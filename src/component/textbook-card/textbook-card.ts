
import { Component, Input } from '@angular/core';
import { CommonUtilService } from '@app/service';

@Component({
  selector: 'textbook-card',
  templateUrl: 'textbook-card.html'
})
export class TextbookCardComponent {

  defaultImg: string;

  @Input() content: any;
  @Input() layoutName: string;

  constructor(public commonUtilService: CommonUtilService ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }
}
