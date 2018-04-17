import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AboutAppPage } from '../about-app/about-app';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AppVersion } from '@ionic-native/app-version';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private uniqueDeviceID: UniqueDeviceID, private appVersion: AppVersion) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
    this.version = "app version will be shown here"

    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log(uuid);
        this.deviceId = uuid
      })
      .catch((error: any) => console.log(error));


    this.appVersion.getAppName()
      .then((appName: any) => {
        return appName;
      })
      .then(val => {
        this.appVersion.getVersionNumber()
          .then((version: any) => {
            this.version = val + " " + version;
          })
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

}
