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
        let uids = this.navParams.get('uids');
        let params = {
            uids: uids, 
            contentId: reportSummary.contentId, 
            hierarchyData: null
        };
        this.reportService.getReportsByUser(params, (data:any) => {
            data = JSON.parse(data);
            let averageScore = 0;
            let averageTime = 0;
            data.forEach(function(d){
                averageTime += d.totalTimespent;
                averageScore += d.score;
            });
            averageScore = averageScore/data.length;
            averageTime = averageTime/data.length;
            let details = {'uiRows': data, totalScore: averageScore, uiTotalTime: that.convertTotalTime(averageTime)};
            that.zone.run(() => {
                loader.dismiss();
                that.fromUserAssessment = details;
                // that.fromUserAssessment['popupCallback'] = GroupReportAlert;
            })
            
        },
        (error: any) => {
            let data = JSON.parse(error);
            console.log('Error received', data);
            loader.dismiss();
        })
        
    }
    convertTotalTime(time: number): string {
        var mm = Math.floor(time / 60);
        var ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
    }

}