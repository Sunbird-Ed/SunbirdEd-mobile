import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Platform, ViewController, LoadingController } from 'ionic-angular';
import {
  UserProfileService, UpdateUserInfoRequest, UserExistRequest, GenerateOTPRequest
} from 'sunbird';
import { ProfileConstants } from '@app/app';
import { CommonUtilService } from '@app/service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

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
  personEditForm: FormGroup;
  isRequired: Boolean = false;

  constructor(private navParams: NavParams, public viewCtrl: ViewController, public platform: Platform,
    private userProfileService: UserProfileService, private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService,
    private fb: FormBuilder) {
    // this.phoneNumber = this.navParams.get('phoneNumber');
    this.userId = this.navParams.get('userId');
    this.title = this.navParams.get('title');
    this.description = this.navParams.get('description');
    this.type = this.navParams.get('type');

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
    this.initEditForm();
  }
  initEditForm() {
    if (this.type === ProfileConstants.CONTACT_TYPE_EMAIL) {
      this.personEditForm = this.fb.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,4}$')])],
      });
    } else {
      this.personEditForm = this.fb.group({
        phone: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      });
    }
  }


  validate() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      const loader = this.getLoader();
      const formVal = this.personEditForm.value;
      loader.present();
      let req: UserExistRequest;
      if (this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
        req = {
          key: formVal.phone,
          type: ProfileConstants.CONTACT_TYPE_PHONE
        };
      } else {
        req = {
          key: formVal.email,
          type: ProfileConstants.CONTACT_TYPE_EMAIL
        };
      }

      this.userProfileService.isAlreadyInUse(req)
        .then((res: any) => {
          res = JSON.parse(res);
          loader.dismiss();
          if (res && res.result) {
            const data = JSON.parse(res.result.response);
            if (data.id === this.userId) {
              this.viewCtrl.dismiss(false);
            } else {
              this.err = true;
            }
          }
        })
        .catch(err => {
          err = JSON.parse(err);
          loader.dismiss();
          if (err.error === 'USER_NOT_FOUND') {
            this.generateOTP();
          } else if (err.error === 'INVALID_PHONE_NO_FORMAT') {
            // TODO
          }
        });
    } else {
      this.commonUtilService.showToast('INTERNET_CONNECTIVITY_NEEDED');
    }
  }

  phoneNumberErr() {
    if (this.err) {
      this.err = false;
    }
  }

  generateOTP() {
    let req: GenerateOTPRequest;
    if (this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
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
        if (this.type === ProfileConstants.CONTACT_TYPE_PHONE) {
          this.viewCtrl.dismiss(true, this.phone);
        } else {
          this.viewCtrl.dismiss(true, this.email);
        }
      })
      .catch(err => {
        err = JSON.parse(err);
        loader.dismiss();
        this.viewCtrl.dismiss(false);
        if (err.error === 'ERROR_RATE_LIMIT_EXCEEDED') {
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
