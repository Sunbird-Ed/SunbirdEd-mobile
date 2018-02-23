import { Component, ViewChild } from '@angular/core';
import { ContainerService } from '../container.services';
import { Tabs } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;


  tabs = [];


  constructor(private container: ContainerService, private navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.tabs = this.container.getAllTabs();

    setTimeout(() => {
      let tabIndex = 0;
      if (this.navParams.get('loginMode') == 'guest') {
        tabIndex = 2;
      }
      this.tabRef.select(tabIndex);
    }, 300);



  }
}
