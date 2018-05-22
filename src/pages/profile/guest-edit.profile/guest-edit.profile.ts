import { boardList } from './../../../config/framework.filters';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
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
  boardList: Array<any> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName: string = '';
  mode: any = {};


  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(private navCtrl: NavController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private frameworkService: FrameworkService,
    private profileService: ProfileService,
    private translate: TranslateService,
    private events: Events
  ) {
    this.mode = this.navParams.get('mode');
    this.profile = this.navParams.get('profile') || {};

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      userType: [this.profile.userType || ['student'] ],
      name: [this.profile.handle || '', Validators.required],
      boards: [this.profile.board || []],
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
        if (this.profile.board && this.profile.board.length) {
          //this.resetForm(0);
          this.checkPrevValue(1, 'gradeList', this.profile.grade);
        }
        if (this.profile.grade && this.profile.grade.length) {
          //this.resetForm(1);
          this.checkPrevValue(2, 'subjectList', this.profile.subject);
        }
        if (this.profile.subject && this.profile.subject.length) {
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
        //this[list] = _.map(JSON.parse(res), 'code');
        /* if(list === 'boardList') {
          this.boardList = JSON.parse(res);
        } else {
          this[list] = _.map(JSON.parse(res), 'code');
        } */
        this[list] = JSON.parse(res);
        console.log("BoardList", this.boardList);
        if(list != 'gradeList')
        {
          //this[list] = this[list].sort();
          this[list] = _.orderBy(this[list], ['name'], ['asc']);
         }
        console.log(list + " Category Response: " + this[list]);
      },
      (err: any) => {
        console.log("Subject Category Response: ", err);
      });
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = [], ) {
    if (index != 0) {
      let request: CategoryRequest = {
        currentCategory: this.categories[index].code,
        prevCategory: this.categories[index - 1].code,
        selectedCode: prevSelectedValue
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
        this.checkPrevValue(1, 'gradeList', this.guestEditForm.value.boards);
        break;

      case 1:
        this.guestEditForm.patchValue({
          subjects: [],
          medium: []
        });
        this.checkPrevValue(2, 'subjectList', this.guestEditForm.value.grades);
        break;

      case 2:
        this.guestEditForm.patchValue({
          medium: [],
        });
        this.checkPrevValue(3, 'mediumList', this.guestEditForm.value.subjects);
        break;
    }
  }

  /**
   * Call on Submit the form
   */
  onSubmit(): void {
    let loader = this.getLoader();
    loader.present();
    let formVal = this.guestEditForm.value;
    let req: Profile = {
      age: -1,
      day: -1,
      month: -1,
      standard: -1,
      board: formVal.boards,
      grade: formVal.grades,
      subject: formVal.subjects,
      medium: formVal.medium,
      uid: this.profile.uid,
      handle: formVal.name,
      isGroupUser: false,
      language: "en",
      avatar: "avatar",
      createdAt: this.profile.createdAt,
      profileType: formVal.userType === 'student' ? ProfileType.STUDENT : ProfileType.TEACHER
    }

    if(this.mode === 'create') {
      this.profileService.createProfile(req,
      (success: any) => {
        console.log("createProfile success : " + success);
        if (success) {
          loader.dismiss();
          let response = JSON.parse(success);
          console.log("UID of the created user - " + response.uid);
          this.getToast(this.translateMessage('PROFILE_CREATE_SUCCESS')).present();
          this.navCtrl.pop();
        }
      },
      (errorResponse: any) => {
        loader.dismiss();
        this.getToast(this.translateMessage('PROFILE_CREATE_FAILED')).present();
        console.log("createProfile success : " + errorResponse);
      }) 
    } else {
      this.profileService.updateProfile(req,
        (res: any) => {
          console.log("Update Response", res);

          // Publish event if the all the fields are submitted
          if (formVal.boards.length && formVal.grades.length && formVal.medium.length && formVal.subjects.length) {
            this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: true });
          } else {
            this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: false });
          }
          this.events.publish('refresh:profile');
          this.events.publish('refresh:onboardingcard');

          loader.dismiss();
          this.getToast(this.translateMessage('PROFILE_UPDATE_SUCCESS')).present();
          this.navCtrl.pop();
        },
        (err: any) => {
          loader.dismiss();
          this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
          
          console.log("Err", err);
        });
    }
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

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}