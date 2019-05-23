import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonUtilService } from '@app/service';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonUtilService: CommonUtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PermissionPage');
  }

}
