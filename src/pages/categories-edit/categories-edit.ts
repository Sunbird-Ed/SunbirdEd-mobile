import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import { CommonUtilService } from './../../service/common-util.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryRequest, Profile } from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-categories-edit',
  templateUrl: 'categories-edit.html',
})
export class CategoriesEditPage {
  syllabusList = [];
  boardList = [];
  subjectList = [];
  classList = [];
  mediumList = [];

  profileEditForm: FormGroup;
  frameworkId: string;
  categories = [];
  btnColor = '#8FC4FF';

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
    private translate: TranslateService
  ) {
    this.initializeForm();
  }

  /**
   * Ionic life cycle event - Fires every time page visits
   */
  ionViewWillEnter() {
    this.getSyllabusDetails();
    this.initializeForm();
  }

  /**
   * It will fetch the syllabus details
   */
  getSyllabusDetails() {
    this.formAndFrameworkUtilService.getSyllabusList()
      .then((syllabus) => {
        this.syllabusList = [];
        if (syllabus && syllabus.length) {
          syllabus.forEach(element => {
            // renaming the fields to text, value and checked
            this.syllabusList.push({ 'name': element.name, 'code': element.frameworkId });
          });
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
   * Initializes form with default values or empty values
   */
  initializeForm() {
    this.profileEditForm = this.fb.group({
      syllabus: [[]],
      board: [[]],
      mediums: [[]],
      classes: [[]],
      subjects: [[]]
    });
  }

  /**
   * It will resets the form to empty values
   */
  resetForm(index: number) {
    switch (index) {
      case 1: // When User changed board values, reset rest of the form to empty values and fetch options for the next category
        this.profileEditForm.patchValue({
          board: [[]],
          classes: [[]],
          mediums: [[]],
          subjects: [[]]
        });
        this.fetchNextCategoryOptionsValues(1, 'boardList', [this.profileEditForm.value.syllabus]);
        break;
      case 2:
        this.profileEditForm.patchValue({
          mediums: [[]],
          classes: [[]],
          subjects: [[]]
        });
        this.fetchNextCategoryOptionsValues(2, 'mediumList', this.profileEditForm.value.board);
        break;
      case 3:
        this.profileEditForm.patchValue({
          classes: [[]],
          subjects: [[]]
        });
        this.fetchNextCategoryOptionsValues(3, 'classList', this.profileEditForm.value.mediums);
        break;
      case 4:
        this.profileEditForm.patchValue({
          subjects: [[]]
        });
        this.fetchNextCategoryOptionsValues(4, 'subjectList', this.profileEditForm.value.classes);
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

          console.log('categories', this.categories);
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

        if (currentField !== 'classList') {
          this[currentField] = _.orderBy(this[currentField], ['name'], ['asc']);
        }

        if (request.currentCategory === 'board') {
          this.profileEditForm.patchValue({
            boards: [result[0].code]
          });
          this.resetForm(2);
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
    if (!formVal.board.length) {
      this.showErrorToastMessage('BOARD');
    } else if (!formVal.mediums.length) {
      this.showErrorToastMessage('MEDIUM');
    } else if (!formVal.classes.length) {
      this.showErrorToastMessage('CLASS');
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
    if (this.profileEditForm.value.classes.length) {
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
    const req: Profile = new Profile();
    req.board = formVal.board;
    req.medium = formVal.mediums;
    req.grade = formVal.classes;
  }

}
