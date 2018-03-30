import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { CameraService, ProfileService, AuthService, UserProfileService } from 'sunbird';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { DatePipe } from '@angular/common';

import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { SkillTagsComponent } from './skill-tags/skill-tags';
import { AdditionalInfoComponent } from './additional-info/additional-info';
import { FormExperience } from './experience/form.experience';
import { OverflowMenuComponent } from './overflowmenu/menu.overflow.component';
import { UserSearchComponent } from './user-search/user-search';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html' 
})
export class ProfilePage {

  profile: any = {};
  userId: number = 0;
  isLoggedInUser: boolean = false;
  lastLoginTime: string;
  userName: string;
  profileName: string;
  profileProgress: string = '';
  subjects: string;
  grades: string;
  imageUri: string = "assets/imgs/ic_profile_default.png";
  educationIcon:  string = "assets/imgs/ic_businessman.png";
  locationIcon:  string = "assets/imgs/ic_location.png";
  list: Array<String> = ['SWITCH_ACCOUNT', 'DOWNLOAD_MANAGER', 'SETTINGS', 'SIGN_OUT'];
  profileCompletionText: string = "Your profile is {c}% completed";
  sunbird: string = "Sunbird";
  uncompletedDetails: any = {
    title: ""
  }

  readonly DEFAULT_PAGINATION_LIMIT: number = 10;
  paginationLimit: number = 10;
  startLimit: number = 0;

  constructor(public navCtrl: NavController, 
    private cameraService: CameraService, 
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    public userProfileService: UserProfileService,
    private zone: NgZone,
    private datePipe: DatePipe,
    public authService: AuthService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams) {
    this.userId = this.navParams.get('userId');
    this.isLoggedInUser = this.userId ? false : true;
      this.doRefresh();
  }

  doRefresh(refresher?) {
    let loader = this.getLoader();
    loader.present();
    this.refreshProfileData().then( () => {
      setTimeout(() => {
        if(refresher) refresher.complete();
        loader.dismiss();
      }, 500);
    })
    .catch(error => {
      console.log("Error while Fetching Data", error);
      loader.dismiss();
    })
  }

  resetProfile() {
    this.profile = {};
    this.lastLoginTime = "Last login time: ";
    this.userName = "User Name - ";
    this.subjects = "";
    this.grades = "";
  }

  refreshProfileData() {
    return new Promise((resolve, reject) => {
      this.authService.getSessionData((session) => {
        if (session === undefined || session == null) {
          reject("session is null");
        } else {
          let sessionObj = JSON.parse(session);
          let req = {
            userId: (this.userId) ? this.userId : sessionObj["userToken"],
            requiredFields: ["completeness", "missingFields", "lastLoginTime", "topics"], 
            refreshUserProfileDetails: true
          };
          this.userProfileService.getUserProfileDetails(req, res => {
            this.zone.run(() => {
              this.resetProfile();
              let r = JSON.parse(res);
              this.profile = r.response;
              if(r.response && r.response.avatar) this.imageUri = r.response.avatar;
              this.formatLastLoginTime();
              this.formatUserName();
              this.formatProfileProgress();
              this.formatJobProfile();
              this.subjects = this.arrayToString(this.profile.subject);
              this.grades = this.arrayToString(this.profile.grade);
              this.formatMissingFields();
              resolve();
            });
          }, error => {
              reject(error);
              console.error(error);
          });
        }
      });
    });
  }

  arrayToString(stringArray) {
    return stringArray.join(', ');
  }

  formatMissingFields() {
    if(this.profile.missingFields && this.profile.missingFields.length) {
      switch(this.profile.missingFields[0]) {
        case "education":   this.uncompletedDetails.title = "+ Add Education";
                            this.uncompletedDetails.page = FormEducation;
                            break;
        case "jobProfile":  this.uncompletedDetails.title = "+ Add Experience";
                            this.uncompletedDetails.page = FormExperience;
                            break;
        case "avatar":      this.uncompletedDetails.title = "+ Add Profile Picture";
                            this.uncompletedDetails.page = 'picture';
                            break;
      }
    }
  }

  formatJobProfile() {
    this.profile.jobProfile.forEach(job => {
        if(job.subject) {
            job.subject = this.arrayToString(job.subject);
        }
    });
  }
  formatLastLoginTime() {
    this.lastLoginTime = this.lastLoginTime + this.datePipe.transform(new Date(this.profile.lastLoginTime), "MMM dd, yyyy, hh:mm:ss a");
  }

  formatUserName() {
    this.userName = this.userName + this.profile.userName;
  }

  formatProfileProgress() {
    this.profileProgress = String(this.profile.completeness);
  }

  editEduDetails(isNewForm, formDetails) {
    this.navCtrl.push(FormEducation, { addForm: isNewForm, formDetails: formDetails });
  }

  editAddress(isNewForm, addressDetails) {
    this.navCtrl.push(FormAddress, { addForm: isNewForm, addressDetails: addressDetails });
  }

  addSkillTags() {
    this.navCtrl.push(SkillTagsComponent);
  }

  editPicture() {
    this.cameraService.getPicture().then((imageData) => {
      this.imageUri = imageData;
    }, (err) => {
      console.error("Error", err);
    });
  }

  editExperience(isNewForm, jobInfo) {
    this.navCtrl.push(FormExperience, { addForm: isNewForm, jobInfo: jobInfo });
  }

  editAdditionalInfo() {
    this.navCtrl.push(AdditionalInfoComponent);
  }

  toggleLock(field) {

    this.profile.profileVisibility[field] = this.profile.profileVisibility[field] == 'private' ? 'public' : 'private';
    this.setProfileVisibility(field);
  }
    setProfileVisibility(field) {
        this.authService.getSessionData((session) => {
            if (session === undefined || session == null) {
              console.error('session is null');
            } else {
              let req = {
                  userId: JSON.parse(session)["userToken"],
                  privateFields: (this.profile.profileVisibility[field] == 'private') ? [field] : [],
                  publicFields: (this.profile.profileVisibility[field] == 'public') ? [field] : []
              }
              this.userProfileService.setProfileVisibility(req, res => {
                  console.log("success", res);
              },
              error => {
                  console.error("Unable to set profile visibility.", error);
              });
            }
          });
    }

  showOverflowMenu(event) {
    let popover = this.popoverCtrl.create(OverflowMenuComponent, {
      list: this.list
    });
    popover.present({
      ev: event
    });
  }

  completeProfile() {
    if(this.uncompletedDetails.page == 'picture') {
      this.editPicture();
    } else {
      this.navCtrl.push(this.uncompletedDetails.page);
    }
  }

  gotoSearchPage() {
    this.navCtrl.push(UserSearchComponent);
  }

  showMoreItems() {
    this.paginationLimit = this.profile.skills.length;
  }
  showLessItems() {
    this.paginationLimit = this.DEFAULT_PAGINATION_LIMIT;
  }
    
   getLoader() {
    return this.loadingCtrl.create({duration: 30000, spinner: "crescent" });
  }

}
