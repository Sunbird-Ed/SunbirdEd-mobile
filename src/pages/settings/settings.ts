import { Component } from '@angular/core';
import { NavController, LoadingController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from "@ionic-native/app-version";
import { SharedPreferences, InteractType, InteractSubtype, ShareUtil } from "sunbird";
import { Impression, ImpressionType, Environment, PageId, TelemetryService } from 'sunbird';
import { generateInteractTelemetry, generateImpressionTelemetry } from '../../app/telemetryutil';

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

  constructor(
    private navCtrl: NavController,
    private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private translate: TranslateService,
    private preference: SharedPreferences,
    private telemetryService: TelemetryService,
    private shareUtil: ShareUtil,
    private loadingCtrl: LoadingController) {

  }

  ionViewWillEnter() {
    this.translate.get('SHARE_APP').subscribe(
      value => {
        this.appVersion.getAppName()
          .then((appName: any) => {
            //TODO: Need to add dynamic string substitution
            this.shareAppLabel = value.replace("{{%s}}", appName);
          });
      }
    );
  }
  ionViewDidLoad() {
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.SETTINGS;
    impression.env = Environment.SETTINGS;
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.SETTINGS,
      Environment.SETTINGS, "", "", "",
      undefined,
      undefined
    ));
  }

  ionViewDidEnter() {

    this.translate.get('CURRENT_LANGUAGE').subscribe(
      value => {
        this.chosenLanguageString = value;
        this.preference.getString(KEY_SELECTED_LANGUAGE, value => {
          this.selectedlanguage = this.chosenLanguageString + ': ' + value;
        });
      }
    );
  }



  goBack() {
    this.navCtrl.pop();
  }

  languageSetting() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.LANGUAGE_CLICKED);
    this.navCtrl.push(LanguageSettingsPage, {
      isFromSettings: true
    });
  }

  dataSync() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.DATA_SYNC_CLICKED);
    this.navCtrl.push(DatasyncPage)
  }

  aboutUs() {
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.ABOUT_APP_CLICKED);
    this.navCtrl.push(AboutUsPage)
  }

  sendMessage() {
    let loader = this.getLoader();
    loader.present();
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SUPPORT_CLICKED);
    this.preference.getString(KEY_SUNBIRD_SUPPORT_FILE_PATH, val => {
      loader.dismiss();
      if (val === undefined || val === "" || val === null) {
        //do nothing
      } else {
        this.fileUrl = "file://" + val;
        // Share via email
        this.socialSharing.shareViaEmail('', '', ['dummy@example.com'], null, null, this.fileUrl).then(() => {
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

    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SHARE_APP_CLICKED);
    this.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.SHARE_APP_INITIATED);

    this.shareUtil.exportApk(filePath => {
      this.generateInteractTelemetry(InteractType.OTHER, InteractSubtype.SHARE_APP_SUCCESS);
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

  generateInteractTelemetry(interactionType, interactSubtype) {
    this.telemetryService.interact(generateInteractTelemetry(
      interactionType, interactSubtype,
      PageId.SETTINGS,
      Environment.SETTINGS, null,
      undefined,
      undefined
    ));
  }
}
