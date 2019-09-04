import { ActiveDownloadsPage } from './../active-downloads/active-downloads';
import { Component, NgZone, OnInit, AfterViewInit, Inject } from '@angular/core';
import {
  App, Events, LoadingController, NavController, NavParams, PopoverController, ViewController
} from 'ionic-angular';
import { OverflowMenuComponent } from '@app/pages/profile';
import { generateInteractTelemetry } from '@app/app/telemetryutil';
import { ContentCard, ContentType, MenuOverflow, MimeType, ProfileConstants, ContentFilterConfig } from '@app/app/app.constant';
import { CategoriesEditPage } from '@app/pages/categories-edit/categories-edit';
import { PersonalDetailsEditPage } from '@app/pages/profile/personal-details-edit.profile/personal-details-edit.profile';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details/enrolled-course-details';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { AppGlobalService, CommonUtilService, TelemetryGeneratorService, AppHeaderService } from '@app/service';
import { FormAndFrameworkUtilService } from './formandframeworkutil.service';
import { EditContactDetailsPopupComponent } from '@app/component/edit-contact-details-popup/edit-contact-details-popup';
import { EditContactVerifyPopupComponent } from '@app/component';
import {
  AuthService,
  ContentSearchCriteria,
  ContentSearchResult,
  ContentService,
  ContentSortCriteria,
  Course,
  CourseService,
  OAuthSession,
  ProfileService,
  SearchType,
  ServerProfileDetailsRequest,
  SortOrder,
  TelemetryObject,
  UpdateServerProfileInfoRequest,
  CachedItemRequestSourceFrom,
  CourseCertificate
} from 'sunbird-sdk';
import { Environment, InteractSubtype, InteractType, PageId } from '@app/service/telemetry-constants';
import {SocialSharing} from '@ionic-native/social-sharing';

/**
 * The Profile page
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit, AfterViewInit {
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
  informationProfileName = false;
  informationOrgName = false;
  checked = false;
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
  organisationDetails = '';
  contentCreatedByMe: any = [];
  orgDetails: {
    'state': '',
    'district': '',
    'block': ''
  };

  layoutPopular = ContentCard.LAYOUT_POPULAR;
  headerObservable: any;
  timer: any;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    @Inject('COURSE_SERVICE') private courseService: CourseService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private zone: NgZone,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private commonUtilService: CommonUtilService,
    private app: App,
    public viewCtrl: ViewController,
    private headerServie: AppHeaderService,
    private socialShare: SocialSharing,
  ) {
    this.userId = this.navParams.get('userId') || '';
    this.isRefreshProfile = this.navParams.get('returnRefreshedUserProfileDetails');
    this.isLoggedInUser = !this.userId;

    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', async (upgrade) => {
      if (upgrade) {
        await this.appGlobalService.openPopover(upgrade);
      }
    });

    this.events.subscribe('loggedInProfile:update', (framework) => {
      this.updateLocalProfile(framework);
      this.refreshProfileData();
    });

    this.formAndFrameworkUtilService.getCustodianOrgId().then((orgId: string) => {
      this.custodianOrgId = orgId;
    }, () => {
    });
  }

  /**
	 * Angular life cycle hooks
	 */
  ngOnInit() {

  }

  ionViewWillEnter() {
    this.events.subscribe('update_header', (data) => {
      this.headerServie.showHeaderWithHomeButton();
    });
    this.headerObservable = this.headerServie.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this.headerServie.showHeaderWithHomeButton();
  }

  ngAfterViewInit() {

  }

  ionViewDidLoad() {
    this.doRefresh();
    this.events.subscribe('profilePicture:update', (res) => {
      if (res.isUploading && res.url !== '') {
        this.imageUri = res.url;
      }
    });
  }

  ionViewWillLeave(): void {
    this.headerObservable.unsubscribe();
    this.events.unsubscribe('update_header');
  }

  public doRefresh(refresher?) {
    const loader = this.getLoader();
    this.isRefreshProfile = true;
    if (!refresher) {
      loader.present();
    } else {
      this.telemetryGeneratorService.generatePullToRefreshTelemetry(PageId.PROFILE, Environment.HOME);
      refresher.complete();
      this.refresh = true;
    }
    return this.refreshProfileData(refresher)
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
  refreshProfileData(refresher?) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.authService.getSession().toPromise().then((session: OAuthSession) => {
        if (session === null || session === undefined) {
          reject('session is null');
        } else {
          that.loggedInUserId = session.userToken;
          if (that.userId && session.userToken === that.userId) {
            that.isLoggedInUser = true;
          }
          const serverProfileDetailsRequest: ServerProfileDetailsRequest = {
            userId: that.userId && that.userId !== session.userToken ? that.userId : session.userToken,
            requiredFields: ProfileConstants.REQUIRED_FIELDS,
            from: CachedItemRequestSourceFrom.SERVER,
          };

          if (that.isLoggedInUser) {
            that.isRefreshProfile = !that.isRefreshProfile;
          }
          that.profileService.getServerProfilesDetails(serverProfileDetailsRequest).toPromise()
            .then((profileData) => {
              that.zone.run(() => {
                that.resetProfile();
                that.profile = profileData;
                that.profileService.getActiveSessionProfile({ requiredFields: ProfileConstants.REQUIRED_FIELDS }).toPromise()
                  .then((activeProfile) => {
                    that.formAndFrameworkUtilService.updateLoggedInUser(profileData, activeProfile)
                      .then((frameWorkData) => {
                        if (!frameWorkData['status']) {
                          that.app.getRootNav().setRoot(CategoriesEditPage, {
                            showOnlyMandatoryFields: true,
                            profile: frameWorkData['activeProfileData']
                          });
                        }
                      });
                    if (profileData && profileData.avatar) {
                      that.imageUri = profileData.avatar;
                    }
                    that.formatRoles();
                    that.formatOrgDetails();
                    that.getOrgDetails();
                    that.formatUserLocation();
                    that.isCustodianOrgId = (that.profile.rootOrg.rootOrgId === this.custodianOrgId);
                    resolve();
                  });
              });
            }).catch(err => {
              if (refresher) {
                refresher.complete();
              }
              reject();
            });
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

  /**
   *
   */
  formatUserLocation() {
    if (this.profile && this.profile.userLocations && this.profile.userLocations.length) {
      for (let i = 0, len = this.profile.userLocations.length; i < len; i++) {
        if (this.profile.userLocations[i].type === 'state') {
          this.userLocation.state = this.profile.userLocations[i];
        } else {
          this.userLocation.district = this.profile.userLocations[i];
        }
      }
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
    this.courseService.getEnrolledCourses(option).toPromise()
      .then((res: Course[]) => {
        this.trainingsCompleted = res.filter((course) => course.status === 2);
      })
      .catch((error: any) => {
        console.error('error while loading enrolled courses', error);
      });
  }

  mapTrainingsToCertificates(trainings: Course[]): CourseCertificate[] {
    return trainings.reduce((accumulator, course) => {
      if (!course.certificates) {
        return accumulator;
      }

      accumulator = accumulator.concat(course.certificates);
      return accumulator;
    }, []);
  }

  getCertificateCourse(certificate: CourseCertificate): Course {
    return this.trainingsCompleted.find((course: Course) => {
      return course.certificates ? course.certificates.indexOf(certificate) > -1 : undefined;
    });
  }

  downloadTrainingCertificate(course: Course, certificate: CourseCertificate) {
    this.courseService.downloadCurrentProfileCourseCertificate({
      courseId: course.courseId,
      certificateToken: certificate.token
    })
    .subscribe();
  }

  shareTrainingCertificate(course: Course, certificate: CourseCertificate) {
    this.courseService.downloadCurrentProfileCourseCertificate({
      courseId: course.courseId,
      certificateToken: certificate.token
    })
    .subscribe((res) => {
      this.socialShare.share('', '', res.path, '');
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
    let telemetryObject: TelemetryObject;
    if (layoutName === ContentCard.LAYOUT_INPROGRESS) {
      telemetryObject = new TelemetryObject(identifier, ContentType.COURSE, undefined);
    } else {
      const telemetryObjectType = this.isResource(content.contentType) ? ContentType.RESOURCE : content.contentType;
      telemetryObject = new TelemetryObject(identifier, telemetryObjectType, undefined);

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
      // this.navCtrl.push(CollectionDetailsPage, {
      this.navCtrl.push(CollectionDetailsEtbPage, {
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
    this.profileService.getActiveSessionProfile({ requiredFields: ProfileConstants.REQUIRED_FIELDS })
      .toPromise()
      .then((resp: any) => {
        this.formAndFrameworkUtilService.updateLoggedInUser(this.profile, resp)
          .then((success) => {
            console.log('updateLocalProfile-- ', success);
          });
      });
  }

  navigateToCategoriesEditPage() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.EDIT_CLICKED,
        Environment.HOME,
        PageId.PROFILE, null,
        undefined,
        undefined);
      this.navCtrl.push(CategoriesEditPage);
    } else {
      this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
    }
  }

  navigateToEditPersonalDetails() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.EDIT_CLICKED,
        Environment.HOME,
        PageId.PROFILE, null,
        undefined,
        undefined);
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
  async searchContent() {
    const contentSortCriteria: ContentSortCriteria = {
      sortAttribute: 'lastUpdatedOn',
      sortOrder: SortOrder.DESC
    };

    const contentTypes = await this.formAndFrameworkUtilService.getSupportedContentFilterConfig(
      ContentFilterConfig.NAME_DOWNLOADS);
    const contentSearchCriteria: ContentSearchCriteria = {
      createdBy: [this.userId || this.loggedInUserId],
      limit: 100,
      contentTypes: contentTypes,
      sortCriteria: [contentSortCriteria],
      searchType: SearchType.SEARCH
    };

    this.contentService.searchContent(contentSearchCriteria).toPromise()
      .then((result: ContentSearchResult) => {
        this.contentCreatedByMe = result.contentDataList || [];
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
      popover.present({
        ev: event
      });
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
      popover.present({
        ev: event
      });
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
    const req: UpdateServerProfileInfoRequest = {
      userId: this.profile.userId,
      phone: phone,
      phoneVerified: true
    };
    this.profileService.updateServerProfile(req).toPromise()
      .then(() => {
        loader.dismiss();
        this.doRefresh();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('PHONE_UPDATE_SUCCESS'));
      }).catch((e) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
      });
  }

  updateEmailInfo(email) {
    const loader = this.getLoader();
    const req: UpdateServerProfileInfoRequest = {
      userId: this.profile.userId,
      email: email,
      emailVerified: true
    };
    this.profileService.updateServerProfile(req).toPromise()
      .then(() => {
        loader.dismiss();
        this.doRefresh();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('EMAIL_UPDATE_SUCCESS'));
      }).catch((e) => {
        loader.dismiss();
        this.commonUtilService.showToast(this.commonUtilService.translateMessage('SOMETHING_WENT_WRONG'));
      });
  }

  handleHeaderEvents($event) {
    switch ($event.name) {
      case 'download':
        this.redirectToActivedownloads();
        break;
    }
  }

  private redirectToActivedownloads() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.ACTIVE_DOWNLOADS_CLICKED,
      Environment.HOME,
      PageId.PROFILE);
    this.navCtrl.push(ActiveDownloadsPage);
  }

  toggleTooltips(event, field) {
    clearTimeout(this.timer);
    if (field === 'name') {
      this.informationProfileName = this.informationProfileName ? false : true;
      this.informationOrgName = false;
      if (this.informationProfileName) {
        this.dismissMessage();
      }
    } else if (field === 'org') {
      this.informationOrgName = this.informationOrgName ? false : true;
      this.informationProfileName = false;
      if (this.informationOrgName) {
        this.dismissMessage();
      }
    } else {
      this.informationProfileName = false;
      this.informationOrgName = false;
    }
    event.stopPropagation();
  }
  dismissMessage() {
    this.timer = setTimeout(() => {
      this.informationProfileName = false;
      this.informationOrgName = false;
    }, 3000);
  }

  getOrgDetails() {
    let orgList = [];
    let orgItemList;
    orgItemList = this.profile.organisations;
    if (orgItemList.length > 1) {
      orgItemList.map((org) => {
        if (this.profile.rootOrgId !== org.organisationId) {
          orgList.push(org);
        }
      });
      orgList = orgList.sort((orgDate1, orgdate2) => orgDate1.orgjoindate > orgdate2.organisation ? 1 : -1);
      this.organisationDetails = orgList[0].orgName;
    } else {
      this.organisationDetails = orgItemList[0].orgName;
    }
  }
}

