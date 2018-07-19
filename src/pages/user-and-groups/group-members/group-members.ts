import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  GroupService,
  Group,
  ProfileRequest,
  Profile,
  ProfileService,
  AddUpdateProfilesRequest
} from 'sunbird';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'group-members.html',
})
export class GroupMembersPage {

  group: Group;
  noMemberSection: boolean = true;
  usersList: Array<Profile> = [];
  userSelectionMap: Map<string, boolean> = new Map();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone
  ) {
    this.group = this.navParams.get('group');
  }

  ionViewWillEnter() {
    this.getAllProfile();
  }

  getAllProfile() {
    let profileRequest: ProfileRequest = {
      local: true
    };

    this.zone.run(() => {
      this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
        this.zone.run(() => {
          if (profiles && profiles.length) {
            this.usersList = JSON.parse(profiles);
            this.noMemberSection = false;
          }
          console.log("UserList", profiles);
        })
      }).catch((error) => {
        console.log("Something went wrong while fetching user list", error);
      });
    });
  }

  toggleSelect(index: number) {
    let value = this.userSelectionMap.get(this.usersList[index].uid)
    if (value) {
      value = false;
    } else {
      value = true;
    }
    this.userSelectionMap.set(this.usersList[index].uid, value);
  }

  isUserSelected(index: number) {
    console.log("Index", index);
    return Boolean(this.userSelectionMap.get(this.usersList[index].uid));
  }

  selectAll() {
    this.userSelectionMap.clear();
    this.zone.run(() => {
      for (var i = 0; i < this.usersList.length; i++) {
        this.userSelectionMap.set(this.usersList[i].uid, true);
      }
    });
  }

  goTOGuestEdit() {
    this.navCtrl.push(GuestEditProfilePage)
  }

  /**
   * Internally call create Group
   */
  createGroup() {
    //    this.userSelectionMap.forEach(this.logMapElements);  //Need for code optimize
    let selectedUids: Array<string> = [];
    this.usersList.forEach((item) => {
      if (Boolean(this.userSelectionMap.get(item.uid))) {
        selectedUids.push(item.uid);
      }
    });
    this.groupService.createGroup(this.group)
      .then((res) => {
        let req: AddUpdateProfilesRequest = {
          groupId: res.result.gid,
          uidList: selectedUids
        }
        this.groupService.addUpdateProfilesToGroup(req).then((success) => {
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
        });
      }).catch((error) => {
        console.log("Error : " + error);
      });
  }

  logMapElements(value, key, map) {
    if (value) {
      this.group.uids.push(key);
    }
    console.log(`m[${key}] = ${value}`);
  }

}