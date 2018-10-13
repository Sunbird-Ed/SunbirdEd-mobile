import { Component } from '@angular/core';
import {
  NavController,
  PopoverController,
  Events
} from 'ionic-angular';
import * as _ from 'lodash';

import { GuestEditProfilePage } from './../guest-edit.profile/guest-edit.profile';
import { OverflowMenuComponent } from './../overflowmenu/menu.overflow.component';
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
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';
import { AppGlobalService } from '../../../service/app-global.service';
import { MenuOverflow, PreferenceKey } from '../../../app/app.constant';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { CommonUtilService } from '../../../service/common-util.service';

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})

export class GuestProfilePage {

  imageUri = 'assets/imgs/ic_profile_default.png';

  showSignInCard = false;
  isNetworkAvailable: boolean;
  showWarning = false;
  boards = '';
  grade = '';
  medium = '';
  subjects = '';
  categories: Array<any> = [];
  profile: any = {};
  syllabus = '';
  selectedLanguage: string;
  loader: any;

  constructor(
    private navCtrl: NavController,
    private network: Network,
    private popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private events: Events,
    private preference: SharedPreferences,
    private commonUtilService: CommonUtilService,
    private appGlobalService: AppGlobalService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {

    // language code
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
      });

    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', (upgrade) => {
      if (upgrade) {
        this.appGlobalService.openPopover(upgrade);
      }
    });

    // TODO: Need to make an get Profile user details API call.
    this.refreshProfileData();
    this.events.subscribe('refresh:profile', () => {
      this.refreshProfileData(false, false);
    });

    const profileType = this.appGlobalService.getGuestUserType();
    if (profileType === ProfileType.TEACHER && this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER) {
      this.showSignInCard = true;
    } else if (profileType === ProfileType.STUDENT && this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT) {
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
      ImpressionType.VIEW, '',
      PageId.GUEST_PROFILE,
      Environment.HOME
    );

    this.appGlobalService.generateConfigInteractEvent(PageId.GUEST_PROFILE);
  }

  refreshProfileData(refresher: any = false, showLoader: boolean = true) {
    this.loader = this.commonUtilService.getLoader();

    if (showLoader) {
      this.loader.present();
    }

    this.profileService.getCurrentUser((res: any) => {
      this.profile = JSON.parse(res);
      this.getSyllabusDetails();
      setTimeout(() => {
        if (refresher) { refresher.complete(); }
      }, 500);
    },
      (err: any) => {
        this.loader.dismiss();
        console.error('Error', err);
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

  getSyllabusDetails() {
    let selectedFrameworkId = '';

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

          this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
        }
      });
  }

  getFrameworkDetails(frameworkId?: string): void {
    this.formAndFrameworkUtilService.getFrameworkDetails(frameworkId)
      .then(catagories => {
        this.categories = catagories;

        if (this.profile.board && this.profile.board.length) {
          this.boards = this.getFieldDisplayValues(this.profile.board, 0);
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
    const displayValues = [];
    this.categories[catIndex].terms.forEach(element => {
      if (_.includes(field, element.code)) {
        displayValues.push(element.name);
      }
    });
    return this.commonUtilService.arrayToString(displayValues);
  }

  /**
   * Takes the user to role selection screen
   *
   */
  goToRoles() {
    this.navCtrl.push(UserTypeSelectionPage, {
      profile: this.profile,
      isChangeRoleRequest: true
    });
  }

  buttonClick(isNetAvailable?) {
    this.showNetworkWarning();
  }

}
