import { ContentRatingAlertComponent } from './../../component/content-rating-alert/content-rating-alert';
import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  PopoverController,
  LoadingController,
  Platform,
  Navbar
} from 'ionic-angular';
import {
  ContentService,
  FileUtil,
  CourseService,
  ChildContentRequest,
  PageId,
  UserProfileService,
  InteractSubtype,
  Environment,
  Mode,
  InteractType,
  BuildParamService,
  ShareUtil,
  SharedPreferences,
  ProfileType,
  ImpressionType,
  CorrelationData,
  TelemetryObject,
  ErrorCode,
  ErrorType
} from 'sunbird';
import * as _ from 'lodash';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { ContentActionsComponent } from '../../component/content-actions/content-actions';
import {
  ContentType,
  MimeType,
  ProfileConstants,
  EventTopics,
  ShareUrl,
  PreferenceKey
} from '../../app/app.constant';
import { CourseBatchesPage } from '../course-batches/course-batches';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { CourseUtilService } from '../../service/course-util.service';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';

/**
 * Generated class for the EnrolledCourseDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enrolled-course-details',
  templateUrl: 'enrolled-course-details.html',
})
export class EnrolledCourseDetailsPage {

  /**
   * Contains content details
   */
  course: any;

  /**
   * Contains children content data
   */
  childrenData: Array<any> = [];

  startData: any;

  /**
   * Show loader while importing content
   */
  showChildrenLoader: boolean;

  /**
   * Contains identifier(s) of locally not available content(s)
   */
  downloadIdentifiers = [];

  /**
   * Contains total size of locally not available content(s)
   */
  downloadSize = 0;

  /**
   * Flag to show / hide resume button
   */
  showResumeBtn: boolean;

  /**
   * Contains card data of previous state
   */
  courseCardData: any;

  /**
   * To get course structure keys
   */
  objectKeys = Object.keys;

  /**
   * To hold identifier
   */
  identifier: string;

  /**
   * Contains child content import / download progress
   */
  downloadProgress = 0;

  showLoading = false;

  /**
   * To hold network status
   */
  isNetworkAvailable: boolean;

  showDownloadProgress: boolean;
  totalDownload: number;
  currentCount = 0;
  isDownloadComplete = false;
  queuedIdentifiers: Array<string> = [];
  faultyIdentifiers: Array<any> = [];
  isDownloadStarted = false;
  isDownlaodCompleted = false;
  batchDetails: any;
  private corRelationList: Array<CorrelationData>;

  /**
   * To hold logged in user id
   */
  userId = '';

  /**
   * To hold rating data
   */
  userRating = 0;

  /**
   * Rating comment
   */
  ratingComment = '';

  /**
   * To hold batch id
   */
  batchId = '';

  /**
   * To hold base url
   */
  baseUrl = '';

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Contains ref of navigation controller
   */
  public navCtrl: NavController;

  guestUser = false;

  /**
   * This variable tells is the course is already enrolled by user
   */
  isAlreadyEnrolled = false;

  profileType = '';
  objId;
  objType;
  objVer;
  didViewLoad: boolean;
  backButtonFunc = undefined;
  shouldGenerateEndTelemetry = false;
  source = '';

  @ViewChild(Navbar) navBar: Navbar;
  constructor(navCtrl: NavController,
    private navParams: NavParams,
    contentService: ContentService,
    private zone: NgZone,
    private events: Events,
    private fileUtil: FileUtil,
    public popoverCtrl: PopoverController,
    private profileService: UserProfileService,
    private courseService: CourseService,
    private buildParamService: BuildParamService,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private loadingCtrl: LoadingController,
    private preference: SharedPreferences,
    private network: Network,
    private courseUtilService: CourseUtilService,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;

    this.getUserId();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.subscribeGenieEvent();

    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
    }
    this.network.onDisconnect().subscribe(() => {
      this.isNetworkAvailable = false;
    });
    this.network.onConnect().subscribe(() => {
      this.isNetworkAvailable = true;
    });
  }

  subscribeUtilityEvents() {
    this.buildParamService.getBuildConfigParam('BASE_URL')
      .then(response => {
        this.baseUrl = response;
      })
      .catch(() => {
      });

    this.events.subscribe(EventTopics.ENROL_COURSE_SUCCESS, (res) => {
      if (res && res.batchId) {
        this.batchId = res.batchId;
      }
    });

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
        false, this.identifier, this.corRelationList);
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.course.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }, 10);

  }

  /**
   * Get user id
   */
  getUserId() {
    if (this.appGlobalService.getSessionData()) {
      this.userId = this.appGlobalService.getSessionData()[ProfileConstants.USER_TOKEN];
    } else {
      this.userId = '';
    }
  }

  /**
 * Get the session to know if the user is logged-in or guest
 *
 */
  checkLoggedInOrGuestUser() {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
  }

  checkCurrentUserType() {
    this.preference.getString(PreferenceKey.SELECTED_USER_TYPE)
      .then(val => {
        if (val !== '') {
          if (val === ProfileType.TEACHER) {
            this.profileType = ProfileType.TEACHER;
          } else if (val === ProfileType.STUDENT) {
            this.profileType = ProfileType.STUDENT;
          }
        }
      });
  }

  /**
   * Function to rate content
   */
  rateContent() {
    // TODO: check content is played or not
    if (!this.guestUser) {
      if (this.course.isAvailableLocally) {
        const popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
          content: this.course,
          rating: this.userRating,
          comment: this.ratingComment,
          pageId: PageId.COURSE_DETAIL
        }, {
            cssClass: 'content-rating-alert'
          });
        popUp.present({
          ev: event
        });
        popUp.onDidDismiss(data => {
          if (data && data.message === 'rating.success') {
            this.userRating = data.rating;
            this.ratingComment = data.comment;
          }
        });
      } else {
        this.commonUtilService.showToast('TRY_BEFORE_RATING');
      }
    } else {
      if (this.profileType === ProfileType.TEACHER) {
        this.commonUtilService.showToast('SIGNIN_TO_USE_FEATURE');
      }
    }
  }

  showOverflowMenu(event) {
    const contentData = this.course;
    contentData.batchId = this.courseCardData.batchId ? this.courseCardData.batchId : false;
    const popover = this.popoverCtrl.create(ContentActionsComponent, {
      content: contentData,
      pageName: 'course'
    }, {
        cssClass: 'content-action'
      });
    popover.present({
      ev: event
    });

    popover.onDidDismiss(data => {
      if (data === 'delete.success' || data === 'flag.success') {
        this.navCtrl.pop();
      }
    });
  }

  /**
   * Set course details by passing course identifier
   *
   * @param {string} identifier
   */
  setContentDetails(identifier): void {
    const option = {
      contentId: identifier,
      refreshContentDetails: true
    };

    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        if (data && data.result) {
          this.extractApiResponse(data);
        }
      });
    },
      (error: any) => {
        if (JSON.parse(error).error === 'CONNECTION_ERROR') {
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else {
          this.commonUtilService.showToast('ERROR_FETCHING_DATA');
        }
        this.navCtrl.pop();
      });
  }

  /**
   * Function to extract api response. Check content is locally available or not.
   * If locally available then make childContents api call else make import content api call
   *
   * @param data
   */
  extractApiResponse(data): void {
    if (data.result.contentData) {
      this.course = data.result.contentData;
      this.objId = this.course.identifier;
      this.objType = this.course.contentType;
      this.objVer = this.course.pkgVersion;
      if (!this.didViewLoad) {
        this.generateImpressionEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
        this.generateStartEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
      }
      this.didViewLoad = true;

      if (this.course.status !== 'Live') {
        this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        this.navCtrl.pop();
      }
      if (this.course.gradeLevel && this.course.gradeLevel.length) {
        this.course.gradeLevel = this.course.gradeLevel.join(', ');
      }
      if (this.course.attributions && this.course.attributions.length) {
        this.course.attributions = this.course.attributions.join(', ');
      }
      if (this.course.me_totalRatings) {
        const rating = this.course.me_totalRatings.split('.');
        if (rating && rating[0]) {
          this.course.me_totalRatings = rating[0];
        }
      }

      // User Rating
      const contentFeedback: any = data.result.contentFeedback ? data.result.contentFeedback : [];
      if (contentFeedback !== undefined && contentFeedback.length !== 0) {
        this.userRating = contentFeedback[0].rating;
        this.ratingComment = contentFeedback[0].comments;
      }
      this.getCourseProgress();
    } else {
      this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
      this.navCtrl.pop();
    }

    this.course.isAvailableLocally = data.result.isAvailableLocally;
    if (this.courseCardData.batchId) {
      this.getBatchDetails();
    }

    if (Boolean(data.result.isAvailableLocally)) {
      this.setChildContents();
    } else {
      this.showLoading = true;
      this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.course, true);
      this.importContent([this.identifier], false);
    }
    this.setCourseStructure();
  }

  /**
   * Get batch details
   */
  getBatchDetails() {
    this.courseService.getBatchDetails({ batchId: this.courseCardData.batchId }, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        if (data.result) {
          this.batchDetails = data.result;
          this.getBatchCreatorName();
        }
      });
    },
      (error: any) => {
        console.log('error while loading content details', error);
      });
  }

  getBatchCreatorName() {
    const req = {
      userId: this.batchDetails.createdBy,
      requiredFields: []
    };
    this.profileService.getUserProfileDetails(req, (data: any) => {
      data = JSON.parse(data);
      if (data) {
        this.batchDetails.creatorFirstName = data.firstName ? data.firstName : '';
        this.batchDetails.creatorLastName = data.lastName ? data.lastName : '';
      }
    }, () => {
    });
  }

  /**
   * Set course structure
   */
  setCourseStructure(): void {
    if (this.course.contentTypesCount) {
      this.course.contentTypesCount = JSON.parse(this.course.contentTypesCount);
    } else if (this.courseCardData.contentTypesCount && !_.isObject(this.courseCardData.contentTypesCount)) {
      this.course.contentTypesCount = JSON.parse(this.courseCardData.contentTypesCount);
    }
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers, isChild: boolean) {
    const requestParams = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        destinationFolder: this.fileUtil.internalStoragePath(),
        contentId: value,
        correlationData: this.corRelationList !== undefined ? this.corRelationList : []
      });
    });

    return requestParams;
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  importContent(identifiers, isChild: boolean, isDownloadAllClicked?) {
    this.showChildrenLoader = this.downloadIdentifiers.length === 0 ? true : false;
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    };

    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      this.zone.run(() => {
        if (data.result && data.result[0].status === 'NOT_FOUND') {
          this.showLoading = false;
        }

        if (data.result && data.result.length && this.isDownloadStarted) {
          _.forEach(data.result, (value) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            } else if (value.status === 'NOT_FOUND') {
              this.faultyIdentifiers.push(value.identifier);
            }
          });

          if (isDownloadAllClicked) {
            this.telemetryGeneratorService.generateDownloadAllClickTelemetry(
              PageId.COURSE_DETAIL,
              this.course,
              this.queuedIdentifiers,
              identifiers.length
            );
          }

          if (this.queuedIdentifiers.length === 0) {
            this.restoreDownloadState();
          }
          if (this.faultyIdentifiers.length > 0) {
            const stackTrace: any = {};
            stackTrace.parentIdentifier = this.course.identifier;
            stackTrace.faultyIdentifiers = this.faultyIdentifiers;
            this.telemetryGeneratorService.generateErrorTelemetry(Environment.HOME,
              ErrorCode.ERR_DOWNLOAD_FAILED,
              ErrorType.SYSTEM,
              PageId.COURSE_DETAIL,
              JSON.stringify(stackTrace),
            );
            this.commonUtilService.showToast('UNABLE_TO_FETCH_RETIRED_CONTENT');
          }
        }
      });
    },
      (error) => {
        this.zone.run(() => {
          if (this.isDownloadStarted) {
            this.restoreDownloadState();
          } else {
            this.showChildrenLoader = false;
          }
          const errorRes = JSON.parse(error);
          if (errorRes && errorRes.error === 'NETWORK_ERROR') {
            this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
          } else {
            this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
          }
        });
      });
  }

  restoreDownloadState() {
    this.isDownloadStarted = false;
  }

  downloadAllContent() {
    if (this.isNetworkAvailable) {
      this.isDownloadStarted = true;
      this.downloadProgress = 0;
      this.importContent(this.downloadIdentifiers, true, true);
    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }

  /**
   * Function to set child contents
   */
  setChildContents(): void {
    this.showChildrenLoader = true;
    const option = new ChildContentRequest();
    option.contentId = this.identifier;
    option.hierarchyInfo = null;

    if (!this.courseCardData.batchId) {
      option.level = 1;
    }

    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
          this.startData = data.result.children;
        }
        if (this.courseCardData.batchId) {
          this.downloadSize = 0;
          this.getContentsSize(this.childrenData);
        }
        this.showChildrenLoader = false;
      });
    },
      (error: string) => {
        console.log('Error: while fetching child contents ===>>>', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      });
  }

  /**
   * Redirect to child content details page
   * @param content
   * @param depth
   */
  navigateToChildrenDetailsPage(content, depth): void {
    const contentState = {
      batchId: this.courseCardData.batchId ? this.courseCardData.batchId : '',
      courseId: this.identifier
    };
    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState
        });
      } else if (content.mimeType === MimeType.COLLECTION) {
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState
        });
      } else {
        this.navCtrl.push(ContentDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState,
          isChildContent: true
        });
      }
    });
  }

  cancelDownload() {
    this.telemetryGeneratorService.generateCancelDownloadTelemetry(this.course);
    this.contentService.cancelDownload(this.identifier, () => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    }, () => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    });
  }

  getContentsSize(data) {
    _.forEach(data, (value) => {
      if (value.contentData.size) {
        this.downloadSize += Number(value.contentData.size);
      }
      this.getContentsSize(value.children);
      if (value.isAvailableLocally === false) {
        this.downloadIdentifiers.push(value.contentData.identifier);
      }
    });
  }

  /**
   * Function gets executed when user click on resume course button.
   *
   * @param {string} identifier
   */
  resumeContent(identifier): void {
    this.showResumeBtn = false;
    this.navCtrl.push(ContentDetailsPage, {
      content: { identifier: identifier },
      depth: '1', // Needed to handle some UI elements.
      contentState: {
        batchId: this.courseCardData.batchId ? this.courseCardData.batchId : '',
        courseId: this.identifier
      },
      isResumedCourse: true,
      isChildContent: true
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.downloadSize = 0;
    this.courseCardData = this.navParams.get('content');
    this.corRelationList = this.navParams.get('corRelation');
    this.source = this.navParams.get('source');
    this.identifier = this.courseCardData.contentId || this.courseCardData.identifier;
    // check if the course is already enrolled
    this.isCourseEnrolled(this.identifier);
    if (this.batchId) {
      this.courseCardData.batchId = this.batchId;
    }
    this.showResumeBtn = this.courseCardData.lastReadContentId ? true : false;
    this.setContentDetails(this.identifier);
    // If courseCardData does not have a batch id then it is not a enrolled course
    this.subscribeGenieEvent();
  }


  isCourseEnrolled(identifier: string) {
    // get all the enrolled courses
    const enrolledCourses = this.appGlobalService.getEnrolledCourseList();
    if (enrolledCourses.length > 0) {
      for (const course of enrolledCourses) {
        if (course.courseId === identifier) {
          this.isAlreadyEnrolled = true;
          this.courseCardData = course;
        }
      }
    }
  }

  getCourseProgress() {
    if (this.courseCardData.batchId) {
      this.course.progress = this.courseUtilService.getCourseProgress(this.courseCardData.leafNodesCount, this.courseCardData.progress);
    }
  }

  /**
   * Subscribe genie event to get content download progress
   */
  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        const res = data;
        // Show download percentage
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          if (res.data.downloadProgress === -1 || res.data.downloadProgress === '-1') {
            this.downloadProgress = 0;
          } else {
            this.downloadProgress = res.data.downloadProgress;
          }

          if (this.downloadProgress === 100) {
            this.showLoading = false;
          }
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          this.showLoading = false;
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
              this.currentCount++;
            }

            if (this.queuedIdentifiers.length === this.currentCount) {
              this.isDownloadStarted = false;
              this.currentCount = 0;
              this.isDownlaodCompleted = true;
              this.downloadIdentifiers.length = 0;
              this.queuedIdentifiers.length = 0;
            }
          } else {
            this.course.isAvailableLocally = true;
            this.setChildContents();
          }
        }

        // For content update available
        const hierarchyInfo = this.courseCardData.hierarchyInfo ? this.courseCardData.hierarchyInfo : null;

        if (res.data && res.type === 'contentUpdateAvailable' && hierarchyInfo === null) {
          this.zone.run(() => {
            this.showLoading = true;
            this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.course, false);
            this.importContent([this.identifier], false);
          });
        }

      });
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.events.unsubscribe('genie.event');
  }

  /**
   * Navigate user to batch list page
   *
   * @param {string} id
   */
  navigateToBatchListPage(): void {
    if (this.isNetworkAvailable) {
      this.navCtrl.push(CourseBatchesPage, { identifier: this.identifier });
    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }

  /**
   * Get executed when user click on start button
   */
  startContent() {
    if (this.startData && this.startData.length) {
      const firstChild = _.first(_.values(this.startData), 1);
      this.navigateToChildrenDetailsPage(firstChild, 1);
    }
  }

  /**
   * Function to get loader instance
   */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: 'crescent'
    });
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_COURSE_INITIATED, this.course.contentType);
    const loader = this.getLoader();
    loader.present();
    const url = this.baseUrl + ShareUrl.COLLECTION + this.course.identifier;
    if (this.course.isAvailableLocally) {
      this.shareUtil.exportEcar(this.course.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_COURSE_SUCCESS, this.course.contentType);
        this.social.share('', '', 'file://' + path, url);
      }, () => {
        loader.dismiss();
        this.commonUtilService.showToast('SHARE_CONTENT_FAILED');
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_COURSE_SUCCESS, this.course.contentType);
      this.social.share('', '', '', url);
    }
  }

  generateShareInteractEvents(interactType, subType, contentType) {
    const values = new Map();
    values['ContentType'] = contentType;
    this.telemetryGeneratorService.generateInteractTelemetry(interactType,
      subType,
      Environment.HOME,
      PageId.CONTENT_DETAIL, undefined,
      values,
      undefined,
      this.corRelationList
    );
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
        true, this.identifier, this.corRelationList);
      this.handleNavBackButton();
    };

    this.subscribeUtilityEvents();
  }

  handleNavBackButton() {
    this.didViewLoad = false;
    this.generateEndEvent(this.objId, this.objType, this.objVer);
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.course.identifier);
    }
    this.navCtrl.pop();
    this.backButtonFunc();
  }

  generateQRSessionEndEvent(pageId: string, qrData: string) {
    if (pageId !== undefined) {
      const telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      this.telemetryGeneratorService.generateEndTelemetry(
        'qr',
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject,
        undefined,
        this.corRelationList);
    }
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.DETAIL,
      '', PageId.COURSE_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      undefined,
      this.corRelationList);
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = objectId;
    telemetryObject.type = objectType;
    telemetryObject.version = objectVersion;
    this.telemetryGeneratorService.generateStartTelemetry(PageId.COURSE_DETAIL,
      telemetryObject,
      undefined,
      this.corRelationList
    );
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = objectId;
    telemetryObject.type = objectType;
    telemetryObject.version = objectVersion;
    this.telemetryGeneratorService.generateEndTelemetry(objectType,
      Mode.PLAY,
      PageId.COURSE_DETAIL,
      Environment.HOME,
      telemetryObject,
      undefined,
      this.corRelationList);
  }
}
