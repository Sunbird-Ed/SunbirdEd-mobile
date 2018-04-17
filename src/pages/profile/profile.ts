import { Component, NgZone } from "@angular/core";
import { NavController, LoadingController, NavParams, Events } from "ionic-angular";
import {
  ProfileService,
  AuthService,
  UserProfileService,
  CourseService,
  ContentService
} from "sunbird";
import { PopoverController } from "ionic-angular/components/popover/popover-controller";
import { DatePipe } from "@angular/common";
import * as _ from 'lodash';

import { FormEducation } from "./education/form.education";
import { FormAddress } from "./address/form.address";
import { SkillTagsComponent } from "./skill-tags/skill-tags";
import { AdditionalInfoComponent } from "./additional-info/additional-info";
import { FormExperience } from "./experience/form.experience";
import { OverflowMenuComponent } from "./overflowmenu/menu.overflow.component";
import { UserSearchComponent } from "./user-search/user-search";
import { ImagePicker } from "./imagepicker/imagepicker";


/**
 * The Profile page
 */
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  /**
   * Contains Profile Object
   */
  profile: any = {};
  /**
   * Contains userId for the Profile
   */
  userId: string = '';
  isLoggedInUser: boolean = false;
  loggedInUserId: string = "";
  lastLoginTime: string;
  userName: string;
  profileName: string;
  profileProgress: string = "";
  languages: string;
  subjects: string;
  grades: string;
  onProfile: boolean = true;
  isUploading: boolean = false;

  /**
   * Contains paths to icons
   */
  imageUri: string = "assets/imgs/ic_profile_default.png";
  educationIcon: string = "assets/imgs/ic_businessman.png";
  locationIcon: string = "assets/imgs/ic_location.png";
  list: Array<String> = [
    "SETTINGS",
    "LOGOUT"
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
    public popoverCtrl: PopoverController,
    private profileService: ProfileService,
    public userProfileService: UserProfileService,
    private zone: NgZone,
    private datePipe: DatePipe,
    public authService: AuthService,
    public courseService: CourseService,
    public contentService: ContentService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    public events: Events
  ) {
    this.userId = this.navParams.get("userId") || '';
    this.isLoggedInUser = this.userId ? false : true;
    this.doRefresh();
    /* events.subscribe('profilePicture:update', (url) => {
      console.log('URL=', url);
      this.imageUri = url;
    }); */
    events.subscribe('profilePicture:update', (res) => {
      console.log('URL=', res.url);
      if (res.isUploading && res.url != '') this.imageUri = res.url;
      this.isUploading = res.isUploading;
    });
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

  /**
   * To reset Profile Before calling new fresh API for Profile
   */
  resetProfile() {
    this.profile = {};
    this.lastLoginTime = "Last login time: ";
    this.userName = "User Name - ";
    this.subjects = "";
    this.grades = "";
    this.languages = "";
  }

  /**
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
            (res: any) => {
              this.zone.run(() => {
                this.resetProfile();
                let r = JSON.parse(res);
                this.profile = r.response;
                if (r.response && r.response.avatar)
                  this.imageUri = r.response.avatar;
                this.searchContent();
                this.formatLastLoginTime();
                this.formatUserName();
                this.formatProfileProgress();
                this.formatJobProfile();
                if (!this.isLoggedInUser) this.formatSkills();
                this.subjects = this.arrayToString(this.profile.subject);
                this.languages = this.arrayToString(this.profile.language);
                this.grades = this.arrayToString(this.profile.grade);
                this.formatMissingFields();
                this.formatSocialLinks();
                resolve();
              });
            },
            (error: any) => {
              reject(error);
              console.error(error);
            }
          );
        }
      });
    });
  }

  /**
   * Method to convert Array to Comma separated string
   * @param {Array<string>} stringArray
   * @returns {string}
   */
  arrayToString(stringArray: Array<string>): string {
    return stringArray.join(", ");
  }

  /**
   * To Format the missing fields and gives it proper name based on missing field
   * TODO: Need to replace following strings with the language constants
   */
  formatMissingFields() {
    this.uncompletedDetails.title = '';
    if (this.profile.missingFields && this.profile.missingFields.length) {
      switch (this.profile.missingFields[0]) {
        case "education":
          this.uncompletedDetails.title = "+ Add Education";
          this.uncompletedDetails.page = FormEducation;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          }
          break;
        case "jobProfile":
          this.uncompletedDetails.title = "+ Add Experience";
          this.uncompletedDetails.page = FormExperience;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          }
          break;
        case "avatar":
          this.uncompletedDetails.title = "+ Add Profile Picture";
          this.uncompletedDetails.page = "picture";
          break;
        case "address":
          this.uncompletedDetails.title = "+ Add Address";
          this.uncompletedDetails.page = FormAddress;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          break;
        case "location":
          let requiredProfileFields: Array<string> = ['userId', 'firstName', 'lastName', 'language', 'email', 'phone', 'profileSummary', 'subject', 'gender', 'dob', 'grade', 'location', 'webPages'];
          this.uncompletedDetails.title = "+ Add Location";
          this.uncompletedDetails.page = AdditionalInfoComponent;
          this.uncompletedDetails.data = {
            userId: this.loggedInUserId,
            profile: this.getSubset(requiredProfileFields, this.profile),
            profileVisibility: this.profile.profileVisibility
          }
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

  /* Add new node in endorsersList as `canEndorse` */
  formatSkills() {
    this.profile.skills.forEach(skill => {
      skill.canEndorse = !Boolean(_.find(skill.endorsersList,
        (element) => {
          return element.userId === this.loggedInUserId;
        })
      );
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

  /**
   * Redirects to the Education form and passes current form data if available
   */
  editEduDetails(isNewForm, profile, formDetails = {}) {
    this.navCtrl.push(FormEducation, {
      addForm: isNewForm,
      formDetails: formDetails,
      profile: profile
    });
  }

  /**
   * Redirects to the Address form and passes current form data if available
   */
  editAddress(isNewForm: boolean = true, addressDetails: any = {}) {
    this.navCtrl.push(FormAddress, {
      addForm: isNewForm,
      addressDetails: addressDetails,
      profile: this.profile
    });
  }

  /**
   * Redirects to the Add Skill page
   */
  addSkillTags() {
    this.navCtrl.push(SkillTagsComponent);
  }

  /**
   * Calls Endorse skill API and update the count of Skill endorsement
   * @param {number} num - position of the skill in the skills Array
   */
  endorseSkill(num) {

    // Increase the Endorsement Count with 1 and make it as endorsed
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
        this.userProfileService.endorseOrAddSkill(
          req,
          (res: any) => {
            console.log("Success", JSON.parse(res));
          },
          (error: any) => {
            console.error("Error", JSON.parse(error));

            /* Revert Changes if API call get fails to update */
            this.profile.skills[num].endorsementcount -= 1;
            this.profile.skills[num].canEndorse = true;
          }
        );
      }
    });
  }

  /**
   * Shows the pop up with current Image or open camera instead.
    */
  editPicture() {
    // this.cameraService.getPicture().then((imageData) => {
    //   this.imageUri = imageData;
    // }, (err) => {
    //   console.error("Error", err);
    // });
    let popover = this.popoverCtrl.create(ImagePicker,
      {
        imageUri: this.imageUri,
        profile: this.profile
      });
    popover.present();
  }

  /**
   * Open up the experience form in edit mode
   * @param {boolean} isNewForm - Tells whether user clicked on New Button or edit button
   * @param {object} jobInfo - job object if available
   */
  editExperience(isNewForm: boolean = true, jobInfo: any = {}): void {
    this.navCtrl.push(FormExperience, {
      addForm: isNewForm,
      jobInfo: jobInfo,
      profile: this.profile
    });
  }

  /**
   * Open up the Additional Information form in edit mode
   */
  editAdditionalInfo() {
    /* Required profile fields to pass to an Additional Info page */
    let requiredProfileFields: Array<string> = ['userId', 'firstName', 'lastName', 'language', 'email', 'phone', 'profileSummary', 'subject', 'gender', 'dob', 'grade', 'location', 'webPages'];

    this.navCtrl.push(AdditionalInfoComponent, {
      userId: this.loggedInUserId,
      profile: this.getSubset(requiredProfileFields, this.profile),
      profileVisibility: this.profile.profileVisibility
    });
  }

  /**
   * To Toggle the lock
   */
  toggleLock(field: string) {
    this.profile.profileVisibility[field] =
      this.profile.profileVisibility[field] == "private" ? "public" : "private";
    this.setProfileVisibility(field);
  }

  /**
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
          (res: any) => {
            console.log("success", res);
          },
          (err: any) => {
            console.error("Unable to set profile visibility.", err);
            this.toggleLock(field); // In-case of API fails to update, make privacy lock icon as it was.
          }
        );
      }
    });
  }

  /**
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
      this.navCtrl.push(this.uncompletedDetails.page, this.uncompletedDetails.data);
    }
  }

  /**
   * Searches contents created by the user
   */
  searchContent(): void {
    let req = {
      createdBy: [this.userId || this.loggedInUserId],
      limit: 20,
      contentTypes: ["story", "worksheet", "game", "collection", "textBook", "course", "lessonPlan", "resource"]
    }

    this.contentService.searchContent(req,
      false,
      (result: any) => {
        this.enrolledCourse = JSON.parse(result).result.contentDataList;
      },
      (error: any) => {
        console.error("Error", error);
      }
    )
  }

  /**
   * Navigates to User Search Page
   */
  gotoSearchPage(): void {
    this.navCtrl.push(UserSearchComponent);
  }

  /**
   * To show more Items in skills list
   */
  showMoreItems(): void {
    this.paginationLimit = this.profile.skills.length;
  }

  /**
   * To show Less items in skills list
   * DEFAULT_PAGINATION_LIMIT = 10
   */
  showLessItems(): void {
    this.paginationLimit = this.DEFAULT_PAGINATION_LIMIT;
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  /**
   *  Returns the Object with given Keys only
   * @param {string} keys - Keys of the object which are required in new sub object
   * @param {object} obj - Actual object
   * @returns {object}
   */
  getSubset(keys, obj) {
    return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
  }
}
