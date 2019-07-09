import {Component, Inject, NgZone} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {
  GetAllProfileRequest,
  Group,
  GroupService,
  Profile,
  ProfileService,
  ProfilesToGroupRequest,
  ProfileType
} from 'sunbird-sdk';
import {GuestEditProfilePage} from '../../profile/guest-edit.profile/guest-edit.profile';
import {TelemetryGeneratorService} from '../../../service/telemetry-generator.service';
import {CommonUtilService} from '../../../service/common-util.service';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  ObjectType,
  PageId
} from '../../../service/telemetry-constants';
import { AppHeaderService } from '@app/service';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'group-members.html',
})
export class GroupMembersPage {
  ProfileType = ProfileType;
  group: Group;
  userList: Array<Profile> = [];
  userSelectionMap: Map<string, boolean> = new Map();
  lastCreatedProfileData: any;
  loading: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    @Inject('GROUP_SERVICE') private groupService: GroupService,
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    private zone: NgZone,
    private loadingCtrl: LoadingController,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private headerService: AppHeaderService
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
    this.headerService.hideHeader();
    this.getAllProfile();
  }

  // method below fetches the last created user
  getLastCreatedProfile() {
    return new Promise((resolve, reject) => {
      const req: GetAllProfileRequest = {
        local: true
      };
      this.profileService.getAllProfiles(req)
        .map((profiles) => profiles.filter((profile) => !!profile.handle))
        .toPromise().then((lastCreatedProfile: any) => {
        this.lastCreatedProfileData = lastCreatedProfile;
        resolve(lastCreatedProfile);
      }).catch(() => {
        reject(null);
      });
    });
  }

  getAllProfile() {
    const profileRequest: GetAllProfileRequest = {
      local: true
    };

    this.zone.run(() => {
      this.profileService.getAllProfiles(profileRequest)
        .map((profiles) => profiles.filter((profile) => !!profile.handle))
        .toPromise().then((profiles) => {
        const loader = this.getLoader();
        loader.present();
        this.zone.run(() => {
          if (profiles && profiles.length) {
            this.userList = profiles;
            loader.dismiss();
            this.loading = false;
          }
        });
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
      .toPromise().then(res => {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.OTHER,
        InteractSubtype.CREATE_GROUP_SUCCESS,
        Environment.USER,
        PageId.CREATE_GROUP
      );
      const req: ProfilesToGroupRequest = {
        groupId: res.gid,
        uidList: selectedUids
      };
      return this.groupService.addProfilesToGroup(req).toPromise();
    })
      .then(success => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('GROUP_CREATE_SUCCESS'));
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
      })
      .catch(error => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
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
        if (data['gradeValue'] && data['gradeValue'][code]) {
          gradeName.push(data['gradeValue'][code]);
        }
      });
      console.log('gradevalue is ', data['gradeValue']);
      if (gradeName.length === 0) {
        return data.grade.join(',');
      }

      return gradeName.join(',');
    }

    return '';
  }
}
