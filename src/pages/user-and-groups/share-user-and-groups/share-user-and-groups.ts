import {
  Component,
  NgZone
} from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import {
  GroupService,
  Group,
  Profile,
  ProfileRequest,
  ProfileService,
  ProfileExportRequest,
  FileUtil
} from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';

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

  private userGroupMap: Map<string, Array<Profile>> = new Map();

  constructor(
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone,
    private fileUtil: FileUtil,
    private socialShare: SocialSharing,
    private loadingCtrl: LoadingController
  ) {

  }

  ionViewWillEnter() {
    this.getAllProfile();
    this.getAllGroup();
  }

  getAllProfile() {
    let profileRequest: ProfileRequest = {
      local: true
    };
    this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
      this.zone.run(() => {
        if (profiles && profiles.length) {
          this.userList = JSON.parse(profiles);
        }
        console.log("UserList", profiles);
      })
    }).catch((error) => {
      console.log("Something went wrong while fetching user list", error);
    });
  }

  getAllGroup() {
    this.zone.run(() => {
      this.groupService.getAllGroup().then((groups) => {
        if (groups.result && groups.result.length) {
          this.groupList = groups.result;
        }

        this.groupList.forEach(group => {
          let gruopUserRequest: ProfileRequest = {
            local: true,
            gid: group.gid
          }
          this.profileService.getAllUserProfile(gruopUserRequest).then((profiles) => {
            this.zone.run(() => {
              if (profiles && profiles.length) {
                let userForGroups = JSON.parse(profiles);
                this.userGroupMap.set(group.gid, userForGroups);
              }
              console.log("UserList", profiles);
            })
          }).catch((error) => {
            console.log("Something went wrong while fetching user list", error);
          });
        });

        console.log("GroupList", groups);
      }).catch((error) => {
        console.log("Something went wrong while fetching data", error);
      });
    })
  }

  toggleGroupSelected(index: number) {
    let selectedGroup = this.groupList[index];
    let allUser = this.userGroupMap.get(selectedGroup.gid);

    if (this.selectedGroupList.indexOf(selectedGroup.gid) == -1) {
      // Add User & Group
      this.selectedGroupList.push(selectedGroup.gid);
      allUser.forEach(profile => {
        if (this.selectedUserList.indexOf(profile.uid) == -1) {
          this.selectedUserList.push(profile.uid);
        }
      });

    } else {
      // Remove User & Group
      let index = this.selectedGroupList.indexOf(selectedGroup.gid);
      this.selectedGroupList.splice(index, 1);
      allUser.forEach(profile => {
        if (this.selectedUserList.indexOf(profile.uid) > -1) {
          let userIndex = this.selectedUserList.indexOf(profile.uid);
          this.selectedUserList.splice(userIndex, 1);
        }
      });
    }
  }


  toggleUserSelected(index: number) {
    let selectedUser = this.userList[index];

    if (this.selectedUserList.indexOf(selectedUser.uid) == -1) {
      // Add User
      this.selectedUserList.push(selectedUser.uid);
    } else {
      // Remove User
      let index = this.selectedUserList.indexOf(selectedUser.uid);
      this.selectedUserList.splice(index, 1);

      this.userGroupMap.forEach((value: Array<Profile>, gid: string) => {
        let groupIndex = this.selectedGroupList.indexOf(gid); 
        if (groupIndex > -1) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].uid == selectedUser.uid) {
              this.selectedGroupList.splice(groupIndex, 1);
              break;
            }
          }
        }
      })
    }
  }


  isUserSelected(uid: string) {
    return this.selectedUserList.indexOf(uid) != -1;
  }

  isGroupSelected(gid: string) {
    return this.selectedGroupList.indexOf(gid) != -1;
  }

  isShareEnabled() {
    return this.selectedUserList.length > 0;
  }

  selectAll() {
    this.zone.run(() => {
      for (let i = 0; i < this.groupList.length; i++) {
        this.toggleGroupSelected(i);
      }
    });
  }

  share() {
    let profileExportRequest: ProfileExportRequest = {
      userIds: this.selectedUserList,
      groupIds: this.selectedGroupList,
      destinationFolder: this.fileUtil.internalStoragePath()
    }

    let loader = this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });

    loader.present();

    this.profileService.exportProfile(profileExportRequest, (path) => {
      path = JSON.parse(path);
      loader.dismiss();
      this.socialShare.share("", "", "file://" + path.exportedFilePath, "");
    }, (err) => {
      loader.dismiss();
    });
  }
}