import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  NavController,
  NavParams,
  LoadingController,
  Platform,
  AlertController
} from 'ionic-angular';
import {
  UserProfileService,
  UpdateUserInfoRequest
} from 'sunbird';
import { ProfilePage } from './../profile';
import { CommonUtilService } from '../../../service/common-util.service';

@Component({
  selector: 'page-address',
  templateUrl: 'form.address.html'
})

/* This contains form for the Education where user can Add new Address Entry or can edit/delete previous one */
export class FormAddress {

  isNewForm = true;
  addressDetails: any = {};
  addressForm: FormGroup;
  profile: any = {};

  constructor(
    private navCtrl: NavController,
    public fb: FormBuilder,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {

    /* Receive data from other component */
    this.isNewForm = this.navParams.get('addForm');
    if (this.isNewForm === undefined) {
      this.isNewForm = true;
    }
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

    const formVal = this.addressForm.value;

    if (this.validateForm(formVal)) {

      // Default Address type is `Permanent`
      if (formVal.addType === '') {
        this.addressForm.patchValue({
          addType: 'permanent'
        });
      }

      const userAddress = {
        addType: formVal.addType,
        addressLine1: formVal.addressLine1,
        addressLine2: formVal.addressLine2,
        city: formVal.city,
        state: formVal.state,
        country: formVal.country,
        zipcode: formVal.zipcode,
        id: this.addressDetails.id || ''
      };

      if (isDeleted) { userAddress['isDeleted'] = isDeleted; }

      // Remove empty object element
      Object.keys(userAddress).forEach((key) => (userAddress[key] === '') && delete userAddress[key]);

      const req: UpdateUserInfoRequest = {
        userId: this.profile.userId,
        address: [userAddress]
      };

      this.updateAddress(req);
    }
  }

  /**
   * @param {object} formVal - Holds Form Values
   * @returns {boolean}
   */
  validateForm(formVal): boolean {

    /* Allowed only Numbers and 6 digits */
    if (formVal.zipcode !== '' && !formVal.zipcode.match(/^\d{6}$/)) {
      console.log('in zipcode');
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('INVALID_PINCODE'));
      return false;
    }
    return true;
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateAddress(req): void {
    const loader = this.getLoader();
    loader.present();
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.navCtrl.setRoot(ProfilePage, { returnRefreshedUserProfileDetails: true });
      },
      (err: any) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_FAILED'));
        console.error('Error', err);
      });
  }

  /**
   * Returns Loading controller object with default config
   */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
    });
  }

  /**
   * Shows confirmation popup for delete
   */
  showDeleteConfirm() {
    const confirm = this.alertCtrl.create({
      title: this.commonUtilService.translateMessage('CONFIRM_DEL', this.commonUtilService.translateMessage('TITLE_ADDRESS')),
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

    // unregister handler after modal closes
    confirm.onDidDismiss(() => {
      unregisterBackButton();
    });
  }
}
