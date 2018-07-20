import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ReportService, ProfileService} from 'sunbird';

/**
 * Generated class for the TablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table.html',
})
export class TablePage implements OnInit {
  categories: string;
  assessmentData;
  columns;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public reportService: ReportService,
    public profileService: ProfileService) {
  }
  convertTotalTime(time: number): string {
    var mm = Math.floor(time / 60);
    var ss = Math.floor(time % 60);
    return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
  }
  ngOnInit() {
    let that = this;
    this.profileService.getCurrentUser(user => {
      user = JSON.parse(user)
      new Promise((resolve, reject) => {
        that.reportService.getListOfReports([user.uid]).then((data) => {
          if (data.length > 0) {
            that.reportService.getDetailReport([user.uid], data[0].contentId).then((reports) => {
              resolve(reports.get(user.uid));
            })
          } else {
            resolve([]);
          }
        })
      }).then(function(response){
        let data = response;
        let rows = data['reportDetailsList'].map(row => {
          return {
            "qtitle": row.qtitle,
            "result": row.score + '/' + row.maxScore,
            "timespent": that.convertTotalTime(row.timespent),
            "qdesc": row.qdesc
          }
        })
        data['reportDetailsList'] = rows;
        data['totalTime'] = that.convertTotalTime(data['totalTime']);
        that.assessmentData = data;
      });
    }, error => {
      console.error("Error", error);
      return "null";
    })
    this.columns = [{
      name: 'Question (Marks)',
      prop: 'qtitle',
      sortable: true
    },{
      name: 'Time',
      prop: 'timespent',
      sortable: true
    },{
      name: 'Result',
      prop: 'result',
      sortable: false
    }]
  }

  goBack() {
    this.navCtrl.pop();
  }

}