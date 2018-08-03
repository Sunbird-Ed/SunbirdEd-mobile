import {
  Component,
  NgZone
} from '@angular/core';
import {
  NavController,
  LoadingController,
  NavParams
} from 'ionic-angular';
import { ReportListPage } from './report-list/report-list';
import {
  ReportService,
  ProfileService,
  GroupService,
  ProfileRequest,
  GroupRequest,
  ImpressionType,
  InteractType,
  InteractSubtype,
  PageId,
  Environment
} from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

@Component({
  selector: 'reports-page',
  templateUrl: 'reports.html'
})
export class ReportsPage {
  report: string = 'users';
  otherUsers;
  currentUser: {};
  groups;
  currentGroups: {};
  private profileDetails: any;

  constructor(private navCtrl: NavController,
    private reportService: ReportService,
    private profileService: ProfileService,
    private groupService: GroupService,
    private ngZone: NgZone,
    private loading: LoadingController,
    private navParams: NavParams,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.profileDetails = this.navParams.get('profile');
  }

  async populateUsers() {
    let that = this;

    return new Promise<Array<any>>((resolve, reject) => {
      let profileRequest: ProfileRequest = {
        local: true
      };
      this.profileService.getAllUserProfile(profileRequest)
        .then((data) => {
          let users = JSON.parse(data)

          that.profileService.getCurrentUser(data => {
            let currentUser = JSON.parse(data);
            if(this.profileDetails){
              if(this.profileDetails.id ===currentUser.uid){
                currentUser.handle=this.profileDetails.firstName;
              }
            }
            users = that.filterOutCurrentUser(users, currentUser);
            resolve([currentUser, users]);
          }, error => {
            console.error("Error", error);
            reject(error);
          })
        })
        .catch((error) => {
          console.log("Something went wrong while fetching user list", error);
          reject(error);
        });
    });
  }

  async populateGroups() {
    let that = this;

    return new Promise<any>((resolve, reject) => {

      let groupRequest: GroupRequest = {
        uid: ""
      }

      that.groupService.getAllGroup(groupRequest)
        .then((groups) => {
          if (groups.result) {
            resolve(groups.result);
          } else {
            resolve();
          }
        })
    });
  }

  ionViewWillEnter() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "", PageId.REPORTS_USER_GROUP, Environment.USER, "", ""
    );
    let loader = this.loading.create({
      spinner: "crescent"
    });
    loader.present();
    let users, cUser, groups;
    this.populateUsers()
      .then(array => {
        cUser = array[0];
        users = array[1];
        return this.populateGroups();
      })
      .then(data => {
        groups = data;
        this.ngZone.run(() => {
          this.groups = groups;
          this.otherUsers = users;
          this.currentUser = cUser;
          loader.dismiss();
        });
      })
      .catch(err => {
        loader.dismiss();
      });
  }

  filterOutCurrentUser(userList, currentUser) {
    return userList.filter(user => {
      return user.uid != currentUser.uid
    })
  }

  goToUserReportList(uid: string) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.REPORTS_USER_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_GROUP
    );
    this.navCtrl.push(ReportListPage, {
      isFromUsers: true,
      uids: [uid]
    });
  }

  goToGroupUserReportList(group) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.REPORTS_GROUP_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_GROUP
    );
    let profileRequest: ProfileRequest = { local: true, groupId: group.gid };
    this.profileService.getAllUserProfile(profileRequest)
    .then(result => {
      let map = new Map<string, string>();
      let users: Array<any> = JSON.parse(result);
      let uids:Array<string> = [];
      users.forEach(user => {
        uids.push(user.uid)
        map.set(user.uid, user.handle);
      })
      this.navCtrl.push(ReportListPage, {
        isFromGroups: true,
        uids: uids,
        users: map
      });
    })
  }
  onReportUserGroupChange(data) {
    let subType = (data == 'users') ? InteractSubtype.REPORTS_USER_SEGMENT_CLICKED : InteractSubtype.REPORTS_GROUP_SEGMENT_CLICKED;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      subType,
      Environment.USER,
      PageId.REPORTS_USER_GROUP
    );
  }
}
