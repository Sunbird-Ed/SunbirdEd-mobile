import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GroupMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-member.html',
})
export class GroupMemberPage {
  value = [];
  constructor(public navCtrl: NavController, public navParams: NavParams
              , public translate: TranslateService) {
    this.value = this.navParams.get('item');
  }

}
