import { GroupDetailsPage } from './group-details/group-details';
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
  AlertController,
  Platform,
  PopoverController,
  ToastController,
  LoadingController
} from 'ionic-angular';
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
  GroupRequest,
  InteractType,
  Environment,
  InteractSubtype,
  PageId,
  TelemetryObject,
  ObjectType,
  ImpressionType,
  AuthService
} from 'sunbird';
import { GuestEditProfilePage } from '../profile/guest-edit.profile/guest-edit.profile';
import { IonicApp } from 'ionic-angular';
import { ShareUserAndGroupPage } from './share-user-and-groups/share-user-and-groups';
import { AppGlobalService } from '../../service/app-global.service';
import { CommonUtilService } from '../../service/common-util.service';
import {
  initTabs,
  GUEST_STUDENT_SWITCH_TABS,
  GUEST_TEACHER_SWITCH_TABS,
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_TABS
} from '../../app/module.service';
import { App, Events } from 'ionic-angular';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Map } from '../../app/telemetryutil';
import { Content } from 'ionic-angular';
import { PreferenceKey } from '../../app/app.constant';
import { CreateGroupPage } from './create-group/create-group';

@IonicPage()
@Component({
  selector: 'page-user-and-groups',
  templateUrl: 'user-and-groups.html',
})
export class UserAndGroupsPage {

  @ViewChild(Content) content: Content;
  segmentType = 'users';
  groupName: string;
  showEmptyGroupsMessage = true;
  // isLoggedInUser: boolean = false;
  currentUserId: string;
  currentGroupId: string;
  playConfig: any;

  userList: Array<Profile> = [];
  groupList: Array<Group> = [];

  unregisterBackButton: any;
  profileDetails: any;
  loadingUserList = false;

  userType: string;
  noUsersPresent = false;
  selectedUserIndex = -1;
  lastCreatedProfileData: any;

  selectedUsername: string ;
  isCurUserSelected: boolean;
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
    private telemetryGeneratorService: TelemetryGeneratorService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService
  ) {

    /* Check userList length and show message or list accordingly */
    this.currentUserId = this.navParams.get('userId');
    this.playConfig = this.navParams.get('playConfig') || undefined;

    if (!this.currentUserId && this.appGlobalService.getCurrentUser()) {
      this.currentUserId = this.appGlobalService.getCurrentUser().uid;
    }

    // this.isLoggedInUser = this.navParams.get('isLoggedInUser');
    // this.profileDetails = this.navParams.get('profile');
    if (this.appGlobalService.isUserLoggedIn()) {
      this.profileDetails = this.appGlobalService.getCurrentUser();
    }
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.USERS_GROUPS,
      Environment.USER
    );
  }

  ionViewWillEnter() {
    this.zone.run(() => {
      this.getAllProfile();
      this.getAllGroup();
      this.getCurrentGroup();
      // this.getLastCreatedProfile();

      this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
        this.dismissPopup();
        this.unregisterBackButton();
      }, 11);
    });

    if (this.userList) {
      this.noUsersPresent = false;
      this.loadingUserList = true;
    }
  }

  getCurrentGroup() {
    this.groupService.getCurrentGroup().then(val => {
      console.log('Value : ' + val);
      const group = val.result;
      if (group) {
        this.zone.run(() => {
          console.log('Value : ' + group.gid);
          this.currentGroupId = group.gid;
        });
      }
    }).catch(error => {
      console.log('Error : ' + error);
    });
  }

  dismissPopup() {
    const activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

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

    const popover = this.popOverCtrl.create(PopoverPage, {
      edit: () => {
        if (isUser) {
          this.navCtrl.push(GuestEditProfilePage, {
            profile: this.userList[index],
            isCurrentUser: isCurrentUser
          });
        } else {
          this.navCtrl.push(CreateGroupPage, {
            groupInfo: this.groupList[index]
          });
        }
        popover.dismiss();
      },
      delete: () => {
        if (isUser) {
          this.deleteUserConfirmBox(index);
        } else {
          this.deleteGroupConfirmBox(index);
        }
        popover.dismiss();
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
    const loader = this.getLoader();
    loader.present();

    const profileRequest: ProfileRequest = {
      local: true
    };
    this.loadingUserList = true;
    setTimeout(() => {
      this.zone.run(() => {
        this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
          const profileList: Array<Profile> = JSON.parse(profiles);
          if (profileList && profileList.length) {
            this.userList = profileList.sort((prev: Profile, next: Profile) => {
              if (prev.uid === this.currentUserId) {
                return -1;
              }

              if (next.uid === this.currentUserId) {
                return 1;
              }

              if (prev.handle < next.handle) {
                return -1;
              }
              if (prev.handle > next.handle) {
                return 1;
              }
              return 0;
            });
            this.noUsersPresent = false;
            this.loadingUserList = false;
          } else {
            this.noUsersPresent = true;
            this.loadingUserList = false;
          }

          loader.dismiss();

        }).catch((error) => {
          loader.dismiss();
          this.noUsersPresent = true;
          this.loadingUserList = false;
          console.log('Something went wrong while fetching user list', error);
        });
      });
    }, 1000);
  }

  getAllGroup() {
    this.zone.run(() => {
      const groupRequest: GroupRequest = {
        uid: ''
      };

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

            if (prev.name < next.name) {
              return -1;
            }
            if (prev.name > next.name) {
              return 1;
            }
            return 0;
          });
        } else {
          this.showEmptyGroupsMessage = true;
        }
        console.log('GroupList', groups);
      }).catch((error) => {
        console.log('Something went wrong while fetching data', error);
      });
    });
  }

  /**Navigates to group details page */
  goToGroupDetail(index) {
    this.navCtrl.push(GroupDetailsPage, {
      groupInfo: this.groupList[index],
      currentUserId: this.currentUserId,
      currentGruopId: this.currentGroupId,
      profile: this.profileDetails,
      playConfig: this.playConfig

    });
  }

  /**
  * Navigates to Create group Page
  */
  createGroup() {
    // Generate create group click event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CREATE_GROUP_CLICKED,
      Environment.USER,
      PageId.USERS_GROUPS
    );
    this.navCtrl.push(CreateGroupPage);
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
    });
  }

  /**
  * Navigates to Create User Page
  */
  createUser() {
    this.getLastCreatedProfile().then((response: any) => {
      // Generate create user click event
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.CREATE_USER_CLICKED,
        Environment.USER,
        PageId.USERS_GROUPS
      );
      this.zone.run(() => {
        this.navCtrl.push(GuestEditProfilePage, {
          isNewUser: true,
          lastCreatedProfile: this.lastCreatedProfileData
        });
      });
    }).catch((error) => {
      this.zone.run(() => {
        this.navCtrl.push(GuestEditProfilePage, {
          isNewUser: true
        });
      });
      console.error('error occoured' + error);
    });
  }

  selectUser(index: number,  uid?: string, name?: string) {
    this.isCurUserSelected = this.appGlobalService.getCurrentUser().uid === uid;
    this.zone.run(() => {
      this.selectedUserIndex = (this.selectedUserIndex === index) ? -1 : index;
    });
    this.selectedUsername = name;
  }

  onSegmentChange(event) {
    this.zone.run(() => {
      this.content.resize();
      this.selectedUserIndex = -1;
    });
    console.log('Event', event._value);
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      event._value,
      Environment.USER
    );
  }

  /**
  * Shows Prompt for switch Account
  */
  switchAccountConfirmBox() {
    // Generate Switch User click event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SWITCH_USER_CLICKED,
      Environment.USER,
      PageId.USERS_GROUPS
    );

    const selectedUser = this.userList[this.selectedUserIndex];

    const valuesMap = new Map();
    const fromUser = new Map();
    fromUser['uid'] = this.currentUserId;
    fromUser['type'] = this.appGlobalService.isUserLoggedIn() ? 'signedin' : 'guest';

    const toUser = new Map();
    toUser['uid'] = selectedUser.uid;
    toUser['type'] = 'guest';

    valuesMap['from'] = fromUser;
    valuesMap['to'] = toUser;

    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = selectedUser.uid;
    telemetryObject.type = ObjectType.USER;

    // Generate Switch user initiate interact event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SWITCH_USER_INITIATE,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject,
      valuesMap
    );

    const alert = this.alertCtrl.create({
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
            this.logOut(selectedUser, false);
          }
        }
      ]
    });

    if (this.appGlobalService.isUserLoggedIn()) {
      alert.present();
    } else {
      this.setAsCurrentUser(selectedUser, false);
    }
    // Generate Switch user success event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.OTHER,
      InteractSubtype.SWITCH_USER_SUCCESS,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject,
      valuesMap
    );
  }
  // method below fetches the last created user
  getLastCreatedProfile() {
    return new Promise((resolve, reject) => {
      const req = {
        local: true,
        latestCreatedProfile: true
      };
      this.profileService.getProfile(req).then((lastCreatedProfile: any) => {
        console.log('lastCreatedProfile: ', lastCreatedProfile);
        this.lastCreatedProfileData = JSON.parse(lastCreatedProfile);
        resolve(JSON.parse(lastCreatedProfile));
      }).catch(error => {
        reject(null);
        console.log('error in fetching last created profile data' + error);
      });
    });
  }

  logOut(selectedUser: any, isBeingPlayed: boolean) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.profileDetails.id;
    telemetryObject.type = Environment.USER;

    // Generate Logout success event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.LOGOUT_INITIATE,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject
    );
    if (isBeingPlayed) {
      this.authService.endSession();
      (<any>window).splashscreen.clearPrefs();
      this.setAsCurrentUser(selectedUser, true);
    } else {
      if (this.commonUtilService.networkInfo.isNetworkAvailable) {
        this.oauth.doLogOut().then(() => {
          (<any>window).splashscreen.clearPrefs();
          this.setAsCurrentUser(selectedUser, false);
        });
      } else {
        this.authService.endSession();
        (<any>window).splashscreen.clearPrefs();
        this.setAsCurrentUser(selectedUser, false);
      }
    }

    // Generate Logout success event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.OTHER,
      InteractSubtype.LOGOUT_SUCCESS,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject
    );

  }
  /**condition for disabling the play button */
  disablePlayButton() {
    if (this.selectedUserIndex === -1 && !this.userList.length) {
      return true;
    }
    return false;
  }

  /** Delete alert box */
  deleteGroupConfirmBox(index) {
    const alert = this.alertCtrl.create({
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
          text: this.translateMessage('YES'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            this.deleteGroup(index);
          }
        }
      ]
    });
    alert.present();
  }
  /**Navigates to play content details page nd launch the player */
  play() {
    const selectedUser = this.userList[this.selectedUserIndex];
    if (this.appGlobalService.isUserLoggedIn()) {
      this.logOut(selectedUser, true);
    } else {
      this.setAsCurrentUser(selectedUser, true);
    }

  }

  deleteGroup(index: number) {

    const gid = this.groupList[index].gid;
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = gid;
    telemetryObject.type = ObjectType.GROUP;

    // Generate Delete user event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_GROUP_INITIATE,
      Environment.USER,
      PageId.GROUPS,
      telemetryObject
    );
    this.groupService.deleteGroup(gid).then((success) => {
      console.log(success);
      this.groupList.splice(index, 1);
      this.getAllGroup();
    }).catch((error) => {
      console.log(error);
    });
  }

  /** Delete alert box */
  deleteUserConfirmBox(index) {
    // let self = this;
    const alert = this.alertCtrl.create({
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
          text: this.translateMessage('YES'),
          cssClass: 'alert-btn-delete',
          handler: () => {
            this.deleteUser(index);
          }
        }
      ]
    });
    alert.present();
  }

  deleteUser(index: number) {
    const uid = this.userList[index].uid;

    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = uid;
    telemetryObject.type = ObjectType.USER;

    // Generate Delete user event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_USER_INITIATE,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject
    );
    this.profileService.deleteUser(uid)
      .then((result) => {
        console.log('User Deleted Successfully', result);
        this.userList.splice(index, 1);
        if (this.userList.length === 0) {
          this.noUsersPresent = true;
        }

      }) .catch((error) => {
        console.error('Error Occurred=', error);
      });
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
      const gradeName = [];
      data.grade.forEach(code => {
        if (data.gradeValueMap && data.gradeValueMap[code]) {
          gradeName.push(data.gradeValueMap[code]);
        }
      });

      if (gradeName.length === 0) {
        return data.grade.join(',');
      }

      return gradeName.join(',');
    }

    return '';
  }

  private setAsCurrentUser(selectedUser, isBeingPlayed: boolean) {
    this.groupService.setCurrentGroup(null)
      .then(val => {
        console.log('Value : ' + val);
      })
      .catch(error => {
        console.log('Error : ' + error);
      });
      this.profileService.setCurrentUser(selectedUser.uid) .then(() => {
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('SWITCHING_TO', selectedUser.handle),
        undefined, undefined, 1000);
    setTimeout(() => {
      if (isBeingPlayed) {
        this.event.publish('playConfig', this.playConfig);
        this.navCtrl.pop();
      }
      if (selectedUser.profileType === ProfileType.STUDENT) {
        initTabs(this.container, isBeingPlayed ? GUEST_STUDENT_TABS : GUEST_STUDENT_SWITCH_TABS);
        this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT);
      } else {
        initTabs(this.container, isBeingPlayed ? GUEST_TEACHER_TABS : GUEST_TEACHER_SWITCH_TABS);
        this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
      }
      this.event.publish('refresh:profile');
      this.event.publish(AppGlobalService.USER_INFO_UPDATED);
      this.app.getRootNav().setRoot(TabsPage);
    }, 1000);
  }) .catch((error) => {
    console.log('Error ' + error);
  });
  }
// code which invokes loader
getLoader(): any {
  return this.loadingCtrl.create({
    duration: 30000,
    spinner: 'crescent'
  });
}
}

