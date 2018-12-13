import { GUEST_TEACHER_TABS, initTabs, GUEST_STUDENT_TABS } from './../../app/module.service';
import { NavParams, IonicApp, Select, App } from 'ionic-angular/index';
import { AppGlobalService } from '../../service/app-global.service';
import { ProfileService, TabsPage, InteractSubtype, PageId, InteractType, ProfileType, ContainerService } from 'sunbird';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  IonicPage,
  NavController
} from 'ionic-angular';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import {
  CategoryRequest,
  SharedPreferences,
  Profile,
  Environment
} from 'sunbird';

import { LoadingController, Events, Platform } from 'ionic-angular';
import { PreferenceKey } from '../../app/app.constant';
import * as _ from 'lodash';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { CommonUtilService } from '../../service/common-util.service';

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
    private navCtrl: NavController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private preference: SharedPreferences,
    private profileService: ProfileService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private appGlobalService: AppGlobalService,
    private events: Events,
    private scanner: SunbirdQRScanner,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private container: ContainerService,
    private ionicApp: IonicApp,
    private app: App
  ) {
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
      });
    this.initUserForm();
    this.getGuestUser();
  }

  ionViewDidLoad() {
    if (Boolean(this.navParams.get('stopScanner'))) {
      this.scanner.stopScanner();
    }
    this.handleBackButton();
  }

  ionViewWillEnter() {
    this.hideBackButton = Boolean(this.navParams.get('hideBackButton'));
    if (this.navParams.get('isCreateNavigationStack')) {
      this.navCtrl.insertPages(0, [{ page: 'LanguageSettingsPage' }, { page: 'UserTypeSelectionPage' }]);
    }
    this.getSyllabusDetails();
  }

  ionViewWillLeave() {
    // this.unregisterBackButton();
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
    this.profileService.getCurrentUser().then((response: any) => {
      this.profile = JSON.parse(response);
      if (this.navParams.get('isChangeRoleRequest')) {
        this.profile.syllabus = [];
        this.profile.board = [];
        this.profile.grade = [];
        this.profile.subject = [];
        this.profile.medium = [];
      }
      this.profileForTelemetry = this.profile;
      this.initUserForm();
    }) .catch(() => {
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

    this.formAndFrameworkUtilService.getSupportingBoardList()
      .then((result) => {
        this.syllabusList = [];
        if (result && result !== undefined && result.length > 0) {
          result.forEach(element => {
            // renaming the fields to text, value and checked
            const value = { 'name': element.name, 'code': element.frameworkId };
            this.syllabusList.push(value);
          });
          this.loader.dismiss();

          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
              .then(catagories => {
                this.categories = catagories;
                this.resetForm(0, false);
              }).catch(error => {
                console.error('Error', error);
                this.loader.dismiss();
                this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
              });
          } else {
            this.loader.dismiss();
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
  getCategoryData(req: CategoryRequest, list): void {
    if (this.frameworkId) {
      this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId).
        then((result) => {
          if (this.loader !== undefined) {
            this.loader.dismiss();
          }
          this[list] = result;
          if (list !== 'gradeList') {
            this[list] = _.orderBy(this[list], ['name'], ['asc']);
          }
          if (req.currentCategory === 'board') {
            this.userForm.patchValue({
              boards: [result[0].code]
            });
            this.resetForm(1, false);
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
  checkPrevValue(index, currentField, prevSelectedValue = []) {
    if (index === 1) {
      const loader = this.commonUtilService.getLoader();
      this.frameworkId = prevSelectedValue[0];
      this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
        .then(catagories => {
          this.categories = catagories;
          const request: CategoryRequest = {
            currentCategory: this.categories[0].code,
            selectedLanguage: this.translate.currentLang
          };
          this.getCategoryData(request, currentField);
        }).catch(() => {
          this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
          loader.dismiss();
        });

    } else {
      const request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: prevSelectedValue,
        selectedLanguage: this.selectedLanguage
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
        oldAttribute.board = this.profileForTelemetry.board ? this.profileForTelemetry.board : '';
        newAttribute.board = this.userForm.value.syllabus ? this.userForm.value.syllabus : '';
        if (!_.isEqual(oldAttribute, newAttribute)) {
          this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
        }
        this.profileForTelemetry.board = this.userForm.value.syllabus;
        this.checkPrevValue(1, 'boardList', [this.userForm.value.syllabus]);
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
          this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
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
      this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
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
      this.boardSelect.open();
      return false;
    } else if (formVal.medium.length === 0) {
      this.btnColor = '#8FC4FF';
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'failed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      // this.commonUtilService.showToast(this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService
      //   .translateMessage('MEDIUM')), false, 'redErrorToast');
      this.mediumSelect.open();
      return false;
    } else if (formVal.grades.length === 0) {
      this.btnColor = '#8FC4FF';
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'failed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      // this.commonUtilService.showToast(this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService
      //   .translateMessage('CLASS')), false, 'redErrorToast');
      this.gradeSelect.open();
      return false;
    } else {
      this.appGlobalService.generateSaveClickedTelemetry(this.extractProfileForTelemetry(formVal), 'passed',
        PageId.ONBOARDING_PROFILE_PREFERENCES, InteractSubtype.FINISH_CLICKED);
      this.submitEditForm(formVal, loader);

    }
  }

  submitEditForm(formVal, loader): void {
    const req: Profile = new Profile();
    req.board = formVal.boards;
    req.grade = formVal.grades;
    req.medium = formVal.medium;
    req.uid = this.profile.uid;
    req.handle = this.profile.handle;

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
            if (!req.gradeValueMap) {
              req.gradeValueMap = {};
            }
            req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name;
            break;
          }
        }
      });
    }
    this.profileService.updateProfile(req)
      .then((res: any) => {
        if (req.profileType === ProfileType.TEACHER) {
          initTabs(this.container, GUEST_TEACHER_TABS);
        } else if (req.profileType === ProfileType.STUDENT) {
          initTabs(this.container, GUEST_STUDENT_TABS);
        }

        this.events.publish('refresh:profile');
        this.appGlobalService.guestUserProfile = JSON.parse(res);
        this.commonUtilService.showToast('PROFILE_UPDATE_SUCCESS');
        this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
        this.events.publish('refresh:profile');
        this.appGlobalService.guestUserProfile = JSON.parse(res);
        this.appGlobalService.setOnBoardingCompleted();
        this.telemetryGeneratorService.generateProfilePopulatedTelemetry(PageId.DIAL_CODE_SCAN_RESULT, req.syllabus[0], 'manual');
        if (this.navParams.get('isChangeRoleRequest')) {
          this.preference.putString(PreferenceKey.SELECTED_USER_TYPE, req.profileType);
        }

        this.navCtrl.push(TabsPage, {
          loginMode: 'guest'
        });
      })
      .catch((err: any) => {
        loader.dismiss();
        this.commonUtilService.showToast('PROFILE_UPDATE_FAILED');
        console.log('Err', err);
      });
  }

  handleBackButton() {
    this.dismissPopup();
    const self = this;
    this.platform.registerBackButtonAction(() => {

      const navObj = self.app.getActiveNavs()[0];
      const currentPage = navObj.getActive().name;

      if (navObj.canGoBack()) {
        navObj.pop();
      } else {
        if (self.counter === 0) {
          self.counter++;
          this.commonUtilService.showToast('BACK_TO_EXIT');
          // this.telemetryGeneratorService.generateBackClickedTelemetry(this.computePageId(currentPage), Environment.HOME, false);
          setTimeout(() => { self.counter = 0; }, 1500);
        } else {
          // this.telemetryGeneratorService.generateBackClickedTelemetry(this.computePageId(currentPage), Environment.HOME, false);
          self.platform.exitApp();
          // this.telemetryGeneratorService.generateEndTelemetry('app', '', '', Environment.HOME);

        }
      }
    });
    this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH, InteractSubtype.DEVICE_BACK_CLICKED,
          PageId.ONBOARDING_PROFILE_PREFERENCES,
          Environment.ONBOARDING);
  }


}
