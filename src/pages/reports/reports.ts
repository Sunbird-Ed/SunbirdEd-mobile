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
  ProfileService,
  GroupService,
  ProfileRequest,
  GroupRequest,
  InteractSubtype,
  InteractType,
  PageId,
  Environment,
  ImpressionType,
  TelemetryObject,
  ObjectType
} from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

@Component({
  selector: 'reports-page',
  templateUrl: 'reports.html'
})
export class ReportsPage {
  report = 'users';
  otherUsers;
  currentUser: {};
  groups;
  currentGroups: {};
  private profileDetails: any;

  constructor(private navCtrl: NavController,
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
    const that = this;

    return new Promise<Array<any>>((resolve, reject) => {
      const profileRequest: ProfileRequest = {
        local: true
      };
      this.profileService.getAllUserProfile(profileRequest)
        .then((data) => {
          let users = JSON.parse(data);

          that.profileService.getCurrentUser().then((profile: any) => {
            const currentUser = JSON.parse(profile);
            if (this.profileDetails) {
              if (this.profileDetails.id === currentUser.uid) {
                currentUser.handle = this.profileDetails.firstName;
              }
            }
            users = that.filterOutCurrentUser(users, currentUser);
            resolve([currentUser, users]);
          }) .catch(error => {
            console.error('Error', error);
            reject(error);
          });
        })
        .catch((error) => {
          console.log('Something went wrong while fetching user list', error);
          reject(error);
        });
    });
  }

  async populateGroups() {
    const that = this;

    return new Promise<any>((resolve) => {

      const groupRequest: GroupRequest = {
        uid: ''
      };

      that.groupService.getAllGroup(groupRequest)
        .then((groups) => {
          if (groups.result) {
            resolve(groups.result);
          } else {
            resolve();
          }
        });
    });
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      Environment.USER,
      PageId.REPORTS_USER_GROUP
    );
    const loader = this.loading.create({
      spinner: 'crescent'
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
      .catch(() => {
        loader.dismiss();
      });
  }

  filterOutCurrentUser(userList, currentUser) {
    return userList.filter(user => {
      return user.uid !== currentUser.uid;
    });
  }

  goToUserReportList(uid: string , handle: string) {

    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = uid;
    telemetryObject.type = ObjectType.USER;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.USER_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_GROUP,
      telemetryObject
    );

    this.navCtrl.push(ReportListPage, {
      isFromUsers: true,
      uids: [uid],
      handle: handle
    });
  }

  goToGroupUserReportList(group) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = group.gid;
    telemetryObject.type = ObjectType.GROUP;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.GROUP_CLICKED,
      Environment.USER,
      PageId.REPORTS_USER_GROUP,
      telemetryObject
    );
    const profileRequest: ProfileRequest = { local: true, groupId: group.gid };
    this.profileService.getAllUserProfile(profileRequest)
      .then(result => {
        const map = new Map<string, string>();
        const users: Array<any> = JSON.parse(result);
        const uids: Array<string> = [];
        users.forEach(user => {
          uids.push(user.uid);
          map.set(user.uid, user.handle);
        });
        this.navCtrl.push(ReportListPage, {
          isFromGroups: true,
          uids: uids,
          users: map,
          group: group
        });
      });
  }

  onSegmentChange(data) {
    const subType = (data === 'users') ? InteractSubtype.USERS_TAB_CLICKED : InteractSubtype.GROUPS_TAB_CLICKED;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      subType,
      Environment.USER,
      PageId.REPORTS_USER_GROUP
    );

    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      Environment.USER,
      PageId.REPORTS_USER_GROUP
    );
  }

}
