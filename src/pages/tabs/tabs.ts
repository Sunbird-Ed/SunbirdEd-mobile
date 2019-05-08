
import { Component, ViewChild, Inject } from '@angular/core';
import { ContainerService } from '../../service/container.services';
import { Tabs, Tab, Events, ToastController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { TelemetryGeneratorService } from '@app/service';
import { Environment, InteractType, InteractSubtype, PageId } from '@app/service/telemetry-constants';
import { SharedPreferences } from 'sunbird-sdk';
import { PreferenceKey } from '@app/app';
import { File } from '@ionic-native/file';

declare const cordova;

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  configData: any;

  @ViewChild('myTabs') tabRef: Tabs;
  tabIndex = 0;
  tabs = [];
  headerConfig = {
    showHeader : true,
    showBurgerMenu: true,
    actionButtons: ['search', 'filter'],
  };
  selectedLanguage: string;
  constructor(
    private container: ContainerService, private navParams: NavParams, private events: Events,
    public toastCtrl: ToastController,
    private telemetryGeneratorService: TelemetryGeneratorService, private file: File,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences) {
      const notifcationData = cordova.plugins.notification.local.launchDetails;
      if (notifcationData !== undefined) {
        const values = new Map();
        values['action'] = 'via-notification';
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
          InteractSubtype.APP_INTIATED,
          Environment.HOME,
          PageId.HOME,
          undefined,
          values);
      } else {
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
          InteractSubtype.APP_INTIATED,
          Environment.HOME,
          PageId.HOME);
      }

      this.file.readAsText(this.file.applicationDirectory + 'www/assets/data', 'local_notofocation_config.json').then( data => {
        this.configData = JSON.parse(data);
        cordova.plugins.notification.local.getScheduledIds( (val) => {
          if (this.configData.id !== val[val.length - 1]) {
            this.localNotification();
          }
        });
      });
  }

  getPreffLanCode() {
    this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
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
    const img = cordova.file.applicationDirectory + 'www/assets/imgs/ic_launcher.png';

    this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
          cordova.plugins.notification.local.schedule({
            id: this.configData.id,
            title: this.configData.data.translations[this.selectedLanguage].title,
            text: this.configData.data.translations[this.selectedLanguage].msg,
            sound: 'file://sound.mp3',
            icon: 'res://icon',
            smallIcon: 'res://n_icon',
            trigger: trigger
          });
      }
    });
  }

  ionViewWillEnter() {
    this.tabs = this.container.getAllTabs();

    let tabIndex = 0;

    this.tabs.forEach((tab, index) => {
      if (tab.isSelected === true) {
        tabIndex = index;
      }
    });
    this.events.publish('update_header', { index: tabIndex });
    // Raise an Event
    setTimeout(() => {
      this.tabRef.select(tabIndex);
    }, 300);
  }

  public ionChange(tab: Tab) {
    // if active tab is other than scanner tab i.e, = tab 2
    if (tab.index !== 2) {
      this.tabs.forEach((tabTo, index) => {

        if (tabTo.isSelected === true) {
          tabTo.isSelected = false;
        }
        if (index === tab.index) {
          tabTo.isSelected = true;
        }
      });
    }
    this.events.publish('tab.change', tab.tabTitle);
  }

  public customClick(tab, _index) {
    // this.tabIndex = _index;
    if (tab.disabled && tab.availableLater) {
      const toast = this.toastCtrl.create({
        message: 'Will be available in later release',
        duration: 3000,
        position: 'middle',
        cssClass: 'sb-toast available-later',
        dismissOnPageChange: true,
        showCloseButton: false
      });
      toast.present();
    }
    if (tab.disabled && !tab.availableLater) {
      const toast = this.toastCtrl.create({
        message: 'Available for teachers only',
        duration: 3000,
        position: 'middle',
        cssClass: 'sb-toast available-later',
        dismissOnPageChange: true,
        showCloseButton: false
      });
      toast.present();
    }
  }

}
