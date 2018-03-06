import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage, OAuthService } from 'sunbird';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";

const selectedCardBorderColor = '#0080ff';
const borderColor = '#fff';
const KEY_SELECTED_ROLE = "selected_role";

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
  continueAs: string = "Continue as ";

  constructor(public navCtrl: NavController, private translator: TranslateService, private storage: Storage) {
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
    this.continueAs = "Continue as teacher";
    this.storage.set(KEY_SELECTED_ROLE, this.selectedRole);
  }

  selectStudentCard() {
    console.log("Student card");
    this.roleSelected = true;
    this.teacherCardBorderColor = borderColor;
    this.studentCardBorderColor = selectedCardBorderColor;
    this.selectedRole = "student";
    this.continueAs = "Continue as student";
    this.storage.set(KEY_SELECTED_ROLE, this.selectedRole)
  }

  continue() {
    this.navCtrl.push(TabsPage);
  }

  goBack() {
    this.navCtrl.pop();
  }

}