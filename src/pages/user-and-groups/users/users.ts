//import { PopoverPage } from './../popover/popover';
//import { CreateUserPage } from './../create-user/create-user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ActionSheetController } from 'ionic-angular';
import { CreateuserPage } from '../createuser/createuser';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  profession: any;
  fullname: any;
  value: any;
  showStyle: false;
  isShow = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController) {
    this.value = this.navParams.get('item');
    if (this.value) {
      this.isShow = false;
      this.fullname = this.value[0].fullname;
      if (this.value[0].student == true) {
        this.profession = "student";
      }
      else {
        this.profession = "teacher";
      }
    }
  }
  getStyle() {
    if (this.showStyle) {
      return "1px solid #488aff";
    } else {
      return "";
    }
  }
  // presentPopover(myEvent) {
  //   let popover = this.popoverCtrl.create(PopoverPage);
  //   popover.present({
  //     ev: myEvent
  //   });
  // }


  createUser() {
    this.navCtrl.push(CreateuserPage, {})
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to switch accounts you will be signed out from your currently logged account ',
      buttons: [
        {
          text: 'CANCEL',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'OKAY',
          handler: () => {
            console.log('Archive clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }


}
