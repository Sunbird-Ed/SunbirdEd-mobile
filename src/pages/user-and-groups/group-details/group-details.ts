import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';
import { PopoverController } from 'ionic-angular';
import { GroupDetailNavPopoverPage } from '../group-detail-nav-popover/group-detail-nav-popover';

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
  constructor(public navCtrl: NavController, public navParams: NavParams
              , public translate: TranslateService , public popOverCtrl: PopoverController) {
    this.value = this.navParams.get('item');
  }

  presentPopoverNav(myEvent) {
    console.log("clicked nav popover")
    let popover = this.popOverCtrl.create(GroupDetailNavPopoverPage, {},
      {
        cssClass: 'groupDetails-popover'
      });
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

}
