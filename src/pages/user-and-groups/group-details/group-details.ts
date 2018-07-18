import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';
import { PopoverController } from 'ionic-angular';
import { GroupDetailNavPopoverPage } from '../group-detail-nav-popover/group-detail-nav-popover';
import { CreateGroupPage } from '../create-group/create-group';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  value = [];
  usersList: Array<any> = [
    {
      name: 'Harish BookWala',
      userType: 'student',
      grade: 'Grade 2'
    },
    {
      name: 'Nilesh More',
      userType: 'student',
      grade: 'Kindergarten'
    },
    {
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    }, {
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    }, {
      name: 'Guru Singh',
      userType: 'student',
      grade: 'Grade 1'
    }
  ];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public popOverCtrl: PopoverController,
    public alertCtrl: AlertController
  ) {
    this.value = this.navParams.get('item');
  }

  presentPopoverNav(myEvent) {
    console.log("clicked nav popover")
    let self = this;
    let popover = this.popOverCtrl.create(GroupDetailNavPopoverPage, {
      goToEditGroup: function () {
        console.log('go to edit group');
        self.navCtrl.push(CreateGroupPage, {
          groupInfo: { name: 'class4A' }
        })
        popover.dismiss();
      },
      deleteGroup: function () {
        self.DeleteGroupConfirmBox();
        popover.dismiss()
      },
      addUsers: function () {
        console.log('go to add users');
      },
      removeUser: function () {
        console.log('go to remove user');
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
  DeleteGroupConfirmBox() {
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
