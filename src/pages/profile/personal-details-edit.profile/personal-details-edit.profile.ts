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
    this.initializeForm();
  }

  /**
   * Ionic life cycle event - Fires every time page visits
   */
  ionViewWillEnter() {
    this.profile = this.navParams.get('profile');
    this.getStates();
  }

  /**
   * Initializes form with default values or empty values
   */

  initializeForm() {
    let profilename = this.profile.firstName;
    const userState = [];
    const userDistrict = [];
    if (this.profile.lastName) {
      profilename = this.profile.firstName + this.profile.lastName;
    }
    if (this.profile && this.profile.userLocations && this.profile.userLocations.length) {
      for (let i = 0, len = this.profile.userLocations.length; i < len; i++) {
        if (this.profile.userLocations[i].type === 'state') {
          userState.push(this.profile.userLocations[i].id);
          this.getDistrict(this.profile.userLocations[i].id);
        } else {
          userDistrict.push(this.profile.userLocations[i].id);
        }
      }
    }
    this.profileEditForm = this.fb.group({
      states: userState || [],
      districts: userDistrict || [],
      name: [profilename.trim(), Validators.pattern('^[a-zA-Z ]*$')],
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

  /**
   * It will validate the forms and internally call submit method
   */
  onSubmit() {
    const formVal = this.profileEditForm.getRawValue();
    if (!formVal.name.trim().length) {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_NAME_INVALID'), false, 'redErrorToast');
    } else {
      this.submitForm();
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

  submitForm() {
    this.loader.present();
    const req = {
      userId: this.profile.userId,
      lastName: ' ',
      firstName: this.validateName(),
      locationCodes: []
    };

    if (this.profileEditForm.value.states && this.profileEditForm.value.states.length) {
      const tempState = this.stateList.find(state => state.id === this.profileEditForm.value.states);
      req.locationCodes.push(tempState.code);
    }
    if (this.profileEditForm.value.districts && this.profileEditForm.value.districts.length) {
      const tempDistrict = this.districtList.find(district => district.id === this.profileEditForm.value.districts);
      if (tempDistrict) {
        req.locationCodes.push(tempDistrict.code);
      }
    }

    this.userProfileService.updateUserInfo(req,
      (res: any) => {
        this.loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_SUCCESS'));
        this.events.publish('loggedInProfile:update', req);
        this.navCtrl.pop();
      },
      (err: any) => {
        this.loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PROFILE_UPDATE_FAILED'));
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 3000,
      spinner: 'crescent'
    });
  }

  /**
  *  It will validate the name field.
  */
  validateName() {
    const name = this.profileEditForm.getRawValue().name;
    return name.trim();
  }
}
