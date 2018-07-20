import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Profile,
  ProfileRequest,
  GroupService,
  ProfileService
} from 'sunbird';

/**
 * Generated class for the AddOrRemoveGroupUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-or-remove-group-user',
  templateUrl: 'add-or-remove-group-user.html',
})
export class AddOrRemoveGroupUserPage {

  addUsers: boolean = true;
  userList: Array<Profile> = [];
  userSelectionMap: Map<string, boolean> = new Map();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    public zone: NgZone,
    public translate: TranslateService
  ) {
    this.addUsers = this.navParams.get('isAddUsers');
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
            this.userList = JSON.parse(profiles);
          }
          console.log("UserList", profiles);
        })
      }).catch((error) => {
        console.log("Something went wrong while fetching user list", error);
      });
    });
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
    console.log("Index", index);
    return Boolean(this.userSelectionMap.get(this.userList[index].uid));
  }

  selectAll() {
    this.userSelectionMap.clear();
    this.zone.run(() => {
      for (var i = 0; i < this.userList.length; i++) {
        this.userSelectionMap.set(this.userList[i].uid, true);
      }
    });
  }

}
