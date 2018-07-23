import { Component } from "@angular/core";
import { NavParams, ViewController, Platform, NavController, IonicApp } from "ionic-angular";

@Component({
  selector: 'report-alert',
  templateUrl: './report-alert.html',
})
export class ReportAlert {

  unregisterBackButton: any;
  callback: QRAlertCallBack
  assessmentDetails: {};
  report: string = 'questions'

  constructor(navParams: NavParams, private viewCtrl: ViewController, private navCtrl: NavController, private platform: Platform, private ionicApp: IonicApp) {
    this.callback = navParams.get('callback');
    this.assessmentDetails = this.callback['row'];
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 11);
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }

  /**
   * It will Dismiss active popup
   */
  dismissPopup() {
    console.log("Fired ionViewWillLeave");
    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

}

export interface QRAlertCallBack {
  cancel(): any;
}
