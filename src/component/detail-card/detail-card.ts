import { Component } from '@angular/core';

/**
 * Generated class for the DetailCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'detail-card',
  templateUrl: 'detail-card.html'
})
export class DetailCardComponent {

  text: string;

  constructor() {
    console.log('Hello DetailCardComponent Component');
    this.text = 'Hello World';
  }

}
