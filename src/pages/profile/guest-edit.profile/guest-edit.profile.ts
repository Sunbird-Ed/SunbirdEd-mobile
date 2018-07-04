import { TranslateService } from '@ngx-translate/core';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController, IonicApp, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  CategoryRequest,
  ProfileService,
  Profile,
  SharedPreferences
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';

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

  tabBarElement: any;
  guestEditForm: FormGroup;
  profile: any = {};
  categories: Array<any> = [];
  syllabusList: Array<any> = []
  boardList: Array<any> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName: string = '';
  selectedLanguage: string;
  frameworks: Array<any> = [];
  frameworkId: string = '';
  loader: any;
  unregisterBackButton: any;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  syllabusOptions = {
    title: this.translateMessage('SYLLABUS'),
    cssClass: 'select-box'
  };

  boardOptions = {
    title: this.translateMessage('BOARD'),
    cssClass: 'select-box'
  };

  mediumOptions = {
    title: this.translateMessage('MEDIUM_OF_INSTRUCTION'),
    cssClass: 'select-box'
  };

  classOptions = {
    title: this.translateMessage('CLASS'),
    cssClass: 'select-box'
  };

  subjectsOptions = {
    title: this.translateMessage('SUBJECTS'),
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
    private zone: NgZone,
    private platform: Platform,
    private ionicApp: IonicApp
  ) {
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      syllabus: [this.profile.syllabus],
      name: [this.profile.handle],
      boards: [this.profile.board],
      grades: [this.profile.grade],
      subjects: [this.profile.subject],
      mediums: [this.profile.medium]
    });


    //language code
    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });
  }

  ionViewWillEnter() {
    let loader = this.getLoader();
    loader.present();

    this.getSyllabusList()
      .then(() => {
        this.zone.run(() => {
          let fwId = this.profile.syllabus;
          if (fwId && fwId.length > 0) {
            this.getBoardList(fwId[0]);
            if (this.profile.board && this.profile.board.length > 0) {
              this.getMediumList(fwId[0], this.profile.board);
              if (this.profile.medium && this.profile.medium.length > 0) {
                this.getGradeList(fwId[0], this.profile.medium);
                if (this.profile.grade && this.profile.grade.length > 0) {
                  this.getSubjectList(fwId[0], this.profile.grade);
                }
              }
            }
          }
        });
        loader.dismiss();
      })
      .catch(() => {
        loader.dismiss();
      });
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 11);
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }

  /**
   * It will Dismiss active popup
   */
  dismissPopup() {
    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

  getSyllabusList(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.formAndFrameworkUtilService.getSyllabusList()
        .then((result) => {
          if (result && result !== undefined && result.length > 0) {
            result.forEach(element => {
              //renaming the fields to text, value and checked
              let value = { 'name': element.name, 'code': element.frameworkId };
              this.syllabusList.push(value);
            });
            resolve();
          } else {
            reject();
          }
        })
        .catch(e => {
          reject();
        });
    });
  }

  getBoardList(frameworkId) {
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "board";
    this.formAndFrameworkUtilService.getCategoryData(categoryRequest)
      .then(res => {
        this.boardList = res;
      })
      .catch(e => {
      });
  }

  resetBoard() {
    this.boardList = [];
    this.guestEditForm.value.boards = [];
  }

  getMediumList(frameworkId: string, selectedBoards: Array<any>) {
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "medium";
    categoryRequest.prevCategory = "board";
    categoryRequest.selectedCode = selectedBoards;
    this.formAndFrameworkUtilService.getCategoryData(categoryRequest)
      .then(res => {
        this.mediumList = res;
      })
      .catch(e => {

      });
  }

  resetMedium() {
    this.mediumList = [];
    this.guestEditForm.value.mediums = [];
  }

  getGradeList(frameworkId: string, selectedMediums: Array<any>) {
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "gradeLevel";
    categoryRequest.prevCategory = "medium";
    categoryRequest.selectedCode = selectedMediums;
    this.formAndFrameworkUtilService.getCategoryData(categoryRequest)
      .then(res => {
        this.gradeList = res;
      })
      .catch(e => {

      });
  }

  resetGrade() {
    this.gradeList = [];
    this.guestEditForm.value.grades = [];
  }

  getSubjectList(frameworkId: string, selectedGrades: Array<any>) {
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "subject";
    categoryRequest.prevCategory = "gradeLevel";
    categoryRequest.selectedCode = selectedGrades;
    this.formAndFrameworkUtilService.getCategoryData(categoryRequest)
      .then(res => {
        this.subjectList = res;
      })
      .catch(e => {

      });
  }

  resetSubject() {
    this.subjectList = [];
    this.guestEditForm.value.subjects = [];
  }

  onSyllabusSelected() {
    this.getBoardList(this.guestEditForm.value.syllabus);
    this.resetBoard();
    this.resetMedium();
    this.resetGrade();
    this.resetSubject();
  }

  onBoardSelected() {
    this.getMediumList(this.guestEditForm.value.syllabus, this.guestEditForm.value.selectedBoards);
    this.resetGrade();
    this.resetSubject();
  }

  onMediumSelected() {
    this.getGradeList(this.guestEditForm.value.syllabus, this.guestEditForm.value.selectedMediums);
    this.resetSubject();
  }

  onGradeSelected() {
    this.getSubjectList(this.guestEditForm.value.syllabus, this.guestEditForm.value.selectedGrades);
  }

  /**
   * Call on Submit the form
   */
  onSubmit(): void {
    let loader = this.getLoader();
    loader.present();
    let formVal = this.guestEditForm.value;
    let req: Profile = {
      board: formVal.boards,
      class: formVal.grades,
      subject: formVal.subjects,
      medium: formVal.mediums,
      uid: this.profile.uid,
      name: formVal.name,
      profileType: this.profile.profileType,
      createdAt: this.profile.createdAt,
      syllabus: [formVal.syllabus]
    }

    this.profileService.updateProfile(req,
      (res: any) => {
        console.log("Update Response", res);
        this.events.publish('refresh:profile');
        this.events.publish('refresh:onboardingcard');
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
        this.navCtrl.pop();
      },
      (err: any) => {
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
        console.log("Err", err);
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

  /**
   * Returns loading controller object
   */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}