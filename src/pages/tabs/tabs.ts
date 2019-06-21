import { AppGlobalService } from './../../service/app-global.service';

import { Component, ViewChild } from '@angular/core';
import { ContainerService } from '../../service/container.services';
import { Tabs, Tab, Events, ToastController } from 'ionic-angular';
import { TelemetryGeneratorService } from '@app/service';

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
    showHeader: true,
    showBurgerMenu: true,
    actionButtons: ['search', 'filter'],
  };

  selectedLanguage: string;

  constructor(
    private container: ContainerService,
    private events: Events,
    public toastCtrl: ToastController,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private appGlobalService: AppGlobalService
  ) {}

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
      this.appGlobalService.currentPageId = tab.tabTitle;
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
