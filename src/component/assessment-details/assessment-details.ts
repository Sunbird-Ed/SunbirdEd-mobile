import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import {TelemetryObject, ReportSummary} from 'sunbird-sdk';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { UserReportPage } from '../../pages/reports/user-report/user-report';
import { NavController } from 'ionic-angular';
import {PageId, InteractSubtype, ObjectType, InteractType, Environment} from '../../service/telemetry-constants';

@Component({
  selector: 'assessment-details',
  templateUrl: './assessment-details.html'
})
export class AssessmentDetailsComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private navCtrl: NavController) {
    this.showResult = true;
  }

  showResult: boolean;
  @Input() assessmentData: any;
  @Input() columns: any;
  @Output() showQuestionFromUser = new EventEmitter<string>();

  ngOnInit() {
    if (this.assessmentData && typeof (this.assessmentData['showResult']) === typeof (true)) {
      this.showResult = this.assessmentData['showResult'];
    }
  }

  onActivate(event, showPopup, callback) {
    let subType: string;
    let pageId: string;
    let telemetryObject: TelemetryObject;
    if (this.assessmentData && this.assessmentData.fromUser) {
      pageId = PageId.REPORTS_USER_ASSESMENT_DETAILS;
      subType = InteractSubtype.QUESTION_CLICKED;

      telemetryObject = new TelemetryObject(event.row.qid ? event.row.qid : '', ObjectType.QUESTION, undefined);

    } else if (this.assessmentData && this.assessmentData.fromGroup) {
      pageId = PageId.REPORTS_GROUP_ASSESMENT_DETAILS;
      const row = event.row;
      if (row.userName) {
        subType = InteractSubtype.USER_CLICKED;
        telemetryObject = new TelemetryObject(event.row.qid ? event.row.qid : '', ObjectType.USER, undefined);

        const reportSummaryRequest: Partial<ReportSummary> = {
          name: row.name,
          uid: row.uid,
          contentId: row.contentId,
          totalQuestionsScore: this.assessmentData.questionsScore
        };
        this.navCtrl.push(UserReportPage, { 'report': reportSummaryRequest });
      } else if (row.qid) {
        subType = InteractSubtype.QUESTION_CLICKED;
        telemetryObject = new TelemetryObject(event.row.uid ? event.row.uid : '', ObjectType.QUESTION, undefined);
      }
    }

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      subType,
      Environment.USER,
      pageId,
      telemetryObject
    );
    if (showPopup && callback) {
      const popover = this.popoverCtrl.create(callback, { 'callback': event }, { cssClass: 'resource-filter' });
      popover.present();
    } else {
      this.showQuestionFromUser.emit();
    }
  }
}
