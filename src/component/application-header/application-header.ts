import { Component, Input, Output, EventEmitter, OnInit, Inject, OnDestroy } from '@angular/core';
import { Events, App, MenuController } from 'ionic-angular';
import { CommonUtilService, AppGlobalService, UtilityService } from '@app/service';
import { SharedPreferences } from 'sunbird-sdk';
import { PreferenceKey, GenericAppConfig } from '../../app/app.constant';
import { AppVersion } from '@ionic-native/app-version';
import { Subscription } from 'rxjs';

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
  appLogo: string;
  appName: string;
  isLoggedIn = false;
  versionName: string;
  versionCode: string;
  networkSubscription: Subscription;

  constructor(public menuCtrl: MenuController,
    private commonUtilService: CommonUtilService,
    @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private utilityService: UtilityService) {
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
     this.networkSubscription = this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
        this.setAppLogo();
    });
  }
  setAppVersion(): any {
    this.utilityService.getBuildConfigValue(GenericAppConfig.VERSION_NAME )
            .then(vName => {
              this.versionName = vName;
                this.utilityService.getBuildConfigValue(GenericAppConfig.VERSION_CODE )
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
        if (this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.appLogo = value;
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
    this.headerEvents.emit({ name });
  }

  emitSideMenuItemEvent($event, menuItem) {
    this.toggleMenu();
    this.sideMenuItemEvent.emit({ menuItem });
  }

  ngOnDestroy() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
    this.events.subscribe('user-profile-changed');
    this.events.subscribe('app-global:profile-obj-changed');
  }

}
