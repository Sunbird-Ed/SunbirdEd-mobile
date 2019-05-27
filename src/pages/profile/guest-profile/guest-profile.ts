import { ActiveDownloadsPage } from './../../active-downloads/active-downloads';
import {TranslateService} from '@ngx-translate/core';
import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import {Events, NavController, PopoverController, ToastController} from 'ionic-angular';
import * as _ from 'lodash';
import {GuestEditProfilePage, OverflowMenuComponent} from '@app/pages/profile';
import {UserTypeSelectionPage} from '@app/pages/user-type-selection';
import {AppGlobalService, CommonUtilService, TelemetryGeneratorService, AppHeaderService} from '@app/service';
import {MenuOverflow, PreferenceKey} from '@app/app';
import {
  Framework,
  FrameworkCategoryCodesGroup,
  FrameworkDetailsRequest,
  FrameworkService,
  FrameworkUtilService,
  GetSuggestedFrameworksRequest,
  ProfileService,
  ProfileType,
  SharedPreferences
} from 'sunbird-sdk';
import {PageId, Environment, InteractType, InteractSubtype} from '../../../service/telemetry-constants';
import {ProfileConstants} from '../../../app';

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})

export class GuestProfilePage implements OnInit, AfterViewInit {

  imageUri = 'assets/imgs/ic_profile_default.png';
  ProfileType = ProfileType;
  showSignInCard = false;
  isNetworkAvailable: boolean;
  boards = '';
  grade = '';
  medium = '';
  subjects = '';
  categories: Array<any> = [];
  profile: any = {};
  syllabus = '';
  selectedLanguage: string;
  loader: any;
  headerObservable: any;
  toast: any;


  isUpgradePopoverShown = false;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private events: Events,
    private commonUtilService: CommonUtilService,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private translate: TranslateService,
    @Inject('FRAMEWORK_SERVICE') private frameworkService: FrameworkService,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private headerServie: AppHeaderService,
    public toastController: ToastController
  ) {


    // language code
    this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
      });

    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', async (upgrade) => {
      if (upgrade && !this.isUpgradePopoverShown) {
        await this.appGlobalService.openPopover(upgrade);
        this.isUpgradePopoverShown = true;
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
  }

  ionViewDidLoad() {

    this.appGlobalService.generateConfigInteractEvent(PageId.GUEST_PROFILE);
  }

  /**
	 * Angular life cycle hooks
	 */
  ngOnInit() {

  }

  ionViewWillEnter() {
    this.events.subscribe('update_header', (data) => {
      this.headerServie.showHeaderWithHomeButton(['download']);
    });
    this.headerObservable = this.headerServie.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this.headerServie.showHeaderWithHomeButton(['download']);
  }

  ngAfterViewInit() {

  }

  ionViewWillLeave(): void {
    this.headerObservable.unsubscribe();
    this.events.unsubscribe('update_header');
  }

  refreshProfileData(refresher: any = false, showLoader: boolean = true) {
    this.loader = this.commonUtilService.getLoader();

    if (showLoader) {
      this.loader.present();
    }
    if (refresher) {
      this.telemetryGeneratorService.generatePullToRefreshTelemetry(PageId.GUEST_PROFILE, Environment.HOME);
    }
    this.profileService.getActiveSessionProfile({requiredFields: ProfileConstants.REQUIRED_FIELDS}).toPromise()
      .then((res: any) => {
        this.profile = res;
        this.getSyllabusDetails();
        setTimeout(() => {
          if (refresher) { refresher.complete(); }
        }, 500);
      })
      .catch(() => {
        this.loader.dismiss();
      });
  }

  editGuestProfile() {
    this.navCtrl.push(GuestEditProfilePage, {
      profile: this.profile,
      isCurrentUser: true
    });
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


    const getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest = {
      language: this.translate.currentLang,
      requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
    };
    this.frameworkUtilService.getActiveChannelSuggestedFrameworkList(getSuggestedFrameworksRequest).toPromise()
      .then((result: Framework[]) => {
        if (result && result !== undefined && result.length > 0) {

          result.forEach(element => {

            if (this.profile.syllabus && this.profile.syllabus.length && this.profile.syllabus[0] === element.identifier) {
              this.syllabus = element.name;
              selectedFrameworkId = element.identifier;
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
    const frameworkDetailsRequest: FrameworkDetailsRequest = {
      frameworkId: this.profile.syllabus[0] || '',
      requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
    };
    this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
      .then((framework: Framework) => {
        this.categories = framework.categories;

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
    this.presentToastForOffline('NO_INTERNET_TITLE');
  }

  handleHeaderEvents($event) {
    switch ($event.name) {
      case 'download':
        this.redirectToActivedownloads();
        break;
    }
  }

  private redirectToActivedownloads() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.ACTIVE_DOWNLOADS_CLICKED,
      Environment.HOME,
      PageId.GUEST_PROFILE);
    this.navCtrl.push(ActiveDownloadsPage);
  }

  // Offline Toast
  async presentToastForOffline(msg: string) {
    this.toast = await this.toastController.create({
      duration: 3000,
      message: this.commonUtilService.translateMessage(msg),
      showCloseButton: true,
      position: 'top',
      closeButtonText: '',
      cssClass: 'toastHeader'
    });
    this.toast.present();
    this.toast.onDidDismiss(() => {
      this.toast = undefined;
    });
  }

}
