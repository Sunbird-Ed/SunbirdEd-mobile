import { Component } from '@angular/core';
import { NavController, LoadingController} from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from "@ionic-native/app-version";
import { SharedPreferences, Interact, InteractType, InteractSubtype, ShareUtil } from "sunbird";
import { Impression, ImpressionType, Environment, PageId, TelemetryService } from 'sunbird';

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

  constructor(private navCtrl: NavController, private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private translate: TranslateService,
    private preference: SharedPreferences,
    private telemetryService : TelemetryService,
    private shareUtil: ShareUtil,
    private loadingCtrl: LoadingController) {
    
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

  generateImpressionEvent(){
    let impression = new Impression();
    impression.type =ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS;
    impression.env=Environment.SETTINGS;
    this.telemetryService.impression(impression);
  }

  goBack() {
    this.navCtrl.pop();
  }

  languageSetting() {
    this.generateInteractEvent(InteractSubtype.LANGUAGE_CLICKED);
    this.navCtrl.push(LanguageSettingsPage, {
      isFromSettings: true
    });
  }

  dataSync() {
    this.generateInteractEvent(InteractSubtype.DATA_SYNC_CLICKED);
    this.navCtrl.push(DatasyncPage)
  }

  aboutUs() {
    this.generateInteractEvent(InteractSubtype.ABOUT_APP_CLICKED);
    this.navCtrl.push(AboutUsPage)
  }

  generateInteractEvent(subType : string) {
    let interact = new Interact();
    interact.type = InteractType.TOUCH;
    interact.subType = subType;
    interact.pageId = PageId.SETTINGS;
    interact.id = PageId.SETTINGS;
    interact.env = Environment.SETTINGS;
    this.telemetryService.interact(interact);
  }

  sendMessage() {
    let loader = this.getLoader();
    loader.present();
    this.preference.getString(KEY_SUNBIRD_SUPPORT_FILE_PATH, val => {
      loader.dismiss();
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
    let loader = this.getLoader();
    loader.present();
    this.shareUtil.exportApk(filePath => {
      loader.dismiss();
      this.socialSharing.share("", "", "file://" + filePath, "");
    }, error => {
      loader.dismiss();
    });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}
