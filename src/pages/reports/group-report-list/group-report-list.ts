import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ProfileService, ReportSummary } from 'sunbird';
import { GroupReportAlert } from '../group-report-alert/group-report-alert';

@Component({
    selector: 'group-report-list',
    templateUrl: 'group-report-list.html'
})
export class GroupReportListPage {
    isFromUsers: boolean;
    isFromGroups: boolean;
    uids: Array<string>;
    report: string = 'users'
    fromUserColumns = [{
        name: 'Name',
        prop: 'qtitle',
        sortable: true
    }, {
        name: 'Time',
        prop: 'timespent',
        sortable: true
    }, {
        name: 'Score',
        prop: 'score',
        sortable: false
    }];
    fromQuestionColumns = [{
        name: 'Questions',
        prop: 'qtitle',
        sortable: true
    }, {
        name: 'Marks',
        prop: 'score',
        sortable: true
    }, {
        name: 'Accuracy',
        prop: 'score',
        sortable: false
    }]
    fromUserAssessment: {};
    fromQuestionAssessment: {};
    listOfReports: Array<ReportSummary> = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private loading: LoadingController,
        public zone: NgZone,
        public reportService: ReportService,
        public profileService: ProfileService) {
    }

    ionViewWillEnter() {
        let loader = this.loading.create({
            spinner: "crescent"
        });
        loader.present();
        let reportSummary: ReportSummary = this.navParams.get('report');
        let that = this;
        this.reportService.getDetailReport([reportSummary.uid], reportSummary.contentId).then(reportsMap => {
            let data = reportsMap.get(reportSummary.uid);
            let rows = data.reportDetailsList.map(row => {
                return {
                "qtitle": row.qtitle,
                "result": row.score + '/' + row.maxScore,
                "timespent": that.convertTotalTime(row.timespent),
                "qdesc": row.qdesc,
                "score": row.score,
                "maxScore": row.maxScore
                }
            })
            data['uiRows'] = rows;
            data['uiTotalTime'] = that.convertTotalTime(data['totalTime']);
            data['showResult'] = true;
            that.zone.run(() => {
                loader.dismiss();
                that.fromUserAssessment = data;
                that.fromQuestionAssessment = data;
                that.fromQuestionAssessment['popupCallback'] = GroupReportAlert;
            });
        }).catch(err => {
            console.log(err);
            loader.dismiss();
        });
    }
    convertTotalTime(time: number): string {
        var mm = Math.floor(time / 60);
        var ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
    }

}