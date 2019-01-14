import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';


@Component({
  selector: 'edit-contact-details-popup',
  templateUrl: 'edit-contact-details-popup.html'
})
export class EditContactDetailsPopupComponent {

  phone: string;

  constructor(private navParams: NavParams) {
    this.phone = this.navParams.get('phone');
    console.log('Phone', this.phone);
  }

}
