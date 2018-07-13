import { GroupMembersPage } from './../group-members/group-members';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppGlobalService } from '../../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../../profile/formandframeworkutil.service';
import { CategoryRequest, Group } from 'sunbird';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController } from 'ionic-angular';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {
  groupEditForm: FormGroup;
  classList = [];
  group: Group;
  syllabusList: Array<any> = [];
  categories: Array<any> = [];
  loader: any;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  /* Options for class ion-select box */
  classOptions = {
    title: this.translateMessage('CLASS'),
    cssClass: 'select-box'
  };

  /* Options for syllabus ion-select box */
  syllabusOptions = {
    title: this.translateMessage('SYLLABUS'),
    cssClass: 'select-box'
  };
  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private appGlobalService: AppGlobalService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private translate: TranslateService,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {

    this.group = this.navParams.get('groupInfo') || {};
    this.groupEditForm = this.fb.group({
      name: [this.group.name || ""],
      syllabus: [this.group.syllabus && this.group.syllabus[0] || []],
      class: [this.group.class || []]
    });

    //this.init();
  }



  ionViewWillEnter() {
    this.getSyllabusDetails();
  }

  /**
   * get Syllabus Details and store locally
   */
  getSyllabusDetails() {
    this.loader = this.getLoader();
    this.loader.present();

    this.formAndFrameworkUtilService.getSyllabusList()
      .then((result) => {
        if (result && result !== undefined && result.length > 0) {
          result.forEach(element => {

            //renaming the fields to text, value and checked
            let value = { 'name': element.name, 'code': element.frameworkId };
            this.syllabusList.push(value);
          });

          if (this.group && this.group.syllabus && this.group.syllabus[0] !== undefined) {
            this.getClassList(this.group.syllabus[0], false);
          } else {
            this.loader.dismiss();
          }
        } else {
          this.loader.dismiss();
          this.getToast(this.translateMessage('NO_DATA_FOUND')).present();
        }
      });

  }

  /**
   * Navigates to UsersList page
   */
  navigateToUsersList() {
    let formValue = this.groupEditForm.value;
    if (formValue.name) {
      this.group.name = formValue.name;
      this.group.class = [formValue.class];
      this.group.syllabus = [formValue.syllabus];

      this.navCtrl.push(GroupMembersPage, {
        group: this.group
      });
    }
    else{
      this.getToast(this.translateMessage('ENTER_GROUP_NAME')).present();
    }
  }

  resetForm() {

  }

  getClassList(frameworkId, isSyllabusChanged: boolean = true) {
    this.groupEditForm.patchValue({
      class: []
    });

    this.formAndFrameworkUtilService.getFrameworkDetails(frameworkId)
      .then((categories) => {
        let request: CategoryRequest = {
          currentCategory: "gradeLevel"
        }
        return this.formAndFrameworkUtilService.getCategoryData(request);
      })
      .then((classes) => {
        this.loader.dismiss();
        this.classList = classes;
        if (!isSyllabusChanged) {
          this.groupEditForm.patchValue({
            class: this.group.class || []
          });
        }

      })
      .catch(error => {
        this.loader.dismiss();
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
}