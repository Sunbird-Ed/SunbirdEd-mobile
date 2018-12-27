import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { XwalkConstants } from '../../app/app.constant';

@Component({
  selector: 'dialog-popup',
  templateUrl: 'dialog-popup.html'
})
export class DialogPopupComponent {
  title: any;
  body: any;
  buttonText: any;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams) {
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
    (<any>window).genieSdkUtil.openPlayStore(XwalkConstants.APP_ID);
  }

}
