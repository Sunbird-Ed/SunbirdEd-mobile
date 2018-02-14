import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  text: string;

  constructor(private navCtrl: NavController) {
    console.log('Hello SettingsComponent Component');
    this.text = 'Hey Fantastic World';
  }

  goBack() {
    this.navCtrl.pop();
  }

  dataSync(){
    this.navCtrl.push(DatasyncPage)
  }

}
