import { AppGlobalService } from '@app/service';
import { CommonUtilService } from './../../service/common-util.service';
import { Component, Inject } from '@angular/core';
import { NavController, DateTime } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import {
  ShareUtil,
  Impression,
} from 'sunbird';
import { PreferenceKey } from '../../app/app.constant';
import {
  ImpressionType,
  Environment,
  PageId,
  InteractType,
  InteractSubtype
} from '../../service/telemetry-constants';
import { TelemetryGeneratorService } from '@app/service';
import { SharedPreferences, DeviceInfo } from 'sunbird-sdk';

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
  constructor(
    private navCtrl: NavController,
    private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private translate: TranslateService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    private preference: SharedPreferences,
    private shareUtil: ShareUtil,
    private commonUtilService: CommonUtilService,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
  ) { }

  ionViewWillEnter() {
    this.appVersion.getAppName()
      .then((appName) => {
        this.appName = appName;
        this.shareAppLabel = this.commonUtilService.translateMessage('SHARE_APP', appName);
      });
  }


  ionViewDidLoad() {
    const impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS;
    impression.env = Environment.SETTINGS;
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

  ionViewDidLeave() {
    (<any>window).supportfile.removeFile(
      result => ({}),
      error => {
        console.error('error' + error);
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
  sendMessage() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SUPPORT_CLICKED);

      this.deviceId =  this.deviceInfo.getDeviceID();

    (<any>window).supportfile.shareSunbirdConfigurations((result) => {
      const loader = this.commonUtilService.getLoader();
      loader.present();
      this.preferences.putString(KEY_SUNBIRD_CONFIG_FILE_PATH, JSON.parse(result)).toPromise()
      .then( (resp) => {
        this.preferences.getString(KEY_SUNBIRD_CONFIG_FILE_PATH).toPromise()
          .then(val => {
            loader.dismiss();
            if (Boolean(val)) {
              this.fileUrl = 'file://' + val;
              this.subjectDetails = this.appName + ' ' + SUBJECT_NAME + '-' + this.deviceId;
              this.socialSharing.shareViaEmail('', this.subjectDetails, [this.appGlobalService.SUPPORT_EMAIL], null, null, this.fileUrl)
                .catch(error => {
                  console.error(error);
                });
            }
          });
      });
    }, (error) => {
      console.error('ERROR - ' + error);
    });
  }
  // this.appGlobalService.APP_NAME
  shareApp() {
    const loader = this.commonUtilService.getLoader();
    loader.present();

    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SHARE_APP_CLICKED);
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SHARE_APP_INITIATED);

    this.shareUtil.exportApk(filePath => {
      this.generateInteractTelemetry(InteractType.OTHER, InteractSubtype.SHARE_APP_SUCCESS);
      loader.dismiss();
      this.socialSharing.share('', '', 'file://' + filePath, '');
    }, error => {
      loader.dismiss();
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
}
