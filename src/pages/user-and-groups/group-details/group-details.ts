import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import { PopoverPage } from '../popover/popover';
import { PopoverController } from 'ionic-angular';
import { GroupDetailNavPopoverPage } from '../group-detail-nav-popover/group-detail-nav-popover';
import { CreateGroupPage } from '../create-group/create-group';
import { AlertController } from 'ionic-angular';
import { AddOrRemoveGroupUserPage } from '../add-or-remove-group-user/add-or-remove-group-user';
import {
  Profile,
  ProfileRequest,
  GroupService,
  ProfileService,
  Group,
  OAuthService,
  ProfileType,
  TabsPage,
  ContainerService,
  SharedPreferences,
  AddUpdateProfilesRequest
} from 'sunbird';
import { Events } from 'ionic-angular';
import { AppGlobalService } from '../../../service/app-global.service';
import { initTabs, GUEST_STUDENT_TABS, GUEST_TEACHER_TABS } from '../../../app/module.service';
import { App } from 'ionic-angular';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  group: Group;
  currentUserId: string;
  userList: Array<Profile> = [];
  selectedUserIndex: number = -1;
  profileDetails: any;
  userUids = [];
  isNoUsers: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone,
    private translate: TranslateService,
    private popOverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private oauth: OAuthService,
    private container: ContainerService,
    private preferences: SharedPreferences,
    private app: App,
    private event: Events,
    private loadingCtrl: LoadingController
  ) {
    this.group = this.navParams.get('groupInfo');
    this.currentUserId = this.navParams.get('currentUserId');
    this.profileDetails = this.navParams.get('profile');
  }

  ionViewWillEnter() {
    this.getAllProfile();
  }

  getAllProfile() {
    let loader = this.getLoader();
    loader.present();
    let profileRequest: ProfileRequest = {
      local: true,
      gid: this.group.gid
    };

    this.zone.run(() => {
      this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
        this.zone.run(() => {
          if (profiles && profiles.length) {
            this.userList = JSON.parse(profiles);
            this.userList.forEach((item) => {
              this.userUids.push(item.uid);
            })
            this.isNoUsers = (this.userList.length) ? false : true;
            loader.dismiss();
          }
          console.log("UserList", JSON.parse(profiles));
        })
      }).catch((error) => {
        loader.dismiss();
        console.log("Something went wrong while fetching user list", error);
      });
    });
  }



  selectUser(index: number, name: string) {
    this.zone.run(() => {
      this.selectedUserIndex = (this.selectedUserIndex === index) ? -1 : index;
    });
    console.log("Clicked list name is ", name);
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
            this.oauth.doLogOut();
            (<any>window).splashscreen.clearPrefs();
            this.setAsCurrentUser(selectedUser);
          }
        }
      ]
    });

    if (this.profileDetails && this.profileDetails.id) {
      alert.present();
    } else {
      this.setAsCurrentUser(selectedUser);
    }

  }

  presentPopoverNav(myEvent) {
    console.log("clicked nav popover")
    let popover = this.popOverCtrl.create(GroupDetailNavPopoverPage, {
      goToEditGroup: () => {
        console.log('go to edit group');
        this.navCtrl.push(CreateGroupPage, {
          groupInfo: this.group
        })
        popover.dismiss();
      },
      deleteGroup: () => {

        this.deleteGroupConfirmBox();
        popover.dismiss();
      },
      addUsers: () => {
        this.navCtrl.push(AddOrRemoveGroupUserPage, {
          isAddUsers: true,
          groupInfo: this.group,
          groupMembers: this.userList
        });
        popover.dismiss();
      },
      removeUser: () => {
        this.navCtrl.push(AddOrRemoveGroupUserPage, {
          isAddUsers: false,
          groupInfo: this.group,
          groupMembers: this.userList
        });
        popover.dismiss();
      },
      noUsers: (this.userList.length) ? true : false
    },
      {
        cssClass: 'groupDetails-popover'
      })
    popover.present({
      ev: myEvent
    });
  }

  presentPopover(myEvent, index) {
    let popover = this.popOverCtrl.create(PopoverPage, {

      edit: () => {
        this.navCtrl.push(GuestEditProfilePage, {
          profile: this.userList[index]
        })
        popover.dismiss();
      },
      delete: () => {
        console.log("in delete");
        this.userDeleteGroupConfirmBox(index);
        popover.dismiss();

      }
    },
      {
        cssClass: 'user-popover'
      });
    popover.present({
      ev: myEvent
    });
  }

  /** Delete alert box */
  deleteGroupConfirmBox() {
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
            console.log(this.group.gid);
            this.groupService.deleteGroup(this.group.gid).then((sucess) => {
              console.log(sucess);
              this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2))

            }).catch((error) => {
              console.log(error);
            })
          }
        }
      ]
    });
    alert.present();
  }

  /* delete confirm box for user */
   /** Delete alert box */
   userDeleteGroupConfirmBox(index) {
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
            this.userUids.forEach((item) => {
              if (this.userList[index].uid == item) {
                console.log(true);
                let elementIndex = this.userUids.indexOf(item.uid);
                let userListIndex = this.userList.indexOf(this.userList[index]);
                this.userUids.splice(elementIndex, 1);
                this.userList.splice(userListIndex , 1);
                console.log(this.userUids);
    
                let req: AddUpdateProfilesRequest = {
                  groupId: this.group.gid,
                  uidList: this.userUids
                }
                this.groupService.addUpdateProfilesToGroup(req);
              }
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

  private setAsCurrentUser(selectedUser) {
    this.groupService.setCurrentGroup(this.group.gid)
      .then(val => {
        console.log("Value : " + val);
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
      }).catch(error => {
        console.log("Error : " + error);
      });
  }

  navigateToAddUser() {
    this.navCtrl.push(GuestEditProfilePage, {
      isNewUser: true
    });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}
