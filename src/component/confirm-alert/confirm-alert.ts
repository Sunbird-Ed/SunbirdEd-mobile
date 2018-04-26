import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'confirm-alert',
  templateUrl: 'confirm-alert.html'
})
export class ConfirmAlertComponent {

  backButtonFunc = undefined;
  constructor(public viewCtrl: ViewController, public platform: Platform) {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }

  selectOption(canDownload: boolean = false) {
    this.viewCtrl.dismiss(canDownload);
  }
}
