import { GroupDetailsPage } from './group-details/group-details';
import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, NgZone, ViewChild } from '@angular/core';
import { AlertController, App, Content, Events, IonicApp, IonicPage, LoadingController, NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover/popover';
import {
  AuthService,
  GetAllProfileRequest,
  Group,
  GroupService,
  Profile,
  ProfileService,
  ProfileType,
  SharedPreferences,
  TelemetryObject
} from 'sunbird-sdk';
import { GuestEditProfilePage } from '../profile/guest-edit.profile/guest-edit.profile';
import { ShareUserAndGroupPage } from './share-user-and-groups/share-user-and-groups';
import { AppGlobalService } from '../../service/app-global.service';
import { CommonUtilService } from '../../service/common-util.service';
import {
  GUEST_STUDENT_SWITCH_TABS,
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_SWITCH_TABS,
  GUEST_TEACHER_TABS,
  initTabs
} from '../../app/module.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Map } from '../../app/telemetryutil';
import { PreferenceKey } from '../../app/app.constant';
import { CreateGroupPage } from './create-group/create-group';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  ObjectType,
  PageId,
} from '../../service/telemetry-constants';
import { ContainerService } from '@app/service/container.services';
import { TabsPage } from '../tabs/tabs';
import { AppHeaderService } from '@app/service';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';

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
  profileDetails: Profile;
  loadingUserList = false;

  userType: string;
  noUsersPresent = false;
  selectedUserIndex = -1;
  lastCreatedProfileData: any;

  selectedUsername: string;
  isCurUserSelected: boolean;
  ProfileType = ProfileType;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private popOverCtrl: PopoverController,
    private zone: NgZone,
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('GROUP_SERVICE') private groupService: GroupService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private platform: Platform,
    private ionicApp: IonicApp,
    private event: Events,
    private appGlobalService: AppGlobalService,
    private container: ContainerService,
    private app: App,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private headerService: AppHeaderService
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
      this.headerService.hideHeader();

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
    this.groupService.getActiveSessionGroup().subscribe((val: Group) => {
      const group = val;
      if (group) {
        this.zone.run(() => {
          this.currentGroupId = group.gid;
        });
      }
    }, () => {
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

    const profileRequest: GetAllProfileRequest = {
      local: true
    };
    this.loadingUserList = true;
    setTimeout(() => {
      this.zone.run(() => {
        this.profileService.getAllProfiles(profileRequest)
          .map((profiles) => profiles.filter((profile) => !!profile.handle))
          .subscribe((profiles) => {
            const profileList: Array<Profile> = profiles;
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

          }, () => {
            loader.dismiss();
            this.noUsersPresent = true;
            this.loadingUserList = false;
          });
      });
    }, 1000);
  }

  getAllGroup() {
    this.zone.run(() => {
      this.groupService.getAllGroups().subscribe((groups: Group[]) => {
        if (groups && groups.length) {
          this.showEmptyGroupsMessage = false;
          this.groupList = groups.sort((prev: Group, next: Group) => {
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
      }, () => {
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
    this.getLastCreatedProfile().then(() => {
      // Generate create user click event
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.CREATE_USER_CLICKED,
        Environment.USER,
        PageId.USERS_GROUPS
      );
      // this.zone.run(() => {
      this.navCtrl.push(GuestEditProfilePage, {
        isNewUser: true,
        lastCreatedProfile: this.lastCreatedProfileData
      });
      // });
    }).catch((error) => {
      // this.zone.run(() => {
      this.navCtrl.push(GuestEditProfilePage, {
        isNewUser: true
      });
      // });
    });
  }

  selectUser(index: number, uid?: string, name?: string) {
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

    const telemetryObject = new TelemetryObject(selectedUser.uid, ObjectType.USER, undefined);

    // Generate Switch user initiate interact event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SWITCH_USER_INITIATE,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject,
      valuesMap
    );

    /*const alert = this.alertCtrl.create({
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
    });*/
    const confirm = this.popOverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('SWITCH_ACCOUNT_CONFIRMATION'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('USER_DELETE_CONFIRM_SECOND_MESSAGE'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
        }, {
          btntext: this.commonUtilService.translateMessage('YES'),
          btnClass: 'popover-color'
        }
      ],
      icon: null
    }, {
        cssClass: 'sb-popover',
      });
    confirm.onDidDismiss((leftBtnClicked: boolean = false) => {
      if (leftBtnClicked == null) {
        return;
      }
      if (!leftBtnClicked) {
        this.logOut(selectedUser, false);
      }
    });

    if (this.appGlobalService.isUserLoggedIn()) {
      confirm.present({
        ev: event
      });
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
      this.profileService.getAllProfiles()
        .map((profiles) => (profiles.sort((p1, p2) => p2.createdAt - p1.createdAt))[0])
        .toPromise().then((lastCreatedProfile: any) => {
          this.lastCreatedProfileData = lastCreatedProfile;
          resolve(lastCreatedProfile);
        }).catch(() => {
          reject(null);
        });
    });
  }

  logOut(selectedUser: any, isBeingPlayed: boolean) {
    const telemetryObject = new TelemetryObject(this.profileDetails.uid, Environment.USER, undefined);

    // Generate Logout success event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.LOGOUT_INITIATE,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject
    );
    if (isBeingPlayed) {
      // this.authService.resignSession().subscribe();
      // (<any>window).splashscreen.clearPrefs();
      this.setAsCurrentUser(selectedUser, true);
    } else {
      if (this.commonUtilService.networkInfo.isNetworkAvailable) {
        this.authService.resignSession().subscribe(() => {
          (<any>window).splashscreen.clearPrefs();
          this.setAsCurrentUser(selectedUser, false);
        }, () => {
        });
      } else {
        this.authService.resignSession().subscribe();
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
    /*const alert = this.alertCtrl.create({
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
    alert.present();*/
    const confirm = this.popOverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.translateMessage('GROUP_DELETE_CONFIRM', this.groupList[index].name),
      sbPopoverMainTitle: this.translateMessage('GROUP_DELETE_CONFIRM_MESSAGE'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
        }, {
          btntext: this.commonUtilService.translateMessage('YES'),
          btnClass: 'popover-color'
        }
      ],
      icon: null
    }, {
        cssClass: 'sb-popover',
      });
    confirm.present({
      ev: event
    });
    confirm.onDidDismiss((leftBtnClicked: boolean = false) => {
      if (leftBtnClicked == null) {
        return;
      }
      if (!leftBtnClicked) {
        this.deleteGroup(index);
      }
    });

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
    const telemetryObject = new TelemetryObject(gid, ObjectType.GROUP, undefined);

    // Generate Delete user event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_GROUP_INITIATE,
      Environment.USER,
      PageId.GROUPS,
      telemetryObject
    );
    this.groupService.deleteGroup(gid).subscribe(() => {
      this.groupList.splice(index, 1);
      this.getAllGroup();
    }, () => {
    });
  }

  /** Delete alert box */
  deleteUserConfirmBox(index) {
    // let self = this;
    /*const alert = this.alertCtrl.create({
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
    alert.present();*/
    const confirm = this.popOverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.translateMessage('USER_DELETE_CONFIRM', this.userList[index].handle),
      sbPopoverMainTitle: this.translateMessage('USER_DELETE_CONFIRM_MESSAGE'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
        },
        {
          btntext: this.commonUtilService.translateMessage('YES'),
          btnClass: 'popover-color'
        }
      ],
      icon: null
    }, {
        cssClass: 'sb-popover',
      });
    confirm.present({
      ev: event
    });
    confirm.onDidDismiss((leftBtnClicked: any) => {
      if (leftBtnClicked == null) {
        return;
      }
      if (!leftBtnClicked) {
        this.deleteUser(index);
      }
    });
  }

  deleteUser(index: number) {
    const uid = this.userList[index].uid;

    const telemetryObject = new TelemetryObject(uid, ObjectType.USER, undefined);

    // Generate Delete user event
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_USER_INITIATE,
      Environment.USER,
      PageId.USERS_GROUPS,
      telemetryObject
    );
    this.profileService.deleteProfile(uid)
      .subscribe(() => {
        this.userList.splice(index, 1);
        if (this.userList.length === 0) {
          this.noUsersPresent = true;
        }

      }, () => {
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
        if (data['gradeValue'] && data['gradeValue'][code]) {
          gradeName.push(data['gradeValue'][code]);
        }
      });

      if (gradeName.length === 0) {
        return data.grade.join(',');
      }

      return gradeName.join(',');
    }

    return '';
  }

  // code which invokes loader
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
    });
  }

  private setAsCurrentUser(selectedUser, isBeingPlayed: boolean) {
    this.groupService.removeActiveGroupSession()
      .subscribe(() => {
      },
        () => {
        });
    this.profileService.setActiveSessionForProfile(selectedUser.uid).subscribe(() => {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('SWITCHING_TO', selectedUser.handle),
        undefined, undefined, 1000);
      setTimeout(() => {
        if (isBeingPlayed) {
          this.playConfig['selectedUser'] = selectedUser;
          if (selectedUser.profileType === ProfileType.STUDENT) {
            this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise().then();
          } else {
            this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise().then();
          }
          this.event.publish('playConfig', this.playConfig);
          this.navCtrl.pop();
        } else {
          if (selectedUser.profileType === ProfileType.STUDENT) {
            initTabs(this.container, isBeingPlayed ? GUEST_STUDENT_TABS : GUEST_STUDENT_SWITCH_TABS);
            this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise().then();
          } else {
            initTabs(this.container, isBeingPlayed ? GUEST_TEACHER_TABS : GUEST_TEACHER_SWITCH_TABS);
            this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise().then();
          }
          this.event.publish('refresh:profile');
          this.event.publish(AppGlobalService.USER_INFO_UPDATED);
          this.app.getRootNav().setRoot(TabsPage);
        }

      }, 1000);
    }, () => {
    });
  }

  ionViewWillLeave(): void {
    if (this.unregisterBackButton) {
      this.unregisterBackButton();
    }
  }
}

