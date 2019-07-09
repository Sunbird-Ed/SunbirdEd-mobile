import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {App, Events, MenuController, Platform} from 'ionic-angular';
import {AppGlobalService, UtilityService, CommonUtilService} from '@app/service';
import {DownloadService, SharedPreferences} from 'sunbird-sdk';
import {GenericAppConfig, PreferenceKey} from '../../app/app.constant';
import {AppVersion} from '@ionic-native/app-version';
import { NotificationService } from '@app/service/notification.service';
import { Subscription } from 'rxjs';
import {TranslateService} from "@ngx-translate/core";

declare const cordova;

@Component({
  selector: 'application-header',
  templateUrl: 'application-header.html',
})
export class ApplicationHeaderComponent implements OnInit, OnDestroy {
  chosenLanguageString: string;
  selectedLanguage: string;
  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  @Output() sideMenuItemEvent = new EventEmitter();

  appLogo?: string;
  appName?: string;
  versionName?: string;
  versionCode?: string;
  decreaseZindex = false;
  isRtl: boolean;
  isLoggedIn = false;
  showDownloadAnimation: Boolean = false;
  networkSubscription: Subscription;

  constructor(
    public menuCtrl: MenuController,
    private commonUtilService: CommonUtilService,
    @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
    @Inject('DOWNLOAD_SERVICE') private downloadService: DownloadService,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private utilityService: UtilityService,
    private changeDetectionRef: ChangeDetectorRef,
    private app: App,
    private notification: NotificationService,
    private translate: TranslateService,
    private platform : Platform
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
    this.translate.onLangChange.subscribe((params) => {
      if(params.lang == 'ur' && !this.platform.isRTL) {
        this.isRtl = true;
      } else if(this.platform.isRTL) {
        this.isRtl = false;
      }
    });
    this.events.subscribe('header:decreasezIndex', () => {
      this.decreaseZindex = true;
    });
    this.events.subscribe('header:setzIndexToNormal', () => {
      this.decreaseZindex = false;
    });
    this.listenDownloads();
    this.networkSubscription = this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
        this.setAppLogo();
    });
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
        if (value) {
          this.appLogo =  this.commonUtilService.networkInfo.isNetworkAvailable ? value : './assets/imgs/ic_launcher.png';
        } else {
          this.appLogo = './assets/imgs/ic_launcher.png';
        }
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

  ngOnDestroy() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
    this.events.subscribe('user-profile-changed');
    this.events.subscribe('app-global:profile-obj-changed');
  }

}
