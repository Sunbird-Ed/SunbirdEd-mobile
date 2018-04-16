import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
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
  tabBarElement: any;
  isNewForm: boolean = true;
  educationForm: FormGroup;
  formDetails: any = {};
  profile: any = {};
  yopList: Array<number> = _.rangeRight(1950, new Date().getFullYear() + 1);


  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(public navCtrl: NavController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public userProfileService: UserProfileService,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {
    //To hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

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
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  /**
   * This will call on click of DELETE and SAVE button
   * @param {object} event - Form event
   * @param {boolean} isDeleted - Flag to delete
   */
  onSubmit(event, isDeleted: boolean = false): void {
    let formVal = this.educationForm.value;

    if (this.validateForm(formVal)) {
      let userEducation: UserEducation = {
        degree: formVal.degree,
        name: formVal.name,
        yearOfPassing: <number>formVal.yearOfPassing,
        percentage: <number>formVal.percentage,
        grade: formVal.grade,
        boardOrUniversity: formVal.boardOrUniversity,
      }

      /* Add `id` if user editing or deleting Education entry */
      if (this.formDetails.id) userEducation['id'] = this.formDetails.id;
      if (isDeleted) userEducation['isDeleted'] = isDeleted;

      // Remove empty object element
      Object.keys(userEducation).forEach((key) => (userEducation[key] === '') && delete userEducation[key]);

      let req: UpdateUserInfoRequest = {
        userId: this.profile.userId,
        firstName: this.profile.firstName,
        language: this.profile.language,
        phone: '8698645680',
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
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        this.getToast(JSON.parse(res).message).present();
        this.navCtrl.setRoot(ProfilePage);
      },
      (err: any) => {
        this.getToast(err).present();
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

  /**
   *  It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

}