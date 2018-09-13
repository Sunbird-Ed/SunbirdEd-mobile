import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {
  TabsPage, SharedPreferences,
  InteractType, InteractSubtype,
  Environment, PageId, ImpressionType,
  ContainerService,
  Profile,
  UserSource
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import { ProfileType, ProfileService } from 'sunbird'
import { Map } from '../../app/telemetryutil';
import { initTabs, GUEST_TEACHER_TABS, GUEST_STUDENT_TABS } from '../../app/module.service';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';

const selectedCardBorderColor = '#006DE5';
const borderColor = '#F7F7F7';
const KEY_SELECTED_USER_TYPE = "selected_user_type";

@Component({
  selector: 'page-user-type-selection',
  templateUrl: 'user-type-selection.html',
})

export class UserTypeSelectionPage {

  userTypes: Array<string>;
  teacherContents: Array<string>;
  studentContents: Array<string>;
  allContents: Array<Array<string>> = [];
  teacherCardBorderColor: string = '#F7F7F7';
  studentCardBorderColor: string = '#F7F7F7';
  userTypeSelected: boolean = false;
  selectedUserType: ProfileType;
  continueAs: string = "";
  language: string;
  profile: Profile;

  /**
   * Contains paths to icons
   */
  studentImageUri: string = "assets/imgs/ic_student.png";
  teacherImageUri: string = "assets/imgs/ic_teacher.png";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
    private preference: SharedPreferences,
    private profileService: ProfileService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private container: ContainerService,
    private zone: NgZone,
    private event: Events,
    private commonUtilService:CommonUtilService
  ) {
    this.initData();

    this.profile = this.navParams.get('profile');
  }

  initData() {
    let that = this;
    this.translate.get(["ROLE.ROLE_TYPE", "ROLE.TEACHER_CONTENT", "ROLE.STUDENT_CONTENT"])
      .subscribe(val => {
        that.userTypes = val["ROLE.ROLE_TYPE"];
        that.teacherContents = val["ROLE.TEACHER_CONTENT"];
        that.studentContents = val["ROLE.STUDENT_CONTENT"];
        that.allContents.push(that.teacherContents);
        that.allContents.push(that.studentContents);
      });
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.USER_TYPE_SELECTION,
      Environment.HOME, "", "", "");
  }

  selectTeacherCard() {
    this.zone.run(() => {
      this.userTypeSelected = true;
      this.teacherCardBorderColor = selectedCardBorderColor;
      this.studentCardBorderColor = borderColor;
      this.selectedUserType = ProfileType.TEACHER;
      this.continueAs = this.commonUtilService.translateMessage('CONTINUE_AS_ROLE', this.commonUtilService.translateMessage('TEACHER_ROLE'));
      this.preference.putString(KEY_SELECTED_USER_TYPE, this.selectedUserType);
    });
  }

  selectStudentCard() {
    this.zone.run(() => {
      this.userTypeSelected = true;
      this.teacherCardBorderColor = borderColor;
      this.studentCardBorderColor = selectedCardBorderColor;
      this.selectedUserType = ProfileType.STUDENT;
      this.continueAs = this.commonUtilService.translateMessage('CONTINUE_AS_ROLE',this.commonUtilService.translateMessage('STUDENT_ROLE'));
      this.preference.putString(KEY_SELECTED_USER_TYPE, this.selectedUserType)
    });
  }

  continue() {
    this.generateInteractEvent(this.selectedUserType);

    //When user is changing the role via the Guest Profile screen
    if (this.profile !== undefined) {
      //if role types are same
      if (this.profile.profileType === this.selectedUserType) {
        this.gotoTabsPage();
      } else {
        let updateRequest = new Profile();

        updateRequest.handle = this.profile.handle;
        updateRequest.avatar = this.profile.avatar;
        updateRequest.language = this.profile.language;
        updateRequest.uid = this.profile.uid;
        updateRequest.profileType = this.selectedUserType;
        updateRequest.createdAt = this.profile.createdAt;
        updateRequest.source = UserSource.LOCAL;

        updateRequest.syllabus = [];
        updateRequest.board = [];
        updateRequest.grade = [];
        updateRequest.subject = [];
        updateRequest.medium = [];

        this.updateProfile(updateRequest);
      }
    } else {

      let profileRequest = new Profile();
      profileRequest.handle = "Guest1";
      profileRequest.profileType = this.selectedUserType;
      profileRequest.source = UserSource.LOCAL;

      this.setProfile(profileRequest);
    }
  }

  updateProfile(updateRequest: any) {
    this.profileService.updateProfile(updateRequest,
      () => {
        this.gotoTabsPage();
      },
      (err: any) => {
        console.log("Err", err);
      });
  }

  setProfile(profileRequest: any) {
    this.profileService.setCurrentProfile(true, profileRequest, () => {
      this.profileService.getCurrentUser(success => {
        let userId = JSON.parse(success).uid;
        if (userId !== "null")
          this.preference.putString('GUEST_USER_ID_BEFORE_LOGIN', userId);
        this.gotoTabsPage();
      }, error => {
        console.error("Error", error);
        return "null";
      });
    },
      err => {
        console.error("Error", err);
      });
  }

  gotoTabsPage() {
    // Update the Global variable in the AppGlobalService
    this.event.publish(AppGlobalService.USER_INFO_UPDATED);

    if (this.selectedUserType == ProfileType.TEACHER) {
      initTabs(this.container, GUEST_TEACHER_TABS);
    } else if (this.selectedUserType == ProfileType.STUDENT) {
      initTabs(this.container, GUEST_STUDENT_TABS);
    }

    this.navCtrl.push(TabsPage, {
      loginMode: 'guest'
    });
  }
  
  generateInteractEvent(userType) {
    let values = new Map();
    values["UserType"] = userType;
    this.telemetryGeneratorService. generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CONTINUE_CLICKED,
      Environment.HOME,
      PageId.USER_TYPE_SELECTION,
      undefined,
      values);
  }

}
