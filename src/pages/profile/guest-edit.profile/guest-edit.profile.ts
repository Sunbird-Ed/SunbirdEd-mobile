import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import {
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
  TabsPage
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import {
  initTabs,
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_TABS
} from '../../../app/module.service';
import { App } from 'ionic-angular';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-guest-edit.profile',
  templateUrl: 'guest-edit.profile.html'
})
export class GuestEditProfilePage {
  guestEditForm: FormGroup;
  profile: any = {};
  categories: Array<any> = [];
  syllabusList: Array<any> = []
  boardList: Array<any> = [];
  gradeList: Array<any> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName: string = '';
  selectedLanguage: string;
  frameworks: Array<any> = [];
  frameworkId: string = '';
  loader: any;
  isNewUser: boolean = false;
  unregisterBackButton: any;
  isCurrentUser: boolean = true;

  isFormValid: boolean = true;

  previousProfileType;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  syllabusOptions = {
    title: this.translateMessage('SYLLABUS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  boardOptions = {
    title: this.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  mediumOptions = {
    title: this.translateMessage('MEDIUM_OF_INSTRUCTION').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  classOptions = {
    title: this.translateMessage('CLASS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  subjectsOptions = {
    title: this.translateMessage('SUBJECTS').toLocaleUpperCase(),
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
    private preference: SharedPreferences,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private platform: Platform,
    private ionicApp: IonicApp,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private container: ContainerService,
    private app: App,
    private preferences: SharedPreferences
  ) {
    this.profile = this.navParams.get('profile') || {};
    this.isNewUser = Boolean(this.navParams.get('isNewUser'));
    this.isCurrentUser = Boolean(this.navParams.get('isCurrentUser'));

    console.log(this.profile);

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      profileType: [this.profile.profileType || 'STUDENT'],
      syllabus: [this.profile.syllabus && this.profile.syllabus[0] || [], Validators.required],
      name: [this.profile.handle || '', Validators.required],
      boards: [this.profile.board || [], Validators.required],
      grades: [this.profile.grade || []],
      subjects: [this.profile.subject || []],
      medium: [this.profile.medium || []]
    });

    this.previousProfileType = this.profile.profileType

    //language code
    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.CREATE_USER,
      Environment.USER, this.isNewUser ? "" : this.profile.uid, this.isNewUser ? "" : ObjectType.USER,
    );

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      this.isNewUser ? InteractSubtype.CREATE_USER_INITIATED : InteractSubtype.EDIT_USER_INITIATED,
      Environment.USER,
      PageId.CREATE_USER
    );
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
                this.guestEditForm.patchValue({
                  boards: this.profile.board || []
                });

                // this.resetForm(1);
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

              }).catch(error => {
                this.isFormValid = false;
                this.loader.dismiss();
                this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
              });
          } else {
            this.loader.dismiss();
          }
        } else {
          this.loader.dismiss();

          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
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

        // if (list === 'boardList')
        if (this.loader !== undefined)
          this.loader.dismiss();

        this[list] = result;
        if (list != 'gradeList') {
          this[list] = _.orderBy(this[list], ['name'], ['asc']);
        }
        console.log(list + " Category Response: " + this[list]);
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
          }
          this.getCategoryData(request, currentField);
        }).catch(error => {
          this.isFormValid = false;
          this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
        });

    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: prevSelectedValue
      }
      this.getCategoryData(request, currentField);
    }

  }

  resetForm(index: number = 0, showloader: boolean): void {
    console.log("Reset Form Index - " + index);
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

  onSubmit(): void {
    if (!this.isFormValid) {
      this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
      return;
    }

    let loader = this.getLoader();
    loader.present();
    let formVal = this.guestEditForm.value;
    if (this.isNewUser) {
      if (formVal.userType === '') {
        this.getToast(this.translateMessage('USER_TYPE_SELECT_WARNING')).present();
      } else {
        this.submitNewUserForm(formVal, loader);
      }
    } else {
      this.submitEditForm(formVal, loader);
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
          if (this.gradeList[i].code == gradeCode) {
            if (!req.gradeValueMap) {
              req.gradeValueMap = {};
            }
            req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name
            break;
          }
        }
      });
    }

    this.profileService.updateProfile(req,
      (res: any) => {
        console.log("Update Response", res);
        this.isCurrentUser && this.publishProfileEvents(formVal);
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
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
        this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
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

    if (this.previousProfileType && this.previousProfileType != formVal.profileType) {
      if (formVal.profileType == ProfileType.STUDENT) {
        this.preferences.putString('selected_user_type', ProfileType.STUDENT);
        initTabs(this.container, GUEST_STUDENT_TABS);
      } else {
        this.preferences.putString('selected_user_type', ProfileType.TEACHER);
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
            req.gradeValueMap[this.gradeList[i].code] = this.gradeList[i].name
            break;
          }
        }
      });
    }

    this.profileService.createProfile(req, (success: any) => {
      loader.dismiss();
      this.getToast(this.translateMessage("User Created successfully")).present();
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.OTHER,
        InteractSubtype.CREATE_USER_SUCCESS,
        Environment.USER,
        PageId.CREATE_USER
      );
      this.navCtrl.pop();
    },
      (error: any) => {
        loader.dismiss();
        this.getToast(this.translateMessage("FILL_THE_MANDATORY_FIELDS")).present();
      });
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  /** It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 3000,
      spinner: "crescent"
    });
  }
}