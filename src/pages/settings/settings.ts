import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutusPage } from './aboutus/aboutus';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  text: string;

  constructor(private navCtrl: NavController, private socialSharing: SocialSharing) {
    console.log('Hello SettingsComponent Component');
    this.text = 'Hey Fantastic World';
  }

  goBack() {
    this.navCtrl.pop();
  }

  languageSetting() {
    this.navCtrl.push(LanguageSettingsPage);
  }

  dataSync() {
    this.navCtrl.push(DatasyncPage)
  }

  aboutUs() {
    this.navCtrl.push(AboutusPage)
  }

  sendMessage() {
    // Share via email
    this.socialSharing.shareViaEmail('', '', ['support@diksha.gov.in']).then(() => {
      console.log("Share is possible");
    }).catch(() => {
      // Error!
    });
  }

  shareApp() {
    this.socialSharing.share().then(() => {
      console.log("Shared");
    }).catch(() => {
      //Error
    });
  }
}
