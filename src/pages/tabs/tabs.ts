
import { Component, ViewChild } from '@angular/core';
import { ContainerService } from '../../service/container-service';
import { Tabs, Tab, Events } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
// import { ResourcesPage } from '../resources/resources';
// import {ResourcesPageModule} from '@app/pages/resources/resources.module';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;

  tabs = [];

  constructor(private container: ContainerService, private navParams: NavParams, private events: Events) {
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
    console.log('TabTitle', tab.tabTitle);
    this.events.publish('tab.change', tab.tabTitle);

  }
}
