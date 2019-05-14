import {Component, Inject, NgZone} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {SharedPreferences} from 'sunbird-sdk';
import {appLanguages, Map, PreferenceKey} from '@app/app';
import {AppGlobalService, CommonUtilService, TelemetryGeneratorService, AppHeaderService} from '@app/service';
import {OnboardingPage} from '@app/pages/onboarding/onboarding';
import {UserTypeSelectionPage} from '@app/pages/user-type-selection';
import {Environment, ImpressionType, InteractSubtype, InteractType, PageId} from '../../service/telemetry-constants';
import { ResourcesPage } from '../resources/resources';
import { File } from '@ionic-native/file';

declare const cordova;


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
  mainPage: Boolean = false;
  headerConfig: any;
  configData: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private events: Events,
    private zone: NgZone,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private headerServie: AppHeaderService,
    private file: File
  ) {
    this.mainPage = this.navParams.get('mainPage');
   }

  ionViewDidLoad() {
    this.isFromSettings = this.navParams.get('isFromSettings');
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
    );
    this.handleBackbutton();
  }

  handleBackbutton() {
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH, InteractSubtype.DEVICE_BACK_CLICKED,
        this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING,
        this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING,
      );

      if (this.isFromSettings) {
        this.navCtrl.pop();
      } else {
        const pId = this.isFromSettings ? PageId.SETTINGS_LANGUAGE : PageId.ONBOARDING_LANGUAGE_SETTING;
        const env = this.isFromSettings ? Environment.SETTINGS : Environment.ONBOARDING;
        console.log('from others calling exit popup');
        this.commonUtilService.showExitPopUp(pId, env, false);
      }
      this.unregisterBackButton();
    }, 10);
  }

  ionViewWillEnter() {
    this.selectedLanguage = {};
    if (!this.isFromSettings) {
      this.headerServie.hideHeader();
    } else if (this.mainPage) {
      this.headerServie.showHeaderWithBackButton();
    } else {
      this.headerServie.showHeaderWithBackButton();
    }
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
    this.languages = appLanguages;

    this.zone.run(() => {
      this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
        .then(val => {
          if (Boolean(val)) {
            this.previousLanguage = val;
            this.language = val;
          } else {
            // this.getDeviceLanguage();
            this.previousLanguage = undefined;

          }
        });
    });

  }
  goToResources() {
     this.navCtrl.setRoot(ResourcesPage);
  }

  /*   getDeviceLanguage() {
      //Get device set language
      this.globalization.getPreferredLanguage()
        .then(res => {
          this.defaultDeviceLang = res.value.split("-")[0];
          let lang = this.languages.find(i => i.code === this.defaultDeviceLang);
          if (lang != undefined && lang != null) {
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
      this.zone.run(() => {
        this.translateService.use(this.language);
        this.btnColor = '#006DE5';
        this.isLanguageSelected = true;
      });
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
        this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE_CODE, this.selectedLanguage.code).toPromise();
        this.preferences.putString(PreferenceKey.SELECTED_LANGUAGE, this.selectedLanguage.label).toPromise();
        this.translateService.use(this.language);
      }
      this.events.publish('onAfterLanguageChange:update', {
        selectedLanguage: this.language
      });
      this.updateNotifiaction();
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

  triggerConfig() {
    let tempDate = this.configData.data.start;
    tempDate = tempDate.split(' ');
    const hour = +tempDate[1].split(':')[0];
    const minute = +tempDate[1].split(':')[1];
    tempDate = tempDate[0].split('/');
    const trigger: any = {};


    if (tempDate.length === 1) {
      const every: any = {
        minute: '',
        hour: ''
      };
      if (!isNaN(+this.configData.data.interval) && typeof(+this.configData.data.interval) === 'number') {
        every.day = +this.configData.data.interval;
      } else if (typeof(this.configData.data.interval) === 'string') {
        every[this.configData.data.interval] = +tempDate[0];
      }
      every.hour = hour;
      every.minute = minute;
      trigger.every = every;
    } else if (tempDate.length === 3) {
      trigger.firstAt = new Date(this.configData.data.start);
      trigger.every = this.configData.data.interval;
      if (this.configData.data.occurance)  {
        trigger.count = this.configData.data.occurance;
      }
    }
    return trigger;
  }

  localNotification() {
    const trigger = this.triggerConfig();
    const translate =  this.configData.data.translations[this.language] || this.configData.data.translations['default'];
    cordova.plugins.notification.local.schedule({
      id: this.configData.id,
      title: translate.title,
      text: translate.msg,
      icon: 'res://icon',
      smallIcon: 'res://n_icon',
      trigger: trigger
    });
  }

  updateNotifiaction() {
    cordova.plugins.notification.local.cancelAll();
    this.file.readAsText(this.file.applicationDirectory + 'www/assets/data', 'local_notofocation_config.json').then( data => {
      this.configData = JSON.parse(data);
      cordova.plugins.notification.local.getScheduledIds( (val) => {
        if (this.configData.id !== val[val.length - 1]) {
          this.localNotification();
        }
      });
    });
  }
}
