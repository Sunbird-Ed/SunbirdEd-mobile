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
import { TranslateService } from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'group-members.html',
})
export class GroupMembersPage {

  group: Group;
  userList: Array<Profile> = [];
  userSelectionMap: Map<string, boolean> = new Map();

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private groupService: GroupService,
    private profileService: ProfileService,
    private zone: NgZone,
    private loadingCtrl: LoadingController,
    private toastCtrl: LoadingController,
    private translate: TranslateService,
    private telemetryGeneratorService:TelemetryGeneratorService
  ) {
    this.group = this.navParams.get('group');

  }

  ionViewDidLoad(){
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.CREATE_GROUP_USER_SELECTION,
      Environment.USER, this.group.gid ? this.group.gid : "", this.group.gid ? ObjectType.GROUP : ""
    );
  }

  ionViewWillEnter() {
    this.getAllProfile();
  }

  getAllProfile() {
    let profileRequest: ProfileRequest = {
      local: true
    };

    this.zone.run(() => {
      this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
        this.zone.run(() => {
          if (profiles && profiles.length) {
            this.userList = JSON.parse(profiles);
          }
          console.log("UserList", profiles);
        })
      }).catch((error) => {
        console.log("Something went wrong while fetching user list", error);
      });
    });
  }

  toggleSelect(index: number) {
    let value = this.userSelectionMap.get(this.userList[index].uid)
    if (value) {
      value = false;
    } else {
      value = true;
    }
    this.userSelectionMap.set(this.userList[index].uid, value);
  }

  isUserSelected(index: number) {
    console.log("Index", index);
    return Boolean(this.userSelectionMap.get(this.userList[index].uid));
  }

  selectAll() {
    this.userSelectionMap.clear();
    this.zone.run(() => {
      for (var i = 0; i < this.userList.length; i++) {
        this.userSelectionMap.set(this.userList[i].uid, true);
      }
    });
  }

  goTOGuestEdit() {
    this.navCtrl.push(GuestEditProfilePage, {
      isNewUser: true
    });
  }

  /**
   * Internally call create Group
   */
  createGroup() {
    let loader = this.getLoader();
    loader.present();

    let selectedUids: Array<string> = [];
    this.userSelectionMap.forEach((value: Boolean, key: string) => {
      if (value === true) selectedUids.push(key);
    });
    this.groupService.createGroup(this.group)
    .then(res => {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.OTHER,
        InteractSubtype.CREATE_GROUP_SUCCESS,
        Environment.USER,
        PageId.CREATE_GROUP
      );
      let req: AddUpdateProfilesRequest = {
        groupId: res.result.gid,
        uidList: selectedUids
      }
      return this.groupService.addUpdateProfilesToGroup(req);
    })
    .then(success => {
      console.log(success);
      loader.dismiss();
      this.getToast(this.translateMessage('GROUP_CREATE_SUCCESS')).present();
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
    })
    .catch(error => {
      loader.dismiss();
      this.getToast(this.translateMessage('SOMETHING_WENT_WRONG')).present();
      console.log("Error : " + error);
      loader.dismiss();
    });
  }

  /**
 * Returns Loader Object
 */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  /** It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @param {string} field - The field to be added in the language constant
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
  getGradeNameFromCode(data: Profile | Group): string {
    if (data.grade && data.grade.length > 0) {
      let gradeName = [];
      data.grade.forEach(code => {
        if (data.gradeValueMap && data.gradeValueMap[code]) {
          gradeName.push(data.gradeValueMap[code]);
        }
      });

      if (gradeName.length == 0) {
        return data.grade.join(",");
      }

      return gradeName.join(",");
    }

    return ""
  }
}