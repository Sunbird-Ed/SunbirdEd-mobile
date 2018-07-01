import { TranslateService } from '@ngx-translate/core';
import { UsersPage } from './../users/users';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateuserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createuser',
  templateUrl: 'createuser.html',
})
export class CreateuserPage {
  user = {};
 value = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public translate: TranslateService) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateUserPage');
  }

  saveUser(){
    console.log(this.user);

     this.value.push(this.user);
     console.log(this.value[0].fullname , this.value[0].student);
    this.navCtrl.push(UsersPage , {
       item: this.value
    })
  }

}
