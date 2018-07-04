import { TranslateService } from '@ngx-translate/core';
import { MembersPage } from './../members/members';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {
  group = {}

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService) {
  }

 

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateGroupPage');
  }
  addMembers(){
    console.log(this.group);
    this.navCtrl.push(MembersPage, {
      item: this.group
    });
  }
}
