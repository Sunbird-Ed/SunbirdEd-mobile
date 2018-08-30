import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';
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
import { PreferenceKey } from '../../app/app.constant';

@Component({
  selector: 'page-language-settings',
  templateUrl: 'language-settings.html',
})
export class LanguageSettingsPage {

  languages: any = [];
  language: any;
  isLanguageSelected: boolean = false;
  isFromSettings: boolean = false;
  defaultDeviceLang: string = '';
  previousLanguage: any;
  selectedLanguage: any = {};
  btnColor: string = '#55acee';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private preferences: SharedPreferences,
    private events: Events,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) { }

  init(): void {
    this.languages = [
      {
        'code': 'en',
        'label': 'English',
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
      this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
        .then(val => {
          if (val === undefined || val === "" || val === null) {
            console.error("Language not set");
            //this.getDeviceLanguage();
            this.previousLanguage = undefined;
          } else {
            this.previousLanguage = val;
            this.language = val;
          }
        });
    });

  }

  // getDeviceLanguage() {
  //   //Get device set language
  //   this.globalization.getPreferredLanguage()
  //     .then(res => {
  //       this.defaultDeviceLang = res.value.split("-")[0];
  //       let lang = this.languages.find(i => i.code === this.defaultDeviceLang);
  //       if (lang != undefined && lang != null) {
  //         console.log("Language chosen - " + lang.code)
  //         lang.isApplied = true;
  //         this.language = lang.code;
  //       } else {
  //         this.makeDefaultLanguage();
  //       }
  //     })
  //     .catch(e => {
  //       this.makeDefaultLanguage();
  //     });
  // }
  // makeDefaultLanguage() {
  //   this.language = this.languages[0].code;
  //   this.languages[0].isApplied = true;
  // }

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
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE_CODE, selectedLanguage.code);
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE, selectedLanguage.label); */
      this.btnColor = '#006DE5';
      this.isLanguageSelected = true;
      this.translateService.use(this.language);
    }
    else {
      this.btnColor = '#8FC4FF';
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

  generateContinueClickedInteractEvent(selectedLanguage: string) {
    let valuesMap = new Map();
    valuesMap["selectedLanguage"] = selectedLanguage;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CONTINUE_CLICKED,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
      this.isFromSettings ? PageId.SETTINGS : PageId.ONBOARDING_LANGUAGE_SETTING,
      undefined,
      valuesMap
    );
  }
  continue() {
    // if language is not null, then select the checked language,
    // else set default language as english
    if (this.isLanguageSelected) {
      this.generateContinueClickedInteractEvent(this.language);
      this.generateLanguageSuccessInteractEvent(this.previousLanguage, this.language);
      if (this.language) {
        this.selectedLanguage = this.languages.find(i => i.code === this.language);
        this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE_CODE, this.selectedLanguage.code);
        this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE, this.selectedLanguage.label);
        this.translateService.use(this.language);
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
    else {
      this.generateContinueClickedInteractEvent("n/a");
      this.btnColor = '#8FC4FF';
      let toast = this.toastCtrl.create({
        message: this.translateMessage('PLEASE_SELECT_A_LANGUAGE'),
        duration: 2000,
        cssClass: 'languageSelectBtn',
        position: 'Bottom'
      });
      toast.dismissAll();
      toast.present();
    }
  }

  /**
 * Change language / direction
 */
  // changeLanguage(event) {
  //   if (currentStyle === "ltr") {
  //     currentStyle = "rtl";
  //   } else {
  //     currentStyle = "ltr";id
  //   }
  //   this.platform.setDir(this.currentStyle as DocumentDirection, true);
  // }
  // generateImpressionEvent() {

  // }

  ionViewWillEnter() {
    this.selectedLanguage = {};
    this.init();
  }

  ionViewWillLeave() {
    if (this.isLanguageSelected) {
      if (!this.selectedLanguage.code) {
        if (this.previousLanguage)
          this.translateService.use(this.previousLanguage);
        else
          this.translateService.use('en');
      }
    }
  }

  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translateService.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}