import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from 'ionic-angular';

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
    if (clickCallback) {
      let popover = this.popoverCtrl.create(clickCallback,{'callback': event}, { cssClass: 'resource-filter' });
      popover.present();
    }
  }
}
