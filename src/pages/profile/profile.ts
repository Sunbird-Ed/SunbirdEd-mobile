import { Component, NgZone } from "@angular/core";
import { NavController, LoadingController, NavParams } from "ionic-angular";
import {
  CameraService,
  ProfileService,
  AuthService,
  UserProfileService,
  CourseService
} from "sunbird";
import { PopoverController } from "ionic-angular/components/popover/popover-controller";
import { DatePipe } from "@angular/common";
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { FormEducation } from "./education/form.education";
import { FormAddress } from "./address/form.address";
import { SkillTagsComponent } from "./skill-tags/skill-tags";
import { AdditionalInfoComponent } from "./additional-info/additional-info";
import { FormExperience } from "./experience/form.experience";
import { OverflowMenuComponent } from "./overflowmenu/menu.overflow.component";
import { UserSearchComponent } from "./user-search/user-search";
import { ImagePicker } from "./imagepicker/imagepicker";

/*
 * The Profile page
 */
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  /*
   * Contains Profile Object
   */
  profile: any = {};
  /*
   * Contains userId for the Profile
   */
  userId: number = 0;
  isLoggedInUser: boolean = false;
  loggedInUserId: string = "";
  lastLoginTime: string;
  userName: string;
  profileName: string;
  profileProgress: string = "";
  subjects: string;
  grades: string;

  /*
   * Contains paths to icons
   */
  imageUri: string = "assets/imgs/ic_profile_default.png";
  educationIcon: string = "assets/imgs/ic_businessman.png";
  locationIcon: string = "assets/imgs/ic_location.png";
  list: Array<String> = [
    "SWITCH_ACCOUNT",
    "DOWNLOAD_MANAGER",
    "SETTINGS",
    "SIGN_OUT"
  ];
  uncompletedDetails: any = {
    title: ""
  };

  /* Social Media Links */
  fbLink: string = "";
  twitterLink: string = "";
  linkedInLink: string = "";
  blogLink: string = "";

  readonly DEFAULT_PAGINATION_LIMIT: number = 10;
  paginationLimit: number = 10;
  startLimit: number = 0;

  enrolledCourse: any = [];

  constructor(
    public navCtrl: NavController,
    private cameraService: CameraService,
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    public userProfileService: UserProfileService,
    private zone: NgZone,
    private datePipe: DatePipe,
    public authService: AuthService,
    public courseService: CourseService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private iab: InAppBrowser
  ) {
    this.userId = this.navParams.get("userId");
    this.isLoggedInUser = this.userId ? false : true;
    this.doRefresh();
  }

  doRefresh(refresher?) {
    let loader = this.getLoader();
    loader.present();
    this.refreshProfileData()
      .then(() => {
        setTimeout(() => {
          if (refresher) refresher.complete();
          loader.dismiss();
        }, 500);
      })
      .catch(error => {
        console.log("Error while Fetching Data", error);
        loader.dismiss();
      });
  }

  /*
  * To reset Profile Before calling new fresh API for Profile
  */
  resetProfile() {
    this.profile = {};
    this.lastLoginTime = "Last login time: ";
    this.userName = "User Name - ";
    this.subjects = "";
    this.grades = "";
  }

  /*
  * To refresh Profile data on pull to refresh or on click on the profile
  */
  refreshProfileData() {
    return new Promise((resolve, reject) => {
      this.authService.getSessionData(session => {
        if (session === undefined || session == null) {
          reject("session is null");
        } else {
          let sessionObj = JSON.parse(session);
          this.loggedInUserId = sessionObj["userToken"];
          if (this.userId && sessionObj["userToken"] === this.userId)
            this.isLoggedInUser = true;

          let req = {
            userId:
              this.userId && this.userId != sessionObj["userToken"]
                ? this.userId
                : sessionObj["userToken"],
            requiredFields: [
              "completeness",
              "missingFields",
              "lastLoginTime",
              "topics"
            ],
            refreshUserProfileDetails: true
          };
          this.userProfileService.getUserProfileDetails(
            req,
            res => {
              this.zone.run(() => {
                this.resetProfile();
                let r = JSON.parse(res);
                this.profile = r.response;
                if (r.response && r.response.avatar)
                  this.imageUri = r.response.avatar;
                this.formatLastLoginTime();
                this.formatUserName();
                this.formatProfileProgress();
                this.formatJobProfile();
                if (!this.isLoggedInUser) this.formatSkills();
                this.subjects = this.arrayToString(this.profile.subject);
                this.grades = this.arrayToString(this.profile.grade);
                this.formatMissingFields();
                this.formatSocialLinks();
                this.getEnrolledCourses();
                resolve();
              });
            },
            error => {
              reject(error);
              console.error(error);
            }
          );
        }
      });
    });
  }

  /*
  * Method to convert Array to Comma separated string
  */
  arrayToString(stringArray) {
    return stringArray.join(", ");
  }

  /*
  * To Format the missing fields and gives it proper name based on missing field
  */
  formatMissingFields() {
    if (this.profile.missingFields && this.profile.missingFields.length) {
      switch (this.profile.missingFields[0]) {
        case "education":
          this.uncompletedDetails.title = "+ Add Education";
          this.uncompletedDetails.page = FormEducation;
          break;
        case "jobProfile":
          this.uncompletedDetails.title = "+ Add Experience";
          this.uncompletedDetails.page = FormExperience;
          break;
        case "avatar":
          this.uncompletedDetails.title = "+ Add Profile Picture";
          this.uncompletedDetails.page = "picture";
          break;
      }
    }
  }

  formatJobProfile() {
    this.profile.jobProfile.forEach(job => {
      if (job.subject) {
        job.subject = this.arrayToString(job.subject);
      }
    });
  }

  formatLastLoginTime() {
    this.lastLoginTime =
      this.lastLoginTime +
      this.datePipe.transform(
        new Date(this.profile.lastLoginTime),
        "MMM dd, yyyy, hh:mm:ss a"
      );
  }

  formatSkills() {
    this.profile.skills.forEach(skill => {
      skill.canEndorse = true;
      skill.endorsersList.filter(endorser => {
        skill.canEndorse =
          endorser.userId === this.loggedInUserId ? false : true;
      });
    });
  }

  formatSocialLinks() {
    if (this.profile.webPages.length) {
      this.profile.webPages.forEach(element => {
        if (element.type === "fb") {
          this.fbLink = element.url;
        } else if (element.type === "twitter") {
          this.twitterLink = element.url;
        } else if (element.type === "in") {
          this.linkedInLink = element.url;
        } else {
          this.blogLink = element.url;
        }
      });
    }
  }

  formatUserName() {
    this.userName = this.userName + this.profile.userName;
  }

  formatProfileProgress() {
    this.profileProgress = String(this.profile.completeness);
  }

  /*
  * Redirects to the Education form and passes current form data if available
  */
  editEduDetails(isNewForm, formDetails) {
    this.navCtrl.push(FormEducation, {
      addForm: isNewForm,
      formDetails: formDetails
    });
  }

  /*
  * Redirects to the Address form and passes current form data if available
  */
  editAddress(isNewForm, addressDetails) {
    this.navCtrl.push(FormAddress, {
      addForm: isNewForm,
      addressDetails: addressDetails
    });
  }

  /*
  * Redirects to the Add Skill page
  */
  addSkillTags() {
    this.navCtrl.push(SkillTagsComponent);
  }

  /*
  * Calls Endorse skill API and update the count of Skill endorsement
  */
  endorseSkill(num) {
    this.profile.skills[num].endorsementcount += 1;
    this.profile.skills[num].canEndorse = false;
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let req = {
          userId: this.profile.skills[num].addedBy,
          skills: [this.profile.skills[num].skillName]
        };
        console.log("Request Object", req);
        this.userProfileService.endorseOrAddSkill(
          req,
          res => {
            console.log("Success", JSON.parse(res));
          },
          error => {
            console.error("Error", JSON.parse(error));
            this.profile.skills[num].endorsementcount -= 1;
            this.profile.skills[num].canEndorse = true;
          }
        );
      }
    });
  }

  /*
  * Shows the pop up with current Image or open camera instead.
  */
  editPicture() {
    // this.cameraService.getPicture().then((imageData) => {
    //   this.imageUri = imageData;
    // }, (err) => {
    //   console.error("Error", err);
    // });
    let popover = this.popoverCtrl.create(ImagePicker, {
      imageUri: this.imageUri
    });
    popover.present();
  }

  /*
  * Open up the experience form in edit mode
  */
  editExperience(isNewForm, jobInfo) {
    this.navCtrl.push(FormExperience, {
      addForm: isNewForm,
      jobInfo: jobInfo
    });
  }

  /*
  * Open up the Additional Information form in edit mode
  */
  editAdditionalInfo() {
    this.navCtrl.push(AdditionalInfoComponent, {
      userId: this.loggedInUserId,
      profile: this.profile
    });
  }

  /*
  * To Toggle the lock
  *  */
  toggleLock(field) {
    this.profile.profileVisibility[field] =
      this.profile.profileVisibility[field] == "private" ? "public" : "private";
    this.setProfileVisibility(field);
  }

  /*
  * To set Profile visibility
  */
  setProfileVisibility(field) {
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let req = {
          userId: JSON.parse(session)["userToken"],
          privateFields:
            this.profile.profileVisibility[field] == "private" ? [field] : [],
          publicFields:
            this.profile.profileVisibility[field] == "public" ? [field] : []
        };
        this.userProfileService.setProfileVisibility(
          req,
          res => {
            console.log("success", res);
          },
          error => {
            console.error("Unable to set profile visibility.", error);
          }
        );
      }
    });
  }

  /*
  * To show popover menu
  */
  showOverflowMenu(event) {
    let popover = this.popoverCtrl.create(OverflowMenuComponent, {
      list: this.list
    });
    popover.present({
      ev: event
    });
  }

  completeProfile() {
    if (this.uncompletedDetails.page == "picture") {
      this.editPicture();
    } else {
      this.navCtrl.push(this.uncompletedDetails.page);
    }
  }

  /*
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(): void {
    console.log("making api call to get enrolled courses");
    let option = {
      userId: this.loggedInUserId,
      refreshEnrolledCourses: false
    };
    this.courseService.getEnrolledCourses(
      option,
      (data: any) => {
        if (data) {
          data = JSON.parse(data);
          data.result.courses
            ? data.result.courses.forEach(element => {
                if(element.addedBy === this.loggedInUserId) {
                    this.enrolledCourse.push(element);
                }
            })
            : [];
          console.log("this mmmmmmmmm enrolledCourse", this.enrolledCourse);
        }
      },
      (error: any) => {
        console.log("error while loading enrolled courses", error);
      }
    );
  }

  /*
  * Navigates to User Search Page
  */
  gotoSearchPage() {
    this.navCtrl.push(UserSearchComponent);
  }

  /*
  * To show more Items in skills list
  */
  showMoreItems() {
    this.paginationLimit = this.profile.skills.length;
  }

  /*
  * To show Less items in skills list
  * DEFAULT_PAGINATION_LIMIT = 10
  *  */
  showLessItems() {
    this.paginationLimit = this.DEFAULT_PAGINATION_LIMIT;
  }

  getLoader() {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  openLink(url) {
    if (url) {
        let options = 'location=no,hidden=yes,hardwareback=yes,clearcache=no,zoom=no,toolbar=yes,clearsessioncache=no,closebuttoncaption=Done,disallowoverscroll=yes';
        const browser = this.iab.create(url, '_system', options);
        let loading = this.getLoader();
        browser.on('loadstart').subscribe(() => {
            loading.present();
        });
        browser.on('loadstop').subscribe(() => {
            loading.dismiss();
            browser.show();
        });
        browser.on('loaderror').subscribe(() => {
            loading.dismiss();
            browser.close();
        });
    }
}

}
