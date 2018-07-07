
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, AlertController, IonicApp } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { UserProfileService, UpdateUserInfoRequest } from 'sunbird';
import { ProfilePage } from './../profile';

/**
 * Interface for the Toast Object
 */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

/**
 * This contains form for the Experience where user can Add new job exprience Entry or can edit/delete previous one
 */
export class FormExperience {
  isNewForm: boolean = true;
  jobInfo: any = {};
  experienceForm: FormGroup;
  profile: any = {};
  currentJob: boolean = false;
  todayDate: string = new Date().toISOString().slice(0, 10);
  joiningDate: string = "1950";
  unregisterBackButton: any;

  subjectOptions = {
    title: this.translateMessage('SUBJECTS'),
    cssClass: 'select-box'
  };

  /**
   * @todo Fetch languageList, SubjectList and gradeList from the framework
   */
  subjectList: Array<String> = ["Assamese", "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Marathi", "Punjabi", "Tamil", "Telugu"];

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    public alertCtrl: AlertController,
    private platform: Platform,
    private ionicApp: IonicApp
  ) {

    /* Receive data from other component */
    this.isNewForm = Boolean(this.navParams.get('addForm'));
    this.jobInfo = this.navParams.get('jobInfo') || {};
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.experienceForm = this.fb.group({
      jobName: [this.jobInfo.jobName || '', Validators.required],
      orgName: [this.jobInfo.orgName || '', Validators.required],
      role: [this.jobInfo.role || ''],
      subject: [this.stringToArray(this.jobInfo.subject) || []],
      isCurrentJob: [<string>this.jobInfo.isCurrentJob || (this.isNewForm ? '' : 'false')],
      joiningDate: [this.jobInfo.joiningDate || ''],
      endDate: [this.jobInfo.endDate || '']
    });

    if (this.jobInfo.isCurrentJob) this.currentJob = true;
  }

  ionViewWillEnter() {
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
    console.log("Fired ionViewWillLeave");
    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

  changeJoiningDate() {
    this.joiningDate = this.experienceForm.value.joiningDate;
    this.experienceForm.patchValue({
      endDate: ''
    })
  }
  /**
   * This will call on click of DELETE and SAVE button
   * @param {object} event - Form event
   * @param {boolean} isDeleted - Flag to delete
   */
  onSubmit(isDeleted: boolean = false): void {
    // if(isDeleted == true){
    //   this.showConfirm();
    //  }

    let formVal = this.experienceForm.value;
    this.validateForm(formVal);
    let userJobProfile = {
      jobName: formVal.jobName,
      orgName: formVal.orgName,
      role: formVal.role,
      subject: formVal.subject,
      isCurrentJob: <boolean>formVal.isCurrentJob, // If not available must be false
      joiningDate: <string>formVal.joiningDate, //
      endDate: <string>formVal.endDate // Should be current Date if `isCurrentJob` is `true`
    }

    if (this.jobInfo.id) userJobProfile['id'] = this.jobInfo.id;
    if (isDeleted) userJobProfile['isDeleted'] = isDeleted;

    // Remove empty object element
    Object.keys(userJobProfile).forEach((key) => (userJobProfile[key] === '') && delete userJobProfile[key]);

    let req: UpdateUserInfoRequest = {
      userId: this.profile.userId,
      jobProfile: [userJobProfile]
    };

    this.updateExperience(req);
  }

  /**
   * It will validates a form
   */
  validateForm(formVal) {
    if (<boolean>formVal.isCurrentJob) {
      this.experienceForm.patchValue({
        endDate: new Date().toJSON().slice(0, 10)
      })
    } else if (formVal.isCurrentJob === '') {
      this.experienceForm.patchValue({
        isCurrentJob: false
      })
    }
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateExperience(req): void {
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
        this.navCtrl.setRoot(ProfilePage, { returnRefreshedUserProfileDetails: true });
      },
      (err: any) => {
        this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
        console.error("Error", err);
      });
  }

  /**
   * It will returns Toast Object
   * @param {string} message - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  /**
   * This method formats the date from YYY-MM-dd HH:MM:SS Z to YYYY-MM-dd
   * @param {string} date - Date in the string Format
   * @returns {string} - Date in the ISO format
   */
  formatDate(date: string): string {
    return new Date(date).toISOString().slice(0, 10);
  }


  /**
   * @param {string} str - Input String that need to convert into the Array
   * @returns {array} - Array
   */
  stringToArray(str: string = '') {
    return _.split(str, ', ');
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  showDeleteConfirm() {
    let confirm = this.alertCtrl.create({
      title: this.translateMessage('CONFIRM_DEL', this.translateMessage('TITLE_EXPERIENCE')),

      mode: 'wp',
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: this.translateMessage('CANCEL'),
          role: 'cancel',
          cssClass: 'alert-btn-cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: this.translateMessage('DELETE'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            this.onSubmit(true);
            console.log('Agree clicked');
          }
        },
        {
          text: 'x',
          role: 'cancel',
          cssClass: 'closeButton',
          handler: () => {
            console.log('close icon clicked');
          }
        }
      ]
    });
    confirm.present();
    let unregisterBackButton = this.platform.registerBackButtonAction(() => {
      // dismiss on back press
      confirm.dismiss();
    }, 11);

    // deregister handler after modal closes
    confirm.onDidDismiss(() => {
      unregisterBackButton();
    });

    function closePopup() {
      confirm.dismiss();
    }
  }
}