import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { TabsPage, SharedPreferences } from 'sunbird';

import { OnboardingPage } from '../onboarding/onboarding';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private globalization: Globalization,
    private preferences: SharedPreferences
  ) {
    this.init()
  }

  init(): void {
    this.languages = [
      {
        'label': 'English',
        'code': 'en',
        'isApplied': false
      },
      {
        'label': 'ಕನ್ನಡ',
        'code': 'kn',
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

    this.preferences.getString(KEY_SELECTED_LANGUAGE_CODE, val => {
      if (val === undefined || val === "" || val === null) {
        console.error("Language not set");
        this.getDeviceLanguage();
      } else {
        this.language = val;
      }
    });

    this.isFromSettings = this.navParams.get('isFromSettings');
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

  /**
   * on language selected
   * @param language
   */
  onLanguageSelected() {
    console.log("language selected : " + this.language);
    if(this.language) {
      let selectedLanguage = this.languages.find(i => i.code === this.language);
      this.preferences.putString(KEY_SELECTED_LANGUAGE_CODE, selectedLanguage.code);
      this.preferences.putString(KEY_SELECTED_LANGUAGE, selectedLanguage.label);
    }
  }

  continue() {
    // if language is not null, then select the checked language,
    // else set default language as english
    if (this.language) {
      this.translateService.use(this.language);
    } else {
      this.translateService.use('en');
    }

    if (this.isFromSettings) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.push(OnboardingPage);
    }
  }
}
