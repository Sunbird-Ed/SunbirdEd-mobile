import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OnboardingPage } from '../onboarding/onboarding';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import { Storage } from "@ionic/storage";

/**
 * Generated class for the LanguageSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const KEY_SELECTED_LANGUAGE = "selected_language";

@Component({
  selector: 'page-language-settings',
  templateUrl: 'language-settings.html',
})
export class LanguageSettingsPage {

  languages: any[];
  language: any;

  constructor(public zone: NgZone, public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, public translateService: TranslateService, private globalization: Globalization,
    private storage: Storage) {

    this.init()
  }

  private init() {
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

    this.storage.get(KEY_SELECTED_LANGUAGE)
      .then(val => {
        if (val === undefined || val === "" || val === null) {
          console.error("Language not set");
          let defaultLanguage = this.getDeviceLanguage();
          console.error("default value - " + defaultLanguage);
          return defaultLanguage
        } else {
          return val
        }
      })
      .then(val => {
        this.language = val;
        console.error("default value - " + this.language);
      })

  }

  private getDeviceLanguage() {
    let someLanguage;

    //Get device set language
    this.globalization.getPreferredLanguage()
      .then(res => {
        console.log(res.value);
        //split the result on "-"
        var splitLang = res.value.split("-")

        console.log("Split lang 1 - " + splitLang[0])
        console.log("Split lang 2 - " + splitLang[1])

        //find the language based on the code
        let lang = this.languages.find(i => i.code === splitLang[0])

        if (lang != undefined && lang != null) {
          console.log("Language chosen - " + lang.code)
          lang.isApplied = true;
          this.language = lang.code;
          someLanguage = this.language;
        } else {
          this.languages[0].isApplied = true;
          this.language = this.languages[0].code
          someLanguage = this.language;
        }
      })
      .catch(e => {
        console.log(e)
        this.language = this.languages[0].code
        someLanguage = this.language;
      });

    return someLanguage;
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
    this.storage.set(KEY_SELECTED_LANGUAGE, this.language)
  }

  continue() {
    // if language is not null, then select the checked language,
    // else set default language as english
    if (this.language) {
      this.translateService.use(this.language.code);
    } else {
      this.translateService.use('en');
    }

    this.navCtrl.push(OnboardingPage).then(() => {
      // first we find the index of the current view controller:
      const index = this.viewCtrl.index;
      // then we remove it from the navigation stack
      this.navCtrl.remove(index);
    });;
  }

}
