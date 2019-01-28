import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, LoadingController } from 'ionic-angular';
import {
  UserProfileService, UpdateUserInfoRequest, UserExistRequest, GenerateOTPRequest, VerifyOTPRequest
} from 'sunbird';
import { ProfileConstants } from '@app/app';
import { CommonUtilService } from '@app/service';

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
    private userProfileService: UserProfileService, private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService) {
    this.key = this.navParams.get('key');
    this.title = this.navParams.get('title');
    this.description = this.navParams.get('description');
    this.type = this.navParams.get('type');

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }


  verify() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
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
          this.viewCtrl.dismiss(true, this.key);
        })
        .catch(err => {
          err = JSON.parse(err);
          if (err.error === 'ERROR_INVALID_OTP') {
            this.invalidOtp = true;
          }
        });
    } else {
      this.commonUtilService.showToast('INTERNET_CONNECTIVITY_NEEDED');
    }
  }

  resendOTP() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
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
        })
        .catch(err => {
          loader.dismiss();
        });
    } else {
        this.commonUtilService.showToast('INTERNET_CONNECTIVITY_NEEDED');
    }
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
