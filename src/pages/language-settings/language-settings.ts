import { CommonUtilService } from './../../service/common-util.service';
import { Platform } from 'ionic-angular/platform/platform';
import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {
  SharedPreferences,
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype
} from 'sunbird';
import { OnboardingPage } from '../onboarding/onboarding';
import { Map } from '../../app/telemetryutil';
import { AppGlobalService } from '../../service/app-global.service';
import { UserTypeSelectionPage } from '../user-type-selection/user-type-selection';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { PreferenceKey } from '../../app/app.constant';

@IonicPage()
@Component({
  selector: 'page-language-settings',
  templateUrl: 'language-settings.html',
})
export class LanguageSettingsPage {

  languages: any = [];
  language: any;
  isLanguageSelected = false;
  isFromSettings = false;
  defaultDeviceLang = '';
  previousLanguage: any;
  selectedLanguage: any = {};
  btnColor = '#55acee';
  unregisterBackButton = undefined;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private preferences: SharedPreferences,
    private events: Events,
    private zone: NgZone,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService
  ) { }

  ionViewDidLoad() {
    this.isFromSettings = this.navParams.get('isFromSettings');
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
    );

    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH, InteractSubtype.DEVICE_BACK_CLICKED,
        this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
        this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      );
      if (this.isFromSettings) {
        this.navCtrl.pop();
      } else {
        this.platform.exitApp();
        this.telemetryGeneratorService.generateEndTelemetry('app', '', '', Environment.ONBOARDING);
      }
      this.unregisterBackButton();
    }, 10);

  }

  ionViewWillEnter() {
    this.selectedLanguage = {};
    this.init();
  }

  ionViewWillLeave() {
    if (this.isLanguageSelected) {
      if (!this.selectedLanguage.code) {
        if (this.previousLanguage) {
          this.translateService.use(this.previousLanguage);
        } else {
          this.translateService.use('en');
        }
      }
    }

    if (this.unregisterBackButton) {
      this.unregisterBackButton();
    }
  }

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
          if (Boolean(val)) {
            this.previousLanguage = val;
            this.language = val;
          } else {
            console.error('Language not set');
            // this.getDeviceLanguage();
            this.previousLanguage = undefined;

          }
        });
    });

  }

  /*   getDeviceLanguage() {
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
    } */



  /**
   * It will set app language
   */
  onLanguageSelected() {
    if (this.language) {
      /*       let selectedLanguage = this.languages.find(i => i.code === this.language);
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE_CODE, selectedLanguage.code);
            this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE, selectedLanguage.label); */
      this.btnColor = '#006DE5';
      this.isLanguageSelected = true;
      this.translateService.use(this.language);
      this.generateClickInteractEvent(this.language, InteractSubtype.LANGUAGE_SELECTED);
    } else {
      this.btnColor = '#8FC4FF';
    }
  }

  generateLanguageSuccessInteractEvent(previousLanguage: string, currentLanguage: string) {
    const valuesMap = new Map();
    valuesMap['previousLanguage'] = previousLanguage ? previousLanguage : '';
    valuesMap['currentLanguage'] = currentLanguage;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.LANGUAGE_SETTINGS_SUCCESS,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      undefined,
      valuesMap
    );
  }

  generateClickInteractEvent(selectedLanguage: string, interactSubType) {
    const valuesMap = new Map();
    valuesMap['selectedLanguage'] = selectedLanguage;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      interactSubType,
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
      this.generateClickInteractEvent(this.language, InteractSubtype.CONTINUE_CLICKED);
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
      } else if (this.appGlobalService.DISPLAY_ONBOARDING_PAGE) {
        this.navCtrl.push(OnboardingPage);
      } else {
        this.navCtrl.push(UserTypeSelectionPage);
      }
    } else {
      this.generateClickInteractEvent('n/a', InteractSubtype.CONTINUE_CLICKED);
      this.btnColor = '#8FC4FF';
      this.commonUtilService.showToast('PLEASE_SELECT_A_LANGUAGE', false, 'redErrorToast');
    }
  }
}
