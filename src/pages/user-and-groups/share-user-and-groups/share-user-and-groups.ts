import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupService, Group, UserProfileSkillsRequest } from 'sunbird';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';

@Component({
  selector: 'page-share-user-and-groups',
  templateUrl: 'share-user-and-groups.html',

})
export class ShareUserAndGroupPage {
  groupName: Group;
  noMemberSection: boolean = true;
  usersList: Array<any> = [
    {
      name: "Anirudh Deep",
      profession: "Student",
      selected: false,
      groupName: 'Class 4A',
      noOfUsers: '2 users'
    },
    {
      name: "Ananya Suresh",
      profession: "Student",
      selected: false,
      groupName: 'English Group',
      noOfUsers: '10 users'
    },
    {
      name: "Rajesh  Verma",
      profession: "Student",
      selected: false,
      groupName: 'Maths Group',
      noOfUsers: '20 users'
    }
  ];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private groupService: GroupService,
    private zone: NgZone
  ) {
    this.groupName = this.navParams.get('group');
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
  createGroup() {
    this.groupService.createGroup(this.groupName)
      .then((val) => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
      }).catch((error) => {
        console.log("Error : " + error);
      });
  }
}