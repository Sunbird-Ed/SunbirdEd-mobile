import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController, Platform, AlertController, IonicApp } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { UserProfileService, UserEducation, UpdateUserInfoRequest } from 'sunbird';
import { ProfilePage } from '../profile';


/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-education',
  templateUrl: 'form.education.html'
})

/* This contains form for the Education where user can Add new Education Entry or can edit/delete previous one */
export class FormEducation {
  isNewForm: boolean = true;
  educationForm: FormGroup;
  formDetails: any = {};
  profile: any = {};
  yopList: Array<number> = _.rangeRight(1950, new Date().getFullYear() + 1);
  unregisterBackButton: any;


  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public userProfileService: UserProfileService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    public alertCtrl: AlertController,
    private platform: Platform,
    private ionicApp: IonicApp
  ) {

    /* Receive data from other component */
    this.isNewForm = this.navParams.get('addForm');
    this.formDetails = this.navParams.get('formDetails') || {};
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.educationForm = this.fb.group({
      degree: [this.formDetails.degree || '', Validators.required],
      name: [this.formDetails.name || '', Validators.required],
      yearOfPassing: [this.formDetails.yearOfPassing || '', [Validators.min(1950), Validators.max(new Date().getFullYear() + 1)]],
      percentage: [this.formDetails.percentage || ''],
      grade: [this.formDetails.grade || ''],
      boardOrUniversity: [this.formDetails.boardOrUniversity || '']
    });
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

  /**
   * This will call on click of DELETE and SAVE button
   * @param {object} event - Form event
   * @param {boolean} isDeleted - Flag to delete
   */
  onSubmit(isDeleted: boolean = false): void {
    let formVal = this.educationForm.value;

    if (this.validateForm(formVal)) {
      let userEducation: UserEducation = {
        degree: formVal.degree,
        name: formVal.name,
        yearOfPassing: <number>formVal.yearOfPassing,
        percentage: <number>formVal.percentage,
        grade: formVal.grade,
        boardOrUniversity: formVal.boardOrUniversity
      }

      /* Add `id` if user editing or deleting Education entry */
      if (this.formDetails.id) userEducation['id'] = this.formDetails.id;
      if (isDeleted) userEducation['isDeleted'] = isDeleted;

      // Remove empty object element
      Object.keys(userEducation).forEach((key) => (userEducation[key] === '') && delete userEducation[key]);

      let req: UpdateUserInfoRequest = {
        userId: this.profile.userId,
        education: [userEducation]
      };

      this.updateEducation(req);
    }
  }

  /**
   * This will validate a form
   * @param {boolean}
   */
  validateForm(formVal): boolean {
    if (formVal.percentage && (formVal.percentage < 0 || formVal.percentage > 100)) {
      this.getToast(this.translateMessage('WARNING_INVALID_PERCENTAGE')).present();
      return false;
    }
    return true;
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateEducation(req): void {
    let loader = this.getLoader();
    loader.present();
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
        this.navCtrl.setRoot(ProfilePage, { returnRefreshedUserProfileDetails: true });
      },
      (err: any) => {
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
        console.error("Error", err);
      });
  }
  /**
   *  It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
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
      title: this.translateMessage('CONFIRM_DEL', this.translateMessage('TITLE_EDUCATION')),

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
    let deregisterBackButton = this.platform.registerBackButtonAction(() => {
      // dismiss on back press
      confirm.dismiss();
    }, 11);

    // deregister handler after modal closes
    confirm.onDidDismiss(() => {
      deregisterBackButton();
    });

    function closePopup() {
      confirm.dismiss();
    }
  }

}