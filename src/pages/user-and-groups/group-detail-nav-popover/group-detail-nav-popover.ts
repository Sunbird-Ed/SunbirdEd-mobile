import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-detail-nav-popover',
  templateUrl: 'group-detail-nav-popover.html',
})
export class GroupDetailNavPopoverPage {

  noUsers: boolean = false;
  isActiveGroup: boolean = false;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
  ) {
    this.isActiveGroup = this.navParams.get('isActiveGroup');
    this.noUsers = Boolean(this.navParams.get('noUsers'));
  }

  goToEditGroup() {
    this.navParams.get('goToEditGroup')();
  }

  deleteGroup() {
    this.navParams.get('deleteGroup')();
  }

  addUsers() {
    this.navParams.get('addUsers')();
  }

  removeUser() {
    this.navParams.get('removeUser')();
  }

}
