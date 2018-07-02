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
} from 'sunbird';
import { UserTypeSelectionPage } from '../../user-type-selection/user-type-selection';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';

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
  list: Array<String> = ['SETTINGS'];

  showSignInCard: boolean = false;
  isNetworkAvailable: boolean;
  showWarning: boolean = false;
  /* Temporary Language Constants */
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

  constructor(public navCtrl: NavController,
    public network: Network,
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private events: Events,
    private preference: SharedPreferences,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService
  ) {

    //language code
    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
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
    })
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
    console.log('ionViewDidLoad LanguageSettingPage');
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
    if (!this.isNetworkAvailable) {
      this.showNetworkWarning();
    }
    else {
      this.navCtrl.push(GuestEditProfilePage, {
        profile: this.profile
      });
    }
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
      list: this.list
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
    return stringArray.join(", ");
  }

  /**
   * Takes the user to role selection screen
   *
   */
  goToRoles() {
    if (!this.isNetworkAvailable) {
      this.showNetworkWarning();
    }
    else {
      this.navCtrl.push(UserTypeSelectionPage, {
        profile: this.profile
      })
    }
  }

  buttonClick(isNetAvailable) {

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
