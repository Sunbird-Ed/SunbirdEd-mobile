import { CommonUtilService } from './../../../service/common-util.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AboutAppPage } from '../about-app/about-app';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
import {
  DeviceInfoService,
  BuildParamService,
  ImpressionType,
  PageId,
  Environment,
  TelemetryService,
  SharedPreferences,
  InteractType,
  InteractSubtype
} from 'sunbird';
import { generateImpressionTelemetry, generateInteractTelemetry } from '../../../app/telemetryutil';

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
    private deviceInfoService: DeviceInfoService,
    private buildParamService: BuildParamService,
    private appVersion: AppVersion,
    private preference: SharedPreferences,
    private socialSharing: SocialSharing,
    private telemetryService: TelemetryService,
    private commonUtilService: CommonUtilService
  ) { }

  ionViewDidLoad() {
    this.version = 'app version will be shown here';

    this.deviceInfoService.getDeviceID()
      .then((res: any) => {
        this.deviceId = res;
      })
      .catch((err: any) => {
      });
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
      this.preference.putString(KEY_SUNBIRD_CONFIG_FILE_PATH, JSON.parse(result));
      this.preference.getString(KEY_SUNBIRD_CONFIG_FILE_PATH)
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
    this.telemetryService.interact(generateInteractTelemetry(
      interactionType, interactSubtype,
      PageId.SETTINGS,
      Environment.SETTINGS, null,
      undefined,
      undefined
    ));
  }

  generateImpressionEvent() {
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.SETTINGS_ABOUT_US,
      Environment.SETTINGS, '', '', '',
      undefined,
      undefined
    ));
  }

  getVersionName(appName): any {
    this.buildParamService.getBuildConfigParam('VERSION_NAME')
      .then(response => {
        this.getVersionCode(appName, response);
        return response;
      })
      .catch(error => {
        console.log('Error--', error);
      });
  }

  getVersionCode(appName, versionName): any {
    this.buildParamService.getBuildConfigParam('VERSION_CODE')
      .then(response => {
        this.version = appName + ' v' + versionName + '.' + response;
        return response;
      })
      .catch(error => {
        console.log('Error--', error);
      });
  }
}
