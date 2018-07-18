import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the AddOrRemoveGroupUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-or-remove-group-user',
  templateUrl: 'add-or-remove-group-user.html',
})
export class AddOrRemoveGroupUserPage {

  addUsers:boolean  = true;

  usersList: Array<any> = [
    {
      name: "Anirudh Deep",
      profession: "Student",
      selected: false
    },
    {
      name: "Ananya Suresh",
      profession: "Student",
      selected: false
    },
    {
      name: "Rajesh  Verma",
      profession: "Student",
      selected: false
    }
  ];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    public translate: TranslateService
  ) {
    this.addUsers = this.navParams.get('isAddUsers');

  }

  selectAll() {
    this.zone.run(() => {
      for (var i = 0; i < this.usersList.length; i++) {
        this.usersList[i].selected = true;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOrRemoveGroupUserPage');
  }

}
