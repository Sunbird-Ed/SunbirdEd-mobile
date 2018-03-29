import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutusPage } from './aboutus/aboutus';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";

const KEY_SELECTED_LANGUAGE = "selected_language";

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  chosenLanguageString: String;
  selectedlanguage: String;

  constructor(private navCtrl: NavController, private socialSharing: SocialSharing, private storage: Storage, private translate: TranslateService) {

    translate.get('SETTINGS_SCREEN.CURRENT_LANGUAGE_CHOSEN').subscribe(
      value => {
        this.chosenLanguageString = value;
      }
    );
  }

  ionViewDidLoad() {
   
  }

  ionViewDidEnter(){
    this.storage.get(KEY_SELECTED_LANGUAGE).then(value => {
      this.selectedlanguage = this.chosenLanguageString + value;
    })
  }

  goBack() {
    this.navCtrl.pop();
  }

  languageSetting() {
    this.navCtrl.push(LanguageSettingsPage, {
      isFromSettings: true
    });
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
