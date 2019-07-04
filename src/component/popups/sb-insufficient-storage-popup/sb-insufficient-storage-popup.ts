import { Component } from '@angular/core';
import { NavParams, ViewController, App } from 'ionic-angular';
import { StorageSettingsPage } from '@app/pages/storage-settings/storage-settings';

@Component({
  selector: 'sb-insufficient-storage-popup',
  templateUrl: 'sb-insufficient-storage-popup.html'
})
export class SbInsufficientStoragePopupComponent {
  sbPopoverHeading = '';
  sbPopoverMessage = '';

  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private app: App) {
    this.initParams();
  }

  private initParams() {
    this.sbPopoverHeading = this.navParams.get('sbPopoverHeading');
    this.sbPopoverMessage = this.navParams.get('sbPopoverMessage');
  }

  closePopover() {
    this.viewCtrl.dismiss();
  }

  navigateToStorageSettings() {
    this.viewCtrl.dismiss();
    this.app.getActiveNav().push(StorageSettingsPage);
  }

}
