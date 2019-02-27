import { Component, NgZone } from '@angular/core';
import {
  NavController,
  LoadingController,
  NavParams,
  Events,
  PopoverController,
  App,
  ViewController
} from 'ionic-angular';
import {
  AuthService,
  UserProfileService,
  UserProfileDetailsRequest,
  TelemetryService,
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype,
  CourseService,
  TelemetryObject,
  ProfileService,
  ContainerService,
  ContentSortCriteria,
  ContentSearchCriteria,
  ContentService,
  SortOrder,
  UpdateUserInfoRequest
} from 'sunbird';
import * as _ from 'lodash';
import {
  OverflowMenuComponent
} from '@app/pages/profile';
import {
  generateInteractTelemetry,
  generateImpressionTelemetry
} from '@app/app/telemetryutil';
import {
  ProfileConstants,
  MenuOverflow,
  ContentType,
  MimeType,
  ContentCard
} from '@app/app/app.constant';
import { CategoriesEditPage } from '@app/pages/categories-edit/categories-edit';
import { PersonalDetailsEditPage } from '@app/pages/profile/personal-details-edit.profile/personal-details-edit.profile';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '@app/pages/collection-details/collection-details';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { AppGlobalService, TelemetryGeneratorService, CommonUtilService } from '@app/service';
import { FormAndFrameworkUtilService } from './formandframeworkutil.service';
import { EditContactDetailsPopupComponent } from '@app/component/edit-contact-details-popup/edit-contact-details-popup';
import { EditContactVerifyPopupComponent } from '@app/component';


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
  refresh: boolean;
  profileName: string;
  onProfile = true;
  trainingsCompleted = [];
  roles = [];
  userLocation = {
    state: {},
    district: {}
  };

  /**
   * Contains paths to icons
   */
  imageUri = 'assets/imgs/ic_profile_default.png';

  readonly DEFAULT_PAGINATION_LIMIT = 2;
  rolesLimit = 2;
  badgesLimit = 2;
  trainingsLimit = 2;
  startLimit = 0;
  custodianOrgId: string;
  isCustodianOrgId: boolean;
  contentCreatedByMe: any = [];
  orgDetails: {
    'state': '',
    'district': '',
    'block': ''
  };

  layoutPopular = ContentCard.LAYOUT_POPULAR;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private userProfileService: UserProfileService,
    private zone: NgZone,
    private authService: AuthService,
    private telemetryService: TelemetryService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private courseService: CourseService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private profileService: ProfileService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private containerService: ContainerService,
    private commonUtilService: CommonUtilService,
    private app: App,
    private contentService: ContentService,
    public viewCtrl: ViewController
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

    this.events.subscribe('loggedInProfile:update', (framework) => {
      this.updateLocalProfile(framework);
      this.doRefresh();
    });

    this.formAndFrameworkUtilService.getCustodianOrgId().then((orgId: string) => {
      this.custodianOrgId = orgId;
    }, err => {
    });
  }

  ionViewDidLoad() {
    this.doRefresh();
    this.events.subscribe('profilePicture:update', (res) => {
      if (res.isUploading && res.url !== '') {
        this.imageUri = res.url;
      }
    });
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.PROFILE,
      Environment.USER, '', '', '',
      undefined,
      undefined
    ));
  }

  public doRefresh(refresher?) {
    const loader = this.getLoader();
    this.isRefreshProfile = true;
    if (!refresher) {
    loader.present();
    } else {
       refresher.complete();
       this.refresh = true;
    }
    return this.refreshProfileData()
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.events.publish('refresh:profile');
            this.refresh = false;
            loader.dismiss();
            resolve();
          }, 500);
          // This method is used to handle trainings completed by user

          this.getEnrolledCourses();
          this.searchContent();
        });
      })
      .catch(error => {
        console.error('Error while Fetching Data', error);
        this.refresh = false;
        loader.dismiss();
      });
  }

  /**
   * To reset Profile Before calling new fresh API for Profile
   */
  resetProfile() {
    this.profile = {};
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
                this.profileService.getCurrentUser().then((resp: any) => {
                  const profile = JSON.parse(resp);
                  that.formAndFrameworkUtilService.updateLoggedInUser(r, profile)
                    .then((value) => {
                      if (!value['status']) {
                        this.app.getRootNav().setRoot(CategoriesEditPage, { showOnlyMandatoryFields: true, profile: value['profile'] });
                      }
                    });
                });
                if (r && r.avatar) {
                  that.imageUri = r.avatar;
                }
                that.formatRoles();
                that.formatOrgDetails();
                that.formatUserLocation();
                that.isCustodianOrgId = (that.profile.rootOrg.rootOrgId === this.custodianOrgId);
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
   * Method to store all roles from different organizations into single array
   */
  formatRoles() {
    this.roles = [];
    if (this.profile && this.profile.roleList) {
      if (this.profile.organisations && this.profile.organisations.length) {
        for (let i = 0, len = this.profile.organisations[0].roles.length; i < len; i++) {
          const roleKey = this.profile.organisations[0].roles[i];
          const val = this.profile.roleList.find(role => role.id === roleKey);
          if (val && val.name.toLowerCase() !== 'public') {
            this.roles.push(val.name);
          }
        }
      }
    }
  }

  formatUserLocation() {
    const len = this.profile.userLocations.length;
    if (len === 2) {
      for (let i = 0; i < len; i++) {
        if (this.profile.userLocations[i].type === 'state') {
          this.userLocation.state = this.profile.userLocations[i];
        } else {
          this.userLocation.district = this.profile.userLocations[i];
        }
      }
    } else if (len === 1) {
      this.userLocation.state = this.profile.userLocations[len - 1];
      this.userLocation.district = [];

    } else if (len === 0) {
      this.userLocation.state = [];
      this.userLocation.district = [];
    }
  }

  /**
   * Method to handle organisation details.
   */
  formatOrgDetails() {
    this.orgDetails = { 'state': '', 'district': '', 'block': '' };
    for (let i = 0, len = this.profile.organisations.length; i < len; i++) {
      if (this.profile.organisations[i].locations) {
        for (let j = 0, l = this.profile.organisations[i].locations.length; j < l; j++) {
          switch (this.profile.organisations[i].locations[j].type) {
            case 'state':
              this.orgDetails.state = this.profile.organisations[i].locations[j];
              break;

            case 'block':
              this.orgDetails.block = this.profile.organisations[i].locations[j];
              break;

            case 'district':
              this.orgDetails.district = this.profile.organisations[i].locations[j];
              break;

            default:
              break;
          }
        }
      }
    }
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

  /**
   * To get enrolled course(s) of logged-in user i.e, trainings in the UI.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses() {
    const option = {
      userId: this.profile.userId,
      refreshEnrolledCourses: false,
      returnRefreshedEnrolledCourses: true
    };
    this.trainingsCompleted = [];
    this.courseService.getEnrolledCourses(option)
      .then((res: any) => {
        res = JSON.parse(res);
        const enrolledCourses = res.result.courses;
        for (let i = 0, len = enrolledCourses.length; i < len; i++) {
          if (enrolledCourses[i].status === 2) {
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
    if (layoutName === ContentCard.LAYOUT_INPROGRESS) {
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

  updateLocalProfile(framework) {
    this.profile.framework = framework;
    this.profileService.getCurrentUser().then((resp: any) => {
      const profile = JSON.parse(resp);
      this.formAndFrameworkUtilService.updateLoggedInUser(this.profile, profile)
        .then((value) => {
        });
    });
  }

  navigateToCategoriesEditPage() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.telemetryService.interact(
        generateInteractTelemetry(InteractType.TOUCH,
          InteractSubtype.EDIT_CLICKED,
          Environment.HOME,
          PageId.PROFILE, null,
          undefined,
          undefined));
      this.navCtrl.push(CategoriesEditPage);
    } else {
      this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
    }
  }

  navigateToEditPersonalDetails() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.telemetryService.interact(
        generateInteractTelemetry(InteractType.TOUCH,
          InteractSubtype.EDIT_CLICKED,
          Environment.HOME,
          PageId.PROFILE, null,
          undefined,
          undefined));
      this.navCtrl.push(PersonalDetailsEditPage, {
        profile: this.profile
      });
    } else {
      this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
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
      limit: 100,
      contentTypes: ContentType.FOR_PROFILE_TAB,
      sortCriteria: [contentSortCriteria]
    };

    this.contentService.searchContent(contentSearchCriteria, false, false, false)
      .then((result: any) => {
        this.contentCreatedByMe = JSON.parse(result).result.contentDataList;
      })
      .catch((error: any) => {
        console.error('Error', error);
      });
  }

  editMobileNumber(event) {
    const newTitle = this.profile.phone ?
                     this.commonUtilService.translateMessage('EDIT_PHONE_POPUP_TITLE') :
                     this.commonUtilService.translateMessage('ENTER_PHONE_POPUP_TITLE');
    const popover = this.popoverCtrl.create(EditContactDetailsPopupComponent, {
      phone: this.profile.phone,
      title: newTitle,
      description: '',
      type: 'phone',
      userId: this.profile.userId
    }, {
        cssClass: 'popover-alert'
      });
    popover.present({
      ev: event
    });
    popover.onDidDismiss((edited: boolean = false, key?: any) => {
      if (edited) {
        this.callOTPPopover(ProfileConstants.CONTACT_TYPE_PHONE, key);
      }
    });
  }

  editEmail(event) {
    const newTitle = this.profile.email ?
                     this.commonUtilService.translateMessage('EDIT_EMAIL_POPUP_TITLE') :
                     this.commonUtilService.translateMessage('EMAIL_PLACEHOLDER');
    const popover = this.popoverCtrl.create(EditContactDetailsPopupComponent, {
      email: this.profile.email,
      title: newTitle,
      description: '',
      type: 'email',
      userId: this.profile.userId
    }, {
        cssClass: 'popover-alert'
      });
    popover.present({
      ev: event
    });
    popover.onDidDismiss((edited: boolean = false, key?: any) => {
      if (edited) {
        this.callOTPPopover(ProfileConstants.CONTACT_TYPE_EMAIL, key);
      }
    });
  }

  callOTPPopover(type: string, key?: any) {
    if (type === ProfileConstants.CONTACT_TYPE_PHONE) {
      const popover = this.popoverCtrl.create(EditContactVerifyPopupComponent, {
        key: key,
        phone: this.profile.phone,
        title: this.commonUtilService.translateMessage('VERIFY_PHONE_OTP_TITLE'),
        description: this.commonUtilService.translateMessage('VERIFY_PHONE_OTP_DESCRIPTION'),
        type: ProfileConstants.CONTACT_TYPE_PHONE
      }, {
          cssClass: 'popover-alert'
        });
      popover.present();
      popover.onDidDismiss((OTPSuccess: boolean = false, phone: any) => {
        if (OTPSuccess) {
          this.viewCtrl.dismiss();
          this.updatePhoneInfo(phone);
        }
      });
    } else {
      const popover = this.popoverCtrl.create(EditContactVerifyPopupComponent, {
        key: key,
        phone: this.profile.email,
        title: this.commonUtilService.translateMessage('VERIFY_EMAIL_OTP_TITLE'),
        description: this.commonUtilService.translateMessage('VERIFY_EMAIL_OTP_DESCRIPTION'),
        type: ProfileConstants.CONTACT_TYPE_EMAIL
      }, {
          cssClass: 'popover-alert'
        });
      popover.present();
      popover.onDidDismiss((OTPSuccess: boolean = false, email: any) => {
        if (OTPSuccess) {
          this.viewCtrl.dismiss();
          this.updateEmailInfo(email);
        }
      });
    }
  }

  updatePhoneInfo(phone) {
    const loader = this.getLoader();
    const req: UpdateUserInfoRequest = {
      userId: this.profile.userId,
      phone: phone,
      phoneVerified: true
    };
    this.userProfileService.updateUserInfo(req, (res) => {
      res = JSON.parse(res);
      loader.dismiss();
      // setTimeout(() => {
      this.doRefresh();
      // }, 1000);
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('PHONE_EDIT_SUCCESS'));
    }, (err) => {
      loader.dismiss();
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
    });
  }

  updateEmailInfo(email) {
    const loader = this.getLoader();
    const req: UpdateUserInfoRequest = {
      userId: this.profile.userId,
      email: email,
      emailVerified: true
    };
    this.userProfileService.updateUserInfo(req, (res) => {
      res = JSON.parse(res);
      loader.dismiss();
      // setTimeout(() => {
      this.doRefresh();
      // }, 1000);
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('EMAIL_EDIT_SUCCESS'));
    }, (err) => {
      loader.dismiss();
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
    });
  }

}
