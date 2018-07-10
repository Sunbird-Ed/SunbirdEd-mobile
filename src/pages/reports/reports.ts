import { Component } from '@angular/core';
//import { ReportListPage } from '../reports/report-list/report-list'
import { NavController } from 'ionic-angular';
import { GroupListPage } from './group-list/group-list';

@Component({
  selector: 'reports-page',
  templateUrl: 'reports.html'
})
export class ReportsPage {
  report: string = 'users';
  constructor(private navCtrl:NavController) {

  }


  goToReportList(){
    this.navCtrl.push(GroupListPage, {
      isFromUsers: true
    });
  }
  goToGroupList(){
    this.navCtrl.push(GroupListPage, {
      isFromGroups:true
    });
}
}
