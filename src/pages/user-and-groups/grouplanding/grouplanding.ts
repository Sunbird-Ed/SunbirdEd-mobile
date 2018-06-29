import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateGroupPage } from './../create-group/create-group';
import { GroupMemberPage } from '../group-member/group-member';

/**
 * Generated class for the GrouplandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-grouplanding',
  templateUrl: 'grouplanding.html',
})
export class GrouplandingPage {
  bar;
  value = [];
  groupName:any;
  isShow:boolean  = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.bar = "Groups";
    this.value = this.navParams.get('item');
    if(this.value){
      this.isShow = true;
      this.groupName = this.value[0]
    }
    else{
      this.isShow = false;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GrouplandingPage');
  }

  createGroup(){
    this.navCtrl.push(CreateGroupPage, {
    });
    
  }
  members(){
    this.navCtrl.push(GroupMemberPage , {
      item:this.value
    })

  }
}
