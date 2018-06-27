import { TranslateService } from '@ngx-translate/core';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import * as _ from 'lodash';

import { UserProfileService, AuthService, FrameworkService, CategoryRequest } from 'sunbird';
import { ProfilePage } from './../profile';
import { languageList } from './../../../config/framework.filters';
import { ProfileConstants } from '../../../app/app.constant';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'additional-info',
  templateUrl: 'additional-info.html'
})

/* This contains form for the User's Additional Information where user can edit previous one */
export class AdditionalInfoComponent {
  isNewForm: boolean = true;
  additionalInfoForm: FormGroup;
  userId: string;
  profile: any = {};
  profileVisibility: any;
  todayDate: string = new Date().toISOString().slice(0, 10);

  /**
   *  Fallback values for the list items
   */
  languageList: Array<String> = languageList;
  subjectList: Array<String> = [];
  gradeList: Array<String> = [];

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public userProfileService: UserProfileService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private translate: TranslateService,
    private frameworkService: FrameworkService,
    private zone: NgZone
  ) {
    /* Receive data from other component */
    this.userId = this.navParams.get('userId');
    this.profile = this.navParams.get('profile') || {};
    this.profileVisibility = this.navParams.get('profileVisibility') || {};

    this.getFrameworkData('subject', 'subjectList');
    this.getFrameworkData('gradeLevel', 'gradeList');

    this.profile.gender = (this.profile.gender && this.profile.gender.length) ? this.profile.gender.toLocaleLowerCase() : '';

    /* Initialize form with default values */
      this.additionalInfoForm = this.fb.group({
        firstName: [this.profile.firstName || '', Validators.required],
        lastName: [this.profile.lastName || ''],
        language: [this.profile.language || [], Validators.required],
        email: [this.profile.email || ''],
        phone: [this.profile.phone, [Validators.minLength(10)]], // Need to assign phone value
        profileSummary: [this.profile.profileSummary || ''],
        subject: [this.profile.subject || []],
        gender: [this.profile.gender || ''],
        dob: [this.profile.dob || ''],
        grade: [this.profile.grade || []],
        location: [this.profile.location || ''],
        facebookLink: [''],
        twitterLink: [''],
        linkedInLink: [''],
        blogLink: ['']
      });

    /* Patch social Webpages links */
    if (this.profile && this.profile.webPages && this.profile.webPages.length) {
      this.profile.webPages.forEach(element => {
        if (element.type === 'fb') {
          this.additionalInfoForm.patchValue({
            facebookLink: element.url
          })
        } else if (element.type === "twitter") {
          this.additionalInfoForm.patchValue({
            twitterLink: element.url
          })
        } else if (element.type === "in") {
          this.additionalInfoForm.patchValue({
            linkedInLink: element.url
          })
        } else {
          this.additionalInfoForm.patchValue({
            blogLink: element.url
          })
        }
      });
    }
  }

  /**
   * This will internally call framework API, fetches framework data and stores in local variables.
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getFrameworkData(currentCategory: string, propertyName: string): void {
    let req: CategoryRequest = {
      currentCategory: currentCategory
    };

    this.frameworkService.getCategoryData(req,
      (res: any) => {
        this[propertyName] = _.map(JSON.parse(res), 'name');
      },
      (err: any) => {
        console.log("Subject Category Response: ", JSON.parse(err));
      });
  }

  /**
   * To Toggle the lock
   * @param {string} field - Field on the html form
   * @param {string} fieldDisplayName - Language constant for the field
   * @param {boolean} revert - Tells whether to revert changes or not
   */
  toggleLock(field: string, fieldDisplayName: string, revert: boolean = false ) {
    this.zone.run(() => {
      this.profileVisibility[field] = this.profileVisibility[field] === "private" ? "public" : "private";
    });

    if (!revert) {
      if (this.profileVisibility[field] === "private") {
        this.getToast(this.translateMessage('PRIVACY_HIDE_TEXT', this.translateMessage(fieldDisplayName).toLocaleLowerCase())).present();
      } else {
        if (fieldDisplayName === "CURRENT_LOCATION") {
          this.getToast(this.translateMessage('PRIVACY_SHOW_TEXT', _.startCase(this.translateMessage(fieldDisplayName)))).present();
        } else {
          this.getToast(this.translateMessage('PRIVACY_SHOW_TEXT', _.capitalize(this.translateMessage(fieldDisplayName)))).present();
        }

      }
      this.setProfileVisibility(field);
    }

  }

  /**
   * To set Profile visibility
   * @param {string} field - Field on Form
   */
  setProfileVisibility(field: string) {
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let req = {
          userId: JSON.parse(session)[ProfileConstants.USER_TOKEN],
          privateFields:
            this.profileVisibility[field] === "private" ? [field] : [],
          publicFields:
            this.profileVisibility[field] === "public" ? [field] : []
        };
        this.userProfileService.setProfileVisibility(
          req,
          (res: any) => {
            console.log("success", res);
          },
          (err: any) => {
            console.error("Unable to set profile visibility.", err);
            this.toggleLock(field, '', true); // In-case of API fails to update, make privacy lock icon as it was.
          }
        );
      }
    });
  }

  /**
   * This will call on click of `SAVE` button
   * @param {object} event - Form event
   */
  onSubmit(event): void {
    /* Holds form Values */
    let formVal = this.additionalInfoForm.value;

    if (this.profile && this.profile.phone && this.profile.phone.length && formVal.phone === '') {
      formVal.phone = this.profile.phone;
    }

    if (this.validateForm(formVal)) {
      let currentValues: any = {
        userId: this.userId,
        firstName: formVal.firstName,
        language: formVal.language,
        phone: <number>formVal.phone,
        lastName: formVal.lastName,
        profileSummary: formVal.profileSummary,
        subject: formVal.subject,
        gender: formVal.gender,
        dob: formVal.dob,
        grade: formVal.grade,
        location: formVal.location,
        webPages: []
      }

      if (formVal.facebookLink !== '') {
        currentValues.webPages.push({
          type: 'fb',
          url: formVal.facebookLink
        });
      }
      if (formVal.twitterLink !== '') {
        currentValues.webPages.push({
          type: 'twitter',
          url: formVal.twitterLink
        });
      }
      if (formVal.linkedInLink !== '') {
        currentValues.webPages.push({
          type: 'in',
          url: formVal.linkedInLink
        });
      }
      if (formVal.blogLink !== '') {
        currentValues.webPages.push({
          type: 'blog',
          url: formVal.blogLink
        });
      }

      let modifiedFields = this.checkDifference(currentValues, this.profile);
      let req: any = {
        userId: this.userId,
        firstName: formVal.firstName,
        language: formVal.language
      }

      if (modifiedFields.length) {
        modifiedFields.forEach(element => {
          req[element] = currentValues[element]
        });

        this.updateInfo(req);
      } else {
        this.getToast(this.translateMessage('NO_CHANGE')).present();
      }

    }
  }

  validateForm(formVal): boolean {
    formVal.phone = (formVal.phone === null) ? '' : formVal.phone;
    if (!formVal.firstName.length) {
      this.getToast(this.translateMessage('ERROR_EMPTY_FIRSTNAME')).present();
      return false;
    } else if (!formVal.language.length) {
      this.getToast(this.translateMessage('ERROR_EMPTY_LANGUAGE')).present();
      return false;
    } else if ((this.profile && this.profile.phone && (formVal.phone !== this.profile.phone)) || (formVal.phone === '' || (formVal.phone.length !== 10))) {
      if (!formVal.phone.match(/^\d{10}$/)) {
        this.getToast(this.translateMessage('ERROR_SHORT_MOBILE')).present();
        return false;
      }
    }
    return true;
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateInfo(req: any): void {
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
        try {
          if (JSON.parse(err).errorMessages[0]) {
            this.getToast(JSON.parse(err).errorMessages[0]).present();
          }
        }
        catch (e) {
          this.getToast(this.translateMessage('PROFILE_UPDATE_FAILED')).present();
        }
        console.error("Error", err);
      });
  }

  /**
   * This compares two objects and returns the variant fields
   * @param {object} currentValues
   * @param {object} profileObj
   * @returns {Array<string>}
   */
  checkDifference(currentValues, profileObj): Array<string> {
    return _.reduce(currentValues, (result, value, key) => _.isEqual(value, profileObj[key]) ? result : result.concat(key), [])
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

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @param {string} field - The field to be added in the language constant
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

  /**
   * Returns the object of loading controller
   */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}