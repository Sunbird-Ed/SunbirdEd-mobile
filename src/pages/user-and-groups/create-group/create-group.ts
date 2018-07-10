import { GroupMembersPage } from './../group-members/group-members';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppGlobalService } from '../../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../../profile/formandframeworkutil.service';
import { CategoryRequest, Group } from 'sunbird';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {


  groupEditForm: FormGroup;
  classList = [];
  group: Group = {}

  /* Options for ion-select box */
  classOptions = {
    title: this.translateMessage('CLASS'),
    cssClass: 'select-box'
  };
  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private appGlobalService: AppGlobalService,
    private formAndFrameAPI: FormAndFrameworkUtilService,
    private translate: TranslateService
  ) {

    this.groupEditForm = this.fb.group({
      name: [this.group.name || ""],
      class: [this.group.class && this.group.class[0] || []]
    });

    this.init();
  }

  /**
   * Navigates to UsersList page
   */
  navigateToUsersList() {
    let formValue = this.groupEditForm.value;

    if (formValue.name) {
      this.group.name = formValue.name;
      this.group.class = [formValue.class];

      this.navCtrl.push(GroupMembersPage, {
        group: this.group
      });
    }
  }

  private init() {
    let profile = this.appGlobalService.getCurrentUser();

    let frameworkId: string;

    if (profile && profile.syllabus && profile.syllabus.length > 0) {
      frameworkId = profile.syllabus[0];
    }

    this.formAndFrameAPI.getFrameworkDetails(frameworkId)
      .then((categories) => {
        let request: CategoryRequest = {
          currentCategory: "gradeLevel"
        }
        return this.formAndFrameAPI.getCategoryData(request);
      })
      .then((classes) => {
        this.classList = classes;
      })
      .catch(error => {
        console.log("Error : " + error);
      });
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
}