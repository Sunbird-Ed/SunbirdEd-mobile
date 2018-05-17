import { boardList } from './../../../config/framework.filters';
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Events, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { GuestEditProfilePage } from './../guest-edit.profile/guest-edit.profile';
import { SignInCardComponent } from './../../../component/sign-in-card/sign-in-card';
import { OverflowMenuComponent } from "./../overflowmenu/menu.overflow.component";
import { ProfileService, FrameworkDetailsRequest, FrameworkService } from 'sunbird';

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
  boards: string = "";
  grade: string = "";
  medium: string = "";
  subjects: string = "";
  profile: any = {};

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private events: Events,
    private frameworkService: FrameworkService
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
      this.getFrameworkDetails();
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

  getFrameworkDetails(): void {
    let req: FrameworkDetailsRequest = {
      defaultFrameworkDetails: true
    };

    this.frameworkService.getFrameworkDetails(req,
      (res: any) => {
        let categories = JSON.parse(JSON.parse(res).result.framework).categories;
        let boardList = [];
        this.profile.board && this.profile.board.length && categories[0].terms.forEach(element => {
          if(_.includes(this.profile.board, element.code)) {
            boardList.push(element.name);
          }
        });
        this.boards = this.arrayToString(boardList);
      },
      (error: any) => {

      })
  }

  /**
   * Method to convert Array to Comma separated string
   * @param {Array<string>} stringArray
   * @returns {string}
   */
  arrayToString(stringArray: Array<string>): string {
    return stringArray.join(", ");
  }

}
