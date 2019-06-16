import { Component, Inject, NgZone } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { GroupReportListPage } from '../group-report-list/group-report-list';
import { LearnerAssessmentSummary, ReportSummary, SummarizerService, SummaryRequest, TelemetryObject } from 'sunbird-sdk';
import { UserReportPage } from '../user-report/user-report';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import {
    Environment, ImpressionType, InteractSubtype, InteractType, ObjectType, PageId
} from '../../../service/telemetry-constants';
import { AppHeaderService } from '@app/service';

@Component({
    selector: 'group-list-page',
    templateUrl: 'report-list.html'
})
export class ReportListPage {

    isFromUsers: boolean;
    isFromGroups: boolean;
    uids: Array<string>;
    listOfUsers;
    listOfReports: Array<LearnerAssessmentSummary> = [];
    groupinfo: any;
    handle: string;
    assessment: {};
    reportSummary: ReportSummary;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private loading: LoadingController,
        @Inject('SUMMARIZER_SERVICE') public summarizerService: SummarizerService,
        public ngZone: NgZone,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private headerService: AppHeaderService) {

    }

    ionViewDidLoad() {
        this.headerService.hideHeader();
        this.telemetryGeneratorService.generateImpressionTelemetry(
            ImpressionType.VIEW, '',
            PageId.REPORTS_ASSESMENT_CONTENT_LIST,
            Environment.USER
        );
        this.isFromUsers = this.navParams.get('isFromUsers');
        this.isFromGroups = this.navParams.get('isFromGroups');
        this.uids = this.navParams.get('uids');
        this.handle = this.navParams.get('handle');
        this.groupinfo = this.navParams.get('group');
        console.log(this.groupinfo);
        const loader = this.loading.create({
            spinner: 'crescent'
        });
        loader.present();

        const summaryRequest: SummaryRequest = {
            qId: '',
            uids: this.uids,
            contentId: '',
            hierarchyData: null,
        };
        this.summarizerService.getSummary(summaryRequest).toPromise()
            .then((list: LearnerAssessmentSummary[]) => {
                this.ngZone.run(() => {
                    loader.dismiss();
                    this.listOfReports = list;
                });
            })
            .catch(err => {
                console.log('getsummary error :', err);
                loader.dismiss();
            });
    }

    formatTime(time: number): string {
        const mm = Math.floor(time / 60);
        const ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ('0' + mm))
            + ':' + (ss > 9 ? ss : ('0' + ss));
    }

    goToGroupReportsList(report: ReportSummary) {
        const telemetryObject = new TelemetryObject(report.contentId, ObjectType.CONTENT, undefined);

        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.CONTENT_CLICKED,
            Environment.USER,
            PageId.REPORTS_ASSESMENT_CONTENT_LIST,
            telemetryObject
        );
        if (this.isFromUsers) {
            this.navCtrl.push(UserReportPage, {
                report: report,
                handle: this.handle
            });
        } else
            if (this.isFromGroups) {
                const uids = this.navParams.get('uids');
                const users = this.navParams.get('users');
                this.navCtrl.push(GroupReportListPage, {
                    report: report,
                    uids: uids,
                    users: users,
                    group: this.groupinfo
                });
            }
    }
}
