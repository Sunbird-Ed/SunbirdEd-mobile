import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, LoadingController } from 'ionic-angular';
import {
  UserProfileService, UpdateUserInfoRequest, UserExistRequest, GenerateOTPRequest, VerifyOTPRequest
} from 'sunbird';
import { ProfileConstants } from '@app/app';

@Component({
  selector: 'edit-contact-verify-popup',
  templateUrl: 'edit-contact-verify-popup.html'
})
export class EditContactVerifyPopupComponent {
  /**
   * Key may be phone or email depending on the verification flow from which it is called
   */
  key;
  otp;
  title: string;
  description: string;
  type: string;
  backButtonFunc = undefined;
  invalidOtp = false;
  enableResend = true;

  constructor(private navParams: NavParams, public viewCtrl: ViewController, public platform: Platform,
    private userProfileService: UserProfileService, private loadingCtrl: LoadingController) {
    this.key = this.navParams.get('key');
    this.title = this.navParams.get('title');
    this.description = this.navParams.get('description');
    this.type = this.navParams.get('type');

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }


  verify(edited: boolean = false) {
    let req: VerifyOTPRequest;
    if (this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
      req = {
        key: this.key,
        type: ProfileConstants.CONTACT_TYPE_PHONE,
        otp: this.otp
      };
    } else {
      req = {
        key: this.key,
        type: ProfileConstants.CONTACT_TYPE_EMAIL,
        otp: this.otp
      };
    }
    this.userProfileService.verifyOTP(req)
      .then(res => {
        console.log('------success response----------', res);
        this.viewCtrl.dismiss(edited, this.key);
      })
      .catch(err => {
        err = JSON.parse(err);
        console.log('------Error response----------', err);
        if (err.error === 'ERROR_INVALID_OTP') {
          this.invalidOtp = true;
        }
      });
  }

  resendOTP(edited: boolean = false) {
    this.enableResend = !this.enableResend;
    let req: GenerateOTPRequest;
    if (this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
      req = {
        key: this.key,
        type: ProfileConstants.CONTACT_TYPE_PHONE
      };
    } else {
      req = {
        key: this.key,
        type: ProfileConstants.CONTACT_TYPE_EMAIL
      };
    }
    const loader = this.getLoader();
    loader.present();
    this.userProfileService.generateOTP(req)
      .then((res: any) => {
        res = JSON.parse(res);
        loader.dismiss();
        console.log('------re-generateOTP success response----------', res);
      })
      .catch(err => {
        loader.dismiss();
        console.log('------re-generateOTP Error response----------', err);
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
