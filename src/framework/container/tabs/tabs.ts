import { Component, ViewChild } from '@angular/core';
import { ContainerService } from '../container.services';
import { Tabs } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

const KEY_USER_ONBOARDED = "user_onboarded";
const KEY_USER_LOGIN_MODE = "user_login_mode";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;


  tabs = [];


  constructor(private container: ContainerService, private navParams: NavParams,  private storage: Storage) {
    let loginMode: string = this.navParams.get('loginMode');
    storage.set(KEY_USER_ONBOARDED, true);
    storage.set(KEY_USER_LOGIN_MODE, loginMode)
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
