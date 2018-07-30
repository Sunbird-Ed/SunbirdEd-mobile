import { Component, Input,Output, OnInit, EventEmitter } from '@angular/core';
import { PopoverController} from 'ionic-angular';

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
  @Output() showQuestionFromUser = new EventEmitter<string>();

  ngOnInit() {
    if(this.assessmentData && typeof(this.assessmentData['showResult']) == typeof(true)){
      this.showResult = this.assessmentData['showResult']
    }
  }

  onActivate(event,showPopup, callback) {
    if (showPopup && callback) {
      let popover = this.popoverCtrl.create(callback,{'callback': event}, { cssClass: 'resource-filter' });
      popover.present();
    } else {
      this.showQuestionFromUser.emit();
    }
  }
}
