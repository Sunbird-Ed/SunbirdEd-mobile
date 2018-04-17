
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { ContainerService} from 'sunbird';
import { GuestEditProfilePage } from '../guest-edit.profile/guest-edit.profile';
import { SignInCardComponent } from './../../component/sign-in-card/sign-in-card';


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

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
  }

  init(containerService: ContainerService) {
    containerService.addTab({ root: GuestProfilePage, label: "PROFILE", icon: "profile", index: 4 })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguageSettingPage');
  }

  editGuestProf() {
    this.navCtrl.push(GuestEditProfilePage);
  }


}
