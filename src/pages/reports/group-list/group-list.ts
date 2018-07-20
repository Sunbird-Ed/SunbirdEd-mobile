import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { GroupReportListPage } from '../group-report-list/group-report-list';
import { TablePage } from '../../table/table';
import { ProfileService, ReportService, ReportSummary } from "sunbird";

@Component({
    selector: 'group-list-page',
    templateUrl: 'group-list.html'
})
export class GroupListPage {

    isFromUsers: boolean;
    isFromGroups: boolean;
    currentUser;
    listOfUsers;
    listOfReports: Array<ReportSummary> = [];

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private loading: LoadingController,
        public reportService: ReportService,
        public ngZone: NgZone) {
    }

    ionViewWillEnter() {
        let loader = this.loading.create({
            spinner: "crescent"
        });
        loader.present();
        this.isFromUsers = this.navParams.get('isFromUsers');
        this.isFromGroups = this.navParams.get('isFromGroups');
        if (this.isFromUsers) {
            this.currentUser = this.navParams.get('currentUser');
            this.reportService.getListOfReports([this.currentUser.uid])
                .then(list => {
                    this.ngZone.run(() => {
                        loader.dismiss();
                        this.listOfReports = list;
                    });
                })
                .catch(err => {
                    loader.dismiss();
                });
        } else if (this.isFromGroups) {
            this.listOfUsers = this.navParams.get('users');
        }
    }

    formatTime(time: number): string {
        var mm = Math.floor(time / 60);
        var ss = Math.floor(time % 60);
        return (mm > 9 ? mm : ("0" + mm))
            + ":" + (ss > 9 ? ss : ("0" + ss));
    }

    goToGroupReportsList(report: ReportSummary) {
        if (this.isFromUsers) {
            this.navCtrl.push(TablePage, {
                report: report
            });
        } else if (this.isFromGroups) {
            // this.navCtrl.push(GroupReportListPage);
        }
    }
}
