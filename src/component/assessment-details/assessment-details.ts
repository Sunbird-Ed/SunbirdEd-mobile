import { Component, Input,Output, OnInit, EventEmitter } from '@angular/core';
import { PopoverController} from 'ionic-angular';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { InteractType, InteractSubtype, Environment, PageId} from 'sunbird';

@Component({
  selector: 'assessment-details',
  templateUrl: './assessment-details.html'
})
export class AssessmentDetailsComponent implements OnInit {
  
  constructor(public popoverCtrl: PopoverController, private telemetryGeneratorService: TelemetryGeneratorService) {
    this.showResult = true;
  }

  showResult: boolean;
  @Input() assessmentData: any;
  @Input() columns: any;
  @Output() showQuestionFromUser = new EventEmitter<string>();

  ngOnInit() {
    if(this.assessmentData && typeof(this.assessmentData['showResult']) == typeof(true)){
      this.showResult = this.assessmentData['showResult']
    }
  }

  onActivate(event,showPopup, callback) {
    let subType: string;
    let pageId: string;
    if (this.columns[1].prop == 'timespent') {
      subType = InteractSubtype.REPORTS_USER_QUESTION_ROW_CLICKED;
      pageId = PageId.REPORTS_USER_ASSESSMENT;
    } else
    if (this.columns[1].prop == 'totalTimespent') {
      subType = InteractSubtype.REPORTS_GROUP_USER_ROW_CLICKED;
      pageId = PageId.REPORTS_GROUP_ASSESSMENT;
    } else 
    if (this.columns[1].prop == 'max_score') {
      subType = InteractSubtype.REPORTS_GROUP_QUESTION_ROW_CLICKED;
      pageId = PageId.REPORTS_GROUP_ASSESSMENT;
    }
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      subType,
      Environment.USER,
      pageId
    );
    if (showPopup && callback) {
      let popover = this.popoverCtrl.create(callback,{'callback': event}, { cssClass: 'resource-filter' });
      popover.present();
    } else {
      this.showQuestionFromUser.emit();
    }
  }
}
