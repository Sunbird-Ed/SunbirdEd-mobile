import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage, OAuthService } from '../../../framework';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-role',
  templateUrl: 'role.html',
})
export class RolePage {

  roles: Array<string>;
  teacherContents: Array<string>;
  studentContents: Array<string>;
  allContents: Array<Array<string>> = [];

  constructor(public navCtrl: NavController, private translator: TranslateService) {
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

}
