
import { Component, Input } from '@angular/core';

@Component({
  selector: 'textbook-card',
  templateUrl: 'textbook-card.html'
})
export class TextbookCardComponent {

  defaultImg: string;

  @Input() content: any;
  @Input() layoutName: string;

  constructor() {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }
}
