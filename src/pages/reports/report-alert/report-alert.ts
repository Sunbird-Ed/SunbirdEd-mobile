import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

@Component({
  selector: 'report-alert',
  templateUrl: './report-alert.html',
})
export class ReportAlert{
  callback: QRAlertCallBack

  constructor(navParams: NavParams, private viewCtrl: ViewController) {
    this.callback = navParams.get('callback');

    // if (navParams.get('icon')) {
    //   this.icon = navParams.get('icon');
    // }

  }

  tryAgain() {
    if (this.callback) {
      this.callback.tryAgain()
    }
  }

  cancel() {
      this.viewCtrl.dismiss();
  }

}

export interface QRAlertCallBack {
  tryAgain(): any;
  cancel(): any;
}
