import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ToastCmp, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { FrameworkDetailsRequest, CategoryRequest, FrameworkService, ProfileService, Profile, ProfileType } from 'sunbird';

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
  categories: Array<any> = [];
  boardList: Array<string> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName: string  = '';


  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(private navCtrl: NavController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private frameworkService: FrameworkService,
    private profileService: ProfileService,
    private translate: TranslateService,
    private events: Events
  ) {
    this.profile = this.navParams.get('profile');

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      name: [this.profile.handle || '', Validators.required],
      boards: [this.profile.board || [], Validators.required],
      grades: [this.profile.grade || []],
      subjects: [this.profile.subject || []],
      medium: [this.profile.medium || []]
    });
  }

  ionViewWillEnter() {
    this.getFrameworkDetails();

  }

  getFrameworkDetails(): void {
    let req: FrameworkDetailsRequest = {
      defaultFrameworkDetails: true
    };

    this.frameworkService.getFrameworkDetails(req,
      (res: any) => {
        this.categories = JSON.parse(JSON.parse(res).result.framework).categories;

        this.checkPrevValue(0, 'boardList');
        if(this.profile.board.length) {
          //this.resetForm(0);
          this.checkPrevValue(1, 'gradeList', this.profile.grade);
        }
        if(this.profile.grade.length) {
          //this.resetForm(1);
          this.checkPrevValue(2, 'subjectList', this.profile.subject);
        }
        if(this.profile.subject.length) {
          this.checkPrevValue(3, 'mediumList', this.profile.medium);
        }
        console.log("Framework details Response: ", JSON.parse(JSON.parse(res).result.framework).categories);
      },
      (err: any) => {
        console.log("Framework details Response: ", JSON.parse(err));
      });
  }

  /**
   * This will internally call framework API
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getCategoryData(req: CategoryRequest, list): void {

    this.frameworkService.getCategoryData(req,
      (res: any) => {
        this[list] = _.map(JSON.parse(res), 'name');
        console.log(list + " Category Response: " + this[list]);
      },
      (err: any) => {
        console.log("Subject Category Response: ", err);
      });
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = '', ) {
    if (index != 0) {
      let request: CategoryRequest = {
        currentCategory: this.categories[index].code,
        prevCategory: this.categories[index - 1].code,
        selectedCode: [prevSelectedValue]
      }
      this.getCategoryData(request, currentField);
    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index].code
      }
      this.getCategoryData(request, currentField);
    }
  }

  resetForm(index: number = 0): void {
    switch (index) {
      case 0:
        this.guestEditForm.patchValue({
          grades: [],
          subjects: [],
          medium: []
        });
        this.checkPrevValue(index + 1, 'gradeList', this.guestEditForm.value.boards);
        break;

      case 1:
        this.guestEditForm.patchValue({
          subjects: [],
          medium: []
        });
        this.checkPrevValue(index + 1, 'subjectList', this.guestEditForm.value.subjects);
        break;

      case 2:
        this.guestEditForm.patchValue({
          medium: [],
        });
        this.checkPrevValue(index + 1, 'mediumList', this.guestEditForm.value.medium);
        break;
    }
  }

  onChanges(): void {
    // this.guestEditForm.get('name').valueChanges.subscribe(val => {
    //   this.formattedMessage = `My name is ${val}.`;
    // });
  }

  /**
   * Call on Submit the form
   */
  onSubmit(): void {
    let formVal = this.guestEditForm.value;
    let req: Profile = {
      age: -1,
      day: -1,
      month: -1,
      standard: -1,
      board: formVal.boards || this.profile.board,
      grade: formVal.grades || this.profile.grade,
      subject: formVal.subjects || this.profile.subject,
      medium: formVal.medium || this.profile.medium,
      uid: this.profile.uid,
      handle: formVal.name,
      isGroupUser: false,
      language: "en",
      avatar: "avatar",
      createdAt: this.profile.createdAt
    }

    this.profileService.updateProfile(req,
      (res: any) => {
        console.log("Update Response", res);
        this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();

        // Publish event if the all the fields are submitted
        if(formVal.boards.length && formVal.grades.length && formVal.medium.length && formVal.subjects.length) {
          this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
        }
        this.events.publish('refresh:profile');
        this.navCtrl.pop();
      },
      (err: any) => {
        this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
        console.log("Err", err);
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

  /** It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }
}