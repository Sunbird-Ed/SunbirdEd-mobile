import { Component } from '@angular/core';

/**
 * Generated class for the SearchCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'search-card',
  templateUrl: 'search-card.html'
})
export class SearchCardComponent {

  text: string;

  constructor() {
    console.log('Hello SearchCardComponent Component');
    this.text = 'Hello World';
  }

}
