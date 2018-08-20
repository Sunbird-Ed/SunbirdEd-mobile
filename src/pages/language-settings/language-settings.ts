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
import { Map } from '../../app/telemetryutil';
import { AppGlobalService } from '../../service/app-global.service';
import { UserTypeSelectionPage } from '../user-type-selection/user-type-selection';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

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
    private zone: NgZone,
    private appGlobal: AppGlobalService,
    private telemetryGeneratorService:TelemetryGeneratorService
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
     
    });
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
    this.isFromSettings = this.navParams.get('isFromSettings');
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
    );
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

  generateLanguageSuccessInteractEvent(previousLanguage: string, currentLanguage: string) {
    let valuesMap = new Map();
    valuesMap["previousLanguage"] = previousLanguage ? previousLanguage : "";
    valuesMap["currentLanguage"] = currentLanguage;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.LANGUAGE_SETTINGS_SUCCESS,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      undefined,
      valuesMap
    );
  }

  generateContinueClickedInterackEvent(selectedLanguage:string){
    let valuesMap = new Map();
    valuesMap["selectedLanguage"] = selectedLanguage;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CONTINUE_CLICKED,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
      this.isFromSettings ? PageId.SETTINGS : PageId.ONBOARDING_LANGUAGE_SETTING ,
      undefined,
      valuesMap
    );
  }
  continue() {
    // if language is not null, then select the checked language,
    // else set default language as english
    this.generateContinueClickedInterackEvent(this.language);
    this.generateLanguageSuccessInteractEvent(this.previousLanguage, this.language);
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
    } else if (this.appGlobal.DISPLAY_ONBOARDING_PAGE) {
      this.navCtrl.push(OnboardingPage);
    } else {
      this.navCtrl.push(UserTypeSelectionPage);
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
