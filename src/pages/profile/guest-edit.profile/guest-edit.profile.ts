import {
  AlertController,
  App,
  Events,
  IonicApp,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  PopoverController
} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
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
  ProfileSource,
  ProfileType,
  SharedPreferences
} from 'sunbird-sdk';
import {TelemetryGeneratorService} from '../../../service/telemetry-generator.service';
import {GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs} from '../../../app/module.service';
import {AppGlobalService} from '../../../service/app-global.service';
import {CommonUtilService} from '../../../service/common-util.service';
import {PreferenceKey} from '../../../app/app.constant';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  ObjectType,
  PageId,
} from '../../../service/telemetry-constants';
import { ContainerService } from '../../../service/container.services';
import { TabsPage } from '@app/pages/tabs/tabs';
import { AppHeaderService } from '@app/service';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
@Component({
  selector: 'page-guest-edit.profile',
  templateUrl: 'guest-edit.profile.html'
})
export class GuestEditProfilePage {
  ProfileType = ProfileType;
  guestEditForm: FormGroup;
  profile: any = {};
  categories: Array<any> = [];
  syllabusList: Array<any> = [];
  boardList: Array<any> = [];
  gradeList: Array<any> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName = '';
  frameworkId = '';
  loader: any;
  isNewUser = false;
  unregisterBackButton: any;
  isCurrentUser = true;

  isFormValid = true;
  isEditData = true;

  previousProfileType;
  profileForTelemetry: any = {};

  syllabusOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  boardOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  mediumOptions = {
    title: this.commonUtilService.translateMessage('MEDIUM_OF_INSTRUCTION').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  classOptions = {
    title: this.commonUtilService.translateMessage('CLASS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  subjectsOptions = {
    title: this.commonUtilService.translateMessage('SUBJECTS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    private translate: TranslateService,
    private events: Events,
    private platform: Platform,
    private ionicApp: IonicApp,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private container: ContainerService,
    private app: App,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private alertCtrl: AlertController,
    @Inject('FRAMEWORK_SERVICE') private frameworkService: FrameworkService,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private popoverCtrl: PopoverController,
    private headerService: AppHeaderService
  ) {
    this.isNewUser = Boolean(this.navParams.get('isNewUser'));
    this.isCurrentUser = Boolean(this.navParams.get('isCurrentUser'));
    if (this.isNewUser) {
      this.profile = this.navParams.get('lastCreatedProfile') || {};
      this.isEditData = false;
      this.guestEditForm = this.fb.group({
        name: [''],
        profileType: [this.profile.profileType || ProfileType.STUDENT],
        syllabus: [this.profile.syllabus && this.profile.syllabus[0] || []],
        boards: [this.profile.board || []],
        medium: [this.profile.medium || []],
        grades: [this.profile.grade || []],
        subjects: [this.profile.subject || []]
      });

    } else {
      this.profile = (JSON.parse(JSON.stringify(this.navParams.get('profile')))) || {};
      this.guestEditForm = this.fb.group({
        name: [this.profile.handle || ''],
        profileType: [this.profile.profileType || ProfileType.STUDENT],
        syllabus: [this.profile.syllabus && this.profile.syllabus[0] || []],
        boards: [this.profile.board || []],
        medium: [this.profile.medium || []],
        grades: [this.profile.grade || []],
        subjects: [this.profile.subject || []]
      });
    }
    this.previousProfileType = this.profile.profileType;
    this.profileForTelemetry = this.profile;
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.CREATE_USER,
      Environment.USER, this.isNewUser ? '' : this.profile.uid, this.isNewUser ? '' : ObjectType.USER,
    );

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      this.isNewUser ? InteractSubtype.CREATE_USER_INITIATED : InteractSubtype.EDIT_USER_INITIATED,
      Environment.USER,
      PageId.CREATE_USER
    );

    // auto fill alert is called when it is new user , profile and profile.name is present
    if (this.isNewUser && this.profile && this.profile.handle) {
      this.showAutoFillAlert();
    }
  }

  ionViewWillEnter() {
    const header = this.headerService.getDefaultPageConfig();
    header.showHeader = false;
    this.headerService.updatePageConfig(header);
    this.getSyllabusDetails();
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 10);
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }
  // shows auto fill alert on load
  showAutoFillAlert() {
    this.isEditData = true;
    /*const alert = this.alertCtrl.create({
      title: this.commonUtilService.translateMessage('PREVIOUS_USER_SETTINGS'),
      mode: 'wp',
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: this.commonUtilService.translateMessage('CANCEL'),
          role: 'cancel',
          cssClass: 'alert-btn-cancel',
          handler: () => {
            this.guestEditForm.patchValue({
              name: undefined,
              syllabus: undefined,
              boards: [[]],
              medium: [[]],
              grades: [[]],
              subjects: [[]]
            });
            this.guestEditForm.controls['profileType'].setValue(ProfileType.STUDENT);

          }
        },
        {
          text: this.commonUtilService.translateMessage('OKAY'),
          cssClass: 'alert-btn-delete',
          handler: () => {

          }
        }
      ]
    });
    alert.present();*/
    const confirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('ALERT'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('PREVIOUS_USER_SETTINGS'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
        }, {
          btntext: this.commonUtilService.translateMessage('OKAY'),
          btnClass: 'popover-color'
        }
      ],
      icon: null
    }, {
      cssClass: 'sb-popover',
    });
      confirm.present({
        ev: event
      });
      confirm.onDidDismiss((leftBtnClicked: any) => {
        if (leftBtnClicked == null) {
          return;
        }
        if (leftBtnClicked) {
          this.guestEditForm.patchValue({
            name: undefined,
            syllabus: undefined,
            boards: [[]],
            medium: [[]],
            grades: [[]],
            subjects: [[]]
          });
          this.guestEditForm.controls['profileType'].setValue(this.ProfileType.STUDENT);
        }
      });
  }

  onProfileTypeChange() {
    this.guestEditForm.patchValue({
      syllabus: [],
      boards: [],
      grades: [],
      subjects: [],
      medium: []
    });
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
    } else {
      this.navCtrl.pop();
    }
  }

  getSyllabusDetails() {
    this.loader = this.getLoader();
    this.loader.present();
    const getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest = {
      language: this.translate.currentLang,
      requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
    };
    this.frameworkUtilService.getActiveChannelSuggestedFrameworkList(getSuggestedFrameworksRequest).toPromise()
      .then((result: Framework[]) => {
        if (result && result !== undefined && result.length > 0) {
          result.forEach(element => {
            // renaming the fields to text, value and checked
            const value = { 'name': element.name, 'code': element.identifier };
            this.syllabusList.push(value);
          });

          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            const frameworkDetailsRequest: FrameworkDetailsRequest = {
              frameworkId:  this.profile.syllabus[0],
              requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
            };
            this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
              .then((framework: Framework) => {
                this.isFormValid = true;
                // loader.dismiss();
                this.categories = framework.categories;

                this.resetForm(0, false);

              }).catch(() => {
                this.isFormValid = false;
                this.loader.dismiss();
                this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
              });
          } else {
            this.loader.dismiss();
          }
        } else {
          this.loader.dismiss();

          this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
        }
      });
  }

  /**
   * This will internally call framework API
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getCategoryData(req: GetFrameworkCategoryTermsRequest, list): void {
    this.frameworkUtilService.getFrameworkCategoryTerms(req).toPromise()
    .then((result: CategoryTerm[]) => {

        if (this.loader !== undefined) {
          this.loader.dismiss();
        }

        this[list] = result;

        if (req.currentCategoryCode === 'board') {
          const boardName = this.syllabusList.find(framework => this.frameworkId === framework.code);
          if (boardName) {
            const boardCode = result.find(board => boardName.name === board.name);
            if (boardCode) {
              this.guestEditForm.patchValue({
                boards: [boardCode.code]
              });
              this.resetForm(1, false);
            } else {
              this.guestEditForm.patchValue({
                boards: [result[0].code]
              });
              this.resetForm(1, false);
            }
          }
        } else if (this.isEditData) {
          this.isEditData = false;

          this.guestEditForm.patchValue({
            medium: this.profile.medium || []
          });

          // this.resetForm(2);
          this.guestEditForm.patchValue({
            grades: this.profile.grade || []
          });

          // this.resetForm(3);
          this.guestEditForm.patchValue({
            subjects: this.profile.subject || []
          });
        }
      });
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = []) {
    if (index === 0) {
      this[currentField] = this.syllabusList;
    } else if (index === 1) {
      // this.frameworkId = prevSelectedValue[0];
      this.frameworkId = prevSelectedValue ? (Array.isArray(prevSelectedValue[0]) ? prevSelectedValue[0][0] : prevSelectedValue[0] ) : '';
      if (this.frameworkId.length !== 0) {
        const frameworkDetailsRequest: FrameworkDetailsRequest = {
          frameworkId:  this.frameworkId,
          requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
        };
        this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
          .then((framework: Framework) => {
            this.categories = framework.categories;

            this.isFormValid = true;
            // loader.dismiss();
            const request: GetFrameworkCategoryTermsRequest = {
              currentCategoryCode: this.categories[0].code,
              language: this.translate.currentLang,
              requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES,
              frameworkId: this.frameworkId
            };
            this.getCategoryData(request, currentField);
          }).catch(() => {
            this.isFormValid = false;
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
          });
      }

    } else {
      const request: GetFrameworkCategoryTermsRequest = {
        currentCategoryCode: this.categories[index - 1].code,
        prevCategoryCode: this.categories[index - 2].code,
        selectedTermsCodes: prevSelectedValue,
        language: this.translate.currentLang,
        requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES,
        frameworkId: this.frameworkId
      };
      this.getCategoryData(request, currentField);
    }

  }

  /**
   * This method is added as we are not getting subject value in reset form method
   */
  onSubjectChanged(event) {
    const oldAttribute: any = {};
    const newAttribute: any = {};
    oldAttribute.subject = this.profileForTelemetry.subject ? this.profileForTelemetry.subject : '';
    newAttribute.subject = event ? event : '';
    if (!_.isEqual(oldAttribute, newAttribute)) {
      this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
    }
    this.profileForTelemetry.subject = event;
  }

  resetForm(index: number = 0, showloader: boolean): void {
    const oldAttribute: any = {};
    const newAttribute: any = {};
    switch (index) {
      case 0:
        this.guestEditForm.patchValue({
          boards: [],
          grades: [],
          subjects: [],
          medium: []
        });
        if (showloader) {
          this.loader = this.getLoader();
          this.loader.present();
        }
        this.checkPrevValue(1, 'boardList', [this.guestEditForm.value.syllabus]);
        break;

      case 1:
        this.guestEditForm.patchValue({
          grades: [],
          subjects: [],
          medium: []
        });

        oldAttribute.board = this.profileForTelemetry.board ? this.profileForTelemetry.board : '';
        newAttribute.board = this.guestEditForm.value.boards ? this.guestEditForm.value.boards : '';
        if (!_.isEqual(oldAttribute, newAttribute)) {
          this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
        }
        this.profileForTelemetry.board = this.guestEditForm.value.boards;
        this.checkPrevValue(2, 'mediumList', this.guestEditForm.value.boards);
        break;

      case 2:
        this.guestEditForm.patchValue({
          subjects: [],
          grades: [],
        });
        oldAttribute.medium = this.profileForTelemetry.medium ? this.profileForTelemetry.medium : '';
        newAttribute.medium = this.guestEditForm.value.medium ? this.guestEditForm.value.medium : '';
        if (!_.isEqual(oldAttribute, newAttribute)) {
          this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
        }
        this.profileForTelemetry.medium = this.guestEditForm.value.medium;
        this.checkPrevValue(3, 'gradeList', this.guestEditForm.value.medium);
        break;
      case 3:
        this.guestEditForm.patchValue({
          subjects: [],
        });
        oldAttribute.class = this.profileForTelemetry.grade ? this.profileForTelemetry.grade : '';
        newAttribute.class = this.guestEditForm.value.grades ? this.guestEditForm.value.grades : '';
        if (!_.isEqual(oldAttribute, newAttribute)) {
          this.appGlobalService.generateAttributeChangeTelemetry(oldAttribute, newAttribute);
        }
        this.profileForTelemetry.grade = this.guestEditForm.value.grades;
        this.checkPrevValue(4, 'subjectList', this.guestEditForm.value.grades);
        break;
    }
  }

  /**
   * Call on Submit the form
   */

  onSubmit() {
    if (!this.isFormValid) {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
      return;
    }

    const loader = this.getLoader();
    const formVal = this.guestEditForm.value;

    if (formVal.userType === '') {
      this.commonUtilService.showToast('USER_TYPE_SELECT_WARNING');
      return false;
    } else if (!this.validateName()) {
      this.commonUtilService.showToast(
        this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService.translateMessage('FULL_NAME')), false, 'red-toast');
    } else if (formVal.boards.length === 0) {
      this.appGlobalService.generateSaveClickedTelemetry(
        this.extractProfileForTelemetry(formVal), 'failed', PageId.EDIT_USER, InteractSubtype.SAVE_CLICKED);
      this.commonUtilService.showToast(
        this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService.translateMessage('BOARD')), false, 'red-toast');
      return false;
    } else if (formVal.medium.length === 0) {
      this.appGlobalService.generateSaveClickedTelemetry(
        this.extractProfileForTelemetry(formVal), 'failed', PageId.EDIT_USER, InteractSubtype.SAVE_CLICKED);
      this.commonUtilService.showToast(
        this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService.translateMessage('MEDIUM')), false, 'red-toast');
      return false;
    } else if (formVal.grades.length === 0) {
      this.appGlobalService.generateSaveClickedTelemetry(
        this.extractProfileForTelemetry(formVal), 'failed', PageId.EDIT_USER, InteractSubtype.SAVE_CLICKED);
      this.commonUtilService.showToast(
        this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService.translateMessage('CLASS')), false, 'red-toast');
      return false;
    } else {
      loader.present();
      if (this.isNewUser) {
        this.submitNewUserForm(formVal, loader);
      } else {
        this.submitEditForm(formVal, loader);
      }
      this.appGlobalService.generateSaveClickedTelemetry(
        this.extractProfileForTelemetry(formVal), 'passed', PageId.EDIT_USER, InteractSubtype.SAVE_CLICKED);
    }
  }

   /**
   *  It will validate the name field.
   */
  validateName() {
    const name = this.guestEditForm.getRawValue().name;
    if (name) {
      return name.trim().length ? true : false;
    } else {
      return false;
    }
  }

  extractProfileForTelemetry(formVal): any {
    const profileReq: any = {};
    profileReq.board = formVal.boards;
    profileReq.grade = formVal.grades;
    profileReq.subject = formVal.subjects;
    profileReq.medium = formVal.medium;
    profileReq.profileType = formVal.profileType;
    profileReq.syllabus = (!formVal.syllabus.length) ? [] : [formVal.syllabus];
    return profileReq;
  }

  /**
   * This will submit edit form.
   */
  submitEditForm(formVal, loader): void {
    const req =  <Profile>{};
    req.board = formVal.boards;
    req.grade = formVal.grades;
    req.subject = formVal.subjects;
    req.medium = formVal.medium;
    req.uid = this.profile.uid;
    req.handle = formVal.name.trim();
    req.profileType = formVal.profileType;
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

    this.profileService.updateProfile(req)
      .subscribe((res: any) => {
        if (this.isCurrentUser) {
          this.publishProfileEvents(formVal);
        }
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.EDIT_USER_SUCCESS,
          Environment.USER,
          PageId.EDIT_USER
        );
        this.navCtrl.pop();
      }, (err: any) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_FAILED'));
      });
  }

  publishProfileEvents(formVal) {
    // Publish event if the all the fields are submitted
    if (formVal.syllabus.length && formVal.boards.length && formVal.grades.length && formVal.medium.length && formVal.subjects.length) {
      this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
    } else {
      this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: false });
    }
    this.events.publish('refresh:profile');
    this.events.publish('refresh:onboardingcard');

    if (this.previousProfileType && this.previousProfileType !== formVal.profileType) {
      if (formVal.profileType === ProfileType.STUDENT) {
        this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise().then();
        initTabs(this.container, GUEST_STUDENT_TABS);
      } else {
        this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise().then();
        initTabs(this.container, GUEST_TEACHER_TABS);
      }

      this.app.getRootNav().setRoot(TabsPage);
    }
  }

  /**
   * It will submit new user form
   */
  submitNewUserForm(formVal, loader): void {
    const req =  <Profile>{};
    req.board = formVal.boards;
    req.grade = formVal.grades;
    req.subject = formVal.subjects;
    req.medium = formVal.medium;
    req.handle = formVal.name.trim();
    req.profileType = formVal.profileType;
    req.source = ProfileSource.LOCAL;
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

    this.profileService.createProfile(req, req.source).subscribe((res: any) => {
      loader.dismiss();
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('USER_CREATED_SUCCESSFULLY'));
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.OTHER, InteractSubtype.CREATE_USER_SUCCESS, Environment.USER, PageId.CREATE_USER);
      this.navCtrl.pop();
    }, (err: any) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('FILL_THE_MANDATORY_FIELDS'));
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 3000,
      spinner: 'crescent'
    });
  }
}
