import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Profile,
  ProfileRequest,
  GroupService,
  ProfileService,
  Group,
  AddUpdateProfilesRequest
} from 'sunbird';
import * as _ from 'lodash';
import { LoadingController } from 'ionic-angular';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';


/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@IonicPage()
@Component({
  selector: 'page-add-or-remove-group-user',
  templateUrl: 'add-or-remove-group-user.html',
})
export class AddOrRemoveGroupUserPage {

  addUsers: boolean = true;
  userSelectionMap: Map<string, boolean> = new Map();
  memberSelectionMap: Map<string, boolean> = new Map();
  uniqueUserList: Array<Profile>;
  groupInfo: Group;
  groupMembers: Array<Profile>;
  uid: any;
  allUsers: Array<Profile> = [];

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    public zone: NgZone,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {
    this.addUsers = this.navParams.get('isAddUsers');
    this.groupInfo = this.navParams.get('groupInfo');
    this.groupMembers = this.navParams.get('groupMembers');
  }

  ionViewWillEnter() {
    this.getAllProfile();
  }

  getAllProfile() {
    let profileRequest: ProfileRequest = {
      local: true
    };

    this.profileService.getAllUserProfile(profileRequest)
      .then(profiles => {
        this.allUsers = JSON.parse(profiles);
        let uniqueUserList = this.allUsers.filter(e => {
          let found = this.groupMembers.find(m => {
            return m.uid === e.uid;
          });
          return found === undefined;
        });
        this.zone.run(() => {
          this.uniqueUserList = uniqueUserList;

          if(!this.addUsers) {
            this.uniqueUserList.forEach((element, index) => {
              this.userSelectionMap.set(this.uniqueUserList[index].uid, true);
            });

            this.groupMembers.forEach((element, index) => {
              this.memberSelectionMap.set(this.groupMembers[index].uid, true);
            });
          }
        })
      })
      .catch((error) => {
        console.log("Something went wrong while fetching user list", error);
      });
  }

  toggleSelect(index: number) {
    let value = this.userSelectionMap.get(this.uniqueUserList[index].uid)
    if (value) {
      value = false;
    } else {
      value = true;
    }
    this.userSelectionMap.set(this.uniqueUserList[index].uid, value);
  }

  toggleMemberSelect(index: number) {
    let value = this.memberSelectionMap.get(this.groupMembers[index].uid)
    if (value) {
      value = false;
    } else {
      value = true;
    }
    this.memberSelectionMap.set(this.groupMembers[index].uid, value);
  }
  goToEditGroup(index) {
    this.navCtrl.push(GuestEditProfilePage, {

    })
  }

  isUserSelected(index: number) {
    console.log("Index", index);
    return Boolean(this.userSelectionMap.get(this.uniqueUserList[index].uid));
  }

  isGroupMemberSelected(index: number) {
    return Boolean(this.memberSelectionMap.get(this.groupMembers[index].uid));
  }

  selectAll() {
    this.userSelectionMap.clear();
    this.zone.run(() => {
      for (var i = 0; i < this.uniqueUserList.length; i++) {
        this.userSelectionMap.set(this.uniqueUserList[i].uid, true);
      }
    });
  }

  unselectAll() {
    this.memberSelectionMap.clear();
    this.userSelectionMap.clear();
    this.zone.run(() => {
      for (var i = 0; i < this.uniqueUserList.length; i++) {
        this.memberSelectionMap.set(this.groupMembers[i].uid, false);
      }
      for (var i = 0; i < this.uniqueUserList.length; i++) {
        this.userSelectionMap.set(this.uniqueUserList[i].uid, false);
      }
    });
  }

  remove() {
    let loader = this.getLoader();
    loader.present();
    let selectedUids: Array<string> = [];

    this.groupMembers.forEach((item) => {
      if (Boolean(this.memberSelectionMap.get(item.uid))) {
        selectedUids.push(item.uid);
      }
    });

    let req: AddUpdateProfilesRequest = {
      groupId: this.groupInfo.gid,
      uidList: selectedUids
    }

    this.groupService.addUpdateProfilesToGroup(req)
    .then((success) => {
      console.log(success);
      loader.dismiss();
      this.getToast(this.translateMessage('GROUP_MEMBER_DELETE_SUCCESS')).present();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
    })
    .catch((error) => {
      loader.dismiss();
      this.getToast(this.translateMessage('SOMETHING_WENT_WRONG')).present();
      console.log("Error : " + error);
      loader.dismiss();
    });

  }

  add() {
    let loader = this.getLoader();
    loader.present();
    let groupMembersUids: Array<string> = [];
    let selectedUids: Array<string> = [];

    this.groupMembers.forEach(element => {
      groupMembersUids.push(element.uid);
    });

    this.uniqueUserList.forEach((item) => {
      if (Boolean(this.userSelectionMap.get(item.uid))) {
        selectedUids.push(item.uid);
      }
    });

    let req: AddUpdateProfilesRequest = {
      groupId: this.groupInfo.gid,
      uidList: groupMembersUids.concat(selectedUids)
    }
    this.groupService.addUpdateProfilesToGroup(req)
    .then((success) => {
      console.log(success);
      loader.dismiss();
      this.getToast(this.translateMessage('GROUP_MEMBER_ADD_SUCCESS')).present();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
    })
    .catch((error) => {
      loader.dismiss();
      this.getToast(this.translateMessage('SOMETHING_WENT_WRONG')).present();
      console.log("Error : " + error);
      loader.dismiss();
    });

  }

  /**
* Returns Loader Object
*/
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  /** It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @param {string} field - The field to be added in the language constant
   * @returns {string} translatedMsg - Translated Message
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
}
