import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  value = [];
  constructor(public navCtrl: NavController, public navParams: NavParams
              , public translate: TranslateService) {
    this.value = this.navParams.get('item');
  }
}
