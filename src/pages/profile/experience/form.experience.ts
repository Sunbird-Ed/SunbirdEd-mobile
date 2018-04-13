
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserProfileService } from 'sunbird';
import { ProfilePage } from './../profile';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

/* This contains form for the Experience where user can Add new job exprience Entry or can edit/delete previous one */
export class FormExperience {
  tabBarElement: any;
  isNewForm: boolean = true;
  jobInfo: any = {};
  experienceForm: FormGroup;
  profile: any = {};

  /* @todo Fetch languageList, SubjectList and gradeList from the framework */
  subjectList: Array<String> = ["Assamese", "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Marathi", "Punjabi", "Tamil", "Telugu"];

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(public navCtrl: NavController,
    private fb: FormBuilder,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private toastCtrl: ToastController
  ) {

    /* Returns a html element for tab bar*/
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    /* Receive data from other component */
    this.isNewForm = this.navParams.get('addForm');
    this.jobInfo = this.navParams.get('jobInfo') || {};
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.experienceForm = this.fb.group({
      jobName: [this.jobInfo.jobName || ''],
      orgName: [this.jobInfo.orgName || '', Validators.required],
      role: [this.jobInfo.role || ''],
      subject: [this.jobInfo.subject || ''],
      isCurrentJob: [''],
      joiningDate: [''],
      endDate: ['']
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
    let formVal = this.experienceForm.value;
    let userJobProfile = {
      jobName: formVal.jobName,
      orgName: formVal.orgName,
      role: formVal.role,
      subject: formVal.subject,
      isCurrentJob: <boolean>formVal.isCurrentJob
    }

    if(formVal.joiningDate != '') userJobProfile['joiningDate'] = <string>formVal.joiningDate;
    if(formVal.endDate != '') userJobProfile['endDate'] = <string>formVal.endDate;
    if(this.jobInfo.id) userJobProfile['id'] = this.jobInfo.id;
    if(isDeleted) userJobProfile['isDeleted'] = isDeleted;

    let req: any = {
      userId: this.profile.userId,
      firstName: this.profile.firstName,
      language: this.profile.language,
      phone: '8698645680',
      jobProfile: [userJobProfile]
    };

    this.updateExprience(req);
  }

  /* This will call Update User's Info API
  * @param {object} req - Request object for the User profile Service
  */
  updateExprience(req): void {
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

  /* This method formats the date from YYY-MM-dd HH:MM:SS Z to YYYY-MM-dd 
  * @param {string} date - Date in the string Format
  * @param {string} - Date in the ISO format
  */
  formatDate(date: string): string {
    return new Date(date).toISOString().slice(0, 10);
  }
}