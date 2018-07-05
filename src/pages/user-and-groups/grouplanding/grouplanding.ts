import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, PopoverController } from 'ionic-angular';

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
  segmentType: string = "users";
  groupName: string;
  showEmptyUsersMessage: boolean = false;
  showEmptyGroupsMessage: boolean = false;
  usersList: Array<any> = [
    {
      name: 'Harish BookWala',
      userType: 'student',
      grade: 'Grade 2'
    },
    {
      name: 'Nilesh More',
      userType: 'student',
      grade: 'Kindergarten'
    },
    {
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },

  ]
  groupList: Array<string> = [];
  userType: string;
  showStyle: false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public popOverCtrl: PopoverController
  ) {

    /* Check usersList length and show message or list accordingly */
    if (this.usersList && this.usersList.length) {
      this.showEmptyUsersMessage = false;
    } else {
      this.showEmptyUsersMessage = true;
    }

    /* Check usersList length and show message or list accordingly */
    if (this.groupList && this.groupList.length) {
      this.showEmptyGroupsMessage = false;
    } else {
      this.showEmptyGroupsMessage = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrouplandingPage');
  }

  /**
   * Navigates to Create group Page
   */
  createGroup() {
    this.navCtrl.push(CreateGroupPage, {
    });
  }

  /**
   * Navigates to group Members page
   */
  gotToGroupMembersPage() {
    this.navCtrl.push(GroupMemberPage, {
      item: this.groupList
    })
  }

  /**
   * Navigates to Create User Page
   */
  createUser() {
    this.navCtrl.push(CreateuserPage, {})
  }

  /**
   * Shows Prompt for switch Account
   */
  switchAccountPrompt() {
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

  /**
   * Returns Style for the border of the box
   */
  getStyle() {
    if (this.showStyle) {
      return "1px solid #488aff";
    } else {
      return "";
    }
  }

  /**
   * Shows Popover for the edit and delete.
   * @param myEvent
   */
  /* presentPopover(myEvent) {
    let popover = this.popOverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  } */
}
