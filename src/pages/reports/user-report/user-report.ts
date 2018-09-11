import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ReportSummary, ImpressionType, PageId, Environment } from 'sunbird';
import { ReportAlert } from '../report-alert/report-alert';
import { TranslateService } from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';

@IonicPage()
@Component({
  selector: 'page-user-report',
  templateUrl: 'user-report.html',
})
export class UserReportPage {
  assessmentData;
  columns = [
    {
      name: this.translateMessage('QUESTION_MARKS'),
      prop: 'index'
    }, {
      name: this.translateMessage('TIME'),
      prop: 'timespent'
    }, {
      name: this.translateMessage('RESULT'),
      prop: 'result'
    }
  ];
  contentName: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private reportService: ReportService,
    private translate: TranslateService,
    private loading: LoadingController,
    private zone: NgZone,
    private telemetryGeneratorService: TelemetryGeneratorService) {
  }

  formatTime(time:number):string{
    let minutes:any = "0" + Math.floor(time / 60);
    let seconds:any = "0" + (time - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
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

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.REPORTS_USER_ASSESMENT_DETAILS,
      Environment.USER
    );
  }

  ionViewWillEnter() {

    let loader = this.loading.create({
      spinner: "crescent"
    });
    loader.present();

    let that = this;

    let reportSummary: ReportSummary = this.navParams.get('report');
    this.contentName = reportSummary.name;

    that.reportService.getDetailReport([reportSummary.uid], reportSummary.contentId)
      .then(reportsMap => {
        let data = reportsMap.get(reportSummary.uid);
        let rows = data.reportDetailsList.map(row => {
          return {
            "index": 'Q' + (('00' + row.qindex).slice(-3)),
            "result": row.score + '/' + row.maxScore,
            "timespent": that.formatTime(row.timespent),
            "qdesc": row.qdesc,
            "score": row.score,
            "maxScore": row.maxScore,
            "qtitle": row.qtitle,
            "qid": row.qid
          }
        })
        data['uiRows'] = rows;
        data['uiTotalTime'] = that.formatTime(data['totalTime']);
        data['fromUser'] = true;
        data['fromGroup'] = false;
        that.zone.run(() => {
          loader.dismiss();
          data['showResult'] = true;
          that.assessmentData = data;
          that.assessmentData['showPopup'] = true;
          that.assessmentData['popupCallback'] = ReportAlert;
        });
      })
      .catch(err => {
        console.log(err);
        loader.dismiss();
      });

  }

  goBack() {
    this.navCtrl.pop();
  }

}