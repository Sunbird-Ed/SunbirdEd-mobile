import { Component } from '@angular/core';

/**
 * Generated class for the SettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  text: string;

  constructor() {
    console.log('Hello SettingsComponent Component');
    this.text = 'Hey Fantastic World';
  }

}
