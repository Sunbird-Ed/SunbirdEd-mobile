import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import {
  App,
  NavController,
  NavParams,
  ToastController,
  Events,
  LoadingController,
  IonicApp,
  Platform
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import * as _ from 'lodash';
import {
  CategoryRequest,
  ProfileService,
  Profile,
  SharedPreferences,
  UserSource,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  ImpressionType,
  ObjectType,
  ProfileType,
  ContainerService,
  TabsPage,
  GetProfileRequest
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import {
  initTabs,
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_TABS
} from '../../../app/module.service';
import { AppGlobalService } from '../../../service/app-global.service';
import { CommonUtilService } from '../../../service/common-util.service';
import { PreferenceKey } from '../../../app/app.constant';

/* Interface for the Toast Object */
export interface ToastOptions {
  message: string;
  duration: number;
  position: string;
}

@Component({
  selector: 'page-guest-edit.profile',
  templateUrl: 'guest-edit.profile.html'
})
export class GuestEditProfilePage {
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

  options: ToastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

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
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private profileService: ProfileService,
    private translate: TranslateService,
    private events: Events,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private platform: Platform,
    private ionicApp: IonicApp,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private container: ContainerService,
    private app: App,
    private appGlobal: AppGlobalService,
    private preferences: SharedPreferences,
    private commonUtilService: CommonUtilService,
    private alertCtrl: AlertController
  ) {
    this.isNewUser = Boolean(this.navParams.get('isNewUser'));
    this.isCurrentUser = Boolean(this.navParams.get('isCurrentUser'));
    this.previousProfileType = this.profile.profileType;
    if (this.isNewUser) {
      this.profile = this.navParams.get('lastCreatedProfile') || {};
      this.isEditData = false;
      this.guestEditForm = this.fb.group({
        name: [''],
        profileType: [this.profile.profileType || 'STUDENT'],
        syllabus: [this.profile.syllabus && this.profile.syllabus[0] || []],
        boards: [this.profile.board || []],
        medium: [this.profile.medium || []],
        grades: [this.profile.grade || []],
        subjects: [this.profile.subject || []]
      });

    } else {
      this.profile = this.navParams.get('profile') || {}
      this.guestEditForm = this.fb.group({
        name: [this.profile.handle || ''],
        profileType: [this.profile.profileType || 'STUDENT'],
        syllabus: [this.profile.syllabus && this.profile.syllabus[0] || []],
        boards: [this.profile.board || []],
        medium: [this.profile.medium || []],
        grades: [this.profile.grade || []],
        subjects: [this.profile.subject || []]
      });
    }
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
    this.getSyllabusDetails();
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 11);
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }
  // shows auto fill alert on load 
  showAutoFillAlert() {
    this.isEditData = true;
    let alert = this.alertCtrl.create({
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
              name: [''],
              syllabus: undefined,
              boards: [[]],
              medium: [[]],
              grades: [[]],
              subjects: [[]]
            });
            this.guestEditForm.controls['profileType'].setValue('STUDENT');

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
    alert.present();
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
    let activePortal = this.ionicApp._modalPortal.getActive() ||
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

    this.formAndFrameworkUtilService.getSyllabusList()
      .then((result) => {
        if (result && result !== undefined && result.length > 0) {
          result.forEach(element => {
            //renaming the fields to text, value and checked
            let value = { 'name': element.name, 'code': element.frameworkId };
            this.syllabusList.push(value);
          });

          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
              .then(catagories => {
                this.isFormValid = true;
                // loader.dismiss();
                this.categories = catagories;

                this.resetForm(0, false);

              }).catch(() => {
                this.isFormValid = false;
                this.loader.dismiss();
                this.commonUtilService.showToast(this.commonUtilService.translateMessage("NEED_INTERNET_TO_CHANGE"));
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
  getCategoryData(req: CategoryRequest, list): void {
    this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId).
      then((result) => {

        if (this.loader !== undefined) {
          this.loader.dismiss();
        }

        this[list] = result;

        if (req.currentCategory === 'board') {
          this.guestEditForm.patchValue({
            boards: [result[0].code]
          })
          this.resetForm(1, false);
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
      })
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = []) {

    if (index === 0) {
      this[currentField] = this.syllabusList;
    } else if (index === 1) {
      // let loader = this.getLoader();
      // loader.present();
      this.frameworkId = prevSelectedValue[0];
      this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
        .then(catagories => {
          this.categories = catagories;

          this.isFormValid = true;
          // loader.dismiss();
          let request: CategoryRequest = {
            currentCategory: this.categories[0].code,
            selectedLanguage: this.translate.currentLang
          }
          this.getCategoryData(request, currentField);
        }).catch(() => {
          this.isFormValid = false;
          this.commonUtilService.showToast(this.commonUtilService.translateMessage("NEED_INTERNET_TO_CHANGE"));
        });

    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: prevSelectedValue,
        selectedLanguage: this.translate.currentLang
      }
      this.getCategoryData(request, currentField);
    }

  }

  resetForm(index: number = 0, showloader: boolean): void {
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
        this.checkPrevValue(2, 'mediumList', this.guestEditForm.value.boards);
        break;

      case 2:
        this.guestEditForm.patchValue({
          subjects: [],
          grades: [],
        });
        this.checkPrevValue(3, 'gradeList', this.guestEditForm.value.medium);
        break;
      case 3:
        this.guestEditForm.patchValue({
          subjects: [],
        });
        this.checkPrevValue(4, 'subjectList', this.guestEditForm.value.grades);
        break;
    }
  }

  /**
   * Call on Submit the form
   */

  onSubmit() {
    if (!this.isFormValid) {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage("NEED_INTERNET_TO_CHANGE"));
      return;
    }

    let loader = this.getLoader();
    //loader.present();
    let formVal = this.guestEditForm.value;

    if (formVal.userType === '') {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('USER_TYPE_SELECT_WARNING'));
      return false;
    }
    else if (formVal.boards.length === 0) {
      this.showMessage('BOARD')
      return false;
    }
    else if (formVal.medium.length === 0) {

      this.showMessage('MEDIUM');
      return false;
    }
    else if (formVal.grades.length === 0) {
      this.showMessage('CLASS');
      return false;
    }
    else {
      loader.present();
      if (this.isNewUser) {
        this.submitNewUserForm(formVal, loader);
      } else {
        this.submitEditForm(formVal, loader);
      }
    }
  }

  /**
   * This will submit edit form.
   */
  submitEditForm(formVal, loader): void {
    let req: Profile = new Profile();
    req.board = formVal.boards;
    req.grade = formVal.grades;
    req.subject = formVal.subjects;
    req.medium = formVal.medium;
    req.uid = this.profile.uid;
    req.handle = formVal.name;
    req.profileType = formVal.profileType;
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

    this.profileService.updateProfile(req,
      (res: any) => {
        console.log('Update Response', res);
        this.isCurrentUser && this.publishProfileEvents(formVal);
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.EDIT_USER_SUCCESS,
          Environment.USER,
          PageId.EDIT_USER
        );
        this.navCtrl.pop();
      },
      (err: any) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_FAILED'));
        console.log("Err", err);
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
      if (formVal.profileType == ProfileType.STUDENT) {
        this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT);
        initTabs(this.container, GUEST_STUDENT_TABS);
      } else {
        this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
        initTabs(this.container, GUEST_TEACHER_TABS);
      }

      this.app.getRootNav().setRoot(TabsPage);
    }
  }
  /**
   * It will submit new user form
   */
  submitNewUserForm(formVal, loader): void {
    let req: Profile = new Profile();
    req.board = formVal.boards;
    req.grade = formVal.grades;
    req.subject = formVal.subjects;
    req.medium = formVal.medium;
    req.handle = formVal.name;
    req.profileType = formVal.profileType;
    req.source = UserSource.LOCAL;
    req.syllabus = (!formVal.syllabus.length) ? [] : [formVal.syllabus];

    if (formVal.grades && formVal.grades.length > 0) {
      formVal.grades.forEach(gradeCode => {
        for (let i = 0; i < this.gradeList.length; i++) {
          if (this.gradeList[i].code == gradeCode) {
            if (!req.gradeValueMap) {
              req.gradeValueMap = {};
            }
            req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name;
            break;
          }
        }
      });
    }

    this.profileService.createProfile(req, () => {
      loader.dismiss();
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('USER_CREATED_SUCCESSFULLY'));
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER, InteractSubtype.CREATE_USER_SUCCESS, Environment.USER, PageId.CREATE_USER);
      this.navCtrl.pop();
    },
      () => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage("FILL_THE_MANDATORY_FIELDS"));
      });
  }

  showMessage(name: string) {
    let toast = this.toastCtrl.create({
      message: this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService.translateMessage(name)),
      duration: 2000,
      cssClass: 'red-toast',
      position: 'Bottom'
    });
    toast.dismissAll();
    toast.present();
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 3000,
      spinner: 'crescent'
    });
  }
}