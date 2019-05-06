import { appLanguages } from './../../app/app.constant';
import { AppGlobalService } from './../../service/app-global.service';
import { CommonUtilService } from './../../service/common-util.service';
import { AppHeaderService, TelemetryGeneratorService, UtilityService } from '@app/service';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageId, Environment, InteractType } from '@app/service/telemetry-constants';
import { SharedPreferences, ProfileService, ContentService, DeviceInfo, GetAllProfileRequest, ContentRequest } from 'sunbird-sdk';
import { PreferenceKey, ContentType, AudienceFilter } from '@app/app/app.constant';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';

declare const cordova;
const KEY_SUNBIRD_CONFIG_FILE_PATH = 'sunbird_config_file_path';
const SUBJECT_NAME = 'support request';
@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  trustedVideoUrl: SafeResourceUrl;

  video: any = {
    url: 'https://ankur01oct.github.io/index.html?selectedlang='
  };
  selectedLanguage: string;
  chosenLanguageString: any;
  deviceId: string;
  fileUrl: string;
  subjectDetails: string;
  appName: string;
  constructor(public navCtrl: NavController,
              private domSanitizer: DomSanitizer,
              private telemetryGeneratorService: TelemetryGeneratorService,
              @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
              @Inject('PROFILE_SERVICE') private profileService: ProfileService,
              @Inject('CONTENT_SERVICE') private contentService: ContentService,
              private appVersion: AppVersion,
              private socialSharing: SocialSharing,
              @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
              private commonUtilService: CommonUtilService,
              private appGlobalService: AppGlobalService,
              private utilityService: UtilityService,
              private headerService: AppHeaderService) {
  }

 async ionViewWillEnter() {
    this.headerService.showHeaderWithBackButton();
    this.appVersion.getAppName()
      .then((appName) => {
        this.appName = appName;
      });
     await this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE).toPromise()
      .then(value => {
        // get chosen language code from  lang mapping constant array
       this.selectedLanguage = appLanguages.filter((el) => {
          return value.trim() === el.label;
        })[0].code ;
      });
      if (this.selectedLanguage) {
        this.video.url += this.selectedLanguage;
      }
        this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.url);
        (<any>window).addEventListener('message', (event) => {
          this.receiveMessage(event);
        }, false);
  }
  receiveMessage(event) {
  const values = new Map();
  values['values'] = event.data;
  // send telemetry for all events except Initiate-Email
  if (event.data && event.data.action && event.data.action !== 'Initiate-Email-Clicked') {
  this.generateInteractTelemetry(event.data.action, values);
  } else {
    this.generateInteractTelemetry(event.data.action, values);
    // launch email sharing
    this.sendMessage(event.data.initiateEmailBody);
  }
}

generateInteractTelemetry(interactSubtype, values) {
  this.telemetryGeneratorService.generateInteractTelemetry(
    InteractType.TOUCH, interactSubtype,
    Environment.USER,
    PageId.HELP, undefined,
    values,
    undefined
  );

}
async sendMessage(message: string) {

  this.deviceId = this.deviceInfo.getDeviceID();
  const allUserProfileRequest: GetAllProfileRequest = {
    local: true,
    server: true
  };
  const contentRequest: ContentRequest = {
    contentTypes: ContentType.FOR_LIBRARY_TAB,
    audience: AudienceFilter.GUEST_TEACHER
  };
  const getUserCount = await this.profileService.getAllProfiles(allUserProfileRequest).map((profile) => profile.length).toPromise();
  const getLocalContentCount = await this.contentService.getContents(contentRequest).map((contentCount) => contentCount.length).toPromise();
  (<any>window).supportfile.shareSunbirdConfigurations(getUserCount, getLocalContentCount, (result) => {
    console.log('in setting - ', result);
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.preferences.putString(KEY_SUNBIRD_CONFIG_FILE_PATH, result).toPromise()
      .then((resp) => {
        this.preferences.getString(KEY_SUNBIRD_CONFIG_FILE_PATH).toPromise()
          .then(val => {
            loader.dismiss();
            if (Boolean(val)) {
              this.fileUrl = 'file://' + val;
              this.subjectDetails = this.appName + ' ' + SUBJECT_NAME + '-' + this.deviceId;
              this.socialSharing.shareViaEmail(message,
                                               this.subjectDetails,
                                               [this.appGlobalService.SUPPORT_EMAIL],
                                               null,
                                               null,
                                               this.fileUrl)
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
}
