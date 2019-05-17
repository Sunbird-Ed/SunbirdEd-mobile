import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {App, Events, MenuController} from 'ionic-angular';
import {AppGlobalService, UtilityService} from '@app/service';
import {DownloadService, SharedPreferences} from 'sunbird-sdk';
import {GenericAppConfig, PreferenceKey} from '../../app/app.constant';
import {AppVersion} from '@ionic-native/app-version';
import { NotificationService } from '@app/service/notification.service';

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
  decreaseZindex = false;

  isLoggedIn = false;
  showDownloadAnimation: Boolean = false;

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
    private notification: NotificationService
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

    this.events.subscribe('header:decreasezIndex', () => {
      this.decreaseZindex = true;
    });
    this.events.subscribe('header:setzIndexToNormal', () => {
      this.decreaseZindex = false;
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
      });
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
    .then(langCode => {
      console.log('Language code: ', langCode);
      this.notification.setupLocalNotification(langCode);
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
