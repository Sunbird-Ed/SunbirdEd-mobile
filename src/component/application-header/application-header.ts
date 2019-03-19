import { Component, Input } from '@angular/core';

/**
 * Generated class for the ApplicationHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'application-header',
  templateUrl: 'application-header.html'
})
export class ApplicationHeaderComponent {

  @Input() searchIcon: any = false;
  @Input() notificationIcon: any = false;
  @Input() profileIcon: any = false;

  constructor() {
    console.log('searchIcon', this.searchIcon);
  }

}
