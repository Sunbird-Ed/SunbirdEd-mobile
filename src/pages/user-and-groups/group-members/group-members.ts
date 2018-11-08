import {
  Component,
  NgZone
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import {
  GroupService,
  Group,
  ProfileRequest,
  Profile,
  ProfileService,
  AddUpdateProfilesRequest,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  ImpressionType,
  ObjectType
} from 'sunbird';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { CommonUtilService } from '../../../service/common-util.service';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'group-members.html',
})
export class GroupMembersPage {

  group: Group;
  userList: Array<Profile> = [];
  userSelectionMap: Map<string, boolean> = new Map();
  lastCreatedProfileData: any;
  loading: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone,
    private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.group = this.navParams.get('group');
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.CREATE_GROUP_USER_SELECTION,
      Environment.USER, this.group.gid ? this.group.gid : '', this.group.gid ? ObjectType.GROUP : ''
    );
  }

  ionViewWillEnter() {
    this.loading = true; // present only loader, untill users are fetched from service
    this.getAllProfile();
  }

  // method below fetches the last created user
  getLastCreatedProfile() {
    return new Promise((resolve, reject) => {
      const req = {
        local: true,
        latestCreatedProfile: true
      };
      this.profileService.getProfile(req).then((lastCreatedProfile: any) => {
        console.log('lastCreatedProfile: ', lastCreatedProfile);
        this.lastCreatedProfileData = JSON.parse(lastCreatedProfile);
        resolve(JSON.parse(lastCreatedProfile));
      }).catch(error => {
        reject(null);
        console.log('error in fetching last created profile data' + error);
      });
    });
  }

  getAllProfile() {
    const profileRequest: ProfileRequest = {
      local: true
    };

    this.zone.run(() => {
      this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
        const loader = this.getLoader();
        loader.present();
        this.zone.run(() => {
          if (profiles && profiles.length) {
            this.userList = JSON.parse(profiles);
            loader.dismiss();
            this.loading = false;
          }
          console.log('UserList', profiles);
        });
      }).catch((error) => {
        console.log('Something went wrong while fetching user list', error);
      });
    });
  }

  toggleSelect(index: number) {
    let value = this.userSelectionMap.get(this.userList[index].uid);
    if (value) {
      value = false;
    } else {
      value = true;
    }
    this.userSelectionMap.set(this.userList[index].uid, value);
  }

  isUserSelected(index: number) {
    console.log('Index', index);
    return Boolean(this.userSelectionMap.get(this.userList[index].uid));
  }

  selectAll() {
    this.userSelectionMap.clear();
    this.zone.run(() => {
      for (let i = 0; i < this.userList.length; i++) {
        this.userSelectionMap.set(this.userList[i].uid, true);
      }
    });
  }

  goTOGuestEdit() {
    this.getLastCreatedProfile().then((response) => {
      this.navCtrl.push(GuestEditProfilePage, {
        isNewUser: true,
        lastCreatedProfile: this.lastCreatedProfileData
      });
    }).catch((error) => {
      this.navCtrl.push(GuestEditProfilePage, {
        isNewUser: true
      });
    });
  }

  /**
   * Internally call create Group
   */
  createGroup() {
    const loader = this.getLoader();
    loader.present();

    const selectedUids: Array<string> = [];
    this.userSelectionMap.forEach((value: Boolean, key: string) => {
      if (value === true) {
        selectedUids.push(key);
      }
    });
    this.groupService.createGroup(this.group)
      .then(res => {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.CREATE_GROUP_SUCCESS,
          Environment.USER,
          PageId.CREATE_GROUP
        );
        const req: AddUpdateProfilesRequest = {
          groupId: res.result.gid,
          uidList: selectedUids
        };
        return this.groupService.addUpdateProfilesToGroup(req);
      })
      .then(success => {
        console.log(success);
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('GROUP_CREATE_SUCCESS'));
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
      })
      .catch(error => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
        console.log('Error : ' + error);
        loader.dismiss();
      });
  }

  /**
 * Returns Loader Object
 */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
    });
  }

  getGradeNameFromCode(data: Profile | Group): string {
    if (data.grade && data.grade.length > 0) {
      const gradeName = [];
      data.grade.forEach(code => {
        if (data.gradeValueMap && data.gradeValueMap[code]) {
          gradeName.push(data.gradeValueMap[code]);
        }
      });

      if (gradeName.length === 0) {
        return data.grade.join(',');
      }

      return gradeName.join(',');
    }

    return '';
  }
}
