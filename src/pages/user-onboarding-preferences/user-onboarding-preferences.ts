import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {  OnInit } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators,ValidatorFn,AbstractControl } from '@angular/forms';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import {
  CategoryRequest,
  Group,
  GroupService,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  ImpressionType,
  ObjectType,
  SharedPreferences
} from 'sunbird';

import { LoadingController } from 'ionic-angular';
import { GuestEditProfilePage } from '../profile/guest-edit.profile/guest-edit.profile';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { PreferenceKey } from '../../app/app.constant';
import * as _ from 'lodash';

export interface toastOptions {
  message: string,
  duration: number,
  position: string
};
@IonicPage()
@Component({
  selector: 'page-user-onboarding-preferences',
  templateUrl: 'user-onboarding-preferences.html',
})
export class UserOnboardingPreferencesPage  {

  user: FormGroup;
  classList = [];
  group: Group;
  selectBoard: any;
  isSelectBoard: boolean = false;
  selectMedium: any;
  isSelectMedium: boolean = false;
  selectClass: any;
  isSelectClass: boolean = false;
  isEditGroup: boolean = false;
  syllabusList: Array<any> = []
  BoardList: Array<any> = [];
  mediumList: Array<any> = [];
  gradeList: Array<any> = [];
  categories: Array<any> = [];
  loader: any;
  frameworks: Array<any> = [];
  frameworkId: string = '';
  btnColor: string = '#8FC4FF';
  

  selectedLanguage: string = 'en';

  isFormValid: boolean = true;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };
  syllabusOptions = {
    title: this.translateMessage('SYLLABUS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  boardOptions = {
    title: this.translateMessage('BOARD').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  mediumOptions = {
    title: this.translateMessage('MEDIUM_OF_INSTRUCTION').toLocaleUpperCase(),
    cssClass: 'select-box'
  };
  classOptions = {
    title: this.translateMessage('CLASS').toLocaleUpperCase(),
    cssClass: 'select-box'
  };

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private translate: TranslateService,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private groupService: GroupService,
    private preference: SharedPreferences,
    private telemetryGeneratorService: TelemetryGeneratorService
  )  {
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
      });

    this.group = this.navParams.get('groupInfo') || {};
    this.user = this.fb.group({
      boards: [this.group.board|| []],
      grades: [this.group.grade || []],
      medium: [this.group.medium || []]
    });
    console.log(this.user);

    this.isEditGroup = this.group.hasOwnProperty('gid') ? true : false;
    this.getSyllabusDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserOnboardingPreferencesPage');
  }
  onProfileTypeChange() {
    this.user.patchValue({
      syllabus:[],
      boards: [],
      grades: [],
      medium: []
    });
  }
    ionViewWillEnter() {
    this.formAndFrameworkUtilService.getFrameworkDetails('NCF').then((categories)=>{
       console.log('categories is',categories);
       console.log('new',this.syllabusList[0]);

    }).catch((error)=>{
        console.log(error);
    })

  }
 
 
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
              //this.syllabusList[0] = value;
              console.log('the medium',value);
            
           
          });
        
          if (this.group && this.group.syllabus && this.group.syllabus[0] === undefined) {
            console.log('value is:',this.group.syllabus[0]);
          
            this.formAndFrameworkUtilService.getFrameworkDetails(this.group.syllabus[0])
            
            .then(catagories => {
              this.isFormValid = true;
              // loader.dismiss();
              this.categories = catagories;
              this.resetForm(0, false);
              this.user.patchValue({
                boards: this.group.board || []
              });

              // this.resetForm(1);
              this.user.patchValue({
                medium: this.group.medium || []
              });

              // this.resetForm(2);
              this.user.patchValue({
                grades: this.group.grade || []
              });

              

              }).catch(error => {
                this.isFormValid = false;
                this.loader.dismiss();
                this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
              });
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
   * This will internally call framework API
   * @param {string} currentCategory - request Parameter passing to the framework API
   * @param {string} list - Local variable name to hold the list data
   */
  getCategoryData(req: CategoryRequest, list): void {
    this.formAndFrameworkUtilService.getCategoryData(req, this.frameworkId).
      then((result) => {

        // if (list === 'boardList')
        if (this.loader !== undefined)
          this.loader.dismiss();

        this[list] = result;
        if (list != 'gradeList') {
          this[list] = _.orderBy(this[list], ['name'], ['asc']);
        }
      })
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = []) {

    if (index === 0) {
      this[currentField] = this.syllabusList;
    } else if (index === 1) {
      // let loader = this.getLoader();
      // loader.present();
      this.frameworkId = prevSelectedValue[0];
      this.formAndFrameworkUtilService.getFrameworkDetails(this.frameworkId)
        .then(catagories => {
          this.categories = catagories;

          this.isFormValid = true;
          // loader.dismiss();
          let request: CategoryRequest = {
            currentCategory: this.categories[0].code,
            selectedLanguage: this.translate.currentLang
          }
          this.getCategoryData(request, currentField);
        }).catch(error => {
          this.isFormValid = false;
          this.getToast(this.translateMessage("NEED_INTERNET_TO_CHANGE")).present();
        });

    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index - 1].code,
        prevCategory: this.categories[index - 2].code,
        selectedCode: prevSelectedValue,
        selectedLanguage: this.selectedLanguage
      }
      this.getCategoryData(request, currentField);
    }

  }

  resetForm(index: number = 0, showloader: boolean): void {
    switch (index) {
      case 0:
        this.user.patchValue({
          boards: [],
          grades: [],
          medium: []
        });
        if (showloader) {
          this.loader = this.getLoader();
          this.loader.present();
        }
        this.checkPrevValue(1, 'boardList', [this.syllabusList[0]]);

        break;

      case 1:
        this.user.patchValue({
          grades: [],
          medium: []
        });
        this.checkPrevValue(2, 'mediumList', this.user.value.boards);
        break;

      case 2:
        this.user.patchValue({
          grades: [],
        });
        this.checkPrevValue(3, 'gradeList', this.user.value.medium);
        break;
     
    }
  }

  ngOnInit() {
    
    }
    onSelectedBoard(){
     this.isSelectBoard = true;
    }
    onSelectMedium(){
      this.isSelectMedium = true;
    }
    onSelectClass(){
      this.isSelectClass = true;
      this.btnColor = '#006DE5';
    }
    showMessage(name: string){
      this.btnColor = '#8FC4FF';
      let toast = this.toastCtrl.create({
        message: this.translateMessage('Please select a ')+name,
        duration: 2000,
        cssClass: 'userFinishSelectBtn',
        position: 'Bottom'
      });
      toast.dismissAll();
      toast.present();
    }

    onSubmit(){
      if(this.isSelectBoard && this.isSelectMedium && this.isSelectClass){
        this.btnColor = '#006DE5';
      }else if(!this.isSelectBoard){
        this.showMessage("board");
        return false;
      }
      else if(!this.isSelectMedium){
        this.showMessage("medium");
        return false;
      }
      else if(!this.isSelectClass){
        console.log("class");
        this.showMessage("class");
        return false;
      }else{
        
      }
       
    }
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
