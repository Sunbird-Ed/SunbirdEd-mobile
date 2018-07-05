import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { CreateGroupPage } from './../create-group/create-group';
import { UsersPage } from './../users/users';
import { GroupMemberPage } from '../group-member/group-member';
import { CreateuserPage } from '../createuser/createuser';

@IonicPage()
@Component({
  selector: 'page-grouplanding',
  templateUrl: 'grouplanding.html',
})
export class GrouplandingPage {
  segmentType: string = "Groups";
  value: Array<any> = [];
  groupName: string;
  isShow: boolean = false;

  profession: any;
  fullname: any;
  showStyle: false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService, public actionSheetCtrl: ActionSheetController) {
    this.segmentType = "Groups";
    this.value = this.navParams.get('item');
    if (this.value) {
      this.isShow = true;
      this.groupName = this.value[0]
    }
    else {
      this.isShow = false;
    }

    if (this.value) {
      this.isShow = false;
      this.fullname = this.value[0].fullname;
      if (this.value[0].student == true) {
        this.profession = "student";
      }
      else {
        this.profession = "teacher";
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrouplandingPage');
  }

  createGroup() {
    this.navCtrl.push(CreateGroupPage, {
    });
  }

  members() {
    this.navCtrl.push(GroupMemberPage, {
      item: this.value
    })
  }

  users() {
    this.navCtrl.push(UsersPage, {})
  }

  createUser() {
    this.navCtrl.push(CreateuserPage, {})
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to switch accounts you will be signed out from your currently logged account ',
      buttons: [
        {
          text: 'CANCEL',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'OKAY',
          handler: () => {
            console.log('Archive clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  getStyle() {
    if (this.showStyle) {
      return "1px solid #488aff";
    } else {
      return "";
    }
  }
}
