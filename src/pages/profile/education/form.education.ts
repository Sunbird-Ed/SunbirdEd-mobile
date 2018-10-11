import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  NavController,
  NavParams,
  Platform,
  AlertController,
  IonicApp
} from 'ionic-angular';
import * as _ from 'lodash';
import { UserProfileService, UserEducation, UpdateUserInfoRequest } from 'sunbird';
import { ProfilePage } from '../profile';
import { CommonUtilService } from '../../../service/common-util.service';

@Component({
  selector: 'page-education',
  templateUrl: 'form.education.html'
})

/* This contains form for the Education where user can Add new Education Entry or can edit/delete previous one */
export class FormEducation {

  isNewForm = true;
  educationForm: FormGroup;
  formDetails: any = {};
  profile: any = {};
  yopList: Array<number> = _.rangeRight(1950, new Date().getFullYear() + 1);
  unregisterBackButton: any;

  constructor(
    private navCtrl: NavController,
    public fb: FormBuilder,
    private navParams: NavParams,
    private userProfileService: UserProfileService,
    private commonUtilService: CommonUtilService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private ionicApp: IonicApp
  ) {

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
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 11);
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }

  /**
   * It will Dismiss active popup
   */
  dismissPopup() {
    const activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

  /**
   * This will call on click of DELETE and SAVE button
   * @param {object} event - Form event
   * @param {boolean} isDeleted - Flag to delete
   */
  onSubmit(isDeleted: boolean = false): void {
    const formVal = this.educationForm.value;

    if (this.validateForm(formVal)) {
      const userEducation: UserEducation = {
        degree: formVal.degree,
        name: formVal.name,
        yearOfPassing: <number>formVal.yearOfPassing,
        percentage: <number>formVal.percentage,
        grade: formVal.grade,
        boardOrUniversity: formVal.boardOrUniversity
      };

      /* Add `id` if user editing or deleting Education entry */
      if (this.formDetails.id) { userEducation['id'] = this.formDetails.id; }
      if (isDeleted) { userEducation['isDeleted'] = isDeleted; }

      // Remove empty object element
      Object.keys(userEducation).forEach((key) => (userEducation[key] === '') && delete userEducation[key]);

      const req: UpdateUserInfoRequest = {
        userId: this.profile.userId,
        education: [userEducation]
      };

      this.updateEducation(req);
    }
  }

  /**
   * This will validate a form
   * @param   {object} formVal Form values object
   * @returns {boolean} returns form validating status
   */
  validateForm(formVal): boolean {
    if (formVal.percentage && (formVal.percentage < 0 || formVal.percentage > 100)) {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('WARNING_INVALID_PERCENTAGE'));

      return false;
    }

    return true;
  }

  /**
   * This will call Update User's Info API
   * @param {object} req - Request object for the User profile Service
   */
  updateEducation(req): void {
    const loader = this.commonUtilService.getLoader();
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
   * Shows Confirmation box while deleting education
   */
  showDeleteConfirm() {
    const confirm = this.alertCtrl.create({
      title: this.commonUtilService.translateMessage('CONFIRM_DEL', this.commonUtilService.translateMessage('TITLE_EDUCATION')),
      mode: 'wp',
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: this.commonUtilService.translateMessage('CANCEL'),
          role: 'cancel',
          cssClass: 'alert-btn-cancel'
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
          cssClass: 'closeButton'
        }
      ]
    });

    confirm.present();
    const unRegisterBackButton = this.platform.registerBackButtonAction(() => {
      // dismiss on back press
      confirm.dismiss();
    }, 11);

    // unregister handler after modal closes
    confirm.onDidDismiss(() => {
      unRegisterBackButton();
    });
  }
}
