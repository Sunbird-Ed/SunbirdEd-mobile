import { Component, ViewChild } from '@angular/core';
import { Tabs, Tab, Events } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ContainerService } from '@app/service/container.services';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;

  tabs = [];

  constructor(private container: ContainerService, private navParams: NavParams,private events : Events) {
  }

  ionViewWillEnter() {
    this.tabs = this.container.getAllTabs();

    let tabIndex = 0;

    this.tabs.forEach((tab, index) => {
      if (tab.isSelected === true) {
        tabIndex = index;
      }
    });

    setTimeout(() => {
      this.tabRef.select(tabIndex);
    }, 300);

  }

  public ionChange(tab: Tab) {
    this.events.publish('tab.change', tab.tabTitle);
  }
}
