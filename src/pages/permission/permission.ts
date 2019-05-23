import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PermissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-permission',
  templateUrl: 'permission.html',
})
export class PermissionPage {

  permissionList = [
    {
      title: 'Camera',
      icon: 'camera',
      description: 'Camera access is needed for scanning of Sunbird QR codes'
    },
    {
      title: 'File Manager',
      icon: 'folder-open',
      description: 'Storage access is needed for downloading of files and moving content to SD cards'
    },
    {
      title: 'Microphone',
      icon: 'mic',
      description: "Microphone access will be used only in content where you can 'record' your voice. This is used to improve pronunciation of words"
    }
  ];
  changePermissionAccess = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PermissionPage');
  }

}
