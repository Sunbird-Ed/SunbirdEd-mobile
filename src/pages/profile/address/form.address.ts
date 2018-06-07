import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService, UserProfileService, UpdateUserInfoRequest } from 'sunbird';
import { ProfilePage } from './../profile';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-address',
  templateUrl: 'form.address.html'
})

/* This contains form for the Education where user can Add new Address Entry or can edit/delete previous one */
export class FormAddress {

  isNewForm: boolean = true;
  addressDetails: any = {};
  addressForm: FormGroup;
  profile: any = {};

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(public navCtrl: NavController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public authService: AuthService,
    private userProfileService: UserProfileService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    public alertCtrl: AlertController,
    private platform: Platform
  ) {

    /* Receive data from other component */
    this.isNewForm = this.navParams.get('addForm');
    if(this.isNewForm === undefined) this.isNewForm = true;
    this.addressDetails = this.navParams.get('addressDetails') || {};
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.addressForm = this.fb.group({
      addType: [this.addressDetails.addType || (this.isNewForm ? '' : 'permanent')],
      addressLine1: [this.addressDetails.addressLine1 || '', [Validators.required]],
      addressLine2: [this.addressDetails.addressLine2 || ''],
      city: [this.addressDetails.city || '', [Validators.required]],
      state: [this.addressDetails.state || ''],
      country: [this.addressDetails.country || ''],
      zipcode: [this.addressDetails.zipcode || '']
    });
  }

  /**
   * This will call on click of DELETE and SAVE button
   * @param {object} event - Form event
   * @param {boolean} isDeleted - Flag to delete
   */
  onSubmit(isDeleted: boolean = false): void {

    let formVal = this.addressForm.value;

    if (this.validateForm(formVal)) {

      //Default Address type is `Permanent`
      if (formVal.addType === '') {
        this.addressForm.patchValue({
          addType: 'permanent'
        })
      }

      let userAddress = {
        addType: formVal.addType,
        addressLine1: formVal.addressLine1,
        addressLine2: formVal.addressLine2,
        city: formVal.city,
        state: formVal.state,
        country: formVal.country,
        zipcode: formVal.zipcode,
        id: this.addressDetails.id || ''
      }

      if (isDeleted) userAddress['isDeleted'] = isDeleted;

      // Remove empty object element
      Object.keys(userAddress).forEach((key) => (userAddress[key] === '') && delete userAddress[key]);

      let req: UpdateUserInfoRequest = {
        userId: this.profile.userId,
        address: [userAddress]
      };

      this.updateAddress(req);
    }
  }

  validateForm(formVal): boolean {

    /* Allowed only Numbers and 6 digits */
    if (formVal.zipcode != '' && !formVal.zipcode.match(/^\d{6}$/)) {
      this.getToast(this.translateMessage('INVALID_PINCODE')).present();
      return false;
    }
    return true;
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateAddress(req): void {
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
      title: this.translateMessage('CONFIRM_DEL',this.translateMessage('TITLE_ADDRESS')),

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