import { Component } from "@angular/core";
import { NavParams, ViewController, Platform, NavController, IonicApp } from "ionic-angular";

@Component({
  selector: 'group-report-alert',
  templateUrl: './group-report-alert.html',
})
export class GroupReportAlert{
  unregisterBackButton : any;
  callback: QRAlertCallBack
  report: string = 'user'
  option: string;
  questionResponse = [
    {
        accuracy: '35/50',
        user: 'Some Student',
        qId: 'Q1',
        marks: 5,
        time: '5:21',
        score: '5',
        result: 'pass'
    },
    {
        accuracy: '45/50',
        user: 'Some Student',
        qId: 'Q2',
        marks: 5,
        time: '5:21',
        score: '5',
        result: 'pass'
    },
    {
        accuracy: '35/50',
        user: 'Some Student',
        qId: 'Q3',
        marks: 5,
        time: '5:21',
        score: '5',
        result: 'pass'
    },
    {
        user: 'Some Student',
        qId: 'Q8',
        marks: 5,
        time: '5:21',
        result: 'failed'
    },
    {
        user: 'Some Student',
        qId: 'Q9',
        marks: 5,
        time: '5:21',
        result: 'failed'
    },
    {
      user: 'Some Student',
      qId: 'Q9',
      marks: 5,
      time: '5:21',
      result: 'failed'
  },]

  constructor(navParams: NavParams, private viewCtrl: ViewController, private navCtrl: NavController, private platform: Platform, private ionicApp: IonicApp) {
    this.callback = navParams.get('callback');

    // if (navParams.get('icon')) {
    //   this.icon = navParams.get('icon');
    // }

  }
  navigateToUsers(){
    this.option = 'user';
  }
  usersStudent() {

    this.option = 'student';
  }

  tryAgain() {
    if (this.callback) {
      this.callback.tryAgain()
    }
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
  tryAgain(): any;
  cancel(): any;
}
