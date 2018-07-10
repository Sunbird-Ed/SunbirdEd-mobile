import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";

@Component({
  selector: 'group-report-alert',
  templateUrl: './group-report-alert.html',
})
export class GroupReportAlert{
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

  constructor(navParams: NavParams, private viewCtrl: ViewController) {
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

}

export interface QRAlertCallBack {
  tryAgain(): any;
  cancel(): any;
}
