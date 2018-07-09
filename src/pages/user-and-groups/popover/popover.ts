import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  isCurrentUser: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
    this.isCurrentUser = this.navParams.get('isCurrentUser');
  }
  delete() {
    this.navParams.get('delete')();
  }
  edit() {
    this.navParams.get('edit')();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}