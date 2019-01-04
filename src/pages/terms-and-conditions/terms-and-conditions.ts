import { Component } from '@angular/core';
import { Loading, LoadingController, NavParams, Platform } from 'ionic-angular';
import { TncUpdateHandlerService } from '@app/service/handlers/tnc-update-handler.service';
import { LogoutHandlerService } from '@app/service/handlers/logout-handler.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { ImpressionType, PageId, Environment, InteractType, InteractSubtype } from 'sunbird';

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
    private sanitizer: DomSanitizer,
    private commonUtilService: CommonUtilService,
    private translateService: TranslateService,
    private appVersion: AppVersion,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
  }

  public async ionViewDidLoad() {
    this.userProfileDetails = this.navParams.get('userProfileDetails');

    this.tncLatestVersionUrl = this.sanitizer
      .bypassSecurityTrustResourceUrl(this.userProfileDetails.tncLatestVersionUrl);

    this.unregisterBackButtonAction = this.platform
      .registerBackButtonAction(async () => await this.showToastOnFirstBackNavigation(), 10);

    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.TERMS_N_CONDITIONS,
      Environment.HOME
    );
    await this.createAndPresentLoadingSpinner();
  }

  public onIFrameLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.TERMS_N_CONDITIONS_STATIC_PAGE,
      Environment.HOME
    );
    if (this.loading) {
      this.loading.dismissAll();
    }
  }

  public onConfirmationChange(change: boolean) {
    const valuesMap = new Map();
    valuesMap['isChecked'] = change;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.ACCEPTANCE_CHECKBOX_CLICKED,
      Environment.HOME,
      PageId.TERMS_N_CONDITIONS,
      undefined,
      valuesMap
    );
    this.shouldAcceptanceButtonEnabled = change;
  }

  public async onAcceptanceClick(): Promise<void> {
    try {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.CONTINUE_CLICKED,
        Environment.HOME,
        PageId.TERMS_N_CONDITIONS
      );
      await this.tncUpdateHandlerService.onAcceptTnc(this.userProfileDetails);
      await this.tncUpdateHandlerService.dismissTncPage();
    } catch (e) {
      await this.logoutOnSecondBackNavigation();
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

  private async logoutOnSecondBackNavigation() {
    this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.TERMS_N_CONDITIONS, Environment.HOME, false);
    if (this.unregisterBackButtonAction) {
      this.unregisterBackButtonAction();
    }
    this.logoutHandlerService.onLogout();
    await this.tncUpdateHandlerService.dismissTncPage();
  }

  private async showToastOnFirstBackNavigation() {
    this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.TERMS_N_CONDITIONS, Environment.HOME, false);
    this.commonUtilService.showToast(await this.translateService
      .get('TNC_BACK_NAVIGATION_MESSAGE',
        { app_name: await this.appVersion.getAppName() }
      ).toPromise<string>());

    if (this.unregisterBackButtonAction) {
      this.unregisterBackButtonAction();
    }

    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(async () => {
      await this.logoutOnSecondBackNavigation();
    }, 10);
  }
}
