import { Popover } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, PopoverController } from 'ionic-angular';

import { CreateGroupPage } from './../create-group/create-group';
import { UsersPage } from './../users/users';
import { GroupMemberPage } from '../group-member/group-member';
import { CreateuserPage } from '../createuser/createuser';
import { PopoverPage } from '../popover/popover';

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
  isUserSelected: number = -1;
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
    }
  ];
  groupList: Array<any> = [
    {
      groupName: 'English Group',
      noOfUsers: '10',
      grade: 'Grade 2'
    },
    {
      groupName: 'Hindi Group',
      noOfUsers: '8',
      grade: 'Grade 5'
    },
    {
      groupName: 'Marathi Group',
      noOfUsers: '5',
      grade: 'Grade 1'
    }
  ];

  userType: string;
  selectedUserIndex: number = -1;
  userProfile = {
    id: 'something',
    firstName: 'Harish',
    lastName: 'Bookwala',
    grade:"CLASS 4A",
    userType: 'teacher',
    avatar: 'assets/imgs/ic_businessman.png'
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public popOverCtrl: PopoverController,
    public zone: NgZone,
    public popoverCtrl: PopoverController
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

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, {
      edit: function() {
          alert('yay');
          popover.dismiss()
          },
        delete: function(){
          alert('delete clicked');
          popover.dismiss()
        },
      });
    popover.present({
      ev: myEvent
    });
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

  selectUser(index: number, name: string) {
    this.isUserSelected = -1;
    this.zone.run(() => {
      this.selectedUserIndex = index;
    });
    console.log("Clicked list name is ", name);
  }

  onSegmentChange(event) {
    this.isUserSelected = -1;
    this.zone.run(() => {
      this.selectedUserIndex = -1;
    })
    console.log("Event", event);
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
