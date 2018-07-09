import { Component } from '@angular/core';
import { ReportListPage } from '../report-list/report-list'
import { NavController, NavParams } from 'ionic-angular';
import { GroupReportListPage } from '../group-report-list/group-report-list';
@Component({
    selector: 'group-list-page',
    templateUrl: 'group-list.html'
})
export class GroupListPage {
    report: string = 'users';
    isFromUsers: boolean;
    isFromGroups: boolean;
    constructor(private navCtrl: NavController, private navParams: NavParams) {
    }
    
    goToGroupReportsList() {
        this.isFromUsers = this.navParams.get('isFromUsers');
        this.isFromGroups = this.navParams.get('isFromGroups');

        if (this.isFromUsers) {
            this.navCtrl.push(ReportListPage);
        }
        if (this.isFromGroups) {
            this.navCtrl.push(GroupReportListPage);
        }
    }
}
