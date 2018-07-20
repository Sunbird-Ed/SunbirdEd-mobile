import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

/**
 * Generated class for the GroupDetailNavPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-detail-nav-popover',
  templateUrl: 'group-detail-nav-popover.html',
})
export class GroupDetailNavPopoverPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
  ) {
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
