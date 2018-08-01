import { Component } from "@angular/core";
import { NavParams, ViewController, Platform, NavController, IonicApp, LoadingController } from "ionic-angular";
import { ReportService } from 'sunbird';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'group-report-alert',
  templateUrl: './group-report-alert.html',
})
export class GroupReportAlert {
  unregisterBackButton: any;
  callback: QRAlertCallBack
  report: string = 'users'
  fromUserColumns = [{
    name: this.translateMessage('FIRST_NAME'),
    prop: 'name'
  }, {
    name: this.translateMessage('TIME'),
    prop: 'time'
  }, {
    name: this.translateMessage('RESULT'),
    prop: 'res'
  }];;
  assessment: {};
  fromUserAssessment = { 'uiRows': [], showResult: false };

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private loading: LoadingController,
    private platform: Platform,
    private ionicApp: IonicApp,
    private reportService: ReportService,
    private translate: TranslateService) {
    this.report = 'questions'
    this.callback = navParams.get('callback');
    this.assessment = this.callback['row'];
  }

  getAssessmentByUser(event) {
    if (event == "users") {
      let loader = this.loading.create({
        spinner: "crescent"
      });
      let params = {
        uids: this.assessment['uids'],
        contentId: this.assessment['content_id'],
        hierarchyData: null,
        qId: this.assessment['qid']
      };
      let that = this;
      this.reportService.getDetailsPerQuestion(params, (data: any) => {
        data = JSON.parse(data);
        if (data.length > 0) {
          data.forEach(assessment => {
            assessment.time = that.convertTotalTime(assessment.time)
            assessment.name = that.assessment['users'].get(assessment.uid)
            assessment.res = assessment.result + '/' + assessment.maxScore
          });
          that.fromUserAssessment['uiRows'] = data;
        }
      }, (error: any) => {
        let data = JSON.parse(error);
        console.log('Error received', data);
        loader.dismiss();
      })
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

  convertTotalTime(time: number): string {
    var mm = Math.floor(time / 60);
    var ss = Math.floor(time % 60);
    return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
  }
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}

export interface QRAlertCallBack {
  cancel(): any;
}
