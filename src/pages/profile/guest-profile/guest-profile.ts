
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { ContainerService } from 'sunbird';
import { GuestEditProfilePage } from './../guest-edit.profile/guest-edit.profile';
import { SignInCardComponent } from './../../../component/sign-in-card/sign-in-card';
import { OverflowMenuComponent } from "./../overflowmenu/menu.overflow.component";

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})

export class GuestProfilePage {

  imageUri: string = "assets/imgs/ic_profile_default.png";
  list: Array<String> = ['SWITCH_ACCOUNT', 'DOWNLOAD_MANAGER', 'SETTINGS', 'SIGN_OUT'];

  /* Temporary Language Constants */
  userName: string = "Teacher";
  profileName: string = "Guest 1";
  board: string = "";
  grade: string = "";
  medium: string = "";
  subjects: string = "";

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
    // TODO: Need to make an get Profile user details API call.
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguageSettingPage');
  }

  editGuestProfile() {
    this.navCtrl.push(GuestEditProfilePage);
  }

  /**
   * To show popover menu
   * @param {object} event
   */
  showOverflowMenu(event) {
    this.popoverCtrl.create(OverflowMenuComponent,{
      list: this.list
    }).present({
      ev: event
    });
  }
}
