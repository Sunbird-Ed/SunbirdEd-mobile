import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AboutAppPage } from '../about-app/about-app';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { AppVersion } from '@ionic-native/app-version';
import { DeviceInfoService} from 'sunbird';
import { Impression, ImpressionType, PageId, Environment, TelemetryService } from 'sunbird';

/**
 * Generated class for the AboutUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  deviceId: String;
  version: String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private deviceInfoService: DeviceInfoService,
    private appVersion: AppVersion,
    private telemetryService: TelemetryService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
    this.version = "app version will be shown here"

    this.deviceInfoService.getDeviceID(
      (res: any) => {
        console.log("Device Id: ", res);
        this.deviceId = res;
      },
      (err: any) => {
        console.log("Device Id: ", JSON.parse(err));
      });

    

    
    this.appVersion.getAppName()
      .then((appName: any) => {
        return appName;
      })
      .then(val => {
          this.getVersionName(val);
      });
  }


  aboutApp() {
    this.navCtrl.push(AboutAppPage)
  }

  termsOfService() {
    this.navCtrl.push(TermsofservicePage)
  }

  privacyPolicy() {
    this.navCtrl.push(PrivacypolicyPage)
  }

  generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS_ABOUT_US;
    impression.env = Environment.SETTINGS;
    this.telemetryService.impression(impression);
  }

  getVersionName(appName) : any {
    this.deviceInfoService.getBuildConfigParam("VERSION_NAME", (response: any) => {
      this.getVersionCode(appName,response);
      return response;
    }, (error) => {
      return "";
    });
  }

  getVersionCode(appName,versionName) : any {
    this.deviceInfoService.getBuildConfigParam("VERSION_CODE", (response: any) => {
      this.version = appName + " v" + versionName+"."+response;
      return response;
    }, (error) => {
      return "";
    });
  }

}
