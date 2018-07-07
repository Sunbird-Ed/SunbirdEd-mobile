import { GrouplandingPage } from './../grouplanding/grouplanding';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupService, Group } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  group: Group;
  users = [
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
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupService: GroupService
  ) {
    this.group = this.navParams.get('group');
  }


  selectedMember(name, profession) {

  }

  selectAll() {
    for (var i = 0; i < this.users.length; i++) {
      this.users[i].selected = true;
    }
  }

  createGroup() {
    this.groupService.createGroup(this.group)
      .then((val) => {
        console.log("Result", val);
        //this.navCtrl.push(GrouplandingPage);
        this.navCtrl.remove(this.navCtrl.getActive().index, 2);
      }).catch((error) => {
        console.log("Error : " + error);
      });
  }
}