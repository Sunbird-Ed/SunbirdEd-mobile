import { Component } from '@angular/core';
import { Platform, ViewController } from 'ionic-angular';

@Component({
    selector: 'unenroll-alert',
    templateUrl: 'unenroll-alert.html'
})
export class UnenrollAlertComponent {

    backButtonFunc = undefined;

    constructor(public viewCtrl: ViewController, public platform: Platform) {
        // TBD
        this.backButtonFunc = this.platform.registerBackButtonAction(() => {
            console.log('sdsds');
            this.viewCtrl.dismiss();
            this.backButtonFunc();
          }, 10);
    }

    selectOption(canDownload: boolean = false) {
        this.viewCtrl.dismiss(canDownload);
    }
}
