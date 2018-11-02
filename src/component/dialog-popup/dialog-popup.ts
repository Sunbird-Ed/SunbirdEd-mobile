import { Component, Input } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CommonUtilService } from '../../service/common-util.service';


@Component({
  selector: 'dialog-popup',
  templateUrl: 'dialog-popup.html'
})
export class DialogPopupComponent {
  title: any;
  body: any;
  buttonText: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private commonUtilService: CommonUtilService) {
  }

  ionViewWillEnter() {
    this.title = this.navParams.get('title');
    this.body = this.navParams.get('body');
    this.buttonText = this.navParams.get('buttonText');
  }

  close() {
    this.viewCtrl.dismiss();
  }
  redirectToPlaystore() {
    this.commonUtilService.openLink('https://play.google.com/store/apps/details?id=org.xwalk.core');
  }
}
