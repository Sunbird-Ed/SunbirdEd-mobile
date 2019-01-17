import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Platform, ViewController, LoadingController } from 'ionic-angular';
import {
  UserProfileService, UpdateUserInfoRequest, UserExistRequest, GenerateOTPRequest
} from 'sunbird';
import { ProfileConstants } from '@app/app';
import { CommonUtilService } from '@app/service';

@Component({
  selector: 'edit-contact-details-popup',
  templateUrl: 'edit-contact-details-popup.html'
})
export class EditContactDetailsPopupComponent {

  phone;
  email;
  userId: string;
  title: string;
  description: string;
  type: string;
  backButtonFunc = undefined;
  err: boolean;

  constructor(private navParams: NavParams, public viewCtrl: ViewController, public platform: Platform,
    private userProfileService: UserProfileService, private loadingCtrl: LoadingController, private commonUtilService: CommonUtilService,) {
    // this.phoneNumber = this.navParams.get('phoneNumber');
    this.userId = this.navParams.get('userId');
    this.title = this.navParams.get('title');
    this.description = this.navParams.get('description');
    this.type = this.navParams.get('type');

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }


  validate(edited: boolean = false) {
    const loader = this.getLoader();
    loader.present();
    let req: UserExistRequest;
    if ( this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
      req = {
        key: this.phone,
        type: ProfileConstants.CONTACT_TYPE_PHONE
      };
    } else {
      req = {
        key: this.email,
        type: ProfileConstants.CONTACT_TYPE_EMAIL
      };
    }

    this.userProfileService.isAlreadyInUse(req)
      .then((res: any) => {
        res  = JSON.parse(res);
        console.log('------success response----------', res);
        loader.dismiss();
        if (res && res.result) {
          const data = JSON.parse(res.result.response);
          if (data.id === this.userId) {
            this.viewCtrl.dismiss();
          } else {
            // TODO :  show error message 'already exists'
            this.err = true;
          }
        }
      })
      .catch(err => {
        err = JSON.parse(err);
        loader.dismiss();
        console.log('------error response----------', err);
        if (err.error === 'USER_NOT_FOUND') {
          this.generateOTP(edited);
        } else if (err.error === 'INVALID_PHONE_NO_FORMAT') {
          // TODO
        }
      });
  }

  generateOTP(edited: boolean = false) {
    let req: GenerateOTPRequest;
    if ( this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
      req = {
        key: this.phone,
        type: ProfileConstants.CONTACT_TYPE_PHONE
      };
    } else {
      req = {
        key: this.email,
        type: ProfileConstants.CONTACT_TYPE_EMAIL
      };
    }
    const loader = this.getLoader();
    loader.present();
    this.userProfileService.generateOTP(req)
      .then((res: any) => {
        res = JSON.parse(res);
        loader.dismiss();
        this.viewCtrl.dismiss(edited, this.email);
        console.log('------generateOTP success response----------', res);
      })
      .catch(err => {
        err  = JSON.parse(err);
        loader.dismiss();
        this.viewCtrl.dismiss(edited);
        console.log('------generateOTP Error response----------', err);
        if (err.error === 'ERROR_RATE_LIMIT_EXCEEDED' ) {
          this.commonUtilService.showToast('You have exceeded the maximum limit for OTP, Please try after some time');
        }
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
    });
  }

  cancel() {
    this.viewCtrl.dismiss(false);
  }
}
