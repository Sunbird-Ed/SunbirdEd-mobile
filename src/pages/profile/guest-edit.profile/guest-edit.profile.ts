import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ToastCmp } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(private navCtrl: NavController, private fb: FormBuilder, public navParams: NavParams, private toastCtrl: ToastController) {
    /* Returns a html element for tab bar */
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.profile = this.navParams.get('profile');

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      name: ['', Validators.required],
      boards: [[], Validators.required],
      grades: [[]],
      subjects: [[], Validators.required],
      medium: [[]]
    });
  }

  /**
   * Call on Submit the form
   */
  onSubmit(): void {
    //TODO: make an API call
  }

  /**
   * It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

}