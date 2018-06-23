import { GrouplandingPage } from './../grouplanding/grouplanding';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  value
  arr = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.value = this.navParams.get('item');
    console.log(this.arr);
    this.arr.push(this.value.groupName);

  }

  users =[
    {
      "name":"Anirudh Deep",
      "profession": "Student",
       selected: false
    },
    {
      "name":"Ananya Suresh",
      "profession": "Student",
       selected: "false"
    },
    {
      "name":"Rajesh  Verma",
      "profession": "Student",
       selected: "false"
    }
    
  ]
  allUsers = this.users;

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
  }

  selectedMember(name ,profession ){
    this.arr.push({"name":name , "profession": profession})
    console.log(this.arr);

  }
  selectall(){
    for(var i=0; i< this.users.length; i++){
        this.users[i].selected = true;
        this.arr.push(this.users[i]);
      } 
    // this.arr.push(this.users);
    console.log(this.arr);
  }
  createGroup(){
    this.navCtrl.push(GrouplandingPage, {
      item: this.arr
    });
  }

}
