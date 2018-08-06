import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Content
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
  AddUpdateProfilesRequest,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  TelemetryObject,
  ObjectType,
  AuthService
} from 'sunbird';
import { Events } from 'ionic-angular';
import { AppGlobalService } from '../../../service/app-global.service';
import { initTabs, GUEST_STUDENT_SWITCH_TABS, GUEST_TEACHER_SWITCH_TABS, GUEST_STUDENT_TABS, GUEST_TEACHER_TABS } from '../../../app/module.service';
import { App } from 'ionic-angular';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { Map } from "../../../app/telemetryutil";
@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  @ViewChild(Content) content: Content;
  group: Group;
  currentUserId: string;
  currentGroupId: string;
  userList: Array<Profile> = [];
  selectedUserIndex: number = -1;
  profileDetails: any;
  userUids = [];
  isNoUsers: boolean = false;
  playContent: any;

  isCurrentGroupActive: boolean = false;

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
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private network: Network,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private authService: AuthService,
    private appGlobalService: AppGlobalService
  ) {
    this.group = this.navParams.get('groupInfo');
    this.currentUserId = this.navParams.get('currentUserId');
    this.currentGroupId = this.navParams.get('currentGruopId');
    this.profileDetails = this.navParams.get('profile');
    this.playContent = this.navParams.get('playContent') || undefined;


    if (this.group.gid == this.currentGroupId) {
      this.isCurrentGroupActive = true;
    }
  }

  ionViewWillEnter() {
    this.getAllProfile();
  }
  resizeContent() {
    this.content.resize();
  }

  getAllProfile() {
    let loader = this.getLoader();
    loader.present();
    let profileRequest: ProfileRequest = {
      local: true,
      groupId: this.group.gid
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
      this.resizeContent();
    });
  }

  /**
  * Shows Prompt for switch Account
  */
  switchAccountConfirmBox() {
    //Generate Switch User click event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SWITCH_USER_CLICKED,
      Environment.USER,
      PageId.GROUP_DETAIL
    );

    let selectedUser = this.userList[this.selectedUserIndex];

    let valuesMap = new Map();
    let fromUser = new Map();
    fromUser["uid"] = this.currentUserId;
    fromUser["type"] = this.appGlobalService.isUserLoggedIn() ? "signed-in" : "guest";

    let toUser = new Map();
    toUser["uid"] = selectedUser.uid;
    toUser["type"] = "guest";

    valuesMap["from"] = fromUser;
    valuesMap["to"] = toUser;
    valuesMap["gid"] = this.group.gid;

    let telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = selectedUser.uid;
    telemetryObject.type = Environment.USER;

    // Generate Switch user initiate interact event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SWITCH_USER_INITIATE,
      Environment.USER,
      PageId.GROUP_DETAIL,
      telemetryObject,
      valuesMap
    );


    let alert = this.alertCtrl.create({
      title: this.translateMessage('SWITCH_ACCOUNT_CONFIRMATION'),
      mode: 'wp',
      message: this.translateMessage('SIGNED_OUT_ACCOUNT_MESSAGE'),
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
            this.logOut(selectedUser,false);
          }
        }
      ]
    });

    if (this.appGlobalService.isUserLoggedIn()) {
      alert.present();
    } else {
      this.setAsCurrentUser(selectedUser, false);
    }

    //Generate Switch user success event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.OTHER,
      InteractSubtype.SWITCH_USER_SUCCESS,
      Environment.USER,
      PageId.GROUP_DETAIL,
      telemetryObject,
      valuesMap
    );

  }
  // takes to content details page and launches player
  play() {
    let selectedUser = this.userList[this.selectedUserIndex];
    this.event.publish('launchPlayer', true);
    this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
    if (this.appGlobalService.isUserLoggedIn()) {
      this.logOut(selectedUser, true);
    } else {
      this.setAsCurrentUser(selectedUser, true);
    }
  }


  logOut(selectedUser: any, isBeingPlayed: boolean) {
    let telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.profileDetails.id;
    telemetryObject.type = Environment.USER;

    //Generate Logout initiate event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.LOGOUT_INITIATE,
      Environment.USER,
      PageId.GROUP_DETAIL,
      telemetryObject
    );
    if (isBeingPlayed) {
      this.authService.endSession();
      (<any>window).splashscreen.clearPrefs();
      this.setAsCurrentUser(selectedUser, true);
    } else {
      if (this.network.type === 'none') {
        this.authService.endSession();
        (<any>window).splashscreen.clearPrefs();
        this.setAsCurrentUser(selectedUser, false);
      } else {
        this.oauth.doLogOut().then(() => {
          (<any>window).splashscreen.clearPrefs();
          this.setAsCurrentUser(selectedUser, false);
        });
      }
    }

    //Generate Logout success event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.OTHER,
      InteractSubtype.LOGOUT_SUCCESS,
      Environment.USER,
      PageId.GROUP_DETAIL,
      telemetryObject
    );
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
      noUsers: (this.userList.length) ? true : false,
      isActiveGroup: this.isCurrentGroupActive
    },
      {
        cssClass: 'user-popover'
      })
    popover.present({
      ev: myEvent
    });
  }

  presentPopover(myEvent, index) {
    let profile = this.userList[index]
    let isActiveUser = false;
    if (profile.uid == this.currentUserId && this.isCurrentGroupActive) {
      isActiveUser = true;
    }
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

      },
      isCurrentUser: isActiveUser
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
      title: this.translateMessage('GROUP_DELETE_CONFIRM', this.group.name),
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
            this.deleteGroup();
          }
        }
      ]
    });
    alert.present();
  }

  deleteGroup() {
    console.log(this.group.gid);
    let telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.group.gid;
    telemetryObject.type = ObjectType.GROUP;

    //Generate Delete group event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_GROUP_INITIATE,
      Environment.USER,
      PageId.GROUP_DETAIL,
      telemetryObject
    );
    this.groupService.deleteGroup(this.group.gid).then((sucess) => {
      console.log(sucess);
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2))

    }).catch((error) => {
      console.log(error);
    })
  }

  /* delete confirm box for user */
  /** Delete alert box */
  userDeleteGroupConfirmBox(index) {
    let alert = this.alertCtrl.create({
      title: this.translateMessage('USER_DELETE_CONFIRM_MESSAGE_FROM_GROUP', this.userList[index].handle),
      mode: 'wp',
      message: this.translateMessage('USER_DELETE_CONFIRM_SECOND_MESSAGE'),
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
            this.deleteUsersinGroup(index);
          }
        }
      ]
    });
    alert.present();
  }

  deleteUsersinGroup(index: number) {
    let userListIndex = this.userList.indexOf(this.userList[index]);
    this.userUids.forEach((item) => {
      if (this.userList[index].uid == item) {
        let elementIndex = this.userUids.indexOf(item);
        this.userUids.splice(elementIndex, 1);

      }
    })
    let req: AddUpdateProfilesRequest = {
      groupId: this.group.gid,
      uidList: this.userUids
    }
    
    this.groupService.addUpdateProfilesToGroup(req).then(
      (success) => {
        console.log("success", success);
        this.userList.splice(userListIndex, 1);        
      }
    ).catch(error => {

    });
    console.log('request is' , req);
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


  private setAsCurrentUser(selectedUser, isBeingPlayed: boolean) {
    this.groupService.setCurrentGroup(this.group.gid)
      .then(val => {
        console.log("Value : " + val);
        this.profileService.setCurrentUser(selectedUser.uid, (success) => {
          if (selectedUser.profileType == ProfileType.STUDENT) {
            initTabs(this.container, isBeingPlayed ? GUEST_STUDENT_TABS : GUEST_STUDENT_SWITCH_TABS);
            this.preferences.putString('selected_user_type', ProfileType.STUDENT);
          } else {
            initTabs(this.container, isBeingPlayed ? GUEST_TEACHER_TABS : GUEST_TEACHER_SWITCH_TABS);
            this.preferences.putString('selected_user_type', ProfileType.TEACHER);
          }

          this.event.publish('refresh:profile');
          this.event.publish(AppGlobalService.USER_INFO_UPDATED);

          this.app.getRootNav().setRoot(TabsPage);

          let toast = this.toastCtrl.create({
            message: this.translateMessage("SWITCHING_TO", selectedUser.handle),
            duration: 2000,
            position: 'bottom'
          });
          toast.present();

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
