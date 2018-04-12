import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";

@Component({
  selector: 'page-alert-qr-scanner',
  templateUrl: './qrscanner_alert.html',
})
export class QRScannerAlert{
  callback: QRAlertCallBack

  constructor(navParams: NavParams) {
    this.callback = navParams.get('callback');
  }

  tryAgain() {
    if (this.callback) {
      this.callback.tryAgain()
    }
  }

  cancel() {
    if (this.callback) {
      this.callback.cancel()
    }
  }

}

export interface QRAlertCallBack {
  tryAgain(): any;
  cancel(): any;
}
