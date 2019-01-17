import { AppGlobalService } from '../../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../../profile/formandframeworkutil.service';
import { CommonUtilService } from '../../../service/common-util.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CategoryRequest, Profile, UpdateUserInfoRequest, UserProfileService, ProfileService, ContainerService,
  TabsPage, FrameworkService, SuggestedFrameworkRequest, LocationSearchCriteria
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Events } from 'ionic-angular';

import {
  initTabs,
  LOGIN_TEACHER_TABS,
  Location
} from '@app/app';
import { Select } from 'ionic-angular';
import { constants } from 'os';

@Component({
  selector: 'personal-details-edit',
  templateUrl: 'personal-details-edit.profile.html',
})
export class PersonalDetailsEditPage {
  @ViewChild('stateSelect') stateSelect: Select;
  @ViewChild('districtSelectg') districtSelectg: Select;

  // syllabusList = [];
  // boardList = [];
  // subjectList = [];
  // gradeList = [];
  // mediumList = [];
  stateList = [];
  districtList = [];

  profile: any;
  profileEditForm: FormGroup;
  frameworkId: string;
  categories = [];
  btnColor = '#8FC4FF';
  showOnlyMandatoryFields: Boolean = true;
  editData: Boolean = true;
  loader: any;

  /* Custom styles for the select box popup */
  stateOptions = {
    title: this.commonUtilService.translateMessage('STATE').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  districtOptions = {
    title: this.commonUtilService.translateMessage('DISTRICT').toLocaleUpperCase(),
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
    private events: Events,
    private container: ContainerService,
    private framework: FrameworkService
  ) {
    // this.profile = this.appGlobalService.getCurrentUser();
    this.profile = this.navParams.get('profile');
    console.log('inside constructor', this.profile);
    this.initializeForm();
  }

  /**
   * Ionic life cycle event - Fires every time page visits
   */
  ionViewWillEnter() {
    this.profile = this.navParams.get('profile');
    console.log('inside ionViewWillEnter', this.profile);
    this.getStates();
  }

  /**
   * Initializes form with default values or empty values
   */

  initializeForm() {
    this.profileEditForm = this.fb.group({
      states: [],
      districts: [],
      name: new FormControl(this.profile.firstName + this.profile.lastName || '')
    });
    this.enableSubmitButton();
  }

  getStates() {
    this.loader = this.getLoader();
    const req: LocationSearchCriteria = {
      type: Location.TYPE_STATE
    };
    this.userProfileService.searchLocation(req).then((response: any) => {
      response = JSON.parse(response);
      const locations = JSON.parse(response.result.locationList);
      if (locations && locations.length) {
          this.stateList = locations;
      } else {
        this.loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
      }
    });
  }

  getDistrict(parentId: string) {
    this.loader = this.getLoader();
    const req: LocationSearchCriteria = {
      type: Location.TYPE_DISTRICT,
      parentId: parentId
    };
    this.userProfileService.searchLocation(req).then((response: any) => {
      response = JSON.parse(response);
      const districtsTemp = JSON.parse(response.result.locationList);
      if (districtsTemp && districtsTemp.length) {
          this.districtList = districtsTemp;
      } else {
        this.profileEditForm.patchValue({
          districts: []
        });
        this.districtList = [];
        this.loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
      }
    });
  }

  test(id) {
    console.log('test', id);
  }
  /**
   * It will fetch the syllabus details
   */
  getSyllabusDetails() {
    // this.loader = this.getLoader();
    // if (this.profile.syllabus && this.profile.syllabus[0]) {
    //   this.frameworkId = this.profile.syllabus[0];
    // }
    // const suggestedFrameworkRequest: SuggestedFrameworkRequest = {
    //   selectedLanguage: this.translate.currentLang
    // };
    // this.framework.getSuggestedFrameworkList(suggestedFrameworkRequest)
    //   .then((result) => {
    //     if (result && result.length) {
    //       result.forEach(element => {
    //         // renaming the fields to text, value and checked
    //         const value = { 'name': element.name, 'code': element.identifier };
    //         this.syllabusList.push(value);
    //       });

    //       if (this.profile && this.profile.syllabus && this.profile.syllabus[0] !== undefined) {
    //         this.formAndFrameworkUtilService.getFrameworkDetails(this.profile.syllabus[0])
    //           .then(catagories => {
    //             this.categories = catagories;
    //             this.resetForm(0);
    //           }).catch(() => {
    //             this.loader.dismiss();
    //             this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
    //           });
    //       } else {
    //         this.loader.dismiss();
    //       }
    //     } else {
    //       this.loader.dismiss();

    //       this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_DATA_FOUND'));
    //     }
    //   });
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
    // if (index === 1) {
    //   this.frameworkId = selectedValue[0];
    //   if (this.frameworkId.length !== 0) {
    //     this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
    //       .then(catagories => {
    //         this.categories = catagories;
    //         // loader.dismiss();
    //         const request: CategoryRequest = {
    //           currentCategory: this.categories[0].code,
    //           selectedLanguage: this.translate.currentLang
    //         };
    //         this.getCategoryData(request, currentField);
    //       }).catch(() => {
    //         this.commonUtilService.showToast(this.commonUtilService.translateMessage('NEED_INTERNET_TO_CHANGE'));
    //       });
    //   }
    // } else {
    //   const request: CategoryRequest = {
    //     currentCategory: this.categories[index - 1].code,
    //     prevCategory: this.categories[index - 2].code,
    //     selectedCode: selectedValue,
    //     selectedLanguage: this.translate.currentLang
    //   };
    //   this.getCategoryData(request, currentField);
    // }
  }

  /**
   * It makes an API call to fetch the categories values for the selected framework
   * @param request API request body
   * @param currentField Variable name of the current field list
   */
  getCategoryData(request: CategoryRequest, currentField: string) {
    this.formAndFrameworkUtilService.getCategoryData(request, this.frameworkId)
      .then((result) => {
      //   this[currentField] = result;
      //   if (request.currentCategory === 'board') {
      //     const boardName = this.syllabusList.find(framework => this.frameworkId === framework.code);
      //     if (boardName) {
      //       const boardCode = result.find(board => boardName.name === board.name);
      //       if (boardCode) {
      //         this.profileEditForm.patchValue({
      //           boards: boardCode.code
      //         });
      //         this.resetForm(1);
      //       } else {
      //         this.profileEditForm.patchValue({
      //           boards: [result[0].code]
      //         });
      //         this.resetForm(1);
      //       }
      //     }
      //   } else if (this.editData) {
      //     this.editData = false;
      //     this.profileEditForm.patchValue({
      //       medium: this.profile.medium || []
      //     });
      //     this.profileEditForm.patchValue({
      //       grades: this.profile.grade || []
      //     });
      //     this.profileEditForm.patchValue({
      //       subjects: this.profile.subject || []
      //     });
      //   }

      // })
      // .catch(error => {
      //   console.error('Error=', error);
    });
  }

  /**
   * It will validate the forms and internally call submit method
   */
  onSubmit() {
    const formVal = this.profileEditForm.value;
    if (!formVal.name.length) {
        this.showErrorToastMessage('NAME');
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
    this.commonUtilService.showToast(this.commonUtilService.translateMessage('NAME_HINT'), false, 'redErrorToast');
  }

  /**
   * It changes the color of the submit button on change of class.
   */
  enableSubmitButton() {
    if (this.profileEditForm.value.name.length) {
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
    console.log("formVal ", formVal);
    this.loader.present();
    const req = {
      userId: this.profile.userId,
      lastName: ' ',
      firstName: this.profileEditForm.value.name,
      locationCodes: []
    };

    if (this.profileEditForm.value.states.length) {
      const tempState = this.stateList.find(state => state.id === this.profileEditForm.value.states);
      req.locationCodes.push(tempState.code);
    }
    if (this.profileEditForm.value.districts.length) {
      const tempDistrict = this.districtList.find(district => district.id === this.profileEditForm.value.districts);
      req.locationCodes.push(tempDistrict.code);
    }

    console.log('req : ', req);

    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        this.loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.events.publish('loggedInProfile:update', req);
        this.navCtrl.pop();
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
