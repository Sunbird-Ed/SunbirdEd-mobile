import { CommonUtilService } from './../../../service/common-util.service';
import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AboutAppPage } from '../about-app/about-app';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppGlobalService, TelemetryGeneratorService, UtilityService, AppHeaderService } from '@app/service';
import { Environment, ImpressionType, InteractSubtype, InteractType, PageId } from '../../../service/telemetry-constants';
import {
  ContentRequest, ContentService, DeviceInfo, GetAllProfileRequest, ProfileService, SharedPreferences
} from 'sunbird-sdk';
import { AudienceFilter, ContentFilterConfig } from '@app/app';
import { FormAndFrameworkUtilService } from '@app/pages/profile/formandframeworkutil.service';

const KEY_SUNBIRD_CONFIG_FILE_PATH = 'sunbird_config_file_path';

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})

export class AboutUsPage {
  deviceId: string;
  version: string;
  fileUrl: string;
  headerConfig = {
    showHeader: false,
    showBurgerMenu: false,
    actionButtons: []
  };

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    public navCtrl: NavController,
    public navParams: NavParams,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private utilityService: UtilityService,
    private appGlobalService: AppGlobalService,
    private headerService: AppHeaderService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
  ) {
  }

  ionViewWillEnter() {
    this.headerConfig = this.headerService.getDefaultPageConfig();
    this.headerConfig.actionButtons = [];
    this.headerConfig.showHeader = false;
    this.headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this.headerConfig);
  }

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
    (<any>window).supportfile.removeFile(() => {
    }, (error) => {
      console.error('error', error);
    });
  }

  async shareInformation() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SUPPORT_CLICKED);
    const allUserProfileRequest: GetAllProfileRequest = {
      local: true,
      server: true
    };
    const contentTypes = await this.formAndFrameworkUtilService.getSupportedContentFilterConfig(
      ContentFilterConfig.NAME_DOWNLOADS);
    const contentRequest: ContentRequest = {
      contentTypes: contentTypes,
      audience: AudienceFilter.GUEST_TEACHER
    };
    const getUserCount = await this.profileService.getAllProfiles(allUserProfileRequest).map((profile) => profile.length).toPromise();
    const getLocalContentCount = await this.contentService.getContents(contentRequest)
      .map((contentCount) => contentCount.length).toPromise();

    (<any>window).supportfile.shareSunbirdConfigurations(getUserCount, getLocalContentCount, (result) => {
      const loader = this.commonUtilService.getLoader();
      loader.present();
      this.preferences.putString(KEY_SUNBIRD_CONFIG_FILE_PATH, result).toPromise()
        .then((res) => {
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
    this.utilityService.getBuildConfigValue('VERSION_NAME')
      .then(response => {
        this.getVersionCode(appName, response);
        return response;
      })
      .catch(error => {
        console.log('Error--', error);
      });
  }

  getVersionCode(appName, versionName): any {
    this.utilityService.getBuildConfigValue('VERSION_CODE')
      .then(response => {
        this.version = appName + ' v' + versionName + '.' + response;
        return response;
      })
      .catch(error => {
        console.log('Error--', error);
      });
  }
}
