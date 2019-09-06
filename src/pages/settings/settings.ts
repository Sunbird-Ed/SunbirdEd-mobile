import { AppGlobalService, TelemetryGeneratorService, UtilityService, AppHeaderService } from '@app/service';
import { CommonUtilService } from './../../service/common-util.service';
import { Component, Inject } from '@angular/core';
import { NavController, PopoverController, ToastController } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { PreferenceKey } from '../../app/app.constant';
import { Environment, ImpressionType, InteractSubtype, InteractType, PageId, } from '../../service/telemetry-constants';
import {
  ContentService,
  DeviceInfo,
  ProfileService,
  SharedPreferences,
  TelemetryImpressionRequest,
  AuthService,
  OAuthSessionProvider,
  SdkConfig,
  ApiService,
  MergeServerProfilesRequest
} from 'sunbird-sdk';
import { PermissionPage } from '../permission/permission';
import { Observable } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {SbPopoverComponent} from '@app/component';

declare const cordova;
const KEY_SUNBIRD_CONFIG_FILE_PATH = 'sunbird_config_file_path';
const SUBJECT_NAME = 'support request';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  chosenLanguageString: string;
  selectedLanguage: string;
  fileUrl: string;
  deviceId: string;
  subjectDetails: string;
  shareAppLabel: string;
  appName: any;

  public isUserLoggedIn$: Observable<boolean>;
  public isNotDefaultChannelProfile$: Observable<boolean>;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    @Inject('SDK_CONFIG') private sdkConfig: SdkConfig,
    @Inject('API_SERVICE') private apiService: ApiService,
    private navCtrl: NavController,
    private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private commonUtilService: CommonUtilService,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private utilityService: UtilityService,
    private headerService: AppHeaderService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private popoverCtrl: PopoverController
  ) {
    this.isUserLoggedIn$ = this.authService.getSession()
      .map((session) => !!session) as any;

    this.isNotDefaultChannelProfile$ = this.profileService.isDefaultChannelProfile()
      .map((isDefaultChannelProfile) => !isDefaultChannelProfile) as any;
  }

  ionViewWillEnter() {
    this.headerService.showHeaderWithBackButton();
    this.appVersion.getAppName()
      .then((appName) => {
        this.appName = appName;
        this.shareAppLabel = this.commonUtilService.translateMessage('SHARE_APP', appName);
      });
  }


  ionViewDidLoad() {
    const telemetryImpressionRequest = new TelemetryImpressionRequest();
    telemetryImpressionRequest.type = ImpressionType.VIEW;
    telemetryImpressionRequest.pageId = PageId.SETTINGS;
    telemetryImpressionRequest.env = Environment.SETTINGS;
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.SETTINGS,
      Environment.SETTINGS, '', '', '',
      undefined,
      undefined
    );
  }

  ionViewDidEnter() {
    this.chosenLanguageString = this.commonUtilService.translateMessage('CURRENT_LANGUAGE');
    this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE).toPromise()
      .then(value => {
        this.selectedLanguage = `${this.chosenLanguageString} : ${value}`;
      });
  }

  goToLanguageSetting() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.LANGUAGE_CLICKED);
    this.navCtrl.push(LanguageSettingsPage, {
      isFromSettings: true
    });
  }

  dataSync() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.DATA_SYNC_CLICKED);
    this.navCtrl.push(DatasyncPage);
  }

  aboutUs() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.ABOUT_APP_CLICKED);
    this.navCtrl.push(AboutUsPage);
  }

  shareApp() {
    const loader = this.commonUtilService.getLoader();
    loader.present();

    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SHARE_APP_CLICKED);
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SHARE_APP_INITIATED);


    this.utilityService.exportApk()
      .then((filepath) => {
        this.generateInteractTelemetry(InteractType.OTHER, InteractSubtype.SHARE_APP_SUCCESS);
        loader.dismiss();
        this.socialSharing.share('', '', 'file://' + filepath, '');
      }).catch((error) => {
        loader.dismiss();
        console.log(error);
      });
  }

  generateInteractTelemetry(interactionType, interactSubtype) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      interactionType, interactSubtype,
      PageId.SETTINGS,
      Environment.SETTINGS, null,
      undefined,
      undefined
    );
  }

  showPermissionPage() {
    this.navCtrl.push(PermissionPage, { changePermissionAccess: true } ) ;
  }

  async showMergeAccountConfirmationPopup() {
    const confirm = this.popoverCtrl.create(SbPopoverComponent, {
      isNotShowCloseIcon: false,
      sbPopoverHeading: this.commonUtilService.translateMessage('ACCOUNT_MERGE_CONFIRMATION_HEADING'),
      sbPopoverHtmlContent: '<div class="sb-popover-content text-left font-weight-normal padding-left-10 padding-right-10">' + this.commonUtilService.translateMessage('ACCOUNT_MERGE_CONFIRMATION_CONTENT', await this.appVersion.getAppName()) + '</div>',
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'popover-button-cancel',
        },
        {
          btntext: this.commonUtilService.translateMessage('OKAY'),
          btnClass: 'popover-button-allow',
        }
      ],
      handler: (selectedButton: string) => {
        if (selectedButton === this.commonUtilService.translateMessage('CANCEL')) {
          confirm.dismiss();
        } else if (selectedButton === this.commonUtilService.translateMessage('OKAY')) {
          confirm.dismiss();
          this.mergeAccount();
        }
      }
    }, {
      cssClass: 'sb-popover primary',
    });

    confirm.present();
  }

  private mergeAccount() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.MERGE_ACCOUNT_INITIATED,
      Environment.SETTINGS,
      PageId.SETTINGS
    );

    this.authService.getSession()
      .map((session) => session!)
      .mergeMap(async (mergeToProfileSession) => {
        const mergeFromProfileSessionProvider = new OAuthSessionProvider(this.sdkConfig.apiConfig, this.apiService, 'merge');
        const mergeFromProfileSession = await mergeFromProfileSessionProvider.provide();

        return {
          from: {
            userId: mergeFromProfileSession.userToken,
            accessToken: mergeFromProfileSession.access_token
          },
          to: {
            userId: mergeToProfileSession.userToken,
            accessToken: mergeToProfileSession.access_token
          }
        } as MergeServerProfilesRequest;
      })
      .mergeMap((mergeServerProfilesRequest) => {
        return this.profileService.mergeServerProfiles(mergeServerProfilesRequest)
      })
      .catch(async (e) => {
        console.error(e);

        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.MERGE_ACCOUNT_FAILED,
          Environment.SETTINGS,
          PageId.SETTINGS
        );

        const toast = this.toastCtrl.create({
          message: await this.translate.get('ACCOUNT_MERGE_FAILED').toPromise(),
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();

        throw e;
      })
      .do(async () => {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.MERGE_ACCOUNT_SUCCESS,
          Environment.SETTINGS,
          PageId.SETTINGS
        );
        const toast = this.toastCtrl.create({
          message: await this.translate.get('ACCOUNT_MERGE_SUCCESS').toPromise(),
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      })
      .subscribe();
  }
}
