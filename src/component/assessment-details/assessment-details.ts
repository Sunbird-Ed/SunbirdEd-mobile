import { Component, OnInit, Input } from '@angular/core';

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

  totalTime: string; totalScore: string; categories: string;
  @Input() rows: any;
  @Input() columns: any;

  ngOnInit() {
    let data = this.rows;   
    let totalQuestionMaxScore = data.reduce(function (acc, val) { return acc + val.maxScore; }, 0)
    let totalQuestionScore = data.reduce(function (acc, val) { return acc + val.score; }, 0)
    let totalTimeSpent = data.reduce(function (acc, val) { return acc + val.timespent; }, 0)
    this.totalTime = this.convertTotalTime(totalTimeSpent);
    this.totalScore = totalQuestionScore + '/' + totalQuestionMaxScore;
  }

  convertTotalTime(time: number): string {
    var mm = Math.floor(time / 60);
    var ss = Math.floor(time % 60);
    return (mm > 9 ? mm : ("0" + mm)) + ":" + (ss > 9 ? ss : ("0" + ss));
  }

  // Function to add a custom class to columns
  getCellClass(data) {
    let className: string;
    switch (data.column.prop.toUpperCase()) {
      case "QTITLE":
        className = " datatable-body-cell-qtitle";
        break;
      case "TIME":
        className = " datatable-body-cell-time";
        break;
      case "RESULT":
        className = " datatable-body-cell-result";
        break;
    }
    return className;
  }

  constructor() {
  }

}
