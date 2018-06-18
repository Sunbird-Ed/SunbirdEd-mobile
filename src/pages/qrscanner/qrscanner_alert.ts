import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";

@Component({
  selector: 'page-alert-qr-scanner',
  templateUrl: './qrscanner_alert.html',
})
export class QRScannerAlert{
  callback: QRAlertCallBack

  icon: string = "./assets/imgs/ic_warning_grey.png";
  messageKey: string = "UNKNOWN_QR";
  cancelKey: string = "CANCEL";
  tryAgainKey: string = "TRY_AGAIN";

  showOnlyPrimaryBtn = false;

  constructor(navParams: NavParams) {
    this.callback = navParams.get('callback');

    if (navParams.get('icon')) {
      this.icon = navParams.get('icon');
    }

    if (navParams.get('messageKey')) {
      this.messageKey = navParams.get('messageKey');
    }

    if (navParams.get('cancelKey')) {
      this.cancelKey = navParams.get('cancelKey');

      if (this.cancelKey == "hide") {
        this.showOnlyPrimaryBtn = true;
        this.cancelKey = undefined;
      }
    }

    if (navParams.get('tryAgainKey')) {
      this.tryAgainKey = navParams.get('tryAgainKey');
    }
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
