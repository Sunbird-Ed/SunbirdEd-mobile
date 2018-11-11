import { NavController } from 'ionic-angular/navigation/nav-controller';
import { Component, NgZone } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';
import {
    ReportService, ReportSummary, PageId, Environment, InteractType, InteractSubtype, DeviceInfoService, ProfileType,
    ProfileService, Profile, GroupService
} from 'sunbird';
import { GroupReportAlert } from '../group-report-alert/group-report-alert';
import { TranslateService } from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { AppGlobalService } from '../../../service/app-global.service';
import { ReportListPage } from '../report-list/report-list';
import { UserReportPage } from '../user-report/user-report';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AppVersion } from '@ionic-native/app-version';
import { DatePipe } from '@angular/common';


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
        prop: 'max_score'
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

    constructor(
        private navParams: NavParams,
        private loading: LoadingController,
        private zone: NgZone,
        private transfer: FileTransfer,
        private reportService: ReportService,
        private translate: TranslateService,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private appGlobalService: AppGlobalService,
        private file: File,
        private datePipe: DatePipe,
        private groupService: GroupService,
        private appVersion: AppVersion,
        private profileService: ProfileService,
        private deviceInfoService: DeviceInfoService,
        private socialShare: SocialSharing,
        private navCtrl: NavController) {
    }
    fileTransfer: FileTransferObject = this.transfer.create();
    ionViewWillEnter() {
        this.fetchAssessment(this.reportType, false);
    }
    ionViewDidLoad() {
        this.deviceInfoService.getDeviceID(
            (res: any) => {
                console.log('Device Id: ', res);
                this.deviceId = res;
            },
            (err: any) => {
                console.error('Error', err);
            });
        this.profile = this.appGlobalService.getCurrentUser();
        console.log(this.profile);
        this.groupinfo = this.navParams.get('group');
        console.log(this.groupinfo);
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
                    console.log(report);
                    this.response = report;
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
                    this.response = data;
                    console.log(data);
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
    convertToCSV(teams) {
        // console.log(this.response);
        console.log(teams);
        let csv: any = '';
        let line: any = '';
        const that = this;
        const values = this.response;
        const anzahlTeams = values.length;
        const filexptime = this.datePipe.transform(new Date(this.exptime), 'dd-mm-yyyy hh:mm:ss a');
        const contentstarttime = this.datePipe.transform(new Date(teams[0].timestamp), 'dd-mm-yyyy hh:mm:ss a');
        // Header
        for (let m = 0; m < anzahlTeams; m++) {
            line += 'Device ID' + '\t' + this.deviceId + '\n';
            line += 'Group name (Group ID)' + '\t' + this.groupinfo.name + '(' + this.groupinfo.gid + ')' + '\n';
            line += 'Content name (Content ID)' + '\t' + this.response[0].qtitle + '(' + this.response[0].content_id + ')' + '\n';
            line += 'Content started time' + '\t' + contentstarttime + '\n';
            line += 'File export time' + '\t' + filexptime + '\n';
            line += 'User name' + '\t\t';
            line += 'UserID' + '\t\t';
            line += 'Question' + '\t\t';
            line += 'QuestionId' + '\t\t';
            line += 'Score' + '\t\t';
            line += 'Time' + '\n';
            break;
        }
        // Teams
        console.log(anzahlTeams);
        console.log(values);
        for (let j = 0; j < anzahlTeams - 1; j++) {
            line += this.response[0].userName + '\t\t';
            line += teams[0].uid + '\t\t';
            line += 'Q' + (('00' + values[j].qindex).slice(-3)) + '\t\t';
            line += values[j].qtitle + '\t\t';
            line += values[j].score + '/' + values[j].max_score + '\t\t';
            line += that.formatTime(values[j].time_spent) + '\n';
        }
        csv += line + '\n';
        return csv;
    }
    importcsv() {
        this.exptime = new Date().getTime();
        const csv: any = this.convertToCSV(this.response);
        const combinefilename = this.deviceId + this.groupinfo.gid + this.response[0].content_id + this.exptime + '.csv';
        console.log(combinefilename);
        const fileName = combinefilename;
        this.file.writeFile(this.file.dataDirectory, fileName, csv)
            .then(
                _ => {
                    this.socialShare.share('message', '', this.file.dataDirectory + fileName, '')
                        .then(() => {
                            console.log('shareSheetShare: Success');
                        }).catch(() => {
                            console.error('shareSheetShare: failed');
                        });
                }
            )
            .catch(
                err => {
                    this.file.writeExistingFile(this.file.dataDirectory, fileName, csv)
                        .then(
                            _ => {
                                this.socialShare.share('message', '', this.file.dataDirectory + fileName, '')
                                    .then(() => {
                                        console.log('shareSheetShare: Success');
                                    }).catch(() => {
                                        console.error('shareSheetShare: failed');
                                    });



                                console.log('Success ;-)2' + this.file.dataDirectory);
                            }
                        )
                        .catch(
                            err1 => {
                                alert(err1 + 'Failure' + this.file.dataDirectory + fileName);
                                console.log(err1 + 'Failure' + this.file.dataDirectory + fileName);
                            }
                        );
                }
            );
    }

}
