import { AppGlobalService } from './../../service/app-global.service';
import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import { CommonUtilService } from './../../service/common-util.service';
import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  CategoryRequest,
  Profile,
  UpdateUserInfoRequest,
  UserProfileService,
  ProfileService,
  ContainerService,
  TabsPage,
  FrameworkService,
  SuggestedFrameworkRequest,
  UserProfileDetailsRequest
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';
import {
  initTabs,
  LOGIN_TEACHER_TABS,
  FrameworkCategory,
  ProfileConstants
} from '@app/app';
import { Select } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-categories-edit',
  templateUrl: 'categories-edit.html',
})
export class CategoriesEditPage {
  @ViewChild('boardSelect') boardSelect: Select;
  @ViewChild('mediumSelect') mediumSelect: Select;
  @ViewChild('gradeSelect') gradeSelect: Select;

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
  showOnlyMandatoryFields: Boolean = true;
  editData: Boolean = true;
  loader: any;

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
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private commonUtilService: CommonUtilService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private appGlobalService: AppGlobalService,
    private userProfileService: UserProfileService,
    private profileService: ProfileService,
    private events: Events,
    private container: ContainerService,
    private framework: FrameworkService
  ) {
    this.profile = this.appGlobalService.getCurrentUser();
    if (this.navParams.get('showOnlyMandatoryFields')) {
      this.showOnlyMandatoryFields = this.navParams.get('showOnlyMandatoryFields');
      if (this.navParams.get('profile')) {
        this.profile = this.navParams.get('profile');
      }
    } else {
      this.showOnlyMandatoryFields = false;
    }
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
      syllabus: [this.profile.syllabus && this.profile.syllabus[0] || []],
      boards: [this.profile.board || []],
      grades: [this.profile.grade || []],
      medium: [this.profile.medium || []],
      subjects: [this.profile.subject || []]
    });
  }

  /**
   * It will fetch the syllabus details
   */
  getSyllabusDetails() {
    this.loader = this.getLoader();
    if (this.profile.syllabus && this.profile.syllabus[0]) {
      this.frameworkId = this.profile.syllabus[0];
    }
    const suggestedFrameworkRequest: SuggestedFrameworkRequest = {
      selectedLanguage: this.translate.currentLang,
      categories: FrameworkCategory.DEFAULT_FRAMEWORK_CATEGORIES
    };
    this.framework.getSuggestedFrameworkList(suggestedFrameworkRequest)
      .then((result) => {
        if (result && result.length) {
          result.forEach(element => {
            // renaming the fields to text, value and checked
            const value = { 'name': element.name, 'code': element.identifier };
            this.syllabusList.push(value);
          });

          if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
            this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
              .then(catagories => {
                this.categories = catagories;
                this.resetForm(0);
              }).catch(() => {
                this.loader.dismiss();
                this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
              });
          } else {
            this.loader.dismiss();
          }
        } else {
          this.loader.dismiss();

          this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
        }
      });

  }

  /**
   * It will resets the form to empty values
   */
  resetForm(index: number) {
    switch (index) {
      case 0:
        this.profileEditForm.patchValue({
          boards: [],
          grades: [],
          subjects: [],
          medium: []
        });
        this.fetchNextCategoryOptionsValues(1, 'boardList', [this.profileEditForm.value.syllabus]);
        break;
      case 1:
        this.profileEditForm.patchValue({
          medium: [],
          grades: [],
          subjects: []
        });
        this.fetchNextCategoryOptionsValues(2, 'mediumList', this.profileEditForm.value.boards);
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
      if (this.frameworkId.length !== 0) {
        this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
          .then(catagories => {
            this.categories = catagories;
            // loader.dismiss();
            const request: CategoryRequest = {
              currentCategory: this.categories[0].code,
              selectedLanguage: this.translate.currentLang,
              categories: FrameworkCategory.DEFAULT_FRAMEWORK_CATEGORIES
            };
            this.getCategoryData(request, currentField);
          }).catch(() => {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
          });
      }
    } else {
      const request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: selectedValue,
        selectedLanguage: this.translate.currentLang,
        categories: FrameworkCategory.DEFAULT_FRAMEWORK_CATEGORIES
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
        if (request.currentCategory === 'board') {
          const boardName = this.syllabusList.find(framework => this.frameworkId === framework.code);
          if (boardName) {
            const boardCode = result.find(board => boardName.name === board.name);
            if (boardCode) {
              this.profileEditForm.patchValue({
                boards: [boardCode.code]
              });
              this.resetForm(1);
            } else {
              this.profileEditForm.patchValue({
                boards: [result[0].code]
              });
              this.resetForm(1);
            }
          }
        } else if (this.editData) {
          this.editData = false;
          this.profileEditForm.patchValue({
            medium: this.profile.medium || []
          });
          this.profileEditForm.patchValue({
            grades: this.profile.grade || []
          });
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
      if (this.showOnlyMandatoryFields) {
        this.boardSelect.open();
      } else {
        this.showErrorToastMessage('BOARD');
      }
    } else if (!formVal.medium.length) {
      if (this.showOnlyMandatoryFields) {
        this.mediumSelect.open();
      } else {
        this.showErrorToastMessage('MEDIUM');
      }
    } else if (!formVal.grades.length) {
      if (this.showOnlyMandatoryFields) {
        this.gradeSelect.open();
      } else {
        this.showErrorToastMessage('CLASS');
      }
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
    this.loader.present();
    const req: UpdateUserInfoRequest = new UpdateUserInfoRequest();
    const framework = {};
    if (formVal.syllabus) {
      framework['id'] = [formVal.syllabus];
    }
    if (formVal.boards) {
      const code = typeof (formVal.boards) === 'string' ? formVal.boards : formVal.boards[0];
      framework['board'] = [this.boardList.find(board => code === board.code).name];
    }
    if (formVal.medium && formVal.medium.length) {
      const Names = [];
      formVal.medium.forEach(element => {
        Names.push(this.mediumList.find(medium => element === medium.code).name);
      });
      framework['medium'] = Names;
    }
    if (formVal.grades && formVal.grades.length) {
      const Names = [];
      formVal.grades.forEach(element => {
        Names.push(this.gradeList.find(grade => element === grade.code).name);
      });
      framework['gradeLevel'] = Names;
    }
    if (formVal.subjects && formVal.subjects.length) {
      const Names = [];
      formVal.subjects.forEach(element => {
        Names.push(this.subjectList.find(subject => element === subject.code).name);
      });
      framework['subject'] = Names;
    }
    req.userId = this.profile.uid;
    req.framework = framework;
    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        this.loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.events.publish('loggedInProfile:update', req.framework);
        if (this.showOnlyMandatoryFields) {
          const reqObj: UserProfileDetailsRequest = {
            userId: this.profile.uid,
            requiredFields: ProfileConstants.REQUIRED_FIELDS,
            returnRefreshedUserProfileDetails: true
          };
          this.userProfileService.getUserProfileDetails(reqObj,
            updatedProfile => {
              this.formAndFrameworkUtilService.updateLoggedInUser(updatedProfile, this.profile)
                .then((value) => {
                  initTabs(this.container, LOGIN_TEACHER_TABS);
                  this.navCtrl.setRoot(TabsPage);
                });
            }, (e) => {
              initTabs(this.container, LOGIN_TEACHER_TABS);
              this.navCtrl.setRoot(TabsPage);
            });
        } else {
          this.navCtrl.pop();
        }
      },
      (err: any) => {
        this.loader.dismiss();
        console.log('Error', err);
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_FAILED'));
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 3000,
      spinner: 'crescent'
    });
  }
}
