import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";
import { FilePath } from '@ionic-native/file-path';

const KEY_SELECTED_LANGUAGE = "selected_language";
const KEY_SUNBIRD_SUPPORT_FILE_PATH = "sunbird_support_file_path";

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  chosenLanguageString: String;
  selectedlanguage: String;
  fileUrl: string;

  constructor(private navCtrl: NavController, private socialSharing: SocialSharing, private storage: Storage,
    private translate: TranslateService, private filePath: FilePath) {

    translate.get('SETTINGS_SCREEN.CURRENT_LANGUAGE_CHOSEN').subscribe(
      value => {
        this.chosenLanguageString = value;
      }
    );
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
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
    this.navCtrl.push(AboutUsPage)
  }

  sendMessage() {
    this.storage.get(KEY_SUNBIRD_SUPPORT_FILE_PATH).then(val => {
      if (val === undefined || val === "" || val === null) {
        //do nothing
      } else {
        this.fileUrl = "file://" + val;
        // Share via email
        this.socialSharing.shareViaEmail('', '', ['support@diksha.gov.in'], null, null, this.fileUrl).then(() => {
          console.log("Share is possible");
        }).catch(error => {
          console.log("Share is not possible");
          console.log(error);
          // Error!
        });
      }
    })

  }

  shareApp() {
    this.socialSharing.share().then(() => {
      console.log("Shared");
    }).catch(() => {
      //Error
    });
  }
}
