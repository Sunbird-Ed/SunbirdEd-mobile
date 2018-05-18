import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GuestEditProfilePage} from '../profile/guest-edit.profile/guest-edit.profile';
import { TranslateService } from "@ngx-translate/core";
 
/**
 * Generated class for the UsersGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users-groups',
  templateUrl: 'users-groups.html',
})


export class UsersGroupsPage {
  catagories :string;
  profile: any = {};
  gradeList: Array<string> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams ,private translate: TranslateService,) {
     this.catagories="user";
    
  }

  logger = [
    'Harish Bookwalla'
  ]

  onTap(name:string){
    console.log("clicked",name);
  }
  users =[
    
  ]

  nameSelected(name: string){
  
 }
 onConfirm(){
   this.navCtrl.push(GuestEditProfilePage);
   console.log("clicked");
 }
 
}
