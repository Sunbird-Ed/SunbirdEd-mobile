import { Component, NgZone } from '@angular/core';
import { NavController, PopoverController, Events, LoadingController, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

import { GuestEditProfilePage } from './../guest-edit.profile/guest-edit.profile';
import { OverflowMenuComponent } from "./../overflowmenu/menu.overflow.component";
import { ProfileService, CategoryRequest, FrameworkDetailsRequest, FrameworkService, SharedPreferences, ProfileType, FormService, FormRequest } from 'sunbird';
import { UserTypeSelectionPage } from '../../user-type-selection/user-type-selection';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

@Component({
  selector: 'page-guest-profile',
  templateUrl: 'guest-profile.html',
})

export class GuestProfilePage {

  imageUri: string = "assets/imgs/ic_profile_default.png";
  list: Array<String> = ['SETTINGS'];

  showSignInCard: boolean = false;
  isNetworkAvailable: boolean;
  showWarning: boolean = false;
  /* Temporary Language Constants */
  boards: string = "";
  grade: string = "";
  medium: string = "";
  subjects: string = "";
  categories: Array<any> = []
  profile: any = {};
  syllabus: string = "";
  selectedLanguage: string;
  loader: any

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(public navCtrl: NavController,
    public network: Network,
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private events: Events,
    private preference: SharedPreferences,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private zone: NgZone
  ) {

    //language code
    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });

    this.preference.getString('selected_user_type', (val) => {
      if (val == ProfileType.TEACHER) {
        this.showSignInCard = true;
      } else if (val == ProfileType.STUDENT) {
        this.showSignInCard = false;
      }
    })
    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
    }
    this.network.onDisconnect().subscribe((data) => {
      this.isNetworkAvailable = false;
    });
    this.network.onConnect().subscribe((data) => {
      this.isNetworkAvailable = true;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguageSettingPage');
  }

  ionViewDidEnter() {
    this.refreshProfileData();
  }

  refreshProfileData(refresher: any = false, showLoader: boolean = true) {
    this.loader = this.getLoader();
    let that = this;

    if (showLoader) {
      this.loader.present();
    }

    this.profileService.getCurrentUser((res: any) => {
      that.profile = JSON.parse(res);
      that.init()
      .then(result => {
        that.zone.run(() => {
          that.syllabus = that.mapSyllabi(result.syllabi);
          that.boards = that.mapBoards(result.boards);
          that.medium = that.mapMediums(result.mediums);
          that.grade = that.mapGrades(result.grades);
          that.subjects = that.mapSubjects(result.subjects);
          that.loader.dismiss();
          if (refresher) {
            refresher.complete();
          }
        });
      });
    }, err => {
      that.loader.dismiss();
      if (refresher) {
        refresher.complete();
      }
    });
  }

  private mapSyllabi(syllabi) {
    let that = this;
    return syllabi.filter(element => {
      return (that.profile.syllabus && that.profile.syllabus.indexOf(element.frameworkId) > -1);
    }).reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue.name.concat(','));
      }, ""
    );
  }

  private mapBoards(boards) {
    let that = this;
    return boards.filter(element => {
      return (that.profile.board && that.profile.board.indexOf(element.code) > -1);
    }).reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue.name.concat(','));
      }, ""
    );
  }

  private mapMediums(mediums) {
    let that = this;
    return mediums.filter(element => {
      return (that.profile.medium && that.profile.medium.indexOf(element.code) > -1);
    }).reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue.name.concat(','));
      }, ""
    );
  }

  private mapGrades(grades) {
    let that = this;
    return grades.filter(element => {
      return (that.profile.grade && that.profile.grade.indexOf(element.code) > -1);
    }).reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue.name.concat(','));
      }, ""
    );
  }

  private mapSubjects(subjects) {
    let that = this;
    return subjects.filter(element => {
      return (that.profile.subject && that.profile.subject.indexOf(element.code) > -1);
    }).reduce(
      (accumulator, currentValue) => {
        return accumulator.concat(currentValue.name.concat(','));
      }, ""
    );
  }

  private async init() {
    let boards = [], mediums = [], grades = [], subjects = [], localSyllabi = [];

    try {
      localSyllabi = await this.getSyllabusList();
      let frameworkId = (this.profile.syllabus && this.profile.syllabus.length > 0)
        ? this.profile.syllabus[0] : undefined;
      if (frameworkId) {
        boards = await this.getBoardList(frameworkId);
        let selectedBoards = (this.profile.board && this.profile.board.length > 0)
          ? this.profile.board : undefined;
        if (selectedBoards) {
          mediums = await this.getMediumList(frameworkId, selectedBoards);
          let selectedMediums = (this.profile.medium && this.profile.medium.length > 0)
            ? this.profile.medium : undefined;
          if (selectedMediums) {
            grades = await this.getGradeList(frameworkId, selectedMediums);
            let selectedGrades = (this.profile.grade && this.profile.grade.length > 0)
              ? this.profile.grade : undefined;
            if (selectedGrades) {
              subjects = await this.getSubjectList(frameworkId, selectedGrades);
            }
          }
        }
      }

      return await {
        syllabi: localSyllabi,
        boards: boards,
        mediums: mediums,
        grades: grades,
        subjects: subjects
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async getSyllabusList() {
    return await this.formAndFrameworkUtilService.getSyllabusList();
  }

  private async getBoardList(frameworkId) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "board";
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  private async getMediumList(frameworkId: string, selectedBoards: Array<any>) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "medium";
    categoryRequest.prevCategory = "board";
    categoryRequest.selectedCode = selectedBoards;
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  private async getGradeList(frameworkId: string, selectedMediums: Array<any>) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "gradeLevel";
    categoryRequest.prevCategory = "medium";
    categoryRequest.selectedCode = selectedMediums;
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  private async getSubjectList(frameworkId: string, selectedGrades: Array<any>) {
    let that = this;
    let categoryRequest = new CategoryRequest();
    categoryRequest.frameworkId = frameworkId;
    categoryRequest.currentCategory = "subject";
    categoryRequest.prevCategory = "gradeLevel";
    categoryRequest.selectedCode = selectedGrades;
    return await this.formAndFrameworkUtilService.fetchNextCategory(categoryRequest);
  }

  editGuestProfile() {
    if (!this.isNetworkAvailable) {
      this.showNetworkWarning();
    }
    else {
      this.navCtrl.push(GuestEditProfilePage, {
        profile: this.profile
      });
    }
  }

  showNetworkWarning() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 3000);
  }
  /**
   * To show popover menu
   * @param {object} event
   */
  showOverflowMenu(event) {
    this.popoverCtrl.create(OverflowMenuComponent, {
      list: this.list
    }, {
        cssClass: 'box'
      }).present({
        ev: event
      });
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }


  /**
   * Takes the user to role selection screen
   *
   */
  goToRoles() {
    if (!this.isNetworkAvailable) {
      this.showNetworkWarning();
    }
    else {
      this.navCtrl.push(UserTypeSelectionPage, {
        profile: this.profile
      })
    }
  }

  buttonClick(isNetAvailable) {

    this.showNetworkWarning();
  }

  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }

  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }


}
