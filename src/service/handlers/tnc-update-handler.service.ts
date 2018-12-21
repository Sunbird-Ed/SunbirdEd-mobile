import {Injectable} from '@angular/core';
import {UserProfileService} from 'sunbird';
import {Modal, ModalController} from 'ionic-angular';
import {TermsAndConditionsPage} from '@app/pages/terms-and-conditions/terms-and-conditions';

interface UserProfile {
  tncAcceptedVersion: string;
  tncAcceptedOn: string;
  tncLatestVersion: string;
  promptTnC: boolean;
  tncLatestVersionUrl: string;
}

@Injectable()
export class TncUpdateHandlerService {
  private modal?: Modal;

  constructor(
    private modalCtrl: ModalController,
    private userProfileService: UserProfileService,
  ) {
  }

  public static hasProfileTncUpdated(user: UserProfile): boolean {
    return !!(user.promptTnC && user.tncLatestVersion && user.tncLatestVersionUrl);
  }

  public async presentTncPage(navParams: any): Promise<undefined> {
    this.modal = this.modalCtrl.create(TermsAndConditionsPage, navParams);
    return this.modal.present();
  }

  public async onAcceptTnc(user: UserProfile): Promise<void> {
    console.log(user);
    return new Promise<void>(((resolve, reject) => {
      this.userProfileService.acceptTermsAndConditions({
        version: user.tncLatestVersion
      }, () => {
        resolve();
      }, (e) => {
        reject(e);
      });
    }));
  }

  public async dismissTncPage(): Promise<void> {
    if (this.modal) {
      return this.modal.dismiss();
    }
  }
}
