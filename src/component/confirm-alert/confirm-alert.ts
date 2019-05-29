import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Platform, NavParams } from 'ionic-angular';
@Component({
  selector: 'confirm-alert',
  templateUrl: 'confirm-alert.html'
})
export class ConfirmAlertComponent {
  sbPopoverHeading: any;
  sbPopoverMainTitle: any;
  sbPopoverContent: any;
  actionsButtons: any;
  icon: any;
  metaInfo: any;
  isUpdateAvail: any;
  contentSize: any;
  backButtonFunc = undefined;
  constructor(public viewCtrl: ViewController, public platform: Platform, public navParams: NavParams) {
    this.actionsButtons = this.navParams.get('actionsButtons');
    this.icon = this.navParams.get('icon');
    this.metaInfo = this.navParams.get('metaInfo');
    this.sbPopoverContent = this.navParams.get('sbPopoverContent');
    this.sbPopoverHeading = this.navParams.get('sbPopoverHeading');
    this.sbPopoverMainTitle = this.navParams.get('sbPopoverMainTitle');
    this.isUpdateAvail = this.navParams.get('isUpdateAvail');
    this.contentSize = this.navParams.get('contentSize');
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }

  selectOption(canDownload: boolean = false) {
    this.viewCtrl.dismiss(canDownload);
  }
  closePopover() {
    this.viewCtrl.dismiss();
  }

}
