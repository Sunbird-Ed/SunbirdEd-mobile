import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OnboardingPage } from '../onboarding/onboarding';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the LanguageSettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-language-settings',
  templateUrl: 'language-settings.html',
})
export class LanguageSettingsPage {

  languages: any[];
  language: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, public translateService: TranslateService) {
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguageSettingPage');
  }

  /**
   * on language selected
   * @param language
   */
  onLanguageSelected(language: any) {
    console.log('language : ' + language);
    this.language = language;
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
