import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AboutappPage } from '../aboutapp/aboutapp';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';

/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {
  deviceId: String;
  appVersion: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusPage');
    this.deviceId = "device id will be shown here";
    this.appVersion = "app version will be shown here"
  }


  aboutApp() {
    this.navCtrl.push(AboutappPage)
  }

  termsOfService() {
    this.navCtrl.push(TermsofservicePage)
  }

  privacyPolicy() {
    this.navCtrl.push(PrivacypolicyPage)
  }

}
