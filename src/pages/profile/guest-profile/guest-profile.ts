import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Events, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { GuestEditProfilePage } from './../guest-edit.profile/guest-edit.profile';
import { SignInCardComponent } from './../../../component/sign-in-card/sign-in-card';
import { OverflowMenuComponent } from "./../overflowmenu/menu.overflow.component";
import { ProfileService } from 'sunbird';

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})

export class GuestProfilePage {

  imageUri: string = "assets/imgs/ic_profile_default.png";
  list: Array<String> = ['SETTINGS'];

  /* Temporary Language Constants */
  userName: string = "Teacher";
  profileName: string = "Guest 1";
  board: string = "";
  grade: string = "";
  medium: string = "";
  subjects: string = "";
  profile: any = {};

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {
    // TODO: Need to make an get Profile user details API call.
    this.refreshProfileData();
    this.events.subscribe('refresh:profile', () => {
      this.refreshProfileData();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguageSettingPage');
  }

  refreshProfileData(refresher: any = false) {
    let loader = this.getLoader();
    loader.present();
    this.profileService.getCurrentUser((res: any) => {
      this.profile = JSON.parse(res);
      setTimeout(() => {
        if (refresher) refresher.complete();
        loader.dismiss();
      }, 500);
      console.log("Response", res);
    },
      (err: any) => {
        loader.dismiss();
        console.log("Err1", err);
      });
  }
  editGuestProfile() {
    this.navCtrl.push(GuestEditProfilePage, {
      profile: this.profile
    });
  }

  /**
   * To show popover menu
   * @param {object} event
   */
  showOverflowMenu(event) {
    this.popoverCtrl.create(OverflowMenuComponent, {
      list: this.list
    }, {
        cssClass: 'box'
      }).present({
        ev: event
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

}
