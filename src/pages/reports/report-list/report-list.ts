import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { GroupReportListPage } from '../group-report-list/group-report-list';
import { ReportService, ReportSummary, ImpressionType, PageId, Environment, InteractType, InteractSubtype } from "sunbird";
import { UserReportPage } from '../user-report/user-report';
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
        private telemetryGeneratorService: TelemetryGeneratorService) {
    }

    ionViewWillEnter() {
        this.telemetryGeneratorService.generateImpressionTelemetry(
            ImpressionType.VIEW, "", PageId.REPORTS_CONTENT_LIST, Environment.USER, "", ""
        );
        let loader = this.loading.create({
            spinner: "crescent"
        });
        loader.present();
        this.isFromUsers = this.navParams.get('isFromUsers');
        this.isFromGroups = this.navParams.get('isFromGroups');
        this.uids = this.navParams.get('uids');
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
    }

    formatTime(time: number): string {
        var mm = Math.floor(time / 60);
        var ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ("0" + mm))
            + ":" + (ss > 9 ? ss : ("0" + ss));
    }

    goToGroupReportsList(report: ReportSummary) {
        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.REPORTS_CONTENT_CLICKED,
            Environment.USER,
            PageId.REPORTS_CONTENT_LIST
        );
        if (this.isFromUsers) {
            this.navCtrl.push(UserReportPage, {
                report: report
            });
        } else
        /* istanbul ignore else */
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
