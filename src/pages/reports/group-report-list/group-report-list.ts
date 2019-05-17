import {CommonUtilService} from './../../../service/common-util.service';
import {Component, Inject, NgZone} from '@angular/core';
import {LoadingController, NavParams, NavController} from 'ionic-angular';
import {GroupReportAlert} from '../group-report-alert/group-report-alert';
import {TranslateService} from '@ngx-translate/core';
import {TelemetryGeneratorService} from '../../../service/telemetry-generator.service';
import {AppGlobalService, UtilityService, AppHeaderService} from '@app/service';
import {UserReportPage} from '../user-report/user-report';
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {DatePipe} from '@angular/common';
import {DeviceInfo, Profile, ReportSummary, SummarizerService, SummaryRequest} from 'sunbird-sdk';
import {Environment, InteractSubtype, InteractType, PageId} from '../../../service/telemetry-constants';


@Component({
    selector: 'group-report-list',
    templateUrl: 'group-report-list.html'
})
export class GroupReportListPage {
    isFromUsers: boolean;
    isFromGroups: boolean;
    uids: Array<string>;
    reportType = 'users';
    exptime: any;
    deviceId: string;
    response: any;
    responseByUser: any;
    // Below variable stores group Report
    groupReport: any;
    profile: Profile;
    currentGroupId: string;
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
        prop: 'maxScore'
    }, {
        name: this.translateMessage('ACCURACY'),
        prop: 'accuracy'
    }];

    fromUserAssessment: {};
    fromQuestionAssessment: {};
    contentName: string;
    listOfReports: Array<ReportSummary> = [];
    group: any;
    groupinfo: any;
    downloadDirectory: any;
    reportSummary: ReportSummary;

    constructor(
        private navParams: NavParams,
        private loading: LoadingController,
        private zone: NgZone,
        private transfer: FileTransfer,
        @Inject('SUMMARIZER_SERVICE') public summarizerService: SummarizerService,
        private translate: TranslateService,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private appGlobalService: AppGlobalService,
        private utilityService: UtilityService,
        private file: File,
        private datePipe: DatePipe,
        @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
        private navCtrl: NavController,
        private commonUtilService: CommonUtilService,
        private headerService: AppHeaderService) {
        this.downloadDirectory = this.file.dataDirectory;
        this.utilityService.getDownloadDirectoryPath()
            .then((response: any) => {
                this.downloadDirectory = response;
                console.log('download path', this.downloadDirectory);
            })
            .catch();
    }
    fileTransfer: FileTransferObject = this.transfer.create();
    ionViewWillEnter() {
        this.fetchAssessment(this.reportType, false);
    }
    ionViewDidLoad() {
        this.deviceId =  this.deviceInfo.getDeviceID();
        this.profile = this.appGlobalService.getCurrentUser();
        this.groupinfo = this.navParams.get('group');
        this.headerService.hideHeader();
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
        this.reportSummary = this.navParams.get('report');
        this.contentName = this.reportSummary.name;
        const that = this;
        const uids = this.navParams.get('uids');
        const users = this.navParams.get('users');
        const summaryRequest: SummaryRequest = {
            qId: '',
            uids: uids,
            contentId: this.reportSummary.contentId,
            hierarchyData: null
        };
        if (fromUserList) {
            summaryRequest.uids = [this.reportSummary.uid];
        }
        if (event === 'users' && !this.fromUserAssessment) {
            this.reportType = event;
            loader.present();
            this.summarizerService.getReportsByUser(summaryRequest).toPromise()
            .then((data: any) => {
                this.groupReport = data;
                let averageScore: any = 0;
                let averageTime = 0;
                data.forEach((report) => {
                    averageTime += report.totalTimespent;
                    averageScore += report.score;
                    report.totalTimespent = that.formatTime(report.totalTimespent);
                    report.name = this.reportSummary.name;
                    that.summarizerService.getLearnerAssessmentDetails(summaryRequest).toPromise()
                        .then(reportsMap => {
                            const data1 = reportsMap.get(report.uid);
                            const rows = data1.reportDetailsList.map(row => {
                                return {
                                    'index': 'Q' + (('00' + row.qindex).slice(-3)),
                                    'result': row.score + '/' + row.maxScore,
                                    'timespent': this.formatTime(row.timespent),
                                    'qdesc': row.qdesc,
                                    'score': row.score,
                                    'maxScore': row.maxScore,
                                    'qtitle': row.qtitle,
                                    'qid': row.qid,
                                    'name': report.userName,
                                    'timestamp': report.createdAt,
                                };
                            });
                            report.assessmentData = rows;
                        })
                        .catch(() => {
                            loader.dismiss();
                        });
                });
                this.response = data;
                this.responseByUser = data;
                averageScore = (averageScore / data.length).toFixed(2);
                averageTime = averageTime / data.length;
                this.appGlobalService.setAverageTime(averageTime);
                this.appGlobalService.setAverageScore(averageScore);
                const details = {
                    'uiRows': data,
                    totalScore: averageScore,
                    uiTotalTime: that.formatTime(averageTime),
                    fromGroup: true,
                    fromUser: false,
                    questionsScore: this.reportSummary.totalQuestionsScore
                };
                that.zone.run(() => {
                    loader.dismiss();
                    that.fromUserAssessment = details;
                });

            })
              .catch(() => {
                    loader.dismiss();
                });
        } else
            if (event === 'questions') {
                this.reportType = event;
                loader.present();
                this.summarizerService.getReportByQuestions(summaryRequest).toPromise()
                .then((data: any) => {
                    this.response = data;
                    let averageTime = 0;
                    let averageScore: any = 0;
                    data.forEach((question) => {
                        question.index = 'Q' + (('00' + question.qindex).slice(-3));
                        averageTime += question.time_spent;
                        averageScore += question.maxScore;
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
                })
                  .catch(() => {
                        loader.dismiss();
                    });
            }
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

    formatTime(time: number): string {
        const mm = Math.floor(time / 60);
        const ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ('0' + mm)) + ':' + (ss > 9 ? ss : ('0' + ss));
    }
    convertToCSV() {
        let csv: any = '';
        let line: any = '';
        const that = this;
        const values = this.responseByUser;
        const anzahlTeams = values.length;
        const filexptime = this.datePipe.transform(new Date(this.exptime), 'dd-MM-yyyy hh:mm:ss a');
        // if (this.response && this.response[0].hasOwnProperty('assessmentData')) {
        const contentstarttime = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss a');
        // Header
        for (let m = 0; m < anzahlTeams; m++) {
            line += 'Device ID' + ',' + this.deviceId + '\n';
            line += 'Group name (Group ID)' + ',' + this.groupinfo.name + '(' + this.groupinfo.gid + ')' + '\n';
            line += 'Content name (Content ID)' + ',' + values[m].name + '(' + values[m].contentId + ')' + '\n';
            line += 'Content started time' + ',' + contentstarttime + '\n';
            line += 'Average Time' + ',' + this.formatTime(this.appGlobalService.getAverageTime()) + '\n';
            line += 'Average Score' + ',' + this.appGlobalService.getAverageScore() + '\n';
            line += 'File export time' + ',' + filexptime + '\n';
            line += '\n\n';
            line += 'Name' + ',';
            line += 'Time' + ',';
            line += 'Score' + '\n';


            for (let i = 0; i < this.groupReport.length; i++) {
                line += '\"' + this.groupReport[i].userName + '\"' + ',';
                line += '\"' + this.groupReport[i].totalTimespent + '\"' + ',';
                line += '\"' + this.groupReport[i].score + '\"' + '\n';
            }
            line += '\n\n';
            line += 'User name' + ',';
            line += 'UserID' + ',';
            line += 'Question#' + ',';
            line += 'QuestionId' + ',';
            line += 'Score' + ',';
            line += 'Time' + '\n';
            break;

        }
        line += '\n';
        // Group Report

        // Teams
        for (let k = 0; k < values.length; k++) {
            for (let j = 0; j < values[k].assessmentData.length; j++) {
                line += '\"' + values[k].userName + '\"' + ',';
                line += '\"' + values[k].uid + '\"' + ',';
                line += '\"' + values[k].assessmentData[j].qtitle + '\"' + ',';
                line += '\"' + values[k].assessmentData[j].qid + '\"' + ',';
                line += '\"' + ' ' + values[k].assessmentData[j].score + '/' + values[k].assessmentData[j].maxScore + '\"' + ',';
                line += '\"' + values[k].assessmentData[j].timespent + '\"' + '\n';
            }
            line += '\n\n';
        }
        // } else {
        //     const contentstarttime11 = this.datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm:ss a');
        //     for (let n = 0; n < anzahlTeams; n++) {
        //         line += 'Device ID' + ',' + this.deviceId + '\n';
        //         line += 'Group name (Group ID)' + ',' + this.groupinfo.name + '(' + this.groupinfo.gid + ')' + '\n';
        //         line += 'Content name (Content ID)' + ',' + values[n].qtitle + '(' + values[n].content_id + ')' + '\n';
        //         line += 'Content started time' + ',' + contentstarttime11 + '\n';
        //         line +=  'Average Time' + ',' +  this.formatTime(this.appGlobalService.getAverageTime()) + '\n';
        //         line += 'Average Score' + ',' + this.appGlobalService.getAverageScore() + '\n';
        //         line += 'File export time' + ',' + filexptime + '\n';
        //         line += '\n\n';
        //         line += 'User name' + ',';
        //         line += 'UserID' + ',';
        //         line += 'Question' + ',';
        //         line += 'QuestionId' + ',';
        //         line += 'Score' + ',';
        //         line += 'Time' + '\n';
        //         break;
        //     }
        //     line += '\n';
        //     for (let p = 0; p < anzahlTeams; p++) {
        //         line += values[p].users.get(values[p].uid) + ',';
        //         line += values[p].uid + ',';
        //         line += values[p].qtitle + ',';
        //         line += values[p].qid + ',';
        //         line += ' ' + values[p].score + '/' + values[p].max_score + ',';
        //         line += this.formatTime(values[p].time_spent) + '\n';
        //     }
        // }

        csv += line + '\n';
        return csv;
    }
    importcsv() {
    this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.DOWNLOAD_REPORT_CLICKED,
        Environment.USER,
        PageId.REPORTS_GROUP_ASSESMENT_DETAILS, undefined,
        );
        this.exptime = new Date().getTime();
        const csv: any = this.convertToCSV();
        const combinefilename = this.deviceId + '_' + this.groupinfo.gid + '_' + this.reportSummary.contentId + '_' + this.exptime + '.csv';
        this.file.writeFile(this.downloadDirectory, combinefilename, csv)
            .then(
                _ => {
                    this.commonUtilService.showToast(this.translateMessage('CSV_DOWNLOAD_SUCCESS', combinefilename), false, 'custom-toast');
                }
            )
            .catch(
                () => {
                    this.file.writeExistingFile(this.downloadDirectory, combinefilename, csv)
                        .then(_ => {
                            this.commonUtilService.showToast(this.translateMessage('CSV_DOWNLOAD_SUCCESS', combinefilename),
                                false, 'custom-toast');
                        })
                        .catch();
                }
            );
    }

}
