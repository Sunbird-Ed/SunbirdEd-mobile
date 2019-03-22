import { Injectable } from '@angular/core';
import {
  AuthService,
  UserProfileDetailsRequest,
  UserProfileService
} from 'sunbird';
import { Modal, ModalController } from 'ionic-angular';
import { TermsAndConditionsPage } from '@app/pages/terms-and-conditions/terms-and-conditions';
import { ProfileConstants } from '@app/app';

interface UserProfile {
  tncAcceptedVersion: string;
  tncAcceptedOn: string;
  tncLatestVersion: string;
  promptTnC: boolean;
  tncLatestVersionUrl: string;
  userId: string;
}

@Injectable()
export class TncUpdateHandlerService {
  private modal?: Modal;

  constructor(
    private modalCtrl: ModalController,
    private userProfileService: UserProfileService,
    private authService: AuthService
  ) {
  }

  public async checkForTncUpdate(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.getSessionData((session) => {
        if (!session || session === 'null') {
          resolve(false);
          return;
        }

        const sessionObj = JSON.parse(session);
        const reqObj: UserProfileDetailsRequest = {
          userId: sessionObj[ProfileConstants.USER_TOKEN],
          requiredFields: ProfileConstants.REQUIRED_FIELDS,
          returnRefreshedUserProfileDetails: true
        };

        this.userProfileService.getUserProfileDetails(reqObj, res => {
          const userProfileDetails = JSON.parse(res);
          if (!this.hasProfileTncUpdated(userProfileDetails)) {
            resolve(false);
            return;
          }

          this.presentTncPage({ userProfileDetails }).then(() => {
            resolve(true);
            return;
          });
        }, (e) => {
          reject(e);
        });
      });
    });
  }

  private hasProfileTncUpdated(user: UserProfile): boolean {
    return !!(user.promptTnC && user.tncLatestVersion && user.tncLatestVersionUrl);
  }

  private async presentTncPage(navParams: any): Promise<undefined> {
    this.modal = this.modalCtrl.create(TermsAndConditionsPage, navParams);
    return this.modal.present();
  }

  public async onAcceptTnc(user: UserProfile): Promise<void> {
    return new Promise<void>(((resolve, reject) => {
      this.userProfileService.acceptTermsAndConditions({
        version: user.tncLatestVersion
      }, () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }))
      .then(() => {
        const reqObj: UserProfileDetailsRequest = {
          userId: user.userId,
          requiredFields: ProfileConstants.REQUIRED_FIELDS,
          returnRefreshedUserProfileDetails: true
        };
        return new Promise<void>(((resolve, reject) => {
          this.userProfileService.getUserProfileDetails(reqObj,
            res => {
              resolve();
            }, (e) => {
              reject(e);
            });
        }));
      });
  }

  public async dismissTncPage(): Promise<void> {
    if (this.modal) {
      return this.modal.dismiss();
    }
  }
}
