import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupService, Group } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  groupName: Group;
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
    private groupService: GroupService,
    private zone: NgZone
  ) {
    this.groupName = this.navParams.get('group');
  }


  toggleSelect(index: number) {
    this.usersList[index].selected = !this.usersList[index].selected;
  }

  selectAll() {
    this.zone.run(()=> {
      for (var i = 0; i < this.usersList.length; i++) {
        this.usersList[i].selected = true;
      }
    });
  }

  createGroup() {
    this.groupService.createGroup(this.groupName)
      .then((val) => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
      }).catch((error) => {
        console.log("Error : " + error);
      });
  }
}