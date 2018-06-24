import { Component } from '@angular/core';
import { ReportListPage } from '../reports/report-list/report-list'
import { NavController } from 'ionic-angular';

@Component({
  selector: 'reports-page',
  templateUrl: 'reports.html'
})
export class ReportPage {
  constructor(private navCtrl:NavController) {
  }


  languageSetting(){
    this.navCtrl.push(ReportListPage, {
      isFromSettings: true
    });
  }
}
