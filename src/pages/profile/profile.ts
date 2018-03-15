import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CameraService, ProfileService, AuthService } from 'sunbird';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { SkillTagsComponent } from './skill-tags/skill-tags';
import { AdditionalInfoComponent } from './additional-info/additional-info';
import { FormExperience } from './experience/form.experience';
import { OverflowMenuComponent } from './overflowmenu/menu.overflow.component';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profile: any = {};
  lastLoginTime: string;
  userName: string;
  profileName: string;
  profileCompletionText: string = "Your profile is {c}% completed";
  profileProgress: string;
  subjects: string;
  grades: string;

  imageUri: string = "assets/imgs/ic_profile_default.png";
  list: Array<String> = ['SWITCH_ACCOUNT', 'DOWNLOAD_MANAGER', 'SETTINGS', 'SIGN_OUT'];
  
  sunbird: string = "Sunbird";
  
  profDesc: string = "Here are the detailed description of the profile fdhfh Here are the detailed description of the profile fdhfh";
  uncompletedDetails: string = "+ Add Experience";

  constructor(public navCtrl: NavController, 
    private cameraService: CameraService, 
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    private zone: NgZone,
    private datePipe: DatePipe,
    private authService: AuthService) {

  }

  ionViewWillEnter() {
    this.refreshProfileData();
  }

  doRefresh(refresher) {
    this.refreshProfileData()
    .then( () => {
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 200);
    })
    .catch(error => {
      console.log(error);
    })
  }

  resetProfile() {
    this.profile = {};
    this.lastLoginTime = "Last login time: ";
    this.userName = "User Name-";
    this.subjects = "";
    this.grades = "";
  }

  refreshProfileData() {
    let that = this;
    return new Promise(function (resolve, reject) {
      that.authService.getSessionData(session => {
        if (session === undefined || session == null) {
          reject("session is null");
        } else {
          let s = JSON.parse(session);
          let req = {
            userId: s["userToken"], 
            requiredFields: ["completeness", "missingFields", "lastLoginTime", "topics"], 
            refreshUserProfileDetails: true
          };
          that.profileService.getProfileById(req, res => {
            that.zone.run(() => {
              that.resetProfile();
              let r = JSON.parse(res);
              that.profile = r.response;
              if(r.response.avatar) that.imageUri = r.response.avatar;
              that.formatLastLoginTime();
              that.formatUserName();
              that.formatProfileName();
              that.formatProfileCompletion();
              that.formatProfileProgress();
              that.formatJobProfile();
              that.formatSubjects();
              that.formatGrades();
              resolve();
            });
          }, error => {
              reject(error);
              console.log(error);
          });
        }
      });
    });
  }

  formatGrades() {
    this.grades = this.profile.grade.join(', ');
  }

  formatSubjects() {
    this.subjects = this.profile.subject.join(', ');
  }

  formatJobProfile() {
    let jobProfile = this.profile.jobProfile;
    let formattedJobProfile = [];
    jobProfile.forEach(j => {
      let t:any = {};
      t.jobName = j.jobName;
      t.role = j.role;
      t.orgName = j.orgName;
      t.subject = "Subjects: ";
      let s = j.subject;
      s.forEach(element => {
        t.subject = t.subject + element + ", ";
      });
      t.duration = j.joiningDate + " - " + j.endDate;
      formattedJobProfile.push(t);
    });
    this.profile.formattedJobProfile = formattedJobProfile;
  }

  formatLastLoginTime() {
    this.lastLoginTime = this.lastLoginTime + this.datePipe.transform(new Date(this.profile.lastLoginTime), "MMM dd, yyyy, hh:mm:ss a");
  }

  formatUserName() {
    this.userName = this.userName + this.profile.userName;
  }

  formatProfileName() {
    this.profileName = this.profile.firstName + " " + this.profile.lastName;
  }

  formatProfileCompletion() {
    this.profileCompletionText = this.profileCompletionText.replace("{c}", this.profile.completeness);
  }

  formatProfileProgress() {
    this.profileProgress = this.profile.completeness + "";
  }

  editEduDetails(isNewForm) {
    this.navCtrl.push(FormEducation, { addForm: isNewForm});
  }

  editAddress() {
    this.navCtrl.push(FormAddress);
  }

  addSkillTags() {
    this.navCtrl.push(SkillTagsComponent);
  }

  editPicture() {
    this.cameraService.getPicture().then((imageData) => {
      this.imageUri = imageData;
    }, (err) => {
      // Handle error
    });
  }

  editExperience() {
    this.navCtrl.push(FormExperience);
  }

  editAdditionalInfo() {
    this.navCtrl.push(AdditionalInfoComponent);
  }

  showOverflowMenu(event) {
    let popover = this.popoverCtrl.create(OverflowMenuComponent, {
      list: this.list
    });
    popover.present({
      ev: event
    });
  }

}
