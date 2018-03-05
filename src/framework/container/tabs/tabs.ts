import { Component, ViewChild } from '@angular/core';
import { ContainerService } from '../container.services';
import { Tabs } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

const KEY_USER_ONBOARDED = "user_onboarded";
const KEY_USER_LOGIN_MODE = "user_login_mode";
const KEY_LOGGED_IN_MODE = "logged_in_mode";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  loginMode: string;

  @ViewChild('myTabs') tabRef: Tabs;


  tabs = [];


  constructor(private container: ContainerService, private navParams: NavParams, private storage: Storage) {

    this.storage.get(KEY_LOGGED_IN_MODE).then(val => {
      if (val === undefined || val === "" || val === null) {
        //do noting
      } else {
        this.loginMode = val;
        storage.set(KEY_USER_ONBOARDED, true);
        storage.set(KEY_USER_LOGIN_MODE, this.loginMode)
      }
    });
  }

  ionViewWillEnter() {
    this.tabs = this.container.getAllTabs();

    setTimeout(() => {
      let tabIndex = 0;
      if (this.loginMode == 'guest') {
        tabIndex = 2;
      }
      this.tabRef.select(tabIndex);
    }, 300);



  }
}
