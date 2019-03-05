import { CommonUtilService } from './../../service/common-util.service';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the ViewAllCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-all-card',
  templateUrl: 'view-all-card.html'
})
export class ViewAllCardComponent {

  text: string;
  @Input() content: any;
  @Input() type: any;
  @Input() sectionName: any;

  constructor(
    public commonUtilService: CommonUtilService
  ) {
    console.log('Hello ViewAllCardComponent Component');
    this.text = 'Hello World';
  }


}
