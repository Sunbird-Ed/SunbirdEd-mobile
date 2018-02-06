import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController) {

  }

  editEduDetails() {
    this.navCtrl.push(FormEducation);
  }

  editAddress() {
    this.navCtrl.push(FormAddress);
  }

}
