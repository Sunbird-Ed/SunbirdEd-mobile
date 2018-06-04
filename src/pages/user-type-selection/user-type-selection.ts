import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {
  TabsPage, SharedPreferences,
  Interact, TelemetryService, InteractType, InteractSubtype,
  Environment, PageId, ImpressionType,
  ContainerService
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import { ProfileType, ProfileService } from 'sunbird'
import {  Map, generateImpressionTelemetry, generateInteractTelemetry } from '../../app/telemetryutil';
import { initTabs, GUEST_TEACHER_TABS, GUEST_STUDENT_TABS } from '../../app/module.service';
import { AppGlobalService } from '../../service/app-global.service';

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
  profile: any = {};

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
    private telemetryService: TelemetryService,
    private container: ContainerService,
    private zone: NgZone,
    private event: Events
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
    this.telemetryService.impression(
      generateImpressionTelemetry(ImpressionType.VIEW, "",
        PageId.USER_TYPE_SELECTION,
        Environment.HOME, "", "", "",
        undefined,
        undefined)
    );
  }

  ionViewDidEnter() {

  }

  selectTeacherCard() {
    this.zone.run(() => {
      this.userTypeSelected = true;
      this.teacherCardBorderColor = selectedCardBorderColor;
      this.studentCardBorderColor = borderColor;
      this.selectedUserType = ProfileType.TEACHER;
      this.continueAs = this.translateMessage('CONTINUE_AS_ROLE', this.translateMessage('TEACHER_ROLE'));
      this.preference.putString(KEY_SELECTED_USER_TYPE, this.selectedUserType);
      initTabs(this.container, GUEST_TEACHER_TABS);
    });
  }

  selectStudentCard() {
    this.zone.run(() => {
      this.userTypeSelected = true;
      this.teacherCardBorderColor = borderColor;
      this.studentCardBorderColor = selectedCardBorderColor;
      this.selectedUserType = ProfileType.STUDENT;
      this.continueAs = this.translateMessage('CONTINUE_AS_ROLE', this.translateMessage('STUDENT_ROLE'));
      this.preference.putString(KEY_SELECTED_USER_TYPE, this.selectedUserType)
      initTabs(this.container, GUEST_STUDENT_TABS);
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
        let updateRequest = {
          age: -1,
          day: -1,
          month: -1,
          standard: -1,
          board: [],
          grade: [],
          subject: [],
          medium: [],
          handle: this.profile.handle,
          avatar: this.profile.avatar,
          language: this.profile.language,
          uid: this.profile.uid,
          profileType: this.selectedUserType,
          isGroupUser: false,
          createdAt: this.profile.createdAt
        };
        this.updateProfile(updateRequest);
      }
    } else {
      let profileRequest = {
        handle: "Guest1",
        avatar: "avatar",
        language: "en",
        age: -1,
        day: -1,
        month: -1,
        standard: -1,
        profileType: this.selectedUserType
      };
      this.setProfile(profileRequest);
    }
  }

  updateProfile(updateRequest: any) {
    this.profileService.updateProfile(updateRequest,
      (res: any) => {
        console.log("Update Response", res);
        this.gotoTabsPage();
      },
      (err: any) => {
        console.log("Err", err);
      });
  }

  setProfile(profileRequest: any) {
    this.profileService.setCurrentProfile(true, profileRequest, res => {
      this.profileService.getCurrentUser(success => {
        let userId = JSON.parse(success).uid
        if (userId !== "null") this.preference.putString('GUEST_USER_ID_BEFORE_LOGIN', userId);
        this.gotoTabsPage();
      },
        error => {
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


    this.navCtrl.push(TabsPage, {
      loginMode: 'guest'
    });
  }

  getCurrentUserId(): any {
    this.profileService.getCurrentUser(success => {
      return JSON.parse(success).uid;
    },
      error => {
        console.error("Error", error);
        return "null";
      });
  }

  setUser(uid: string) {
    this.profileService.setCurrentUser(uid,
      (success: any) => {
        console.log("Set User Success - " + success);
        this.navCtrl.push(TabsPage, {
          loginMode: 'guest'
        });
      }, (error: any) => {
        console.log("Set User Error -" + error);
      })
  }

  generateInteractEvent(userType) {
    let values = new Map();
    values["UserType"] = userType;
    this.telemetryService.interact(generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CONTINUE_CLICKED,
      Environment.HOME,
      PageId.USER_TYPE_SELECTION,
      values,
      undefined,
      undefined
    ));
  }

  /**
    * Used to Translate message to current Language
    * @param {string} messageConst - Message Constant to be translated
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

}
