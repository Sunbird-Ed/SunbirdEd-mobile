
import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  Platform,
  AlertController,
  IonicApp
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import * as _ from 'lodash';
import {
  UserProfileService,
  UpdateUserInfoRequest
} from 'sunbird';
import { ProfilePage } from './../profile';
import { CommonUtilService } from '../../../service/common-util.service';

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

/**
 * This contains form for the Experience where user can Add new job exprience Entry or can edit/delete previous one
 */
export class FormExperience {

  isNewForm = true;
  jobInfo: any = {};
  experienceForm: FormGroup;
  profile: any = {};
  currentJob = false;
  todayDate: string = new Date().toISOString().slice(0, 10);
  joiningDate = '1950';
  unregisterBackButton: any;

  subjectOptions = {
    title: this.commonUtilService.translateMessage('SUBJECTS'),
    cssClass: 'select-box'
  };

  /**
   * @todo Fetch languageList, SubjectList and gradeList from the framework
   */
  subjectList: Array<string> = ['Assamese', 'Bengali', 'English', 'Gujarati', 'Hindi', 'Kannada', 'Marathi', 'Punjabi', 'Tamil', 'Telugu'];

  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private commonUtilService: CommonUtilService,
    private alertCtrl: AlertController,
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

    if (this.jobInfo.isCurrentJob) { this.currentJob = true; }
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
    console.log('Fired ionViewWillLeave');
    const activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

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
    });
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

    const formVal = this.experienceForm.value;
    this.validateForm(formVal);
    const userJobProfile = {
      jobName: formVal.jobName,
      orgName: formVal.orgName,
      role: formVal.role,
      subject: formVal.subject,
      isCurrentJob: <boolean>formVal.isCurrentJob, // If not available must be false
      joiningDate: <string>formVal.joiningDate, //
      endDate: <string>formVal.endDate // Should be current Date if `isCurrentJob` is `true`
    };

    if (this.jobInfo.id) { userJobProfile['id'] = this.jobInfo.id; }
    if (isDeleted) { userJobProfile['isDeleted'] = isDeleted; }

    // Remove empty object element
    Object.keys(userJobProfile).forEach((key) => (userJobProfile[key] === '') && delete userJobProfile[key]);

    const req: UpdateUserInfoRequest = {
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
      });
    } else if (formVal.isCurrentJob === '') {
      this.experienceForm.patchValue({
        isCurrentJob: false
      });
    }
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateExperience(req): void {
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.navCtrl.setRoot(ProfilePage, { returnRefreshedUserProfileDetails: true });
      },
      (err: any) => {
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_FAILED'));
        console.error('Error', err);
      });
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

  showDeleteConfirm() {
    const confirm = this.alertCtrl.create({
      title: this.commonUtilService.translateMessage('CONFIRM_DEL', this.commonUtilService.translateMessage('TITLE_EXPERIENCE')),

      mode: 'wp',
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: this.commonUtilService.translateMessage('CANCEL'),
          role: 'cancel',
          cssClass: 'alert-btn-cancel',
          handler: () => {
          }
        },
        {
          text: this.commonUtilService.translateMessage('DELETE'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            this.onSubmit(true);
          }
        },
        {
          text: 'x',
          role: 'cancel',
          cssClass: 'closeButton',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
    const unregisterBackButton = this.platform.registerBackButtonAction(() => {
      // dismiss on back press
      confirm.dismiss();
    }, 11);

    // deregister handler after modal closes
    confirm.onDidDismiss(() => {
      unregisterBackButton();
    });
  }
}
