import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ProfileService, ReportSummary } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage {
  categories: string;
  assessmentData;
  columns = [
    {
      name: 'Question (Marks)',
      prop: 'qtitle',
      sortable: true
    }, {
      name: 'Time',
      prop: 'timespent',
      sortable: true
    }, {
      name: 'Result',
      prop: 'result',
      sortable: false
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public reportService: ReportService,
    public profileService: ProfileService,
    public loading: LoadingController,
    public zone: NgZone) {
  }

  convertTotalTime(time: number): string {
    var mm = Math.floor(time / 60);
    var ss = Math.floor(time % 60);
    return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
  }

  ionViewWillEnter() {

    let loader = this.loading.create({
        spinner: "crescent"
    });
    loader.present();

    let that = this;

    let reportSummary: ReportSummary = this.navParams.get('report');
    
    that.reportService.getDetailReport([reportSummary.uid], reportSummary.contentId)
    .then(reportsMap => {
      let data = reportsMap.get(reportSummary.uid);
      let rows = data.reportDetailsList.map(row => {
        return {
          "qtitle": row.qtitle,
          "result": row.score + '/' + row.maxScore,
          "timespent": that.convertTotalTime(row.timespent),
          "qdesc": row.qdesc
        }
      })
      data['uiRows'] = rows;
      data['uiTotalTime'] = that.convertTotalTime(data['totalTime']);
      that.zone.run(() => {
        loader.dismiss();
        that.assessmentData = data;
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