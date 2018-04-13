import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage, OAuthService } from 'sunbird';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";
import { ProfileType, ProfileService } from 'sunbird'

const selectedCardBorderColor = '#0080ff';
const borderColor = '#fff';
const KEY_SELECTED_ROLE = "selected_role";
const KEY_SELECTED_LANGUAGE = "selected_language";

@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})

export class RolePage {

  roles: Array<string>;
  teacherContents: Array<string>;
  studentContents: Array<string>;
  allContents: Array<Array<string>> = [];
  teacherCardBorderColor: string = '#fff';
  studentCardBorderColor: string = '#fff';
  roleSelected: boolean = false;
  selectedRole: string;
  continueAs: string = "";
  language: string;

  constructor(public navCtrl: NavController, private translator: TranslateService, private storage: Storage, private profileService: ProfileService) {
    this.initData();
  }

  initData() {
    let that = this;
    this.translator.get(["ROLE.ROLE_TYPE", "ROLE.TEACHER_CONTENT", "ROLE.STUDENT_CONTENT"])
      .subscribe(val => {
        that.roles = val["ROLE.ROLE_TYPE"];
        that.teacherContents = val["ROLE.TEACHER_CONTENT"];
        that.studentContents = val["ROLE.STUDENT_CONTENT"];
        that.allContents.push(that.teacherContents);
        that.allContents.push(that.studentContents);
      });
  }

  ionViewDidLoad() {
  }

  selectTeacherCard() {
    console.log("Teacher card");
    this.roleSelected = true;
    this.teacherCardBorderColor = selectedCardBorderColor;
    this.studentCardBorderColor = borderColor;
    this.selectedRole = "teacher";
    this.translator.get('CONTINUE_AS_TEACHER').subscribe(value => {
      this.continueAs = value;
    })
    this.storage.set(KEY_SELECTED_ROLE, this.selectedRole);
  }

  selectStudentCard() {
    console.log("Student card");
    this.roleSelected = true;
    this.teacherCardBorderColor = borderColor;
    this.studentCardBorderColor = selectedCardBorderColor;
    this.selectedRole = "student";
    this.translator.get('CONTINUE_AS_STUDENT').subscribe(value => {
      this.continueAs = value;
    })
    this.storage.set(KEY_SELECTED_ROLE, this.selectedRole)
  }

  continue() {
    let profileRequest;

    if (this.selectedRole == "teacher") {
      profileRequest = {
        handle: "Guest1",
        avatar: "avatar",
        language: "en",
        age: -1,
        day: -1,
        month: -1,
        standard: -1,
        profileType: ProfileType.TEACHER
      };
    } else {
      profileRequest = {
        handle: "Guest1",
        avatar: "avatar",
        language: "en",
        age: -1,
        day: -1,
        month: -1,
        standard: -1,
        profileType: ProfileType.STUDENT
      };
    }

    this.profileService.createProfile(profileRequest, (successResponse) => {
      console.log("createProfile success : " + successResponse);
      if (successResponse) {
        let response = JSON.parse(successResponse);

        console.log("UID of the created user - " + response.uid)
        this.setUser(response.uid)
      }


    }, (errorResponse) => {
      console.log("createProfile success : " + errorResponse);
    })

  }

  goBack() {
    this.navCtrl.pop();
  }

  setUser(uid: string) {
    this.profileService.setCurrentUser(uid, (successResponse) => {
      console.log("Set User Success - " + successResponse);
      this.navCtrl.push(TabsPage);
    }, (errorResponse) => {
      console.log("Set User Error -" + errorResponse);
    })
  }

}
