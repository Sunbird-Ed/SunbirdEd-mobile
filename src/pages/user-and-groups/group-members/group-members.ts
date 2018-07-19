import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupService, Group, UserProfileSkillsRequest } from 'sunbird';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'group-members.html',

})
export class GroupMembersPage {
  group: Group;
  noMemberSection: boolean = true;
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
    this.group = this.navParams.get('group');
    if (this.usersList && this.usersList.length > 0) {
      this.noMemberSection = false;
    }
  }



  toggleSelect(index: number) {
    this.usersList[index].selected = !this.usersList[index].selected;
  }

  selectAll() {
    this.zone.run(() => {
      for (var i = 0; i < this.usersList.length; i++) {
        this.usersList[i].selected = true;
      }
    });
  }

  goTOGuestEdit() {
    this.navCtrl.push(GuestEditProfilePage)
  }

  /**
   * Internally call create Group
   */
  createGroup() {
    this.groupService.createGroup(this.group)
      .then((val) => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
      }).catch((error) => {
        console.log("Error : " + error);
      });
  }
}