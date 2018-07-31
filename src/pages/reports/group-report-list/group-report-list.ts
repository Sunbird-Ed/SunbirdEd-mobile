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
    reportType: string = 'users'
    fromUserColumns = [{
        name: 'Name',
        prop: 'userName'
    }, {
        name: 'Time',
        prop: 'totalTimespent'
    }, {
        name: 'Score',
        prop: 'score'
    }];
    fromQuestionColumns = [{
        name: 'Questions',
        prop: 'index'
    }, {
        name: 'Marks',
        prop: 'max_score'
    }, {
        name: 'Accuracy',
        prop: 'accuracy'
    }]
    
    fromUserAssessment: {};
    fromQuestionAssessment: {};
    contentName: string;
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
        this.fetchAssessment(this.reportType, false)
    }
    fetchAssessment(event: string, fromUserList: boolean) {
        let loader = this.loading.create({
            spinner: "crescent"
        });
        let reportSummary: ReportSummary = this.navParams.get('report');
        this.contentName = reportSummary.name;
        let that = this;
        let uids = this.navParams.get('uids');
        let users = this.navParams.get('users');
        let params = {
            uids: uids, 
            contentId: reportSummary.contentId, 
            hierarchyData: null,
            qId: ''
        };
        if (fromUserList) {
            params.uids = [reportSummary.uid]
        }
        if (event == "users" && !this.fromUserAssessment) {
            this.reportType = event;
            loader.present();
            this.reportService.getReportsByUser(params, (data:any) => {
                data = JSON.parse(data);
                let averageScore:any = 0;
                let averageTime = 0;
                data.forEach(function(report){
                    averageTime += report.totalTimespent;
                    averageScore += report.score;
                    report.totalTimespent = that.convertTotalTime(report.totalTimespent);
                    report.name = reportSummary.name;
                });
                averageScore = (averageScore/data.length).toFixed(2);
                averageTime = averageTime/data.length;
                let details = {'uiRows': data, totalScore: averageScore, uiTotalTime: that.convertTotalTime(averageTime), summaryScoreLabel: "Average Score", summaryTimeLabel: "Average Time"};
                that.zone.run(() => {
                    loader.dismiss();
                    that.fromUserAssessment = details;
                })
                
            },
            (error: any) => {
                let data = JSON.parse(error);
                console.log('Error received', data);
                loader.dismiss();
            })
        } else
        if (event == "questions") {
            this.reportType = event;
            loader.present();
            this.reportService.getReportsByQuestion(params, (data:any) => {
                data = JSON.parse(data);
                let averageTime = 0;
                let averageScore:any = 0;
                data.forEach(function(question) {
                    question.index = 'Q' + (('00' + question.qindex).slice(-3));
                    averageTime += question.time_spent;
                    averageScore += question.score;
                    question.accuracy = question.sum_max_score + '/' + question.max_score * uids.length,
                    question.users = users,
                    question.uids = uids
                })
                averageScore = (averageScore/data.length).toFixed(2);
                averageTime = averageTime/data.length;
                let details = {'uiRows': data, totalScore: averageScore, uiTotalTime: that.convertTotalTime(averageTime),showPopup: true, popupCallback: GroupReportAlert, summaryScoreLabel: "Average Score", summaryTimeLabel: "Average Time"};
                that.zone.run(() => {
                    loader.dismiss();
                    that.fromQuestionAssessment = details;
                })
            },
            (error: any) => {
                let data = JSON.parse(error);
                console.log('Error received', data);
                loader.dismiss();
            })
        }
    }
    convertTotalTime(time: number): string {
        var mm = Math.floor(time / 60);
        var ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
    }
    showQuestionFromUser() {
        this.fetchAssessment('questions', true)
    }

}