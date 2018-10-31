import { Component, NgZone } from '@angular/core';
import {
  NavController, LoadingController,
  NavParams, Events
} from 'ionic-angular';
import {
  AuthService,
  UserProfileService,
  UserProfileDetailsRequest,
  ContentService,
  TelemetryService,
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype,
  ContentSearchCriteria,
  ContentSortCriteria,
  SortOrder,
  CourseService,
  TelemetryObject
} from 'sunbird';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { SkillTagsComponent } from './skill-tags/skill-tags';
import { AdditionalInfoComponent } from './additional-info/additional-info';
import { FormExperience } from './experience/form.experience';
import { OverflowMenuComponent } from './overflowmenu/menu.overflow.component';
import { UserSearchComponent } from './user-search/user-search';
import { ImagePicker } from './imagepicker/imagepicker';
import {
  generateInteractTelemetry,
  generateImpressionTelemetry
} from '../../app/telemetryutil';
import {
  ProfileConstants,
  MenuOverflow,
  ContentType,
  MimeType
} from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { CommonUtilService } from '../../service/common-util.service';
import { CategoriesEditPage } from '../categories-edit/categories-edit';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

/**
 * The Profile page
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  /**
   * Contains Profile Object
   */
  profile: any = {};
  /**
   * Contains userId for the Profile
   */
  userId = '';
  isLoggedInUser = false;
  isRefreshProfile = false;
  loggedInUserId = '';
  lastLoginTime = '';

  profileName: string;
  profileProgress = '';
  languages: string;
  subjects: string;
  grades: string;
  onProfile = true;
  isUploading = false;
  trainingsCompleted = [];
  roles = [];

  /**
   * Contains paths to icons
   */
  imageUri = 'assets/imgs/ic_profile_default.png';
  educationIcon = 'assets/imgs/ic_businessman.png';
  locationIcon = 'assets/imgs/ic_location.png';

  uncompletedDetails: any = {
    title: ''
  };

  /* Social Media Links */
  fbLink = '';
  twitterLink = '';
  linkedInLink = '';
  blogLink = '';

  readonly DEFAULT_PAGINATION_LIMIT = 2;
  paginationLimit = 2;
  rolesLimit = 2;
  badgesLimit = 2;
  trainingsLimit = 2;
  startLimit = 0;

  enrolledCourse: any = [];

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private userProfileService: UserProfileService,
    private zone: NgZone,
    private datePipe: DatePipe,
    private authService: AuthService,
    private contentService: ContentService,
    private telemetryService: TelemetryService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private courseService: CourseService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.userId = this.navParams.get('userId') || '';
    this.isRefreshProfile = this.navParams.get('returnRefreshedUserProfileDetails');
    this.isLoggedInUser = this.userId ? false : true;

    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', (upgrade) => {
      if (upgrade) {
        this.appGlobalService.openPopover(upgrade);
      }
    });
  }

  ionViewDidLoad() {
    this.doRefresh();
    this.events.subscribe('profilePicture:update', (res) => {
      if (res.isUploading && res.url !== '') {
        this.imageUri = res.url;
      }

      this.isUploading = res.isUploading;
    });
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.PROFILE,
      Environment.USER, '', '', '',
      undefined,
      undefined
    ));
  }

  doRefresh(refresher?) {
    const loader = this.getLoader();
    this.isRefreshProfile = true;
    loader.present();
    this.refreshProfileData()
      .then(() => {
        setTimeout(() => {
          if (refresher) {
            refresher.complete();
          }
          this.events.publish('refresh:profile');
          loader.dismiss();
        }, 500);
        // This method is used to handle trainings completed by user
        this.getEnrolledCourses();
      })
      .catch(error => {
        console.error('Error while Fetching Data', error);
        loader.dismiss();
      });
  }

  /**
   * To reset Profile Before calling new fresh API for Profile
   */
  resetProfile() {
    this.profile = {};
    this.subjects = '';
    this.grades = '';
    this.languages = '';
  }

  /**
   * To refresh Profile data on pull to refresh or on click on the profile
   */
  refreshProfileData() {
    const that = this;
    return new Promise((resolve, reject) => {
      that.authService.getSessionData(session => {
        if (session === null || session === 'null') {
          reject('session is null');
        } else {
          const sessionObj = JSON.parse(session);
          that.loggedInUserId = sessionObj[ProfileConstants.USER_TOKEN];
          if (that.userId && sessionObj[ProfileConstants.USER_TOKEN] === that.userId) {
            that.isLoggedInUser = true;
          }

          const req: UserProfileDetailsRequest = {
            userId:
              that.userId && that.userId !== sessionObj[ProfileConstants.USER_TOKEN]
                ? that.userId
                : sessionObj[ProfileConstants.USER_TOKEN],
            requiredFields: ProfileConstants.REQUIRED_FIELDS
          };
          if (that.isLoggedInUser) {
            if (that.isRefreshProfile) {
              req.returnRefreshedUserProfileDetails = true;
              that.isRefreshProfile = false;
            } else {
              req.refreshUserProfileDetails = true;
            }
          } else {
            req.returnRefreshedUserProfileDetails = true;
            that.isRefreshProfile = false;
          }

          that.userProfileService.getUserProfileDetails(
            req,
            (res: any) => {
              that.zone.run(() => {
                that.resetProfile();
                const r = JSON.parse(res);
                that.profile = r;
                if (r && r.avatar) {
                  that.imageUri = r.avatar;
                }
                that.searchContent();
                that.formatLastLoginTime();
                that.formatProfileProgress();
                that.formatJobProfile();
                that.formatRoles();
                if (!that.isLoggedInUser) { that.formatSkills(); }
                that.subjects = that.arrayToString(that.profile.subject);
                that.languages = that.arrayToString(that.profile.language);
                that.grades = that.arrayToString(that.profile.grade);
                that.formatMissingFields();
                that.formatSocialLinks();
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
    return stringArray.join(', ');
  }

  /**
   * To Format the missing fields and gives it proper name based on missing field
   * TODO: Need to replace following strings with the language constants
   */
  formatMissingFields() {
    this.uncompletedDetails.title = '';
    if (this.profile.missingFields && this.profile.missingFields.length) {
      // Removing avatar from missing fields, because user can't add or edit profile image.
      if (this.profile.missingFields[0] === 'avatar') {
        this.profile.missingFields.splice(0, 1);
      }

      switch (this.profile.missingFields[0]) {
        case 'education':
          this.uncompletedDetails.title = 'ADD_EDUCATION';
          this.uncompletedDetails.page = FormEducation;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          break;

        case 'jobProfile':
          this.uncompletedDetails.title = 'ADD_EXPERIENCE';
          this.uncompletedDetails.page = FormExperience;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          break;

        // case "avatar":
        //   this.uncompletedDetails.title = 'ADD_AVATAR';
        //   this.uncompletedDetails.page = "picture";
        //   break;

        case 'address':
          this.uncompletedDetails.title = 'ADD_ADDRESS';
          this.uncompletedDetails.page = FormAddress;
          this.uncompletedDetails.data = {
            addForm: true,
            profile: this.profile
          };
          break;

        case 'location':
          this.setMissingProfileDetails('ADD_LOCATION');
          break;
        case 'phone':
          this.setMissingProfileDetails('ADD_PHONE_NUMBER');
          break;
        case 'profileSummary':
          this.setMissingProfileDetails('ADD_PROFILE_DESCRIPTION');
          break;
        case 'subject':
          this.setMissingProfileDetails('ADD_SUBJECT');
          break;
        case 'dob':
          this.setMissingProfileDetails('ADD_DATE_OF_BIRTH');
          break;
        case 'grade':
          this.setMissingProfileDetails('ADD_CLASS');
          break;
        case 'lastName':
          this.setMissingProfileDetails('ADD_LAST_NAME');
          break;
      }
    }
  }

  setMissingProfileDetails(title: string) {
    const requiredProfileFields: Array<string> = [
      'userId',
      'firstName',
      'lastName',
      'language',
      'email',
      'phone',
      'profileSummary',
      'subject',
      'gender',
      'dob',
      'grade',
      'location',
      'webPages'
    ];

    this.uncompletedDetails.title = title;
    this.uncompletedDetails.page = AdditionalInfoComponent;
    this.uncompletedDetails.data = {
      userId: this.loggedInUserId,
      profile: this.getSubset(requiredProfileFields, this.profile),
      profileVisibility: this.profile.profileVisibility
    };
  }

  formatJobProfile() {
    this.profile.jobProfile.forEach(job => {
      if (job.subject) {
        job.subject = this.arrayToString(job.subject);
      }
    });
  }

  formatRoles() {
    this.roles = [];
    for (let i = 0, len = this.profile.organisations.length; i < len; i++) {
      for (let j = 0, l = this.profile.organisations[i].roles.length; j < l; j++) {
        this.roles.push(this.profile.organisations[i].roles[j]);
      }
    }
  }

  formatLastLoginTime() {
    this.lastLoginTime = this.datePipe.transform(new Date(this.profile.lastLoginTime), 'MMM dd, yyyy, hh:mm:ss a');
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
        if (element.type === 'fb') {
          this.fbLink = element.url;
        } else if (element.type === 'twitter') {
          this.twitterLink = element.url;
        } else if (element.type === 'in') {
          this.linkedInLink = element.url;
        } else {
          this.blogLink = element.url;
        }
      });
    }
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
    this.zone.run(() => {
      this.navCtrl.push(FormAddress, {
        addForm: isNewForm,
        addressDetails: addressDetails,
        profile: this.profile
      });
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

    if (this.profile.skills[num].hasOwnProperty('endorsementCount')) {
      this.profile.skills[num].endorsementCount += 1;
    } else {
      this.profile.skills[num].endorsementcount += 1;
    }

    this.profile.skills[num].canEndorse = false;

    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error('session is null');
      } else {
        const req = {
          userId: this.profile.skills[num].addedBy,
          skills: [this.profile.skills[num].skillName]
        };
        this.userProfileService.endorseOrAddSkill(
          req,
          (res: any) => {
          },
          (error: any) => {
            console.error('Error', JSON.parse(error));

            /* Revert Changes if API call get fails to update */
            if (this.profile.skills[num].hasOwnProperty('endorsementCount')) {
              this.profile.skills[num].endorsementCount -= 1;
            } else {
              this.profile.skills[num].endorsementcount -= 1;
            }
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
    const popover = this.popoverCtrl.create(ImagePicker,
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
    this.zone.run(() => {
      this.navCtrl.push(FormExperience, {
        addForm: isNewForm,
        jobInfo: jobInfo,
        profile: this.profile
      });
    });
  }

  /**
   * Open up the Additional Information form in edit mode
   */
  editAdditionalInfo() {
    /* Required profile fields to pass to an Additional Info page */
    const requiredProfileFields: Array<string> = [
      'userId',
      'firstName',
      'lastName',
      'language',
      'email',
      'phone',
      'profileSummary',
      'subject',
      'gender',
      'dob',
      'grade',
      'location',
      'webPages'
    ];

    this.navCtrl.push(AdditionalInfoComponent, {
      userId: this.loggedInUserId,
      profile: this.getSubset(requiredProfileFields, this.profile),
      profileVisibility: this.profile.profileVisibility
    });
  }

  /**
   * To Toggle the lock
   */
  toggleLock(field: string, fieldDisplayName: string, revert: boolean = false, ) {
    if (!this.profile.profileVisibility.hasOwnProperty(field)) {
      this.profile.profileVisibility[field] = 'public';
    }
    this.profile.profileVisibility[field] = this.profile.profileVisibility[field] === 'private' ? 'public' : 'private';

    if (!revert) {
      if (this.profile.profileVisibility[field] === 'private') {
        this.commonUtilService.showToast(
          this.commonUtilService.translateMessage('PRIVACY_HIDE_TEXT',
            this.commonUtilService.translateMessage(fieldDisplayName).toLocaleLowerCase()));
      } else {
        if (fieldDisplayName === 'SKILL_TAGS') {
          this.commonUtilService.showToast(
            this.commonUtilService.translateMessage('PRIVACY_SHOW_TEXT',
              _.startCase(this.commonUtilService.translateMessage(fieldDisplayName))));
        } else {
          this.commonUtilService.showToast(
            this.commonUtilService.translateMessage('PRIVACY_SHOW_TEXT',
              _.capitalize(this.commonUtilService.translateMessage(fieldDisplayName))));
        }
      }
      this.setProfileVisibility(field);
    }
  }

  /**
   * To set Profile visibility
   */
  setProfileVisibility(field: string) {
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
      } else {
        const req = {
          userId: JSON.parse(session)[ProfileConstants.USER_TOKEN],
          privateFields:
            this.profile.profileVisibility[field] === 'private' ? [field] : [],
          publicFields:
            this.profile.profileVisibility[field] === 'public' ? [field] : []
        };
        this.userProfileService.setProfileVisibility(
          req,
          (res: any) => {
            this.isRefreshProfile = true;
            this.refreshProfileData();
          },
          (err: any) => {
            console.error('Unable to set profile visibility.', err);
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
            this.toggleLock(field, '', true); // In-case of API fails to update, make privacy lock icon as it was.
          }
        );
      }
    });
  }

  /**
   * To show popover menu
   */
  showOverflowMenu(event) {
    const popover = this.popoverCtrl.create(OverflowMenuComponent, {
      list: MenuOverflow.MENU_LOGIN,
      profile: this.profile
    }, {
        cssClass: 'box'
      });
    popover.present({
      ev: event
    });
  }

  completeProfile() {
    if (this.uncompletedDetails.page === 'picture') {
      this.editPicture();
    } else {
      this.navCtrl.push(this.uncompletedDetails.page, this.uncompletedDetails.data);
    }
  }

  /**
   * Searches contents created by the user
   */
  searchContent(): void {
    const contentSortCriteria: ContentSortCriteria = {
      sortAttribute: 'lastUpdatedOn',
      sortOrder: SortOrder.DESC
    };
    const contentSearchCriteria: ContentSearchCriteria = {
      createdBy: [this.userId || this.loggedInUserId],
      limit: 20,
      contentTypes: ContentType.FOR_PROFILE_TAB,
      sortCriteria: [contentSortCriteria]
    };

    this.contentService.searchContent(contentSearchCriteria,
      false, false, false,
      (result: any) => {
        this.enrolledCourse = JSON.parse(result).result.contentDataList;
      },
      (error: any) => {
        console.error('Error', error);
      }
    );
  }

  /**
   * Navigates to User Search Page
   */
  gotoSearchPage(): void {
    this.telemetryService.interact(
      generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.SEARCH_BUTTON_CLICKED,
        Environment.HOME,
        PageId.PROFILE, null,
        undefined,
        undefined));
    this.navCtrl.push(UserSearchComponent);
  }

  /**
   * To show more Items in skills list
   */
  showMoreItems(): void {
    this.rolesLimit = this.roles.length;
    generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEW_MORE_CLICKED,
      Environment.HOME,
      PageId.PROFILE, null,
      undefined,
      undefined);
  }

  /**
   * To show Less items in skills list
   * DEFAULT_PAGINATION_LIMIT = 10
   */
  showLessItems(): void {
    this.rolesLimit = this.DEFAULT_PAGINATION_LIMIT;
  }

  showMoreBadges(): void {
    this.badgesLimit = this.profile.badgeAssertions.length;
    generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEW_MORE_CLICKED,
      Environment.HOME,
      PageId.PROFILE, null,
      undefined,
      undefined);
  }

  showLessBadges(): void {
    this.badgesLimit = this.DEFAULT_PAGINATION_LIMIT;
  }

  showMoreTainings(): void {
    this.trainingsLimit = this.trainingsCompleted.length;
    generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEW_MORE_CLICKED,
      Environment.HOME,
      PageId.PROFILE, null,
      undefined,
      undefined);
  }

  showLessTrainings(): void {
    this.trainingsLimit = this.DEFAULT_PAGINATION_LIMIT;
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
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

  openLink(url: string): void {
    const options
      = 'hardwareback=yes,clearcache=no,zoom=no,toolbar=yes,clearsessioncache=no,closebuttoncaption=Done,disallowoverscroll=yes';

    (<any>window).cordova.InAppBrowser.open(url, '_system', options);
  }

  /**
   * To get enrolled course(s) of logged-in user i.e, trainings in the UI.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses() {
    const option = {
      userId: this.profile.userId,
      refreshEnrolledCourses: true,
      returnRefreshedEnrolledCourses: true
    };
    this.trainingsCompleted = [];
    this.courseService.getEnrolledCourses(option)
     .then((res: any) => {
      res = JSON.parse(res);
      const enrolledCourses = res.result.courses;
      for (let i = 0, len = enrolledCourses.length; i < len; i++) {
        if ((enrolledCourses[i].status === 2) || (enrolledCourses[i].leafNodesCount === enrolledCourses[i].progress)) {
          this.trainingsCompleted.push(enrolledCourses[i]);
        }
      }
    })
     .catch((error: any) => {
      console.error('error while loading enrolled courses', error);
    });
  }

  isResource(contentType) {
    return contentType === ContentType.STORY ||
      contentType === ContentType.WORKSHEET;
  }

  /**
   * Navigate to the course/content details page
   *
   * @param {string} layoutName
   * @param {object} content
   */
  navigateToDetailPage(content: any, layoutName: string, index: number): void {
    const identifier = content.contentId || content.identifier;
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = identifier;
    if (layoutName === 'Inprogress') {
      telemetryObject.type = ContentType.COURSE;
    } else {
      telemetryObject.type = this.isResource(content.contentType) ? ContentType.RESOURCE : content.contentType;
    }


    const values = new Map();
    values['sectionName'] = 'Contributions';
    values['positionClicked'] = index;

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      Environment.USER, // env
      PageId.PROFILE, // page name
      telemetryObject,
      values);
    if (content.contentType === ContentType.COURSE) {
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      });
    } else {
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      });
    }
  }

  navigateToCategoriesEditPage() {
    this.telemetryService.interact(
      generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.EDIT_CLICKED,
        Environment.HOME,
        PageId.PROFILE, null,
        undefined,
        undefined));
    this.navCtrl.push(CategoriesEditPage);
  }

}
