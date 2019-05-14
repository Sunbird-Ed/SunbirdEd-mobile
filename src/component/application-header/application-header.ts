import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {App, Events, MenuController} from 'ionic-angular';
import {AppGlobalService, UtilityService} from '@app/service';
import {DownloadService, SharedPreferences} from 'sunbird-sdk';
import {GenericAppConfig, PreferenceKey} from '../../app/app.constant';
import {AppVersion} from '@ionic-native/app-version';
import { File } from '@ionic-native/file';

declare const cordova;

@Component({
  selector: 'application-header',
  templateUrl: 'application-header.html',
})
export class ApplicationHeaderComponent implements OnInit {

  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  @Output() sideMenuItemEvent = new EventEmitter();

  selectedLanguage?: string;
  appLogo?: string;
  appName?: string;
  versionName?: string;
  versionCode?: string;

  isLoggedIn = false;
  showDownloadAnimation: Boolean = false;
  configData: any;

  constructor(
    public menuCtrl: MenuController,
    @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
    @Inject('DOWNLOAD_SERVICE') private downloadService: DownloadService,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private utilityService: UtilityService,
    private changeDetectionRef: ChangeDetectorRef,
    private app: App,
    private file: File
  ) {
    this.setLanguageValue();
    this.events.subscribe('onAfterLanguageChange:update', (res) => {
      if (res && res.selectedLanguage) {
        this.setLanguageValue();
      }
    });
  }

  ngOnInit() {
    this.setAppLogo();
    this.setAppVersion();
    this.events.subscribe('user-profile-changed', () => {
      this.setAppLogo();
    });
    this.events.subscribe('app-global:profile-obj-changed', () => {
      this.setAppLogo();
    });
    this.listenDownloads();
  }

  setAppVersion(): any {
    this.utilityService.getBuildConfigValue(GenericAppConfig.VERSION_NAME)
      .then(vName => {
        this.versionName = vName;
        this.utilityService.getBuildConfigValue(GenericAppConfig.VERSION_CODE)
          .then(vCode => {
            this.versionCode = vCode;
          })
          .catch(error => {
            console.error('Error in getting app version code', error);
          });
      })
      .catch(error => {
        console.error('Error in getting app version name', error);
      });
  }

  setLanguageValue() {
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE).toPromise()
      .then(value => {
        this.selectedLanguage = value;
        this.updateNotifiaction();
      });
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
    const translate =  this.configData.data.translations[this.selectedLanguage] || this.configData.data.translations['default'];
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

  listenDownloads() {
    this.downloadService.getActiveDownloadRequests().subscribe((list) => {
      this.showDownloadAnimation = !!list.length;
      this.changeDetectionRef.detectChanges();
    });
  }

  setAppLogo() {
    if (!this.appGlobalService.isUserLoggedIn()) {
      this.isLoggedIn = false;
      this.appLogo = './assets/imgs/ic_launcher.png';
      this.appVersion.getAppName().then((appName: any) => {
        this.appName = appName;
      });
    } else {
      this.isLoggedIn = true;
      this.preference.getString('app_logo').toPromise().then(value => {
        this.appLogo = value;
      });
      this.preference.getString('app_name').toPromise().then(value => {
        this.appName = value;
      });
    }
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  emitEvent($event, name) {
      this.headerEvents.emit({name});
  }

  emitSideMenuItemEvent($event, menuItem) {
    this.toggleMenu();
    this.sideMenuItemEvent.emit({menuItem});
  }

}
