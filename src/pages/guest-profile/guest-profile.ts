import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OnboardingPage } from '../onboarding/onboarding';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';
import { BasePlugin, ContainerService} from 'sunbird';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { GuestEditProfilePage } from '../guest-edit.profile/guest-edit.profile';

/**
 * Generated class for the GuestProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})
export class GuestProfilePage {

  imageUri: string = "assets/imgs/ic_profile_default.png";
  list: Array<String> = ['SWITCH_ACCOUNT', 'DOWNLOAD_MANAGER', 'SETTINGS', 'SIGN_OUT'];
  lastLoginTime: string = "Last login time:Feb 13,2018,3:20:05 PM";
  userName: string = "Teacher";
  profileName: string = "Guest 1";
  sunbird: string = "Sunbird";
  profileCompletionText: string = "Your profile is 82% completed";
  progValue: string = "82";
  profDesc: string = "Here are the detailed description of the profile fdhfh Here are the detailed description of the profile fdhfh";
  uncompletedDetails: string = "+ Add Experience";

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
