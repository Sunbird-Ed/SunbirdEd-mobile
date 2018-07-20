import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
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
  ProfileService
} from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  value = [];
  userList: Array<Profile> = [];
  groupInfo : any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone,
    private translate: TranslateService,
    private popOverCtrl: PopoverController,
    private alertCtrl: AlertController
  ) {
    this.value = this.navParams.get('item');
    this.groupInfo = this.navParams.get('groupInfo'); 
    console.log('groupInfo is',this.groupInfo);
  }

  ionViewWillEnter() {
    this.getAllProfile();
  }

  getAllProfile() {
    let profileRequest: ProfileRequest = {
      local: true,
      gid: this.groupInfo.gid
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

  presentPopoverNav(myEvent) {
    console.log("clicked nav popover")
    let self = this;
    let popover = this.popOverCtrl.create(GroupDetailNavPopoverPage, {
      goToEditGroup: function () {
        console.log('go to edit group');
        self.navCtrl.push(CreateGroupPage)
        popover.dismiss();
      },
      deleteGroup: function () {
        self.deleteGroupConfirmBox();
        popover.dismiss();
      },
      addUsers: function () {
        self.navCtrl.push(AddOrRemoveGroupUserPage, {
          isAddUsers: true
        });
        popover.dismiss();
      },
      removeUser: function () {
        self.navCtrl.push(AddOrRemoveGroupUserPage, {
          isAddUsers: false
        });
        popover.dismiss();
      }
    },
      {
        cssClass: 'groupDetails-popover'
      })
    popover.present({
      ev: myEvent
    });
  }

  presentPopover(myEvent, user) {
    console.log(user);
    let popover = this.popOverCtrl.create(PopoverPage, {},
      {
        cssClass: 'user-popover'
      });
    popover.present({
      ev: myEvent
    });
  }

  /** Delete alert box */
  deleteGroupConfirmBox() {
    let self = this;
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

}
