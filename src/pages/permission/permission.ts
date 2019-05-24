import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonUtilService } from '@app/service';
import { PageId } from '../../service/telemetry-constants';
import { SunbirdQRScanner } from '../qrscanner';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-permission',
  templateUrl: 'permission.html',
})
export class PermissionPage {

  permissionList = [
    {
      title: this.commonUtilService.translateMessage('CAMERA'),
      icon: 'camera',
      description: this.commonUtilService.translateMessage('CAMERA_PERMISSION_DESCRIPTION')
    },
    {
      title: this.commonUtilService.translateMessage('FILE_MANAGER'),
      icon: 'folder-open',
      description: this.commonUtilService.translateMessage('FILE_MANAGER_PERMISSION_DESCRIPTION')
    },
    {
      title: this.commonUtilService.translateMessage('MICROPHONE'),
      icon: 'mic',
      description: this.commonUtilService.translateMessage('MICROPHONE_PERMISSION_DESCRIPTION')
    }
  ];
  changePermissionAccess = false;
  showScannerPage = false;
  showProfileSettingPage = false;
  showTabsPage = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonUtilService: CommonUtilService, private scannerService: SunbirdQRScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PermissionPage');
  }

  ionViewWillEnter() {
    this.showScannerPage = Boolean(this.navParams.get('showScannerPage'));
    this.showProfileSettingPage = Boolean(this.navParams.get('showProfileSettingPage'));
    this.showTabsPage = Boolean(this.navParams.get('showTabsPage'));
  }

  grantAccess() {
    // If user given camera access and the showScannerPage is ON
    // TODO: Add one more condition for the camera access
    if (this.showScannerPage) {
      this.scannerService.startScanner(PageId.USER_TYPE_SELECTION, true);
    } else if (this.showProfileSettingPage) {
      this.navCtrl.push(ProfileSettingsPage);
    } else {
      this.navCtrl.push(TabsPage, {
        loginMode: 'guest'
      });
    }
  }

  skipAccess() {

  }

}
