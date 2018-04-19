import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { FilePath } from '@ionic-native/file-path';
import { AppVersion } from "@ionic-native/app-version";
import { SharedPreferences } from "sunbird";

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
  shareAppLabel: string;

  constructor(private navCtrl: NavController, 
    private appVersion: AppVersion,
    private socialSharing: SocialSharing, 
    private translate: TranslateService, 
    private filePath: FilePath,
    private preference: SharedPreferences) {
    
  }

  ionViewDidLoad() {
    this.translate.get('SHARE_APP').subscribe(
      value => {
        this.appVersion.getAppName()
        .then((appName: any) => {
          this.shareAppLabel = value.replace("%s", appName);
        });
      }
    );
  }

  ionViewDidEnter() {
    this.preference.getString(KEY_SELECTED_LANGUAGE, value => {
      this.selectedlanguage = this.chosenLanguageString + value;
    });
    this.translate.get('CURRENT_LANGUAGE').subscribe(
      value => {
        this.chosenLanguageString = value;
      }
    );
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
    this.preference.getString(KEY_SUNBIRD_SUPPORT_FILE_PATH, val => {
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
