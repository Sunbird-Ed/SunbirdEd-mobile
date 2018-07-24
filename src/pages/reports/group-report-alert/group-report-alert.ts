import { Component } from "@angular/core";
import { NavParams, ViewController, Platform, NavController, IonicApp } from "ionic-angular";

@Component({
  selector: 'group-report-alert',
  templateUrl: './group-report-alert.html',
})
export class GroupReportAlert{
  unregisterBackButton : any;
  callback: QRAlertCallBack
  report: string = 'users'
  fromUserColumns;
  assessmentDetails: {};
  fromUserAssessment: {};


  constructor(navParams: NavParams, private viewCtrl: ViewController, private navCtrl: NavController, private platform: Platform, private ionicApp: IonicApp) {
    this.callback = navParams.get('callback');
    this.assessmentDetails = this.callback['row'];
    this.fromUserAssessment = this.callback['row'];
    this.fromUserAssessment['showResult'] = false;
    this.fromUserColumns= [{
      name: 'Name',
      prop: 'qtitle'
    }, {
      name: 'Time',
      prop: 'timespent'
    }, {
      name: 'Result',
      prop: 'result'
    }];
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
