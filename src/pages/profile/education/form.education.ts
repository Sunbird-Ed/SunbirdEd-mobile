import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { UserProfileService } from 'sunbird';
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
export class FormEducation{
  tabBarElement: any;
  isNewForm: boolean = true;
  educationForm: FormGroup;
  formDetails: any = {};
  profile: any = {};
  currentYear: number = new Date().getFullYear();


  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(public navCtrl: NavController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public userProfileService: UserProfileService,
    private toastCtrl: ToastController
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
      yearOfPassing: [this.formDetails.yearOfPassing || '', Validators.minLength(4)],
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

  /* This will call on click of DELETE and SAVE button
  * @param {object} event - Form event
  * @param {boolean} isDeleted - Flag to delete
  */
  onSubmit(event, isDeleted: boolean = false): void {
    let formVal = this.educationForm.value;
    let userEducation = {
      degree: formVal.degree,
      name: formVal.name,
      yearOfPassing: <string>formVal.yearOfPassing,
      percentage: <string>formVal.percentage,
      grade: formVal.grade,
      boardOrUniversity: formVal.boardOrUniversity,
    }

    /* Add `id` if user editing or deleting Education entry */
    if(this.formDetails.id) userEducation['id'] = this.formDetails.id;
    if(isDeleted) userEducation['isDeleted'] = isDeleted;

    let req: any = {
      userId: this.profile.userId,
      firstName: this.profile.firstName,
      language: this.profile.language,
      phone: '8698645680',
      education: [userEducation]
    };

    this.updateEducation(req);
  }

  /* This will call Update User's Info API
  * @param {object} req - Request object for the User profile Service
  */
  updateEducation(req): void {
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