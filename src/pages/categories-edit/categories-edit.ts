import { AppGlobalService } from './../../service/app-global.service';
import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import { CommonUtilService } from './../../service/common-util.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryRequest, Profile, UpdateUserInfoRequest, UserProfileService } from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-categories-edit',
  templateUrl: 'categories-edit.html',
})
export class CategoriesEditPage {
  syllabusList = [];
  boardList = [];
  subjectList = [];
  gradeList = [];
  mediumList = [];

  profile: Profile;
  profileEditForm: FormGroup;
  frameworkId: string;
  categories = [];
  btnColor = '#8FC4FF';
  editData: Boolean = true;

  /* Custom styles for the select box popup */
  boardOptions = {
    title: this.commonUtilService.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  mediumOptions = {
    title: this.commonUtilService.translateMessage('MEDIUM').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  classOptions = {
    title: this.commonUtilService.translateMessage('CLASS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  subjectOptions = {
    title: this.commonUtilService.translateMessage('SUBJECTS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private commonUtilService: CommonUtilService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private appGlobalService: AppGlobalService,
    private userProfileService: UserProfileService,
    private events: Events
  ) {
    this.profile = this.appGlobalService.getCurrentUser();
    this.initializeForm();
  }

  /**
   * Ionic life cycle event - Fires every time page visits
   */
  ionViewWillEnter() {
    this.getSyllabusDetails();
  }

  /**
   * Initializes form with default values or empty values
   */

  initializeForm() {
    if (this.profile.board && this.profile.board.length > 1) {
      this.profile.board.splice(1, this.profile.board.length);
    }
    this.profileEditForm = this.fb.group({
      syllabus: [ this.profile.syllabus && this.profile.syllabus[0] || []],
      boards: [ this.profile.board || []],
      grades: [ this.profile.grade || []],
      medium: [ this.profile.medium || []],
      subjects: [ this.profile.subject || []]
    });

  }

  /**
   * It will fetch the syllabus details
   */
  getSyllabusDetails() {
    this.formAndFrameworkUtilService.getSupportingBoardList()
      .then((syllabus) => {
        this.syllabusList = [];
        if (syllabus && syllabus.length) {
          syllabus.forEach(element => {
            // renaming the fields to text, value and checked
            this.syllabusList.push({ 'name': element.name, 'code': element.frameworkId });
          });
          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
              .then(catagories => {
                // this.isFormValid = true;
                this.categories = catagories;
                this.resetForm(0);

              }).catch((err) => {
                // this.isFormValid = false;
                // this.loader.dismiss();
                this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
              });
          } else {
            // this.loader.dismiss();
          }
        } else {
          this.commonUtilService.showToast('NO_DATA_FOUND');
        }
      })
      .catch((error) => {
        console.error('Error Occurred = ', error);
        this.commonUtilService.showToast('SOMETHING_WENT_WRONG');
      });
  }

  /**
   * It will resets the form to empty values
   */
  resetForm(index: number) {
    switch (index) {
      case 0: // When User changed board values, reset rest of the form to empty values and fetch options for the next category
        this.profileEditForm.patchValue({
          board: [],
          grades: [],
          medium: [],
          subjects: []
        });
        this.fetchNextCategoryOptionsValues(1, 'boardList', [this.profileEditForm.value.syllabus]);
        break;
      case 1:
        this.profileEditForm.patchValue({
          medium: [],
          grades: [],
          subjects: []
        });
        this.fetchNextCategoryOptionsValues(2, 'mediumList', this.profileEditForm.value.board);
        break;
      case 2:
        this.profileEditForm.patchValue({
          grades: [],
          subjects: []
        });
        this.fetchNextCategoryOptionsValues(3, 'gradeList', this.profileEditForm.value.medium);
        break;
      case 3:
        this.profileEditForm.patchValue({
          subjects: []
        });
        this.fetchNextCategoryOptionsValues(4, 'subjectList', this.profileEditForm.value.grades);
        break;
    }
  }

  /**
   * It builds API request object and internally call form API to fetch category data.
   * @param index Index of the field in the form
   * @param currentField Variable Name of the current field list
   * @param selectedValue selected value for the currently selected field
   */
  fetchNextCategoryOptionsValues(index: number, currentField: string, selectedValue: Array<string>) {
    if (index === 1) {
      this.frameworkId = selectedValue[0];
      this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
        .then(catagories => {
          this.categories = catagories;

          const request: CategoryRequest = {
            currentCategory: this.categories[0].code,
            selectedLanguage: this.translate.currentLang
          };
          this.getCategoryData(request, currentField);
        }).catch((error) => {
          console.error('Error', error);
          this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
        });
    } else {
      const request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: selectedValue,
        selectedLanguage: this.translate.currentLang
      };
      this.getCategoryData(request, currentField);
    }
  }

  /**
   * It makes an API call to fetch the categories values for the selected framework
   * @param request API request body
   * @param currentField Variable name of the current field list
   */
  getCategoryData(request: CategoryRequest, currentField: string) {
    this.formAndFrameworkUtilService.getCategoryData(request, this.frameworkId)
      .then((result) => {
        this[currentField] = result;

        // if (currentField !== 'gradeList') {
        //   this[currentField] = _.orderBy(this[currentField], ['name'], ['asc']);
        // }

        if (request.currentCategory === 'board') {
          this.profileEditForm.patchValue({
            boards: [result[0].code]
          });
          this.resetForm(1);
        } else if (this.editData) {
          this.editData = false;
            this.profileEditForm.patchValue({
              medium: this.profile.medium || []
            });
            // this.resetForm(2);
            this.profileEditForm.patchValue({
              grades: this.profile.grade || []
            });
            // this.resetForm(3);
            this.profileEditForm.patchValue({
              subjects: this.profile.subject || []
            });
        }
      })
      .catch(error => {
        console.error('Error=', error);
      });
  }

  /**
   * It will validate the forms and internally call submit method
   */
  onSubmit() {
    const formVal = this.profileEditForm.value;
    if (!formVal.boards.length) {
      this.showErrorToastMessage('BOARD');
    } else if (!formVal.medium.length) {
      this.showErrorToastMessage('MEDIUM');
    } else if (!formVal.grades.length) {
      this.showErrorToastMessage('GRADE');
    } else {
      this.submitForm(formVal);
    }
  }

  /**
   * Shows Toast Message with `red` color
   * @param {string} fieldName Name of the field in the form
   */
  showErrorToastMessage(fieldName: string) {
    this.btnColor = '#8FC4FF';
    this.commonUtilService.showToast(this.commonUtilService.translateMessage('PLEASE_SELECT', this.commonUtilService
      .translateMessage(fieldName)), false, 'redErrorToast');
  }

  /**
   * It changes the color of the submit button on change of class.
   */
  enableSubmitButton() {
    if (this.profileEditForm.value.grades.length) {
      this.btnColor = '#006DE5';
    } else {
      this.btnColor = '#8FC4FF';
    }
  }

  /**
   * It makes an update API call.
   * @param {object} formVal Object of Form values
   */

  submitForm(formVal) {
    const req: UpdateUserInfoRequest = new UpdateUserInfoRequest();
    const Framework = {};
    if (formVal.syllabus) {
      Framework['board'] = [this.syllabusList.find(syllabus => formVal.syllabus === syllabus.code).name];
    }
    if (formVal.medium && formVal.medium.length) {
      const Names = [];
      formVal.medium.forEach(element => {
        Names.push(this.mediumList.find(medium => element === medium.code).name);
      });
      Framework['medium'] = Names;
    }
    if (formVal.grades && formVal.grades.length) {
      const Names = [];
      formVal.grades.forEach(element => {
        Names.push(this.gradeList.find(grade => element === grade.code).name);
      });
      Framework['gradeLevel'] = Names;
    }
    if (formVal.subjects && formVal.subjects.length) {
      const Names = [];
      formVal.subjects.forEach(element => {
        Names.push(this.subjectList.find(subject => element === subject.code).name);
      });
      Framework['subject'] = Names;
    }
    req.userId = this.profile.uid;
    req.framework = Framework;
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
          this.commonUtilService.showToast('Profile data updated successfully');
          this.events.publish('loggedInProfile:update', req.framework);
          // this.viewCtrl.dismiss();
      },
      (err: any) => {
          console.log('Error', err);
          this.commonUtilService.showToast('Profile update failed');
          // this.viewCtrl.dismiss();
      });
  }
}
