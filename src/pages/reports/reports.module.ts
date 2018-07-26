import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportsPage } from './reports';
import { ReportListPage } from '../reports/report-list/report-list'
import { GroupReportAlert } from '../reports/group-report-alert/group-report-alert'
import { GroupReportListPage } from '../reports/group-report-list/group-report-list'
import { ReportAlert } from '../reports/report-alert/report-alert'
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../component/components.module';

@NgModule({
  declarations: [
    ReportsPage,
    GroupReportAlert,
    ReportAlert,
    ReportListPage,
    GroupReportListPage
  ],
  entryComponents: [
    GroupReportAlert,
    ReportsPage,
    ReportListPage,
    ReportAlert,
    GroupReportListPage
  ],
  imports: [
    IonicPageModule.forChild(ReportsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class ReportsPageModule { }
