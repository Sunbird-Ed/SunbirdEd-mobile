import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'sb-no-network-popup',
  templateUrl: 'sb-no-network-popup.html'
})
export class SbNoNetworkPopupComponent {
  sbPopoverHeading = '';
  sbPopoverMessage = '';

  constructor(private navParams: NavParams,
    private viewCtrl: ViewController) {
    this.initParams();
  }

  private initParams() {
    this.sbPopoverHeading = this.navParams.get('sbPopoverHeading');
    this.sbPopoverMessage = this.navParams.get('sbPopoverMessage');
  }

  closePopover() {
    this.viewCtrl.dismiss();
  }

}
