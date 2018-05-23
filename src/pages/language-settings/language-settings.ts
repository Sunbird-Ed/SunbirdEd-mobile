import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import {
  SharedPreferences,
  Impression,
  ImpressionType,
  PageId,
  Environment,
  TelemetryService,
  Interact,
  InteractType,
  InteractSubtype
} from 'sunbird';

import { OnboardingPage } from '../onboarding/onboarding';

const KEY_SELECTED_LANGUAGE_CODE = "selected_language_code";
const KEY_SELECTED_LANGUAGE = "selected_language";
class CMap {
  [key: string]: any
}
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
  ) {}

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
    console.log('ionViewDidLoad LanguageSettingPage');
  }

  ionViewDidEnter() {
    this.generateImpressionEvent();
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
    let interact = new Interact();
    interact.type = InteractType.TOUCH;
    interact.subType = InteractSubtype.LANGUAGE_SETTINGS_SUCCESS;
    if (this.isFromSettings) {
      interact.pageId = PageId.SETTINGS_LANGUAGE;
      interact.id = PageId.SETTINGS_LANGUAGE;
      interact.env = Environment.SETTINGS;
    }
    else {
      interact.pageId = PageId.ONBOARDING;
      interact.id = PageId.ONBOARDING;
      interact.env = Environment.HOME;
    }

    let valuesMap = new CMap();
    if (previousLanguage == undefined) {
      valuesMap["PreviousLanguage"] = "";
    }
    else {
      valuesMap["PreviousLanguage"] = previousLanguage;
    }

    valuesMap["CurrentLanguage"] = currentLanguage;
    interact.valueMap = valuesMap;

    this.telemetryService.interact(interact);
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

  generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    if (this.isFromSettings) {
      impression.pageId = PageId.SETTINGS_LANGUAGE;
    }
    else {
      impression.pageId = PageId.ONBOARDING;
    }

    impression.env = Environment.SETTINGS;
    this.telemetryService.impression(impression);
  }

  ionViewWillEnter()
  {
    this.selectedLanguage = {};
    this.init();
  }

  ionViewWillLeave() {
    if(!this.selectedLanguage.code) {
      if(this.previousLanguage)
        this.translateService.use(this.previousLanguage);
      else
      this.translateService.use('en');
    }
  }
}


