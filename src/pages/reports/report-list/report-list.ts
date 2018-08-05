import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { GroupReportListPage } from '../group-report-list/group-report-list';
import { ReportService, ReportSummary, ContentService, ContentFilterCriteria, SummarizerContentFilterCriteria, ContentSortCriteria, SortOrder, ImpressionType, Environment, PageId, InteractType, InteractSubtype, ObjectType, TelemetryObject } from "sunbird";
import { UserReportPage } from '../user-report/user-report';
import { ContentType } from '../../../app/app.constant';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';

@Component({
    selector: 'group-list-page',
    templateUrl: 'report-list.html'
})
export class ReportListPage {

    isFromUsers: boolean;
    isFromGroups: boolean;
    uids: Array<string>;
    listOfUsers;
    listOfReports: Array<ReportSummary> = [];

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private loading: LoadingController,
        public reportService: ReportService,
        public ngZone: NgZone,
        private contentService: ContentService,
        private telemetryGeneratorService: TelemetryGeneratorService) {

    }

    ionViewDidLoad() {
        this.telemetryGeneratorService.generateImpressionTelemetry(
            ImpressionType.VIEW, "",
            PageId.REPORTS_ASSESMENT_CONTENT_LIST,
            Environment.USER
        );
        this.isFromUsers = this.navParams.get('isFromUsers');
        this.isFromGroups = this.navParams.get('isFromGroups');
        this.uids = this.navParams.get('uids');

        let loader = this.loading.create({
            spinner: "crescent"
        });
        loader.present();


        const requestParams: SummarizerContentFilterCriteria = {
            contentTypes: ContentType.FOR_LIBRARY_TAB,
            uids: this.uids,
            attachContentAccess: true,
            attachFeedback: true
        };
        this.contentService.getLocalContents(requestParams)
            .then(contentList => {
                this.reportService.getListOfReports(this.uids)
                    .then(list => {
                        this.ngZone.run(() => {
                            loader.dismiss();
                            this.listOfReports = list;
                        });
                    })
                    .catch(err => {
                        loader.dismiss();
                    });
            })
            .catch(err => {
                loader.dismiss();
            });

    }

    ionViewWillEnter() {

    }

    formatTime(time: number): string {
        var mm = Math.floor(time / 60);
        var ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ("0" + mm))
            + ":" + (ss > 9 ? ss : ("0" + ss));
    }

    goToGroupReportsList(report: ReportSummary) {
        let telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = report.contentId;
        telemetryObject.type = ObjectType.CONTENT;

        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.CONTENT_CLICKED,
            Environment.USER,
            PageId.REPORTS_ASSESMENT_CONTENT_LIST,
            telemetryObject
        );
        if (this.isFromUsers) {
            this.navCtrl.push(UserReportPage, {
                report: report
            });
        } else
            if (this.isFromGroups) {
                let uids = this.navParams.get('uids');
                let users = this.navParams.get('users');
                this.navCtrl.push(GroupReportListPage, {
                    report: report,
                    uids: uids,
                    users: users
                });
            }
    }
}
