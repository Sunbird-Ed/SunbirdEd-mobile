import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-detail-nav-popover',
  templateUrl: 'group-detail-nav-popover.html',
})
export class GroupDetailNavPopoverPage {

  noUsers = false;
  isActiveGroup = false;
  constructor(
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
