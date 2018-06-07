import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import {
  SharedPreferences,
  ImpressionType,
  PageId,
  Environment,
  TelemetryService,
  InteractType,
  InteractSubtype
} from 'sunbird';
import { OnboardingPage } from '../onboarding/onboarding';
import { generateImpressionTelemetry, generateInteractTelemetry, Map } from '../../app/telemetryutil';

const KEY_SELECTED_LANGUAGE_CODE = "selected_language_code";
const KEY_SELECTED_LANGUAGE = "selected_language";

@Component({
  selector: 'page-language-settings',
  templateUrl: 'language-settings.html',
})
export class LanguageSettingsPage {

  languages: any = [];
  language: any;
  isFromSettings: boolean = false;
  defaultDeviceLang: string = '';
  previousLanguage: any;
  selectedLanguage: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private globalization: Globalization,
    private preferences: SharedPreferences,
    private telemetryService: TelemetryService,
    private events: Events,
    private zone: NgZone
  ) { }

  init(): void {
    this.languages = [
      {
        'label': 'English',
        'code': 'en',
        'isApplied': false
      },
      {
        'label': 'हिंदी',
        'code': 'hi',
        'isApplied': false
      },
      {
        'label': 'తెలుగు',
        'code': 'te',
        'isApplied': false
      },
      {
        'label': 'தமிழ்',
        'code': 'ta',
        'isApplied': false
      },
      {
        'label': 'मराठी',
        'code': 'mr',
        'isApplied': false
      }
    ];

    this.zone.run(() => {
      this.preferences.getString(KEY_SELECTED_LANGUAGE_CODE, val => {
        if (val === undefined || val === "" || val === null) {
          console.error("Language not set");
          this.getDeviceLanguage();
          this.previousLanguage = undefined;
        } else {
          this.previousLanguage = val;
          this.language = val;
        }
      });
      this.isFromSettings = this.navParams.get('isFromSettings');
    });

    this.generateImpressionEvent();
  }

  getDeviceLanguage() {
    //Get device set language
    this.globalization.getPreferredLanguage()
      .then(res => {
        this.defaultDeviceLang = res.value.split("-")[0];

        let lang = this.languages.find(i => i.code === this.defaultDeviceLang);

        if (lang != undefined && lang != null) {
          console.log("Language chosen - " + lang.code)
          lang.isApplied = true;
          this.language = lang.code;
        } else {
          this.makeDefaultLanguage();
        }
      })
      .catch(e => {
        this.makeDefaultLanguage();
      });
  }

  makeDefaultLanguage() {
    this.language = this.languages[0].code;
    this.languages[0].isApplied = true;
  }

  ionViewDidLoad() {
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING,
      Environment.SETTINGS, "", "", "",
      undefined, undefined
    ));
  }

  /**
   * on language selected
   * @param language
   */
  onLanguageSelected() {
    console.log("language selected : " + this.language);
    if (this.language) {
      /*       let selectedLanguage = this.languages.find(i => i.code === this.language);
            this.preferences.putString(KEY_SELECTED_LANGUAGE_CODE, selectedLanguage.code);
            this.preferences.putString(KEY_SELECTED_LANGUAGE, selectedLanguage.label); */
      this.translateService.use(this.language);
    }
  }

  generateInteractEvent(previousLanguage: string, currentLanguage: string) {
    let valuesMap = new Map();
    if (previousLanguage == undefined) {
      valuesMap["PreviousLanguage"] = "";
    }
    else {
      valuesMap["PreviousLanguage"] = previousLanguage;
    }
    valuesMap["CurrentLanguage"] = currentLanguage;
    this.telemetryService.interact(generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.LANGUAGE_SETTINGS_SUCCESS,
      this.isFromSettings ? Environment.SETTINGS : Environment.HOME,
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING,
      valuesMap,
      undefined,
      undefined
    ));
  }

  continue() {
    // if language is not null, then select the checked language,
    // else set default language as english
    this.generateInteractEvent(this.previousLanguage, this.language);
    if (this.language) {
      this.selectedLanguage = this.languages.find(i => i.code === this.language);
      this.preferences.putString(KEY_SELECTED_LANGUAGE_CODE, this.selectedLanguage.code);
      this.preferences.putString(KEY_SELECTED_LANGUAGE, this.selectedLanguage.label);
      this.translateService.use(this.language);
    } else {
      this.preferences.putString(KEY_SELECTED_LANGUAGE_CODE, 'en');
      this.preferences.putString(KEY_SELECTED_LANGUAGE, 'English');
      this.translateService.use('en');
    }
    this.events.publish('onAfterLanguageChange:update', {
      selectedLanguage: this.language
    });
    if (this.isFromSettings) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.push(OnboardingPage);
    }
  }

  /**
 * Change language / direction
 */
  // changeLanguage(event) {
  //   if (currentStyle === "ltr") {
  //     currentStyle = "rtl";
  //   } else {
  //     currentStyle = "ltr";
  //   }

  //   this.platform.setDir(this.currentStyle as DocumentDirection, true);
  // }

  generateImpressionEvent() {
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING,
      Environment.SETTINGS, "", "", "",
      undefined, undefined
    ));
  }

  ionViewWillEnter() {
    this.selectedLanguage = {};
    this.init();
  }

  ionViewWillLeave() {
    if (!this.selectedLanguage.code) {
      if (this.previousLanguage)
        this.translateService.use(this.previousLanguage);
      else
        this.translateService.use('en');
    }
  }
}
