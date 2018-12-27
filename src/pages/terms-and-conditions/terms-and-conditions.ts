import {Component} from '@angular/core';
import {Loading, LoadingController, NavParams, Platform} from 'ionic-angular';
import {TncUpdateHandlerService} from '@app/service/handlers/tnc-update-handler.service';
import {LogoutHandlerService} from '@app/service/handlers/logout-handler.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html',
})
export class TermsAndConditionsPage {

  public tncLatestVersionUrl: SafeUrl;
  public shouldAcceptanceButtonEnabled = false;
  private loading?: Loading;
  private unregisterBackButtonAction?: Function;
  private userProfileDetails;

  constructor(
    private navParams: NavParams,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private logoutHandlerService: LogoutHandlerService,
    private tncUpdateHandlerService: TncUpdateHandlerService,
    private sanitizer: DomSanitizer
  ) {
  }

  public async ionViewDidLoad() {
    this.userProfileDetails = this.navParams.get('userProfileDetails');

    this.tncLatestVersionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.userProfileDetails.tncLatestVersionUrl);

    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(async () => {
      await this.logout();
    }, 10);

    await this.createAndPresentLoadingSpinner();
  }

  public onIFrameLoad() {
    if (this.loading) {
      this.loading.dismissAll();
    }
  }

  public onConfirmationChange(change: boolean) {
    this.shouldAcceptanceButtonEnabled = change;
  }

  public async onAcceptanceClick(): Promise<void> {
    try {
      await this.tncUpdateHandlerService.onAcceptTnc(this.userProfileDetails);
      await this.tncUpdateHandlerService.dismissTncPage();
    } catch (e) {
      await this.logout();
    }
  }

  private async createAndPresentLoadingSpinner() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop: true,
      spinner: 'crescent'
    });

    await this.loading.present();
  }

  private async logout() {
    if (this.unregisterBackButtonAction) {
      this.unregisterBackButtonAction();
    }
    this.logoutHandlerService.onLogout();
    await this.tncUpdateHandlerService.dismissTncPage();
  }
}
