import { Component } from '@angular/core';
//import { ReportListPage } from '../reports/report-list/report-list'
import { NavController } from 'ionic-angular';
import { GroupListPage } from './group-list/group-list';
import {ReportService, ProfileService, GroupService, ProfileRequest} from 'sunbird';
import * as _ from 'lodash';

@Component({
  selector: 'reports-page',
  templateUrl: 'reports.html'
})
export class ReportsPage {
  report: string = 'users';
  users;
  currentUser: {};
  groups;
  currentGroups: {};
  constructor(private navCtrl:NavController, public reportService: ReportService, public profileService: ProfileService, public groupService: GroupService) {}

  ionViewWillEnter() {
    let that = this;
    let profileRequest: ProfileRequest = {
      local: true
    };
    this.profileService.getAllUserProfile(profileRequest).then((users) => {
      users = JSON.parse(users)
      that.profileService.getCurrentUser(currentUser => {
        currentUser = JSON.parse(currentUser);
        users = _.filter(users, function(user) {
          return user.uid != currentUser.uid
        })
        that.users = users;
        that.currentUser = currentUser;
      }, error => {
        console.error("Error", error)
        return null;
      })
    }).catch((error) => {
      console.log("Something went wrong while fetching user list", error);
      return null;
    })
    this.groupService.getAllGroup().then((groups) => {
      if (groups.result && groups.result.length) {
        that.groups = groups;
      }
    })
  }

  goToReportList(user){
    this.navCtrl.push(GroupListPage, {
      isFromUsers: true
    });
  }
  goToGroupList(){
    this.navCtrl.push(GroupListPage, {
      isFromGroups:true
    });
}
}
