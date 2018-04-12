import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from 'sunbird';

import { UserProfileService } from 'sunbird';
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

  tabBarElement: any;
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
    private toastCtrl: ToastController
  ) {
    /* Returns a html element for tab bar*/
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    /* Receive data from other component */
    this.isNewForm = this.navParams.get('addForm') || true;
    this.addressDetails = this.navParams.get('addressDetails') || {};
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.addressForm = this.fb.group({
      addType: [this.addressDetails.addType || '', Validators.required],
      addressLine1: [this.addressDetails.addressLine1 || '', Validators.required],
      addressLine2: [this.addressDetails.addressLine2 || ''],
      city: [this.addressDetails.city || '', Validators.required],
      state: [this.addressDetails.state || ''],
      country: [this.addressDetails.country || ''],
      zipcode: [this.addressDetails.zipcode || '', Validators.minLength(4)]
    });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  /* This will call on click of DELETE and SAVE button
  * @param {object} event - Form event
  * @param {boolean} isDeleted - Flag to delete
  */
  onSubmit(event, isDeleted: boolean = false): void {

    let formVal = this.addressForm.value;
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

    if(isDeleted) userAddress['isDeleted'] = isDeleted;

    // Remove empty object element
    Object.keys(userAddress).forEach((key) => (userAddress[key] === '') && delete userAddress[key]);

    let req: any = {
      userId: this.profile.userId,
      firstName: this.profile.firstName,
      language: this.profile.language,
      phone: '8698645680',
      address: [userAddress]
    };

    this.updateAddress(req);
  }

  /* This will call Update User's Info API
  * @param {object} req - Request object for the User profile Service
  */
  updateAddress(req): void {
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        console.log("Response", res);
        this.getToast(JSON.parse(res).message).present();
        setTimeout(() => {
          this.navCtrl.setRoot(ProfilePage);
        }, 2000);
      },
      (err: any) => {
        console.log("Error", err);
        this.getToast(err).present();
      });
  }

  /* It will returns Toast Object
  * @param {message} string - Message for the Toast to show
  * @returns {object} - toast Object
  */
  getToast(message: string = ''): any {
    this.options.message = message;
    if(message.length) return this.toastCtrl.create(this.options);
  }
}