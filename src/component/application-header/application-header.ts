import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Events, App, MenuController } from 'ionic-angular';
import { CommonUtilService, AppGlobalService } from '@app/service';
import { SharedPreferences } from 'sunbird';
import { PreferenceKey } from '../../app/app.constant';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'application-header',
  templateUrl: 'application-header.html',
})
export class ApplicationHeaderComponent implements OnInit {
  chosenLanguageString: string;
  selectedLanguage: string;
  @Input() headerConfig: any = false;
  @Output() headerEvents = new EventEmitter();
  @Output() sideMenuItemEvent = new EventEmitter();
  appLogo: string;
  appName: string;
  isLoggedIn = false;

  constructor(public menuCtrl: MenuController,
    private commonUtilService: CommonUtilService,
    private preference: SharedPreferences,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion) {
    this.chosenLanguageString = this.commonUtilService.translateMessage('CURRENT_LANGUAGE');
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE)
      .then(value => {
        this.selectedLanguage = value;
      });
    this.events.subscribe('onAfterLanguageChange:update', (res) => {
      if (res && res.selectedLanguage) {
        this.selectedLanguage = res.selectedLanguage;
      }
    });
  }

  ngOnInit() {
    this.setAppLogo();
    this.events.subscribe('user-profile-changed', (res) => {
     this.setAppLogo();
    });
    this.events.subscribe(' app-global:profile-obj-changed', (res) => {
      this.setAppLogo();
     });
  }

  setAppLogo() {
    if (this.appGlobalService.isUserLoggedIn()) {
      console.log('this.appGlobalService.isGuestUser ----------', this.appGlobalService.isGuestUser);
      this.isLoggedIn = false;
      this.appLogo = './assets/imgs/ic_launcher.png';
      this.appVersion.getAppName().then((appName: any) => {
        console.log('App name ----------', appName);
        this.appName = appName;
      });
    } else {
      console.log('this.appGlobalService.isGuestUser ELSE ----------', this.appGlobalService.isGuestUser);
      this.isLoggedIn = true;
      this.preference.getString('app_logo').then(value => {
        this.appLogo = value;
      });
      this.preference.getString('app_name').then(value => {
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
    this.sideMenuItemEvent.emit({ menuItem });
  }

}
