import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { XwalkConstants } from '../../app/app.constant';
import {UtilityService} from '@app/service';

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
    private navParams: NavParams,
    private utilityService: UtilityService) {
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
    this.utilityService.openPlayStore(XwalkConstants.APP_ID);
  }

}
