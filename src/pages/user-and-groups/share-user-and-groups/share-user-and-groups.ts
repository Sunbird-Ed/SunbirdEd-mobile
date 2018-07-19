import {
  Component,
  NgZone
} from '@angular/core';
import {
  NavController,
  NavParams
} from 'ionic-angular';
import {
  GroupService,
  Group,
  Profile,
  ProfileRequest,
  ProfileService
} from 'sunbird';

@Component({
  selector: 'page-share-user-and-groups',
  templateUrl: 'share-user-and-groups.html',
})
export class ShareUserAndGroupPage {

  groupName: Group;
  userList: Array<Profile> = [];
  groupList: Array<Group> = [];

  userSelectionMap: Map<string, boolean> = new Map();
  groupSelectionMap: Map<string, boolean> = new Map();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone
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
        console.log("GroupList", groups);
      }).catch((error) => {
        console.log("Something went wrong while fetching data", error);
      });
    })
  }

  toggleSelect(index: number) {
    let value = this.userSelectionMap.get(this.userList[index].uid)
    if (value) {
      value = false;
    } else {
      value = true;
    }
    this.userSelectionMap.set(this.userList[index].uid, value);
  }

  isUserSelected(index: number) {
    return this.userSelectionMap.get(this.userList[index].uid);
  }

  isGroupSelected(index: number) {
    return this.groupSelectionMap.get(this.groupList[index].gid);
  }

  selectAll() {
    this.zone.run(() => {
      for (var i = 0; i < this.userList.length; i++) {
        // this.userList[i].selected = true;
      }
    });
  }

  share() {

  }
}