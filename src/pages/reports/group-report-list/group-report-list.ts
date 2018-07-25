import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ProfileService, ReportSummary } from 'sunbird';
import { GroupReportAlert } from '../group-report-alert/group-report-alert';
import { ReportAlert } from '../report-alert/report-alert';

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
        prop: 'handle'
    }, {
        name: 'Time',
        prop: 'totalTime'
    }, {
        name: 'Score',
        prop: 'totalScore'
    }];
    fromQuestionColumns = [{
        name: 'Questions',
        prop: 'qtitle'
    }, {
        name: 'Marks',
        prop: 'score'
    }, {
        name: 'Accuracy',
        prop: 'score'
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
            let users = this.navParams.get('users');
            let data = reportsMap.get(reportSummary.uid);
            let userData = that.reportService.mapReportDetailPerUser(data.reportDetailsList);
            let userDataReport = {'uiRows': [], 'uiTotalTime': "", 'totalScore': 0, 'maxTotalScore': 0, 'showResult': true};
            let totalTime = 0;
            userData.forEach(element => {
                let user = users.find(function(u){
                    return u.uid == element.uid
                })
                element['handle'] = user.handle;
                userDataReport.uiRows.push(element);
                totalTime += element.totalTime;
                userDataReport['totalScore'] += element.totalScore;
                userDataReport['maxTotalScore'] += element.maxTotalScore;
            });
            userDataReport['uiTotalTime'] = that.convertTotalTime(totalTime);
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
                that.fromUserAssessment = userDataReport;
                that.fromUserAssessment['popupCallback'] = GroupReportAlert;
                that.fromQuestionAssessment = data;
                that.fromQuestionAssessment['popupCallback'] = ReportAlert;
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