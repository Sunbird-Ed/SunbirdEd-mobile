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
  PopoverController,
  ToastController
} from 'ionic-angular';
import { CreateGroupPage } from './create-group/create-group';
import { PopoverPage } from './popover/popover';
import {
  ProfileService,
  GroupService,
  ProfileRequest,
  Profile,
  Group,
  ContainerService,
  ProfileType,
  TabsPage,
  SharedPreferences,
  OAuthService,
  GroupRequest
} from 'sunbird';
import { GuestEditProfilePage } from '../profile/guest-edit.profile/guest-edit.profile';
import { IonicApp } from 'ionic-angular';
import { ShareUserAndGroupPage } from './share-user-and-groups/share-user-and-groups';
import { Events } from 'ionic-angular';
import { AppGlobalService } from '../../service/app-global.service';
import { initTabs, GUEST_STUDENT_TABS, GUEST_TEACHER_TABS } from '../../app/module.service';
import { App } from 'ionic-angular';
import { group } from '@angular/core/src/animation/dsl';
import { Network } from '@ionic-native/network';


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
  currentGroupId: string;

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
    private event: Events,
    private appGlobalService: AppGlobalService,
    private container: ContainerService,
    private preferences: SharedPreferences,
    private app: App,
    private oauth: OAuthService,
    private network: Network,
    private toastCtrl: ToastController
  ) {

    /* Check userList length and show message or list accordingly */
    this.currentUserId = this.navParams.get('userId');

    if (!this.currentUserId && this.appGlobalService.getCurrentUser()) {
      this.currentUserId = this.appGlobalService.getCurrentUser().uid;
    }

    this.isLoggedInUser = this.navParams.get('isLoggedInUser');
    this.profileDetails = this.navParams.get('profile');
  }

  ionViewWillEnter() {
    this.getAllProfile();
    this.getAllGroup();
    this.getCurrentGroup();

    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.dismissPopup();
    }, 11);
  }

  getCurrentGroup() {
    this.groupService.getCurrentGroup().then(val => {
      console.log("Value : " + val);
      let group = val.result;
      if (group) {
        this.zone.run(() => {
          console.log("Value : " + group.gid);
          this.currentGroupId = group.gid
        });
      }
    }).catch(error => {
      console.log("Error : " + error);
    })
  }

  dismissPopup() {
    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

  presentPopover(myEvent, index, isUser) {
    let isCurrentUser = false;
    if (isUser) {
      isCurrentUser = (this.currentUserId === this.userList[index].uid) ? true : false;
    } else {
      isCurrentUser = this.currentGroupId === this.groupList[index].gid;
    }

    let popover = this.popOverCtrl.create(PopoverPage, {
      edit: () => {
        if (isUser) {
          this.navCtrl.push(GuestEditProfilePage, {
            profile: this.userList[index],
            isCurrentUser: isCurrentUser
          });
        } else {
          this.navCtrl.push('CreateGroupPage', {
            groupInfo: this.groupList[index]
          });
        }
        popover.dismiss();
      },
      delete: ($event) => {
        if (isUser) {
          this.deleteUserConfirmBox(index);
        } else {
          this.deleteGroupConfirmBox(index);
        }
        popover.dismiss()
      },
      isCurrentUser: isCurrentUser
    },
      {
        cssClass: 'user-popover'
      }
    );
    popover.present({
      ev: myEvent
    });
  }

  getAllProfile() {
    let profileRequest: ProfileRequest = {
      local: true
    };

    this.zone.run(() => {
      this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
        if (profiles && profiles.length) {
          this.showEmptyUsersMessage = false;
          let profileList: Array<Profile> = JSON.parse(profiles);
          this.userList = profileList.sort((prev: Profile, next: Profile) => {
            if (prev.uid === this.currentUserId) {
              return -1;
            }

            if (next.uid === this.currentUserId) {
              return 1;
            }


            if (prev.handle < next.handle) return -1;
            if (prev.handle > next.handle) return 1;
            return 0;
          });
        } else {
          this.showEmptyUsersMessage = true;
        }
      }).catch((error) => {
        console.log("Something went wrong while fetching user list", error);
      });
    })
  }

  getAllGroup() {
    this.zone.run(() => {
      let groupRequest: GroupRequest = {
        uid: ""
      }

      this.groupService.getAllGroup(groupRequest).then((groups) => {
        if (groups.result && groups.result.length) {
          this.showEmptyGroupsMessage = false;
          this.groupList = groups.result.sort((prev: Group, next: Group) => {
            if (prev.gid === this.currentGroupId) {
              return -1;
            }

            if (next.gid === this.currentGroupId) {
              return 1;
            }


            if (prev.name < next.name) return -1;
            if (prev.name > next.name) return 1;
            return 0;
          });
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
  goToGroupDetail(index) {
    this.navCtrl.push(GroupDetailsPage, {
      groupInfo: this.groupList[index],
      currentUserId: this.currentUserId,
      currentGruopId: this.currentGroupId,
      profile: this.profileDetails
    });
  }

  /**
   * Navigates to Create group Page
   */
  createGroup() {
    this.navCtrl.push('CreateGroupPage');
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
    // TODO : Handle the Group switching
    let selectedUser = this.userList[this.selectedUserIndex];

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
            console.log('Cancel clicked' + selectedUser);
          }
        },
        {
          text: this.translateMessage('OKAY'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            if (this.network.type === 'none') {
              let toast = this.toastCtrl.create({
                message: this.translateMessage("NEED_INTERNET_TO_CHANGE"),
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            } else {
              this.oauth.doLogOut();
              (<any>window).splashscreen.clearPrefs();
              this.setAsCurrentUser(selectedUser);
            }
          }
        }
      ]
    });

    if (this.profileDetails.id) {
      alert.present();
    } else {
      this.setAsCurrentUser(selectedUser);
    }
  }

  /** Delete alert box */
  deleteGroupConfirmBox(index) {
    let self = this;
    let alert = this.alertCtrl.create({
      title: this.translateMessage('GROUP_DELETE_CONFIRM', this.groupList[index].name),
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

  /** Delete alert box */
  deleteUserConfirmBox(index) {
    //let self = this;
    let alert = this.alertCtrl.create({
      title: this.translateMessage('USER_DELETE_CONFIRM', this.userList[index].handle),
      mode: 'wp',
      message: this.translateMessage('USER_DELETE_CONFIRM_MESSAGE'),
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
            let request = this.userList[index].uid;
            this.profileService.deleteUser(request,
              (result) => {
                console.log("User Deleted Successfully", result);
                this.userList.splice(index, 1);
              }, (error) => {
                console.error("Error Occurred=", error);
              });
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

  getGradeNameFromCode(data: Profile | Group): string {
    if (data.grade && data.grade.length > 0) {
      let gradeName = [];
      data.grade.forEach(code => {
        if (data.gradeValueMap && data.gradeValueMap[code]) {
          gradeName.push(data.gradeValueMap[code]);
        }
      });

      if (gradeName.length == 0) {
        return data.grade.join(",");
      }

      return gradeName.join(",");
    }

    return ""
  }

  private setAsCurrentUser(selectedUser) {
    this.groupService.setCurrentGroup(null)
      .then(val => {
        console.log("Value : " + val);
      })
      .catch(error => {
        console.log("Error : " + error);
      });

    this.profileService.setCurrentUser(selectedUser.uid, (success) => {
      this.event.publish('refresh:profile');
      this.event.publish(AppGlobalService.USER_INFO_UPDATED);

      if (selectedUser.profileType == ProfileType.STUDENT) {
        initTabs(this.container, GUEST_STUDENT_TABS);
        this.preferences.putString('selected_user_type', ProfileType.STUDENT);
      } else {
        initTabs(this.container, GUEST_TEACHER_TABS);
        this.preferences.putString('selected_user_type', ProfileType.TEACHER);
      }

      this.app.getRootNav().setRoot(TabsPage);

    }, (error) => {
      console.log("Error " + error);
    });
  }
}
