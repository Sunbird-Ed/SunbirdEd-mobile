import { Component, Input } from '@angular/core';

/**
 * Generated class for the NotificationItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.html'
})
export class NotificationItemComponent {

  text: string;
  isExpanded = false;

  @Input('itemData') itemData;
  constructor() {
    console.log('Hello NotificationItemComponent Component');
    this.text = 'Hello World';
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

}
