import { Component } from '@angular/core';
import {
  NavParams,
  Platform
} from 'ionic-angular';

@Component({
  selector: 'page-alert-qr-scanner',
  templateUrl: './qrscanner_alert.html',
})
export class QRScannerAlert {
  callback: QRAlertCallBack;

  icon = './assets/imgs/ic_coming_soon.png';
  messageKey = 'UNKNOWN_QR';
  cancelKey = 'CANCEL';
  tryAgainKey = 'TRY_AGAIN';
  skipKey = 'SKIP';
  invalidContent = false;
  unregisterBackButton = undefined;

  showOnlyPrimaryBtn = false;

  constructor(navParams: NavParams, public platform: Platform) {
    this.callback = navParams.get('callback');

    if (navParams.get('icon')) {
      this.icon = navParams.get('icon');
    }

    if (navParams.get('messageKey')) {
      this.messageKey = navParams.get('messageKey');
    }

    if (navParams.get('cancelKey')) {
      this.cancelKey = navParams.get('cancelKey');

      if (this.cancelKey === 'hide') {
        this.showOnlyPrimaryBtn = true;
        this.cancelKey = undefined;
      }
    }

    if (navParams.get('tryAgainKey')) {
      this.tryAgainKey = navParams.get('tryAgainKey');
    }

    if (navParams.get('invalidContent')) {
      this.invalidContent = navParams.get('invalidContent');
    }
  }

  ionViewWillEnter() {
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.cancel();
      this.unregisterBackButton();
    }, 11);
  }
  tryAgain() {
    if (this.callback) {
      this.callback.tryAgain();
    }
  }

  cancel() {
    if (this.callback) {
      this.callback.cancel();
    }
  }
}

export interface QRAlertCallBack {
  tryAgain(): any;
  cancel(): any;
}
