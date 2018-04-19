import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage, OAuthService, SharedPreferences } from 'sunbird';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';
import { ProfileType, ProfileService } from 'sunbird'

const selectedCardBorderColor = '#0080ff';
const borderColor = '#fff';
const KEY_SELECTED_USER_TYPE = "selected_user_type";
const KEY_SELECTED_LANGUAGE = "selected_language";

@Component({
  selector: 'page-user-type-selection',
  templateUrl: 'user-type-selection.html',
})

export class UserTypeSelectionPage {

  userTypes: Array<string>;
  teacherContents: Array<string>;
  studentContents: Array<string>;
  allContents: Array<Array<string>> = [];
  teacherCardBorderColor: string = '#fff';
  studentCardBorderColor: string = '#fff';
  userTypeSelected: boolean = false;
  selectedUserType: string;
  continueAs: string = "";
  language: string;

  /**
   * Contains paths to icons
   */
  userImageUri: string = "assets/imgs/ic_anonymous.png";

  constructor(public navCtrl: NavController,
    private translator: TranslateService,
    private profileService: ProfileService,
    private preference: SharedPreferences
  ) {
    this.initData();
  }

  initData() {
    let that = this;
    this.translator.get(["ROLE.ROLE_TYPE", "ROLE.TEACHER_CONTENT", "ROLE.STUDENT_CONTENT"])
      .subscribe(val => {
        that.userTypes = val["ROLE.ROLE_TYPE"];
        that.teacherContents = val["ROLE.TEACHER_CONTENT"];
        that.studentContents = val["ROLE.STUDENT_CONTENT"];
        that.allContents.push(that.teacherContents);
        that.allContents.push(that.studentContents);
      });
  }

  ionViewDidLoad() {
  }

  selectTeacherCard() {
    this.userTypeSelected = true;
    this.teacherCardBorderColor = selectedCardBorderColor;
    this.studentCardBorderColor = borderColor;
    this.selectedUserType = "teacher";
    this.translator.get('CONTINUE_AS_TEACHER').subscribe(value => {
      this.continueAs = value;
    })
    this.preference.putString(KEY_SELECTED_USER_TYPE, this.selectedUserType);
  }

  selectStudentCard() {
    this.userTypeSelected = true;
    this.teacherCardBorderColor = borderColor;
    this.studentCardBorderColor = selectedCardBorderColor;
    this.selectedUserType = "student";
    this.translator.get('CONTINUE_AS_STUDENT').subscribe(value => {
      this.continueAs = value;
    })
    this.preference.putString(KEY_SELECTED_USER_TYPE, this.selectedUserType)
  }

  continue() {
    let profileRequest = {
      handle: "Guest1",
      avatar: "avatar",
      language: "en",
      age: -1,
      day: -1,
      month: -1,
      standard: -1,
      profileType: ProfileType.TEACHER
    };

    if (this.selectedUserType != "teacher") {
      profileRequest.profileType = ProfileType.STUDENT;
    }

    this.profileService.createProfile(profileRequest,
      (success: any) => {
        console.log("createProfile success : " + success);
        if (success) {
          let response = JSON.parse(success);

          console.log("UID of the created user - " + response.uid)
          this.setUser(response.uid)
        }
      },
      (errorResponse: any) => {
        console.log("createProfile success : " + errorResponse);
      })

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

}
