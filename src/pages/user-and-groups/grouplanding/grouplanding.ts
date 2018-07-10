import { Popover } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';

import { CreateGroupPage } from './../create-group/create-group';
import { GroupMemberPage } from '../group-member/group-member';
import { CreateuserPage } from '../createuser/createuser';
import { PopoverPage } from '../popover/popover';
import { GroupService, Group } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-grouplanding',
  templateUrl: 'grouplanding.html',
})
export class GrouplandingPage {
  segmentType: string = "users";
  groupName: string;
  showEmptyUsersMessage: boolean = false;
  showEmptyGroupsMessage: boolean = true;
  isLoggedInUser: boolean = false;
  currentUserId: string;
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
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    },{
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    }
  ];

  groupList: Array<any> = [];

  userType: string;
  selectedUserIndex: number = -1;
  userProfile = {
    id: 'something',
    firstName: 'Harish',
    lastName: 'Bookwala',
    grade: "CLASS 4A",
    userType: 'teacher',
    avatar: 'assets/imgs/ic_businessman.png'
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public popOverCtrl: PopoverController,
    public zone: NgZone,
    public popoverCtrl: PopoverController,
    public groupService: GroupService
  ) {

    /* Check usersList length and show message or list accordingly */
    this.showEmptyUsersMessage = (this.usersList && this.usersList.length) ? false : true;
    this.currentUserId = this.navParams.get('userId');
    this.isLoggedInUser = this.navParams.get('isLoggedInUser');
  }

  ionViewWillEnter() {
    this.getGroupsList();
  }

  presentPopover(myEvent, userId) {

    let popover = this.popoverCtrl.create(PopoverPage, {
      edit: function () {
        alert('yay');
        popover.dismiss()
      },
      delete: function () {
        alert('delete clicked');
        popover.dismiss()
      },
      isCurrentUser: false
    } , {
      cssClass: 'user-popover'});
    popover.present({
      ev: myEvent
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrouplandingPage');
  }

  getGroupsList() {
    this.groupService.getAllGroup().then((groups) => {
      if (groups.result && groups.result.length) {
        this.showEmptyGroupsMessage = false;
        this.groupList = groups.result;
      } else {
        this.showEmptyGroupsMessage = true;
      }
      console.log("GroupList", groups);
      //this.groupList = groups;
    }).catch((error) => {
      console.log("Something went wrong while fetching data", error);
    });
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
    this.zone.run(() => {
      this.selectedUserIndex = (this.selectedUserIndex === index) ? -1 : index;
    });
    console.log("Clicked list name is ", name);
  }

  onSegmentChange(event) {
    this.zone.run(() => {
      this.selectedUserIndex = -1;
    })
    console.log("Event", event);
  }

  /**
   * Shows Prompt for switch Account
   */
  switchAccountConfirmBox() {
    let alert = this.alertCtrl.create({
      title: this.translateMessage('GROUP_DELETE_CONFIRM'),
      mode: 'wp',
      message: this.translateMessage('GROUP_DELETE_CONFIRM_MESSAGE'),
      cssClass: 'confirm-alert',
      buttons: [
        {
          text: this.translateMessage('CANCEL'),
          role: 'cancel',
          cssClass: 'alert-btn-cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translateMessage('OKAY'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst Message Constant to be translated
   * @param {string} field Field to be place in language string
   * @returns {string} field Translated Message
   */
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}
