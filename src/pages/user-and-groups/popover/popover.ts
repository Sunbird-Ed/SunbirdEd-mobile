//import { CreateGroupPage } from './../create-group/create-group';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  delete() {
    this.navParams.get('delete')(); 
  }   
  edit(){
    this.navParams.get('edit')();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}
