import { NavController } from 'ionic-angular/navigation/nav-controller';
import { Component, NgZone } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import { ReportService, ReportSummary, PageId, Environment, InteractType, InteractSubtype } from 'sunbird';
import { GroupReportAlert } from '../group-report-alert/group-report-alert';
import { TranslateService } from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { AppGlobalService } from '../../../service/app-global.service';
import { ReportListPage } from '../report-list/report-list';
import { UserReportPage } from '../user-report/user-report';

@Component({
    selector: 'group-report-list',
    templateUrl: 'group-report-list.html'
})
export class GroupReportListPage {
    isFromUsers: boolean;
    isFromGroups: boolean;
    uids: Array<string>;
    reportType = 'users';
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
        name: this.translateMessage('QUESTIONS'),
        prop: 'index'
    }, {
        name: this.translateMessage('MARKS'),
        prop: 'max_score'
    }, {
        name: this.translateMessage('ACCURACY'),
        prop: 'accuracy'
    }];

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
        private telemetryGeneratorService: TelemetryGeneratorService,
        private appGlobalService: AppGlobalService,
        private navCtrl: NavController) {
    }

    ionViewWillEnter() {
        this.fetchAssessment(this.reportType, false);
    }
    fetchAssessment(event: string, fromUserList: boolean) {
        const subType = (event === 'users') ? InteractSubtype.REPORTS_BY_USER_CLICKED : InteractSubtype.REPORTS_BY_QUESTION_CLICKED;
        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            subType,
            Environment.USER,
            PageId.REPORTS_GROUP_ASSESMENT_DETAILS
        );

        const loader = this.loading.create({
            spinner: 'crescent'
        });
        const reportSummary: ReportSummary = this.navParams.get('report');
        this.contentName = reportSummary.name;
        const that = this;
        const uids = this.navParams.get('uids');
        const users = this.navParams.get('users');
        const params = {
            uids: uids,
            contentId: reportSummary.contentId,
            hierarchyData: null,
            qId: ''
        };
        if (fromUserList) {
            params.uids = [reportSummary.uid];
        }
        if (event === 'users' && !this.fromUserAssessment) {
            this.reportType = event;
            loader.present();
            this.reportService.getReportsByUser(params, (data: any) => {
                data = JSON.parse(data);
                let averageScore: any = 0;
                let averageTime = 0;
                data.forEach((report) => {
                    averageTime += report.totalTimespent;
                    averageScore += report.score;
                    report.totalTimespent = that.formatTime(report.totalTimespent);
                    report.name = reportSummary.name;
                });
                averageScore = (averageScore / data.length).toFixed(2);
                averageTime = averageTime / data.length;
                this.appGlobalService.setAverageTime(averageTime);
                this.appGlobalService.setAverageScore(averageScore);
                const details = {
                    'uiRows': data,
                    totalScore: averageScore,
                    uiTotalTime: that.formatTime(averageTime),
                    fromGroup: true,
                    fromUser: false
                };
                that.zone.run(() => {
                    loader.dismiss();
                    that.fromUserAssessment = details;
                });

            },
                (error: any) => {
                    const data = JSON.parse(error);
                    console.log('Error received', data);
                    loader.dismiss();
                });
        } else
            if (event === 'questions') {
                this.reportType = event;
                loader.present();
                this.reportService.getReportsByQuestion(params, (data: any) => {
                    data = JSON.parse(data);
                    let averageTime = 0;
                    let averageScore: any = 0;
                    data.forEach((question) => {
                        question.index = 'Q' + (('00' + question.qindex).slice(-3));
                        averageTime += question.time_spent;
                        averageScore += question.score;
                        question.accuracy = (question.correct_users_count || '0') + '/' + question.occurenceCount;
                        question.users = users;
                        question.uids = uids;
                    });
                    averageScore = (averageScore / data.length).toFixed(2);
                    averageTime = averageTime / data.length;
                    const details = {
                        'uiRows': data,
                        totalScore: that.appGlobalService.getAverageScore(),
                        uiTotalTime: that.formatTime(that.appGlobalService.getAverageTime()),
                        showPopup: true,
                        popupCallback: GroupReportAlert,
                        fromGroup: true,
                        fromUser: false
                    };
                    that.zone.run(() => {
                        loader.dismiss();
                        that.fromQuestionAssessment = details;
                    });
                },
                    (error: any) => {
                        const data = JSON.parse(error);
                        console.log('Error received', data);
                        loader.dismiss();
                    });
            }
    }

    formatTime(time: number): string {
        const mm = Math.floor(time / 60);
        const ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ('0' + mm)) + ':' + (ss > 9 ? ss : ('0' + ss));
    }

    showQuestionFromUser() {
        this.fetchAssessment('questions', true);
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

    goToReportList() {
        const reportSummary: ReportSummary = this.navParams.get('report');
        this.navCtrl.push(UserReportPage, { 'report': reportSummary });
    }

}
