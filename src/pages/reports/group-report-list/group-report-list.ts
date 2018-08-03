import { Component, NgZone } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ReportSummary, ImpressionType, PageId, Environment, InteractType, InteractSubtype } from 'sunbird';
import { GroupReportAlert } from '../group-report-alert/group-report-alert';
import {TranslateService} from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';

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
        name: this.translateMessage('FIRST_NAME'),
        prop: 'userName'
    }, {
        name: this.translateMessage('TIME'),
        prop: 'totalTimespent'
    }, {
        name: this.translateMessage('SCORE'),
        prop: 'score'
    }];
    fromQuestionColumns = [{
        name: this.translateMessage('QUESTION_PLURAL'),
        prop: 'index'
    }, {
        name: this.translateMessage('MARKS'),
        prop: 'max_score'
    }, {
        name: this.translateMessage('ACCURACY'),
        prop: 'accuracy'
    }]
    
    fromUserAssessment: {};
    fromQuestionAssessment: {};
    contentName: string;
    listOfReports: Array<ReportSummary> = [];
    
    constructor(
        private navParams: NavParams,
        private loading: LoadingController,
        private zone: NgZone,
        private reportService: ReportService,
        private translate: TranslateService,
        private telemetryGeneratorService: TelemetryGeneratorService) {
    }

    ionViewWillEnter() {
        this.telemetryGeneratorService.generateImpressionTelemetry(
            ImpressionType.VIEW, "", PageId.REPORTS_GROUP_ASSESSMENT, Environment.USER, "", ""
        );
        this.fetchAssessment(this.reportType, false)
    }
    fetchAssessment(event: string, fromUserList: boolean) {
        let subType = (event == 'users') ? InteractSubtype.REPORTS_GROUP_BYUSER_CLICKED : InteractSubtype.REPORTS_GROUP_BYQUESTION_CLICKED;
        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            subType,
            Environment.USER,
            PageId.REPORTS_GROUP_ASSESSMENT
        );
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
                let details = {'uiRows': data, totalScore: averageScore, uiTotalTime: that.convertTotalTime(averageTime), fromGroup: true, fromUser: false};
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
                let details = {'uiRows': data, totalScore: averageScore, uiTotalTime: that.convertTotalTime(averageTime),showPopup: true, popupCallback: GroupReportAlert, fromGroup: true, fromUser: false};
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