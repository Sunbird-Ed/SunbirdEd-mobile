import { MembersPage } from './../members/members';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppGlobalService } from '../../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../../profile/formandframeworkutil.service';
import { GroupService, CategoryRequest, Group } from 'sunbird';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {


  groupEditForm: FormGroup

  gradeList = [];
  group: Group = {}

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private appGlobalService: AppGlobalService,
    private formAndFrameAPI: FormAndFrameworkUtilService,
    private groupService: GroupService) {

      this.groupEditForm = this.fb.group({
        name: [this.group.name || ""],
        grade: [this.group.class && this.group.class[0] || []]
      });

    this.init();
  }

  addMembers() {
    let formValue = this.groupEditForm.value;

    if (formValue.name) {
      this.group.name = formValue.name;
      this.group.class = [formValue.grade];

      this.navCtrl.push(MembersPage, {
        group: this.group
      });
    }
  }

  private init() {
    let profile = this.appGlobalService.getCurrentUser()

    let frameworkId;

    if (profile && profile.syllabus && profile.syllabus.length > 0) {
      frameworkId = profile.syllabus[0];
    }

    this.formAndFrameAPI.getFrameworkDetails(frameworkId)
      .then((categories) => {
        let request: CategoryRequest = {
          currentCategory: "gradeLevel"
        }
        return this.formAndFrameAPI.getCategoryData(request)
      })
      .then((grades) => {
        this.gradeList = grades;
      })
      .catch(error => {
        console.log("Error : " + error);
      });
  }
}