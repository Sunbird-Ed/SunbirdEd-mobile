import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { ReportAlert } from '../../pages/reports/report-alert/report-alert';

/**
 * Generated class for the AssessmentDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'assessment-details',
  templateUrl: './assessment-details.html'
})
export class AssessmentDetailsComponent implements OnInit {
  
  constructor(public popoverCtrl: PopoverController) {
  }
  categories: string;
  @Input() assessmentData: any;
  @Input() columns: any;

  ngOnInit() {
    let data = this.assessmentData;   
  }

  // Function to add a custom class to columns
  getCellClass(data) {
    let className: string;
    switch (data.column.prop.toUpperCase()) {
      case "QTITLE":
        className = " datatable-body-cell-qtitle";
        break;
      case "TIMESPENT":
        className = " datatable-body-cell-time";
        break;
      case "RESULT":
        className = " datatable-body-cell-result";
        break;
    }
    return className;
  }

  onActivate(event) {
    let popover = this.popoverCtrl.create(ReportAlert,undefined, { cssClass: 'resource-filter' });
    popover.present({
      ev: event
    });
    console.log('Activate Event', event);
    let data = event.row;
  }



}
