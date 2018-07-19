import { GroupDetailsPage } from './group-details/group-details';
import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform,
  PopoverController
} from 'ionic-angular';
import { CreateGroupPage } from './create-group/create-group';
import { PopoverPage } from './popover/popover';
import {
  ProfileService,
  GroupService,
  ProfileRequest,
  Profile,
  Group
} from 'sunbird';
import { GuestEditProfilePage } from '../profile/guest-edit.profile/guest-edit.profile';
import { IonicApp } from 'ionic-angular';
import { ShareUserAndGroupPage } from './share-user-and-groups/share-user-and-groups';


@IonicPage()
@Component({
  selector: 'page-user-and-groups',
  templateUrl: 'user-and-groups.html',
})
export class UserAndGroupsPage {

  segmentType: string = "users";
  groupName: string;
  showEmptyUsersMessage: boolean = false;
  showEmptyGroupsMessage: boolean = true;
  isLoggedInUser: boolean = false;
  currentUserId: string;

  userList: Array<Profile> = [];
  groupList: Array<Group> = [];

  unregisterBackButton: any;
  profileDetails: any;

  userType: string;
  selectedUserIndex: number = -1;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private popOverCtrl: PopoverController,
    private zone: NgZone,
    private profileService: ProfileService,
    private groupService: GroupService,
    private platform: Platform,
    private ionicApp: IonicApp,
  ) {

    /* Check userList length and show message or list accordingly */
    this.showEmptyUsersMessage = (this.userList && this.userList.length) ? false : true;
    this.currentUserId = this.navParams.get('userId');
    this.isLoggedInUser = this.navParams.get('isLoggedInUser');
    this.profileDetails = this.navParams.get('profile');
    console.log(this.profileDetails);
  }

  ionViewWillEnter() {
    this.zone.run(() => {
      this.getAllProfile();
      this.getAllGroup();
    });

    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 11);
  }

  dismissPopup() {
    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

  presentPopover(myEvent, index, name) {
    let self = this;
    let popover = this.popOverCtrl.create(PopoverPage, {
      edit: function () {
        self.navCtrl.push('CreateGroupPage', {
          groupInfo: self.groupList[index]
        });
        popover.dismiss()
      },
      delete: function ($event) {
        self.deleteGroupConfirmBox(index, name);
        popover.dismiss()
      },
      isCurrentUser: false
    },
      {
        cssClass: 'user-popover'
      });
    popover.present({
      ev: myEvent
    });
  }

  getAllProfile() {
    this.zone.run(() => {
      let profileRequest: ProfileRequest = {
        local: true
      };
      this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
        if (profiles && profiles.length) {
          this.showEmptyUsersMessage = false;
          this.userList = JSON.parse(profiles);
        } else {
          this.showEmptyUsersMessage = true;
        }
        console.log("UserList", profiles);
      }).catch((error) => {
        console.log("Something went wrong while fetching user list", error);
      });
    })
  }

  getAllGroup() {
    this.zone.run(() => {
      this.groupService.getAllGroup().then((groups) => {
        if (groups.result && groups.result.length) {
          this.showEmptyGroupsMessage = false;
          this.groupList = groups.result;
        } else {
          this.showEmptyGroupsMessage = true;
        }
        console.log("GroupList", groups);
      }).catch((error) => {
        console.log("Something went wrong while fetching data", error);
      });
    })
  }

  /**Navigates to group details page */
  goToGroupDetail() {
    this.navCtrl.push(GroupDetailsPage);
  }

  /**
   * Navigates to Create group Page
   */
  createGroup() {
    this.navCtrl.push('CreateGroupPage', {
    });
  }

  goToSharePage() {
    this.navCtrl.push(ShareUserAndGroupPage, {
      isNewUser: true
    });
  }
  
  /**
   * Navigates to group Details page
   */
  gotToGroupDetailsPage() {
    this.navCtrl.push(GroupDetailsPage, {
      item: this.groupList
    })
  }

  /**
   * Navigates to Create User Page
   */
  createUser() {
    this.navCtrl.push(GuestEditProfilePage, {
      isNewUser: true
    });
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
      title: this.translateMessage('ARE_YOU_SURE_YOU_WANT_TO_SWITCH_ACCOUNT'),
      mode: 'wp',
      message: this.translateMessage('YOU_WILL_BE_SIGNED_OUT_FROM_YOUR_CURRENTLY_LOGGED_IN_ACCOUNT'),
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

  /** Delete alert box */
  deleteGroupConfirmBox(index, name) {
    let self = this;
    let alert = this.alertCtrl.create({
      title: this.translateMessage('GROUP_DELETE_CONFIRM', name),
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
          text: this.translateMessage('Yes'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            self.groupService.deleteGroup(self.groupList[index].gid).then((success) => {
              console.log(success);
              self.groupList.splice(index, 1);
            }).catch((error) => {
              console.log(error);
            })
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
