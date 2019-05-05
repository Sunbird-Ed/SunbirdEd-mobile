import { ActiveDownloadsPage } from './../../pages/active-downloads/active-downloads';
import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { Events, App, MenuController } from 'ionic-angular';
import { AppGlobalService, UtilityService } from '@app/service';
import { SharedPreferences, DownloadService, DownloadRequest } from 'sunbird-sdk';
import { PreferenceKey, GenericAppConfig } from '../../app/app.constant';
import { AppVersion } from '@ionic-native/app-version';
import { Observable } from 'rxjs';

@Component({
  selector: 'application-header',
  templateUrl: 'application-header.html',
})
export class ApplicationHeaderComponent implements OnInit {
  ActiveDownloadsPage = ActiveDownloadsPage;
  chosenLanguageString: string;
  selectedLanguage: string;
  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  @Output() sideMenuItemEvent = new EventEmitter();
  appLogo: string;
  appName: string;
  isLoggedIn = false;
  versionName: string;
  versionCode: string;
  activeDownloadRequests$: Observable<DownloadRequest[]>;
  showDownloadAnimation: Boolean = false;

  constructor(public menuCtrl: MenuController,
    @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
    @Inject('DOWNLOAD_SERVICE') private downloadService: DownloadService,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private utilityService: UtilityService,
    private app: App) {
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
    this.events.subscribe('user-profile-changed', (res) => {
      this.setAppLogo();
    });
    this.events.subscribe('app-global:profile-obj-changed', (res) => {
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
            console.log('Error in getting app version code');
          });
      })
      .catch(error => {
        console.log('Error in getting app version name');
      });
  }

  setLanguageValue() {
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE).toPromise()
      .then(value => {
        this.selectedLanguage = value;
      });
  }

  listenDownloads() {
    this.activeDownloadRequests$ = this.downloadService.getActiveDownloadRequests();
    this.activeDownloadRequests$.subscribe((list) => {
      console.log('active downloads', list);
      if (list.length) {
        this.showDownloadAnimation = true;
      } else {
        this.showDownloadAnimation = false;
      }
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
    if (name === 'download') {
      this.app.getRootNav().push(ActiveDownloadsPage);
    } else {
      this.headerEvents.emit({ name });
    }
  }

  emitSideMenuItemEvent($event, menuItem) {
    this.toggleMenu();
    this.sideMenuItemEvent.emit({ menuItem });
  }

}
