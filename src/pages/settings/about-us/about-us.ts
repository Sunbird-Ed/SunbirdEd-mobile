import { CommonUtilService } from './../../../service/common-util.service';
import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AboutAppPage } from '../about-app/about-app';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TelemetryGeneratorService, AppGlobalService } from '@app/service';
import {
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype
} from '../../../service/telemetry-constants';
import {SharedPreferences, DeviceInfo} from 'sunbird-sdk';

const KEY_SUNBIRD_CONFIG_FILE_PATH = 'sunbird_config_file_path';

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})

export class AboutUsPage {
  deviceId: string;
  version: string;
  fileUrl: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,

    private appGlobalService: AppGlobalService
  ) { }

  ionViewDidLoad() {
    this.version = 'app version will be shown here';

    this.deviceId = this.deviceInfo.getDeviceID();

    this.appVersion.getAppName()
      .then((appName: any) => {
        return appName;
      })
      .then(val => {
        this.getVersionName(val);
      });
  }

  ionViewDidLeave() {
    (<any>window).supportfile.removeFile((result) => {
      console.log('File deleted -' + JSON.parse(result));
    }, (error) => {
      console.error('error', error);
    });
  }

  shareInformation() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SUPPORT_CLICKED);
    (<any>window).supportfile.shareSunbirdConfigurations((result) => {
      const loader = this.commonUtilService.getLoader();
      loader.present();
      this.preferences.putString(KEY_SUNBIRD_CONFIG_FILE_PATH, JSON.parse(result)).toPromise()
      .then( (res) => {
        this.preferences.getString(KEY_SUNBIRD_CONFIG_FILE_PATH).toPromise()
        .then(val => {
          loader.dismiss();

          if (Boolean(val)) {
            this.fileUrl = 'file://' + val;

            // Share via email
            this.socialSharing.share('', '', this.fileUrl).then(() => {
            }).catch(error => {
              console.error('Sharing Data is not possible', error);
            });
          }

        });
      });
    }, (error) => {
      console.error('ERROR - ' + error);
    });
  }

  aboutApp() {
    this.navCtrl.push(AboutAppPage);
  }

  termsOfService() {
    this.navCtrl.push(TermsofservicePage);
  }

  privacyPolicy() {
    this.navCtrl.push(PrivacypolicyPage);
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

  generateImpressionEvent() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.SETTINGS_ABOUT_US,
      Environment.SETTINGS, '', '', '',
      undefined,
      undefined
    );
  }

  getVersionName(appName): any {
    this.appGlobalService.getBuildConfigValue('VERSION_NAME')
      .then(response => {
        this.getVersionCode(appName, response);
        return response;
      })
      .catch(error => {
        console.log('Error--', error);
      });
  }

  getVersionCode(appName, versionName): any {
    this.appGlobalService.getBuildConfigValue('VERSION_CODE')
      .then(response => {
        this.version = appName + ' v' + versionName + '.' + response;
        return response;
      })
      .catch(error => {
        console.log('Error--', error);
      });
  }
}
