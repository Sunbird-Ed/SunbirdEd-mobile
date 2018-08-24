import { Component } from '@angular/core';
import {
  NavController,
  PopoverController,
  Events,
  LoadingController,
  ToastController
} from 'ionic-angular';
import * as _ from 'lodash';

import { GuestEditProfilePage } from './../guest-edit.profile/guest-edit.profile';
import { OverflowMenuComponent } from "./../overflowmenu/menu.overflow.component";
import {
  ProfileService,
  SharedPreferences,
  ProfileType,
  ImpressionType,
  PageId,
  Environment,
} from 'sunbird';
import { UserTypeSelectionPage } from '../../user-type-selection/user-type-selection';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';
import { AppGlobalService } from '../../../service/app-global.service';
import { MenuOverflow, PreferenceKey } from '../../../app/app.constant';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})

export class GuestProfilePage {

  imageUri: string = "assets/imgs/ic_profile_default.png";

  showSignInCard: boolean = false;
  isNetworkAvailable: boolean;
  showWarning: boolean = false;
  boards: string = "";
  grade: string = "";
  medium: string = "";
  subjects: string = "";
  categories: Array<any> = []
  profile: any = {};
  syllabus: string = "";
  selectedLanguage: string;
  loader: any

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    public network: Network,
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private events: Events,
    private preference: SharedPreferences,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private appGlobal: AppGlobalService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {

    //language code
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE, (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });

    //Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', (upgrade) => {
      if (upgrade) {
        this.appGlobal.openPopover(upgrade)
      }
    });

    // TODO: Need to make an get Profile user details API call.
    this.refreshProfileData();
    this.events.subscribe('refresh:profile', () => {
      this.refreshProfileData(false, false);
    });

    this.preference.getString('selected_user_type', (val) => {

      if (val == ProfileType.TEACHER) {
        this.showSignInCard = true;
      } else if (val == ProfileType.STUDENT) {
        this.showSignInCard = false;
      }
    });
    
    let profileType = this.appGlobal.getGuestUserType();
    if (profileType === ProfileType.TEACHER && this.appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER) {
      this.showSignInCard = true;
    } else if (profileType == ProfileType.STUDENT && this.appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT) {
      this.showSignInCard = true;
    } else {
      this.showSignInCard = false;
    }

    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
    }
    this.network.onDisconnect().subscribe((data) => {
      this.isNetworkAvailable = false;
    });
    this.network.onConnect().subscribe((data) => {
      this.isNetworkAvailable = true;
    });
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.GUEST_PROFILE,
      Environment.HOME
    );

    this.appGlobal.generateConfigInteractEvent(PageId.GUEST_PROFILE);
  }

  refreshProfileData(refresher: any = false, showLoader: boolean = true) {
    this.loader = this.getLoader();

    if (showLoader) {
      this.loader.present();
    }

    this.profileService.getCurrentUser((res: any) => {
      this.profile = JSON.parse(res);
      this.getSyllabusDetails();
      setTimeout(() => {
        if (refresher) refresher.complete();
        // loader.dismiss();
      }, 500);
      console.log("Response", res);
    },
      (err: any) => {
        this.loader.dismiss();
        console.log("Err1", err);
      });
  }

  editGuestProfile() {
    this.navCtrl.push(GuestEditProfilePage, {
      profile: this.profile,
      isCurrentUser: true
    });
  }

  showNetworkWarning() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 3000);
  }
  /**
   * To show popover menu
   * @param {object} event
   */
  showOverflowMenu(event) {
    this.popoverCtrl.create(OverflowMenuComponent, {
      list: MenuOverflow.MENU_GUEST
    }, {
        cssClass: 'box'
      }).present({
        ev: event
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  getSyllabusDetails() {
    let selectedFrameworkId: string = '';

    this.formAndFrameworkUtilService.getSyllabusList()
      .then((result) => {
        if (result && result !== undefined && result.length > 0) {

          result.forEach(element => {

            if (this.profile.syllabus && this.profile.syllabus.length && this.profile.syllabus[0] === element.frameworkId) {
              this.syllabus = element.name;
              selectedFrameworkId = element.frameworkId;
            }
          });


          if (selectedFrameworkId !== undefined && selectedFrameworkId.length > 0) {
            this.getFrameworkDetails(selectedFrameworkId);
          } else {
            this.loader.dismiss();
          }
        } else {
          this.loader.dismiss();

          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
        }
      });
  }

  getFrameworkDetails(frameworkId?: string): void {
    this.formAndFrameworkUtilService.getFrameworkDetails(frameworkId)
      .then(catagories => {
        this.categories = catagories;

        if (this.profile.board && this.profile.board.length) {
          this.boards = this.getFieldDisplayValues(this.profile.board, 0)
        }
        if (this.profile.medium && this.profile.medium.length) {
          this.medium = this.getFieldDisplayValues(this.profile.medium, 1);
        }
        if (this.profile.grade && this.profile.grade.length) {
          this.grade = this.getFieldDisplayValues(this.profile.grade, 2);
        }
        if (this.profile.subject && this.profile.subject.length) {
          this.subjects = this.getFieldDisplayValues(this.profile.subject, 3);
        }

        this.loader.dismiss();
      });
  }

  getFieldDisplayValues(field: Array<any>, catIndex: number): string {
    let displayValues = [];
    this.categories[catIndex].terms.forEach(element => {
      if (_.includes(field, element.code)) {
        displayValues.push(element.name);
      }
    });
    return this.arrayToString(displayValues);
  }

  /**
   * Method to convert Array to Comma separated string
   * @param {Array<string>} stringArray
   * @returns {string}
   */
  arrayToString(stringArray: Array<string>): string {
    console.log("stringArray hererer", stringArray.join(", "));
    return stringArray.join(", ");
  }

  /**
   * Takes the user to role selection screen
   *
   */
  goToRoles() {
    this.navCtrl.push(UserTypeSelectionPage, {
      profile: this.profile
    });
  }

  buttonClick(isNetAvailable?) {
    this.showNetworkWarning();
  }

  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}