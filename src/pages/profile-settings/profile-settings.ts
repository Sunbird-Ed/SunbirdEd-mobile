import {GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs} from './../../app/module.service';
import {AppGlobalService} from '../../service/app-global.service';
import {Component, Inject, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Events, IonicPage, LoadingController, NavController, Platform, App, IonicApp, NavParams, Select} from 'ionic-angular';
import {PreferenceKey} from '../../app/app.constant';
import * as _ from 'lodash';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {SunbirdQRScanner} from '../qrscanner/sunbirdqrscanner.service';
import {CommonUtilService} from '../../service/common-util.service';
import {
  CategoryTerm,
  Framework,
  FrameworkCategoryCodesGroup,
  FrameworkDetailsRequest,
  FrameworkService,
  FrameworkUtilService,
  GetFrameworkCategoryTermsRequest,
  GetSuggestedFrameworksRequest,
  Profile,
  ProfileService,
  ProfileType,
  SharedPreferences
} from 'sunbird-sdk';
import {Environment, InteractSubtype, InteractType, PageId, ImpressionType, ImpressionSubtype} from '../../service/telemetry-constants';
import {ContainerService} from '../../service/container.services';
import {TabsPage} from '@app/pages/tabs/tabs';
import {ProfileConstants} from '../../app';
import { AppHeaderService } from '@app/service';
import {AppVersion} from "@ionic-native/app-version";

@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {
  @ViewChild('boardSelect') boardSelect: Select;
  @ViewChild('mediumSelect') mediumSelect: Select;
  @ViewChild('gradeSelect') gradeSelect: Select;

  counter = 0;
  userForm: FormGroup;
  classList = [];
  profile: Profile;

  syllabusList: Array<any> = [];
  BoardList: Array<any> = [];
  mediumList: Array<any> = [];
  gradeList: Array<any> = [];
  categories: Array<any> = [];
  loader: any;
  frameworks: Array<any> = [];
  frameworkId = '';
  btnColor = '#8FC4FF';
  isEditData = true;
  unregisterBackButton: any;
  selectedLanguage = 'en';
  profileForTelemetry: any = {};
  hideBackButton = true;

  // syllabusOptions = {
  //   title: this.commonUtilService.translateMessage('SYLLABUS').toLocaleUpperCase(),
  //   cssClass: 'select-box'
  // };
  boardOptions = {
    title: this.commonUtilService.translateMessage('BOARD_OPTION_TEXT'),
    cssClass: 'select-box'
  };
  mediumOptions = {
    title: this.commonUtilService.translateMessage('MEDIUM_OPTION_TEXT'),
    cssClass: 'select-box'
  };
  classOptions = {
    title: this.commonUtilService.translateMessage('GRADE_OPTION_TEXT'),
    cssClass: 'select-box'
  };

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private appGlobalService: AppGlobalService,
    private events: Events,
    private scanner: SunbirdQRScanner,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private container: ContainerService,
    private ionicApp: IonicApp,
    private app: App,
    private telemetryService: TelemetryGeneratorService,
    @Inject('FRAMEWORK_SERVICE') private frameworkService: FrameworkService,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private headerService: AppHeaderService,
    private appVersion: AppVersion
  ) {
    this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
      });
    this.initUserForm();
    this.getGuestUser();
    this.handleBackButton();
  }

  ionViewDidLoad() {
    if (Boolean(this.navParams.get('stopScanner'))) {
      setTimeout(() => {
        this.scanner.stopScanner();
      }, 500);
    }
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.ONBOARDING_PROFILE_PREFERENCES,
      Environment.ONBOARDING
    );
  }

  ionViewWillEnter() {
    this.hideBackButton = Boolean(this.navParams.get('hideBackButton'));
    if (!this.hideBackButton) {
      this.headerService.hideHeader();
    } else {
      this.headerService.showHeaderWithBackButton();
    }
    if (this.navParams.get('isCreateNavigationStack')) {
      this.navCtrl.insertPages(0, [{page: 'LanguageSettingsPage'}, {page: 'UserTypeSelectionPage'}]);
    }
    this.getSyllabusDetails();
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }

  /**
   * It will Dismiss active popup
   */
  dismissPopup() {
    const activePortal = this.ionicApp._modalPortal.getActive() ||
      this.ionicApp._toastPortal.getActive() ||
      this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
  }

  /**
   * Initializes guest user object
   */
  getGuestUser() {
    this.profileService.getActiveSessionProfile({requiredFields: ProfileConstants.REQUIRED_FIELDS})
      .toPromise()
      .then((response: any) => {
        this.profile = response;
        if (this.navParams.get('isChangeRoleRequest')) {
          this.profile.syllabus = [];
          this.profile.board = [];
          this.profile.grade = [];
          this.profile.subject = [];
          this.profile.medium = [];
        }
        this.profileForTelemetry = this.profile;
        this.initUserForm();
      }).catch(() => {
      this.profile = undefined;
      this.initUserForm();
    });
  }

  /**
   * Initializes form and assigns default values from the profile object
   */
  initUserForm() {
    if (this.navParams.get('isChangeRoleRequest')) {
      this.userForm = this.fb.group({
        syllabus: [[]],
        boards: [[]],
        grades: [[]],
        medium: [[]]
      });
    } else {
      this.userForm = this.fb.group({
        syllabus: [this.profile && this.profile.syllabus && this.profile.syllabus[0] || []],
        boards: [this.profile && this.profile.board || []],
        grades: [this.profile && this.profile.grade || []],
        medium: [this.profile && this.profile.medium || []]
      });
    }
  }

  /**
   * It will fetch syllabus details
   */
  getSyllabusDetails() {
    this.loader = this.commonUtilService.getLoader();
    this.loader.present();

    const getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest = {
      language: this.translate.currentLang,
      requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
    };
    this.frameworkUtilService.getActiveChannelSuggestedFrameworkList(getSuggestedFrameworksRequest).toPromise()
      .then((result: Framework[]) => {
        console.log('getActiveChannelSuggestedFrameworkList', result);
        this.syllabusList = [];
        if (result && result !== undefined && result.length > 0) {
          result.forEach(element => {
            // renaming the fields to text, value and checked
            const value = {'name': element.name, 'code': element.identifier};
            this.syllabusList.push(value);
          });
          this.loader.dismiss();
          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            const frameworkDetailsRequest: FrameworkDetailsRequest = {
              frameworkId: this.profile.syllabus[0] ? this.profile.syllabus[0] : '',
              requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
            };
            this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
              .then((framework: Framework) => {
                this.categories = framework.categories;
                this.resetForm(0, false);
              }).catch(error => {
              console.error('Error', error);
              this.loader.dismiss();
              this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
            });
          }
        } else {
          this.loader.dismiss();
          this.commonUtilService.showToast('NO_DATA_FOUND');
        }
      });
  }

  /**
   * This will internally call framework API
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getCategoryData(req: GetFrameworkCategoryTermsRequest, list): void {
    if (this.frameworkId) {
      this.frameworkUtilService.getFrameworkCategoryTerms(req).toPromise()
        .then((result: CategoryTerm[]) => {
          if (this.loader !== undefined) {
            this.loader.dismiss();
          }
          this[list] = result;
          if (list !== 'gradeList') {
            this[list] = _.orderBy(this[list], ['name'], ['asc']);
          }
          if (req.currentCategoryCode === 'board') {
            const boardName = this.syllabusList.find(framework => this.frameworkId === framework.code);
            if (boardName) {
              const boardCode = result.find(board => boardName.name === board.name);
              if (boardCode) {
                this.userForm.patchValue({
                  boards: [boardCode.code]
                });
                this.resetForm(1, false);
              } else {
                this.userForm.patchValue({
                  boards: [result[0].code]
                });
                this.resetForm(1, false);
              }
            }
          } else if (this.isEditData) {
            this.isEditData = false;
            this.userForm.patchValue({
              medium: this.profile.medium || []
            });
            this.userForm.patchValue({
              grades: this.profile.grade || []
            });
          }
        });
    }
  }

  /**
   * It will check previous value and make a API call
   * @param index
   * @param currentField
   * @param prevSelectedValue
   */
  checkPrevValue(index, currentField, prevSelectedValue: any[]) {
    if (index === 1) {
      const loader = this.commonUtilService.getLoader();
      this.frameworkId = prevSelectedValue ? (Array.isArray(prevSelectedValue[0]) ? prevSelectedValue[0][0] : prevSelectedValue[0]) : '';
      const frameworkDetailsRequest: FrameworkDetailsRequest = {
        frameworkId: this.frameworkId,
        requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
      };
      this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
        .then((framework: Framework) => {
          this.categories = framework.categories;
          console.log('this.categories', this.categories);
          const request: GetFrameworkCategoryTermsRequest = {
            currentCategoryCode: this.categories[0].code,
            language: this.translate.currentLang,
            requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES,
            frameworkId: this.frameworkId
          };
          this.getCategoryData(request, currentField);
        }).catch(() => {
        this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
        loader.dismiss();
      });

    } else {
      const request: GetFrameworkCategoryTermsRequest = {
        currentCategoryCode: this.categories[index - 1].code,
        prevCategoryCode: this.categories[index - 2].code,
        selectedTermsCodes: prevSelectedValue,
        language: this.selectedLanguage,
        requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES,
        frameworkId: this.frameworkId
      };
      this.getCategoryData(request, currentField);
    }
  }

  /**
   * It will reset user form, based on given index
   * @param {number}  index
   * @param {boolean} showloader Flag for showing loader or not
   */
  resetForm(index, showloader: boolean): void {
    const oldAttribute: any = {};
    const newAttribute: any = {};
    switch (index) {
      case 0:
        this.userForm.patchValue({
          boards: [],
          grades: [],
          medium: []
        });
        if (showloader) {
          this.loader = this.commonUtilService.getLoader();
          this.loader.present();
        }
        oldAttribute.board = this.profileForTelemetry.board &&  this.profileForTelemetry.board.length ? this.profileForTelemetry.board : '';
        newAttribute.board = this.userForm.value.syllabus ? this.userForm.value.syllabus : '';
        if (!_.isEqual(oldAttribute, newAttribute)) {
          this.appGlobalService.generateAttributeChangeTelemetry(
            oldAttribute, newAttribute, PageId.ONBOARDING_PROFILE_PREFERENCES, Environment.ONBOARDING
          );
        }
        this.profileForTelemetry.board = this.userForm.value.syllabus;
        this.checkPrevValue(1, 'boardList', [this.userForm.value.syllabus]);
        document.querySelectorAll('[ion-button=alert-button]')[0].setAttribute('disabled', 'false');
        break;

      case 1:
        this.userForm.patchValue({
          grades: [],
          medium: []
        });

        this.checkPrevValue(2, 'mediumList', this.userForm.value.boards);
        break;

      case 2:
        this.userForm.patchValue({
          grades: [],
        });

        oldAttribute.medium = this.profileForTelemetry.medium ? this.profileForTelemetry.medium : '';
        newAttribute.medium = this.userForm.value.medium ? this.userForm.value.medium : '';
        if (!_.isEqual(oldAttribute, newAttribute)) {
          this.appGlobalService.generateAttributeChangeTelemetry(
            oldAttribute, newAttribute, PageId.ONBOARDING_PROFILE_PREFERENCES, Environment.ONBOARDING
          );
        }
        this.profileForTelemetry.medium = this.userForm.value.medium;
        this.checkPrevValue(3, 'gradeList', this.userForm.value.medium);
        break;
    }
  }

  enableSubmit() {
    if (this.userForm.value.grades.length) {
      this.btnColor = '#006DE5';
    } else {
      this.btnColor = '#8FC4FF';
    }
    const oldAttribute: any = {};
    const newAttribute: any = {};
    oldAttribute.class = this.profileForTelemetry.grade ? this.profileForTelemetry.grade : '';
    newAttribute.class = this.userForm.value.grades ? this.userForm.value.grades : '';
    if (!_.isEqual(oldAttribute, newAttribute)) {
      this.appGlobalService.generateAttributeChangeTelemetry(
        oldAttribute, newAttribute, PageId.ONBOARDING_PROFILE_PREFERENCES, Environment.ONBOARDING
      );
    }
    this.profileForTelemetry.grade = this.userForm.value.grades;
  }

  extractProfileForTelemetry(formVal): any {
    const profileReq: any = {};
    profileReq.board = formVal.syllabus;
    profileReq.medium = formVal.medium;
    profileReq.grade = formVal.grades;
    return profileReq;
  }

  onSubmit() {
    const loader = this.commonUtilService.getLoader();
    const formVal = this.userForm.value;
    if (formVal.boards.length === 0) {
      this.btnColor = '#8FC4FF';
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'failed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      // this.commonUtilService.showToast(this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService
      //   .translateMessage('BOARD')), false, 'redErrorToast');
      const values = new Map();
      values['board'] = 'na';
      this.telemetryService.generateInteractTelemetry(
        InteractType.TOUCH,
        'submit-clicked',
        Environment.HOME,
        PageId.ONBOARDING_PROFILE_PREFERENCES,
        undefined,
        values,
        undefined,
        undefined,
      );
      this.boardSelect.open();
      return false;
    } else if (formVal.medium.length === 0) {
      this.btnColor = '#8FC4FF';
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'failed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      // this.commonUtilService.showToast(this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService
      //   .translateMessage('MEDIUM')), false, 'redErrorToast');
      const values = new Map();
      values['medium'] = 'na';
      this.telemetryService.generateInteractTelemetry(
        InteractType.TOUCH,
        'submit-clicked',
        Environment.HOME,
        PageId.ONBOARDING_PROFILE_PREFERENCES,
        undefined,
        values,
        undefined,
        undefined,
      );
      this.mediumSelect.open();
      return false;
    } else if (formVal.grades.length === 0) {
      this.btnColor = '#8FC4FF';
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'failed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      // this.commonUtilService.showToast(this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService
      //   .translateMessage('CLASS')), false, 'redErrorToast');
      this.gradeSelect.open();
      const values = new Map();
      values['grades'] = 'na';
      this.telemetryService.generateInteractTelemetry(
        InteractType.TOUCH,
        'submit-clicked',
        Environment.HOME,
        PageId.ONBOARDING_PROFILE_PREFERENCES,
        undefined,
        values,
        undefined,
        undefined,
      );
      return false;
    } else {
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'passed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      this.submitEditForm(formVal, loader);

    }
  }

  submitEditForm(formVal, loader): void {
    const req: Profile = {
      ...this.profile,
      board: formVal.boards,
      grade: formVal.grades,
      medium: formVal.medium
    };
    if (this.navParams.get('selectedUserType')) {
      req.profileType = this.navParams.get('selectedUserType');
    } else {
      req.profileType = this.profile.profileType;
    }

    req.source = this.profile.source;
    req.createdAt = this.profile.createdAt;
    req.syllabus = (!formVal.syllabus.length) ? [] : [formVal.syllabus];

    if (formVal.grades && formVal.grades.length > 0) {
      formVal.grades.forEach(gradeCode => {
        for (let i = 0; i < this.gradeList.length; i++) {
          if (this.gradeList[i].code === gradeCode) {
            if (!req.gradeValue) {
              req.gradeValue = {};
            }
            req.gradeValue[this.gradeList[i].code] = this.gradeList[i].name;
            break;
          }
        }
      });
    }
    this.profileService.updateProfile(req).toPromise()
      .then((res: any) => {
        if (req.profileType === ProfileType.TEACHER) {
          initTabs(this.container, GUEST_TEACHER_TABS);
        } else if (req.profileType === ProfileType.STUDENT) {
          initTabs(this.container, GUEST_STUDENT_TABS);
        }
        this.appVersion.getAppName().then((appName) => {
          this.events.publish('show-qr-walkthrough' , {showWalkthroughBackDrop: true, appName: appName});
        });
        this.telemetryGeneratorService.generateImpressionTelemetry(
          ImpressionType.VIEW,
          ImpressionSubtype.QR_SCAN_WALKTHROUGH,
          PageId.LIBRARY,
          Environment.ONBOARDING
        );
        this.events.publish('refresh:profile');
        this.appGlobalService.guestUserProfile = res;
        this.commonUtilService.showToast('PROFILE_UPDATE_SUCCESS');
        this.events.publish('onboarding-card:completed', {isOnBoardingCardCompleted: true});
        this.events.publish('refresh:profile');
        this.appGlobalService.guestUserProfile = res;
        this.appGlobalService.setOnBoardingCompleted();
        this.telemetryGeneratorService.generateProfilePopulatedTelemetry(
          PageId.ONBOARDING_PROFILE_PREFERENCES, req, 'manual', Environment.ONBOARDING
        );
        if (this.navParams.get('isChangeRoleRequest')) {
          this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, req.profileType).toPromise().then();
        }

        this.navCtrl.push(TabsPage, {
          loginMode: 'guest'
        });
      })
      .catch(() => {
        loader.dismiss();
        this.commonUtilService.showToast('PROFILE_UPDATE_FAILED');
      });
  }

  handleBackButton() {
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      const navObj = this.app.getActiveNavs()[0];

      if (navObj.canGoBack()) {
        this.dismissPopup();
      } else {
        this.commonUtilService.showExitPopUp(PageId.ONBOARDING_PROFILE_PREFERENCES, Environment.ONBOARDING, false);

      }
      this.unregisterBackButton();
    }, 11);
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH, InteractSubtype.DEVICE_BACK_CLICKED,
      PageId.ONBOARDING_PROFILE_PREFERENCES,
      Environment.ONBOARDING);
  }
}

