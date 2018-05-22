import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GuestEditProfilePage } from '../profile/guest-edit.profile/guest-edit.profile';
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-users-groups',
  templateUrl: 'users-groups.html',
})



export class UsersGroupsPage {

  logger = ['Harish Bookwalla'];

  users = ['Anirudh Deep' , 'Ananya Suresh', 'Ananya Suresh'];

  loggerID = "assets/imgs/ic_businessman.png";

  usersID = "assets/imgs/ic_profile_default.png";

  logger_subValue = "Jawahar Vidya Mandir , Pune";
  
  users_subValue = 'status';

  catagories: string;

  
  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private translate: TranslateService) {

    this.catagories = "user";
  }

  onTap(name: string) {
    console.log("clicked", name);
  }


  nameSelected(name: string) {
    console.log("Clicked list name is ", name);
    }

  onConfirm() {
    this.navCtrl.push(GuestEditProfilePage);
    console.log("clicked");
  }

}
