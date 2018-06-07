import { boardList } from './../../../config/framework.filters';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { FrameworkDetailsRequest, CategoryRequest, FrameworkService, ProfileService, Profile, FormService, SharedPreferences } from 'sunbird';
import { FormRequest } from 'sunbird/services/form/bean';
import { resolve } from 'path';

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
  syllabusList: Array<any> = []
  boardList: Array<any> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];
  userName: string = '';
  selectedLanguage: string;
  frameworks: Array<any> = [];
  frameworkId: string = '';

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
    private events: Events,
    private formService: FormService,
    private preference: SharedPreferences
  ) {
    this.profile = this.navParams.get('profile');

    /* Initialize form with default values */
    this.guestEditForm = this.fb.group({
      syllabus: [this.profile.syllabus && this.profile.syllabus[0] || [], Validators.required],
      name: [this.profile.handle || '', Validators.required],
      boards: [this.profile.board || [], Validators.required],
      grades: [this.profile.grade || []],
      subjects: [this.profile.subject || []],
      medium: [this.profile.medium || []]
    });


    //language code
    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });
  }

  ionViewWillEnter() {
    this.getSyllabusDetails();
  }


  getSyllabusDetails() {
    let loader = this.getLoader();
    loader.present();

    let req: FormRequest = {
      type: 'user',
      subType: 'instructor',
      action: 'onboarding',
    };

    this.formService.getForm(req,
      (res: any) => {
        let response: any = JSON.parse(res);
        console.log("Form Result - " + response.result);
        let fields: Array<any> = response.result.fields;
        let frameworkId: string = '';

        if (fields !== undefined && fields.length > 0) {
          fields.forEach(field => {
            if (field.language === this.selectedLanguage) {
              this.frameworks = field.range;
            }
          });

          if (this.frameworks != null && this.frameworks.length > 0) {
            this.frameworks.forEach(frameworkDetails => {
              let value = { 'name': frameworkDetails.name, 'code': frameworkDetails.frameworkId };
              this.syllabusList.push(value);
            });
          }

          loader.dismiss();
          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            this.getFrameworkDetails(this.profile.syllabus[0])
              .then(catagories => {
                this.categories = catagories;

                // this.checkPrevValue(0, 'syllabusList');

                this.resetForm(0);
                this.guestEditForm.patchValue({
                  boards: this.profile.board || []
                });

                this.resetForm(1);
                this.guestEditForm.patchValue({
                  medium: this.profile.medium || []
                });

                this.resetForm(2);
                this.guestEditForm.patchValue({
                  grades: this.profile.grade || []
                });

                this.resetForm(3);
                this.guestEditForm.patchValue({
                  subjects: this.profile.subject || []
                });

              });
          }

        } else {
          loader.dismiss();

          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
        }
      },
      (error: any) => {
        loader.dismiss();
        console.log("Error - " + error);
        this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
      })
  }


  getFrameworkDetails(frameworkId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let loader = this.getLoader();
      loader.present();

      let req: FrameworkDetailsRequest = {
        defaultFrameworkDetails: true
      };

      if (frameworkId !== undefined && frameworkId.length) {
        req.defaultFrameworkDetails = false;
        req.frameworkId = frameworkId;
        this.frameworkId = frameworkId;
      }


      this.frameworkService.getFrameworkDetails(req,
        (res: any) => {
          let categories = JSON.parse(JSON.parse(res).result.framework).categories;
          loader.dismiss();


          // if (this.profile.board && this.profile.board.length) {
          //   //this.resetForm(0);
          //   this.checkPrevValue(1, 'boardList', [this.profile.syllabus]);
          // }
          // if (this.profile.grade && this.profile.grade.length > 1) {
          //   //this.resetForm(1);
          //   this.checkPrevValue(2, 'gradeList', this.profile.board);
          // }
          // if (this.profile.subject && this.profile.subject.length) {
          //   this.checkPrevValue(3, 'subjectList', this.profile.grade);
          // }

          console.log("Framework details Response: ", JSON.parse(JSON.parse(res).result.framework).categories);
          resolve(categories);
        },
        (err: any) => {
          loader.dismiss();

          console.log("Framework details Response: ", JSON.parse(err));
          reject(err);
        });
    });
  }

  /**
   * This will internally call framework API
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getCategoryData(req: CategoryRequest, list): void {

    // let loader = this.getLoader();
    // loader.present();

    if (this.frameworkId !== undefined && this.frameworkId.length) {
      req.frameworkId = this.frameworkId;
    }

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
        if (list != 'gradeList') {
          //this[list] = this[list].sort();
          this[list] = _.orderBy(this[list], ['name'], ['asc']);
        }
        console.log(list + " Category Response: " + this[list]);
        // loader.dismiss();
      },
      (err: any) => {
        // loader.dismiss();
        console.log("Subject Category Response: ", err);
      });
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = [], ) {
    // if (index != 0) {
    //   let request: CategoryRequest = {
    //     currentCategory: this.categories[index].code,
    //     prevCategory: this.categories[index - 1].code,
    //     selectedCode: prevSelectedValue
    //   }
    //   this.getCategoryData(request, currentField);
    // } else {
    //   let request: CategoryRequest = {
    //     currentCategory: this.categories[index].code
    //   }
    //   this.getCategoryData(request, currentField);
    // }


    if (index === 0) {
      this[currentField] = this.syllabusList;
    } else if (index === 1) {
      this.getFrameworkDetails(prevSelectedValue[0])
        .then(catagories => {
          this.categories = catagories;

          let request: CategoryRequest = {
            currentCategory: this.categories[0].code,
            // prevCategory: ,
            // selectedCode: prevSelectedValue
          }
          this.getCategoryData(request, currentField);
        });

    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: prevSelectedValue
      }
      this.getCategoryData(request, currentField);
    }

  }

  resetForm(index: number = 0): void {
    console.log("Reset Form Index - " + index);
    switch (index) {
      case 0:
        this.guestEditForm.patchValue({
          boards: [],
          grades: [],
          subjects: [],
          medium: []
        });
        this.checkPrevValue(1, 'boardList', [this.guestEditForm.value.syllabus]);
        break;

      case 1:
        this.guestEditForm.patchValue({
          grades: [],
          subjects: [],
          medium: []
        });
        this.checkPrevValue(2, 'mediumList', this.guestEditForm.value.boards);
        break;

      case 2:
        this.guestEditForm.patchValue({
          subjects: [],
          grades: [],
        });
        this.checkPrevValue(3, 'gradeList', this.guestEditForm.value.medium);
        break;
      case 3:
        this.guestEditForm.patchValue({
          subjects: [],
        });
        this.checkPrevValue(4, 'subjectList', this.guestEditForm.value.grades);
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
      profileType: this.profile.profileType,
      createdAt: this.profile.createdAt,
      syllabus: [formVal.syllabus]
    }

    this.profileService.updateProfile(req,
      (res: any) => {
        console.log("Update Response", res);

        // Publish event if the all the fields are submitted
        if (formVal.syllabus.length && formVal.boards.length && formVal.grades.length && formVal.medium.length && formVal.subjects.length) {
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