import {Component, Inject} from '@angular/core';
import {Loading, LoadingController, NavParams, Platform} from 'ionic-angular';
import {TncUpdateHandlerService} from '@app/service/handlers/tnc-update-handler.service';
import {LogoutHandlerService} from '@app/service/handlers/logout-handler.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CommonUtilService, TelemetryGeneratorService, AppHeaderService} from '@app/service';
import {TranslateService} from '@ngx-translate/core';
import {AppVersion} from '@ionic-native/app-version';
import {Environment, ImpressionType, InteractSubtype, InteractType, PageId} from '../../service/telemetry-constants';
import {ProfileService, ServerProfile} from 'sunbird-sdk';
import {ProfileConstants} from '../../app';

@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html',
})
export class TermsAndConditionsPage {
  public tncLatestVersionUrl: SafeUrl;
  public termsAgreed = false;
  private loading?: Loading;
  private unregisterBackButtonAction?: Function;
  private userProfileDetails: ServerProfile;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    private navParams: NavParams,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private logoutHandlerService: LogoutHandlerService,
    private tncUpdateHandlerService: TncUpdateHandlerService,
    private sanitizer: DomSanitizer,
    private commonUtilService: CommonUtilService,
    private translateService: TranslateService,
    private appVersion: AppVersion,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private headerService: AppHeaderService
  ) {
  }

  public async ionViewDidLoad() {
    this.headerService.hideHeader();
    this.userProfileDetails = (await this.profileService.getActiveSessionProfile({requiredFields: ProfileConstants.REQUIRED_FIELDS}).toPromise()).serverProfile;

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

  public ionViewWillLeave() {
    if (this.unregisterBackButtonAction) {
      this.unregisterBackButtonAction();
    }
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

  public onConfirmationChange(event) {
    const valuesMap = new Map();
    valuesMap['isChecked'] = event.checked;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.ACCEPTANCE_CHECKBOX_CLICKED,
      Environment.HOME,
      PageId.TERMS_N_CONDITIONS,
      undefined,
      valuesMap
    );
    this.termsAgreed = event.checked;
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
