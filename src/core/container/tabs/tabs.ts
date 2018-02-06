import { Component, ViewChild } from '@angular/core';
import { ContainerService } from '../container.services';
import { Tabs } from 'ionic-angular';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;


  tabs = [];


  constructor(private container: ContainerService) {
  }

  ionViewWillEnter() {
    this.tabs = this.container.getAllTabs();

    setTimeout(() => {
      this.tabRef.select(0);
    }, 300);



  }
}
