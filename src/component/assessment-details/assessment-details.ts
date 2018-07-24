import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { ReportAlert } from '../../pages/reports/report-alert/report-alert';

@Component({
  selector: 'assessment-details',
  templateUrl: './assessment-details.html'
})
export class AssessmentDetailsComponent implements OnInit {
  
  constructor(public popoverCtrl: PopoverController) {
    this.showResult = true;
  }

  showResult: boolean;
  @Input() assessmentData: any;
  @Input() columns: any;

  ngOnInit() {
    if(this.assessmentData && typeof(this.assessmentData['showResult']) == typeof(true)){
      this.showResult = this.assessmentData['showResult']
    }
  }

  onActivate(event, clickCallback) {
    let popupCallback = clickCallback || ReportAlert;
    let popover = this.popoverCtrl.create(popupCallback,{'callback': event}, { cssClass: 'resource-filter' });
    popover.present();
  }
}
