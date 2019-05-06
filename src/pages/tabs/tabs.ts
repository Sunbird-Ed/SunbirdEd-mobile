
import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ContainerService } from '../../service/container.services';
import { Tabs, Tab, Events, ToastController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { LocalNotificationConfig } from '@app/app';
import { TelemetryGeneratorService } from '@app/service';
import { ImpressionType, ImpressionSubtype, Environment, InteractType, InteractSubtype, PageId } from '@app/service/telemetry-constants';
import { TelemetryObject } from 'sunbird-sdk';

declare const cordova;

// import { ResourcesPage } from '../resources/resources';
// import {ResourcesPageM:odule} from '@app/pages/resources/resources.module';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  dummyData: any = {
    id: 1004,
    type: 1,
    data: {
      start: '4 19:00',
      interval: 'week',
      translations: {
        en: {
          title: 'Learn something new on DIKSHA today!',
        }
      }
    }
  };

  @ViewChild('myTabs') tabRef: Tabs;
  tabIndex = 0;
  tabs = [];
  headerConfig = {
    showHeader : true,
    showBurgerMenu: true,
    actionButtons: ['search', 'filter'],
  };
  constructor(private container: ContainerService, private navParams: NavParams, private events: Events,
    public toastCtrl: ToastController, private localNotifications: LocalNotifications,
    private telemetryGeneratorService: TelemetryGeneratorService) {
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

      cordova.plugins.notification.local.getScheduledIds( (val) => {
        if (this.dummyData.id !== val[val.length - 1]) {
          this.localNotification();
        } else {
        }
      });
  }

  triggerConfig() {
    console.log(this.dummyData);
    let d1 = this.dummyData.data.start;
    d1 = d1.split(' ');
    const hour = +d1[1].split(':')[0];
    const minute = +d1[1].split(':')[1];
    d1 = d1[0].split('/');
    console.log(d1.length);
    const trigger: any = {};


    if (d1.length === 1) {
      const every: any = {
        minute: '',
        hour: ''
      };
      if (!isNaN(+this.dummyData.data.interval) && typeof(+this.dummyData.data.interval) === 'number') {
        every.day = +this.dummyData.data.interval;
      } else if (typeof(this.dummyData.data.interval) === 'string') {
        every[this.dummyData.data.interval] = +d1[0];
      }
      every.hour = hour;
      every.minute = minute;
      trigger.every = every;
      console.log(trigger);
    } else if (d1.length === 3) {
      trigger.firstAt = new Date(this.dummyData.data.start);
      trigger.every = this.dummyData.data.interval;
      if (this.dummyData.data.occurance)  {
        trigger.count = this.dummyData.data.occurance;
      }
      console.log(trigger);
    }
    return trigger;
  }

  localNotification() {
    const lang = Object.keys(this.dummyData.data.translations)[0];
    // TODO check user language condition
    const trigger = this.triggerConfig();
    const img = cordova.file.applicationDirectory + 'www/assets/imgs/ic_launcher.png';
    cordova.plugins.notification.local.schedule({
      id: this.dummyData.id,
      title: this.dummyData.data.translations[lang].title,
      sound: 'file://sound.mp3',
      icon: 'res://icon',
      smallIcon: 'res://n_icon',
      trigger: trigger
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
    console.log('TabTitle', tab.tabTitle);
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

  handleHeaderEvents($event) {
    // switch ($event.name) {
    //   case 'search': this.search();
    //                 break;
    //   case 'filter': this.showFilter();
    //                   break;
    // }
  }
}
