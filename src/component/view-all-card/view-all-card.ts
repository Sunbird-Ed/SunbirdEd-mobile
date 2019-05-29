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
  defaultImg: string;
  @Input() content: any;
  @Input() type: any;
  @Input() sectionName: any;
  @Input() userId: any;

  constructor(
    public commonUtilService: CommonUtilService
  ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }


}
