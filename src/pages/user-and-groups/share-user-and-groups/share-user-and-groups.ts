import {
  Component,
  NgZone
} from '@angular/core';
import {
  LoadingController
} from 'ionic-angular';
import {
  GroupService,
  Group,
  Profile,
  ProfileRequest,
  ProfileService,
  ProfileExportRequest,
  FileUtil,
  GroupRequest,
  InteractType,
  InteractSubtype,
  Environment,
  PageId
} from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
@Component({
  selector: 'page-share-user-and-groups',
  templateUrl: 'share-user-and-groups.html',
})
export class ShareUserAndGroupPage {

  groupName: Group;
  userList: Array<Profile> = [];
  groupList: Array<Group> = [];

  selectedUserList: Array<string> = [];
  selectedGroupList: Array<string> = [];

   private userWeightMap: Map<string, number> = new Map();

   private userGroupMap: Map<string, Array<Profile>> = new Map();

  constructor(
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone,
    private fileUtil: FileUtil,
    private socialShare: SocialSharing,
    private loadingCtrl: LoadingController,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {

  }

  ionViewWillEnter() {
    this.getAllProfile();
    this.getAllGroup();
  }

  getAllProfile() {
    const profileRequest: ProfileRequest = {
      local: true
    };
    this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
      this.zone.run(() => {
        if (profiles && profiles.length) {
          this.userList = JSON.parse(profiles);
        }

        this.userList.forEach(profile => {
          this.userWeightMap.set(profile.uid, 0);
        });
      });
    }).catch((error) => {
      console.log('Something went wrong while fetching user list', error);
    });
  }

  getAllGroup() {
    this.zone.run(() => {

      const groupRequest: GroupRequest = {
        uid: ''
      };

      this.groupService.getAllGroup(groupRequest).then((groups) => {
        if (groups.result && groups.result.length) {
          this.groupList = groups.result;
        }

        this.groupList.forEach(group => {
          const gruopUserRequest: ProfileRequest = {
            local: true,
            groupId: group.gid
          };
          this.profileService.getAllUserProfile(gruopUserRequest).then((profiles) => {
            this.zone.run(() => {
              if (profiles && profiles.length) {
                const userForGroups = JSON.parse(profiles);
                this.userGroupMap.set(group.gid, userForGroups);
              }
              console.log('UserList', profiles);
            });
          }).catch((error) => {
            console.log('Something went wrong while fetching user list', error);
          });
        });

        console.log('GroupList', groups);
      }).catch((error) => {
        console.log('Something went wrong while fetching data', error);
      });
    });
  }
  checkUserGroups() {
    const totalLength = this.userList.length + this.groupList.length;
    if (totalLength > 0) {
      return true;
    }
    return false;
  }

  toggleGroupSelected(index: number) {
    const selectedGroup = this.groupList[index];
    const allUser = this.userGroupMap.get(selectedGroup.gid);
    console.log(selectedGroup , allUser);
    if (this.selectedGroupList.indexOf(selectedGroup.gid) === -1) {
      // Add User & Group
      this.selectedGroupList.push(selectedGroup.gid);
      allUser.forEach(profile => {
        let userWeigth = this.userWeightMap.get(profile.uid);
        if (this.selectedUserList.indexOf(profile.uid) === -1) {
          this.selectedUserList.push(profile.uid);
          userWeigth = 1;
        } else {
          userWeigth += 1;
        }
        this.userWeightMap.set(profile.uid, userWeigth);
      });

    } else {
      // Remove User & Group
      const selectedGroupIndex = this.selectedGroupList.indexOf(selectedGroup.gid);
      this.selectedGroupList.splice(selectedGroupIndex, 1);
      allUser.forEach(profile => {
        if (this.selectedUserList.indexOf(profile.uid) > -1) {
          let userWeigth = this.userWeightMap.get(profile.uid);
          if (userWeigth === 1) {
            const userIndex = this.selectedUserList.indexOf(profile.uid);
            this.selectedUserList.splice(userIndex, 1);
            userWeigth = 0;
          } else {
            userWeigth -= 1;
          }
          this.userWeightMap.set(profile.uid, userWeigth);
        }
      });
    }
  }


  toggleUserSelected(index: number) {
    const selectedUser = this.userList[index];

    let userWeigth = this.userWeightMap.get(selectedUser.uid);

    if (this.selectedUserList.indexOf(selectedUser.uid) === -1) {
      // Add User
      this.selectedUserList.push(selectedUser.uid);
      userWeigth += 1;
    } else {
      // Remove User
      const selectedUserIndex = this.selectedUserList.indexOf(selectedUser.uid);
      this.selectedUserList.splice(selectedUserIndex, 1);
      userWeigth = 0;

      this.userGroupMap.forEach((value: Array<Profile>, gid: string) => {
        const groupIndex = this.selectedGroupList.indexOf(gid);
        if (groupIndex > -1) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].uid === selectedUser.uid) {
              this.selectedGroupList.splice(groupIndex, 1);
              break;
            }
          }
        }
      });
    }

    this.userWeightMap.set(selectedUser.uid, userWeigth);
  }


  isUserSelected(uid: string) {
    return this.selectedUserList.indexOf(uid) !== -1;
  }

  isGroupSelected(gid: string) {
    return this.selectedGroupList.indexOf(gid) !== -1;
  }

  isShareEnabled() {
    return this.selectedUserList.length > 0;
  }

  selectAll() {
    this.zone.run(() => {
      for (let i = 0; i < this.userList.length; i++) {
        this.toggleUserSelected(i);
      }

      for (let i = 0; i < this.groupList.length; i++) {
        this.toggleGroupSelected(i);
      }
    });
  }

  share() {

    if (this.selectedUserList && this.selectedGroupList) {
      const valueMap = new Map();
      valueMap['UIDS'] = this.selectedUserList.concat(this.selectedGroupList);
      // Generate Share initiate
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.SHARE_USER_GROUP_INITIATE,
        Environment.USER,
        PageId.SHARE_USER_GROUP,
        undefined,
        valueMap
      );
    }
    const profileExportRequest: ProfileExportRequest = {
      userIds: this.selectedUserList,
      groupIds: this.selectedGroupList,
      destinationFolder: this.fileUtil.internalStoragePath()
    };

    const loader = this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
    });

    loader.present();
    this.profileService.exportProfile(profileExportRequest).then((path: any) => {
      path = JSON.parse(path);
      loader.dismiss();
      if (this.selectedUserList && this.selectedGroupList) {
        const valueMap = new Map();
        valueMap['UIDS'] = this.selectedUserList.concat(this.selectedGroupList);
        // Generate Share initiate
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.SHARE_USER_GROUP_SUCCESS,
          Environment.USER,
          PageId.SHARE_USER_GROUP,
          undefined,
          valueMap
        );
      }
      this.socialShare.share('', '', 'file://' + path.exportedFilePath, '');
    }) .catch((err) => {
      loader.dismiss();
    });
  }
}
