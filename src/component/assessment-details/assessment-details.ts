import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { InteractSubtype, PageId, InteractType, Environment, TelemetryObject, ObjectType } from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

@Component({
  selector: 'assessment-details',
  templateUrl: './assessment-details.html'
})
export class AssessmentDetailsComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController,
    private telemetryGeneratorService: TelemetryGeneratorService) {
    this.showResult = true;
  }

  showResult: boolean;
  @Input() assessmentData: any;
  @Input() columns: any;
  @Output() showQuestionFromUser = new EventEmitter<string>();

  ngOnInit() {
    if (this.assessmentData && typeof (this.assessmentData['showResult']) == typeof (true)) {
      this.showResult = this.assessmentData['showResult']
    }
  }

  onActivate(event, showPopup, callback) {
    let subType: string;
    let pageId: string;
    let telemetryObject: TelemetryObject = new TelemetryObject();
    if (this.assessmentData && this.assessmentData.fromUser) {
      pageId = PageId.REPORTS_USER_ASSESMENT_DETAILS;
      subType = InteractSubtype.QUESTION_CLICKED;
      telemetryObject.id = event.row.qid ? event.row.qid : "";
      telemetryObject.type = ObjectType.QUESTION;
    } else if (this.assessmentData && this.assessmentData.fromGroup) {
      pageId = PageId.REPORTS_GROUP_ASSESMENT_DETAILS;
      let row = event.row;
      if (row.userName) {
        subType = InteractSubtype.USER_CLICKED;
        telemetryObject.id = event.row.qid ? event.row.qid : "";
        telemetryObject.type = ObjectType.USER;
      } else if (row.qid) {
        subType = InteractSubtype.QUESTION_CLICKED;
        telemetryObject.id = event.row.uid ? event.row.uid : "";
        telemetryObject.type = ObjectType.QUESTION;
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
      let popover = this.popoverCtrl.create(callback, { 'callback': event }, { cssClass: 'resource-filter' });
      popover.present();
    } else {
      this.showQuestionFromUser.emit();
    }
  }
}
