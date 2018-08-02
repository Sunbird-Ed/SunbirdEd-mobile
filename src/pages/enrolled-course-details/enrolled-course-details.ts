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
  ToastController,
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
  TelemetryService,
  Environment,
  Mode,
  InteractType,
  BuildParamService,
  ShareUtil,
  SharedPreferences,
  ProfileType,
  ImpressionType,
  CorrelationData
} from 'sunbird';
import * as _ from 'lodash';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { ContentActionsComponent } from '../../component/content-actions/content-actions';
import { TranslateService } from '@ngx-translate/core';
import {
  ContentType,
  MimeType,
  ProfileConstants,
  EventTopics,
  ShareUrl
} from '../../app/app.constant';
import { CourseBatchesPage } from '../course-batches/course-batches';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import {
  generateInteractTelemetry,
  generateEndTelemetry,
  generateStartTelemetry,
  generateImpressionTelemetry
} from '../../app/telemetryutil';
import { CourseUtilService } from '../../service/course-util.service';
import { AppGlobalService } from '../../service/app-global.service';

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
  downloadSize: number = 0;

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
  downloadProgress: any;

  /**
   * To hold network status
   */
  isNetworkAvailable: boolean;

  showDownloadProgress: boolean;
  totalDownload: number;
  currentCount: number = 0;
  isDownloadComplete = false;
  queuedIdentifiers: Array<string> = [];
  isDownloadStarted: boolean = false;
  isDownlaodCompleted: boolean = false;
  batchDetails: any;
  private corRelationList: Array<CorrelationData>;

  /**
   * To hold logged in user id
   */
  userId: string = '';

  /**
   * To hold rating data
   */
  userRating: number = 0;

  /**
   * Rating comment
   */
  ratingComment: string = '';

  /**
   * To hold batch id
   */
  batchId: string = '';

  /**
   * To hold base url
   */
  private baseUrl = "";

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Contains ref of navigation controller
   */
  public navCtrl: NavController;

  /**
   * Contains reference of ionic toast controller
   */
  public toastCtrl: ToastController;

  guestUser: boolean = false;

  profileType: string = '';
  private objId;
  private objType;
  private objVer;
  private didViewLoad: boolean;
  private backButtonFunc = undefined;
  private shouldGenerateEndTelemetry: boolean = false;
  private source: string = "";

  @ViewChild(Navbar) navBar: Navbar;
  constructor(navCtrl: NavController,
    private navParams: NavParams, // Contains ref of navigation params
    contentService: ContentService,
    private zone: NgZone, // Contains reference of zone service
    private events: Events,
    toastCtrl: ToastController,
    private fileUtil: FileUtil,
    public popoverCtrl: PopoverController,
    private translate: TranslateService,
    private profileService: UserProfileService,
    private courseService: CourseService,
    private buildParamService: BuildParamService,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private telemetryService: TelemetryService, private loadingCtrl: LoadingController,
    private preference: SharedPreferences,
    private network: Network,
    private courseUtilService: CourseUtilService,
    private platform: Platform,
    private appGlobalService: AppGlobalService) {
    this.getUserId();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();

    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;

    this.buildParamService.getBuildConfigParam("BASE_URL", (response: any) => {
      this.baseUrl = response
    }, (error) => {
    });

    this.events.subscribe(EventTopics.ENROL_COURSE_SUCCESS, (res) => {
      if (res && res.batchId) {
        this.batchId = res.batchId;
      }
    });

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.course.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }, 10);

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
    this.preference.getString('selected_user_type', (val) => {
      if (val != "") {
        if (val == ProfileType.TEACHER) {
          this.profileType = ProfileType.TEACHER;
        } else if (val == ProfileType.STUDENT) {
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
        let popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
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
        this.showMessage(this.translateLanguageConstant('TRY_BEFORE_RATING'));
      }
    } else {
      if (this.profileType == ProfileType.TEACHER) {
        this.showMessage(this.translateLanguageConstant('SIGNIN_TO_USE_FEATURE'));
      }
    }
  }

  showOverflowMenu(event) {
    let contentData = this.course;
    contentData.batchId = this.courseCardData.batchId ? this.courseCardData.batchId : false;
    let popover = this.popoverCtrl.create(ContentActionsComponent, {
      content: contentData,
      pageName: 'course'
    }, {
        cssClass: 'content-action'
      });
    popover.present({
      ev: event
    });

    popover.onDidDismiss(data => {
      if (data === 'delete.success') {
        this.navCtrl.pop();
      } else if (data === 'flag.success') {
        this.navCtrl.pop();
      }
    });
  }

  translateLanguageConstant(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
  }

  /**
   * Set course details by passing course identifier
   *
   * @param {string} identifier
   */
  setContentDetails(identifier): void {
    this.contentService.getContentDetail({ contentId: identifier }, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('enrolled course details: ', data);
        if (data && data.result) {
          this.extractApiResponse(data);
        }
      });
    },
      (error: any) => {
        console.log('error while loading content details', error);
        if (JSON.parse(error).error === 'CONNECTION_ERROR') {
          this.showMessage(this.translateLanguageConstant('ERROR_NO_INTERNET_MESSAGE'));
        } else {
          this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
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
        this.generateStartEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
        this.generateImpressionEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
      }
      this.didViewLoad = true;

      if (this.course.status !== 'Live') {
        this.showMessage(this.translateLanguageConstant('ERROR_CONTENT_NOT_AVAILABLE'));
        this.navCtrl.pop();
      }
      if (this.course.gradeLevel && this.course.gradeLevel.length) {
        this.course.gradeLevel = this.course.gradeLevel.join(", ");
      }
      if (this.course.attributions && this.course.attributions.length) {
        this.course.attributions = this.course.attributions.join(", ");
      }
      if (this.course.me_totalRatings) {
        let rating = this.course.me_totalRatings.split(".");
        if (rating && rating[0]) {
          this.course.me_totalRatings = rating[0];
        }
      }

      //User Rating
      let contentFeedback: any = data.result.contentFeedback ? data.result.contentFeedback : [];
      if (contentFeedback !== undefined && contentFeedback.length !== 0) {
        this.userRating = contentFeedback[0].rating;
        this.ratingComment = contentFeedback[0].comments;
        console.log("User Rating  - " + this.userRating);
      }
      this.getCourseProgress();
    } else {
      this.showMessage(this.translateLanguageConstant('ERROR_CONTENT_NOT_AVAILABLE'));
      this.navCtrl.pop();
    }

    this.course.isAvailableLocally = data.result.isAvailableLocally;
    if (this.courseCardData.batchId) {
      this.getBatchDetails();
    }

    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Content locally available. Geting child content... @@@");
        this.setChildContents();
        break;
      }
      case false: {
        console.log("Content locally not available. Import started... @@@");
        this.importContent([this.identifier], false);
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
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
        console.log('batch details: ', data);
        if (data.result) {
          this.batchDetails = data.result;
          this.getBatchCreatorName()
        }
      });
    },
      (error: any) => {
        console.log('error while loading content details', error);
      });
  }

  getBatchCreatorName() {
    let req = {
      userId: this.batchDetails.createdBy,
      requiredFields: []
    }
    this.profileService.getUserProfileDetails(req, (data: any) => {
      data = JSON.parse(data);
      if (data) {
        this.batchDetails.creatorFirstName = data.firstName ? data.firstName : '';
        this.batchDetails.creatorLastName = data.lastName ? data.lastName : '';
      }
    }, (error: any) => {

    })
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
   * Log telemetry
   */
  logTelemetry(): void {

  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers, isChild: boolean) {
    let requestParams = [];
    _.forEach(identifiers, (value, key) => {
      requestParams.push({
        isChildContent: isChild,
        destinationFolder: this.fileUtil.internalStoragePath(),
        contentId: value,
        correlationData: this.corRelationList !== undefined ? this.corRelationList : []
      })
    });

    return requestParams;
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  importContent(identifiers, isChild: boolean) {
    this.showChildrenLoader = this.downloadIdentifiers.length === 0 ? true : false;
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    }
    // Call content service
    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: Import content =>', data);
      this.zone.run(() => {
        if (data.result && data.result[0].status === 'NOT_FOUND') {
          // this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
          // this.showChildrenLoader = false;
        }

        if (data.result && data.result.length && this.isDownloadStarted) {
          _.forEach(data.result, (value, key) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
            this.restoreDownloadState();
          }
        }
      });
    },
      (error: any) => {
        this.zone.run(() => {
          if (this.isDownloadStarted) {
            this.restoreDownloadState();
          } else {
            this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
            this.showChildrenLoader = false;
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
      this.importContent(this.downloadIdentifiers, true);
    } else {
      this.showMessage(this.translateLanguageConstant('ERROR_NO_INTERNET_MESSAGE'));
    }
  }

  /**
   * Function to set child contents
   */
  setChildContents(): void {
    this.showChildrenLoader = true;
    let option = new ChildContentRequest();
    option.contentId = this.identifier;
    option.hierarchyInfo = null;

    if (!this.courseCardData.batchId) {
      option.level = 1
    }

    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents ===>>>', data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
          this.startData = data.result.children;
        }
        if (this.courseCardData.batchId) {
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
    }
    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        console.warn('Inside CourseDetailPage >>>');
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState
        })
      } else if (content.mimeType === MimeType.COLLECTION) {
        console.warn('Inside CollectionDetailsPage >>>');
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState
        })
      } else {
        console.warn('Inside ContentDetailsPage >>>');
        this.navCtrl.push(ContentDetailsPage, {
          content: content,
          depth: depth,
          contentState: contentState,
          isChildContent: true
        })
      }
    })
  }

  showMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getContentsSize(data) {
    console.log('downloadSize ==>>>', this.downloadSize);
    this.downloadSize = this.downloadSize;
    _.forEach(data, (value, key) => {
      if (value.children && value.children.length) {
        this.getContentsSize(value.children);
      }

      if (value.isAvailableLocally === false) {
        this.downloadIdentifiers.push(value.contentData.identifier);
        this.downloadSize += +value.contentData.size;
      }
    });
    console.log('downloadIdentifiers =====>>>>>>>>>', this.downloadIdentifiers);
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
    if (this.batchId) {
      this.courseCardData.batchId = this.batchId;
    }
    this.identifier = this.courseCardData.contentId || this.courseCardData.identifier;
    this.showResumeBtn = this.courseCardData.lastReadContentId ? true : false;
    this.setContentDetails(this.identifier);
    // If courseCardData does not have a batch id then it is not a enrolled course
    this.subscribeGenieEvent();
  }

  getCourseProgress() {
    if (this.courseCardData.batchId) {
      this.course.progress = this.courseUtilService.getCourseProgress(this.courseCardData.leafNodesCount, this.courseCardData.progress)
      console.log('course progress', this.course.progress);
    }
  }

  /**
   * Subscribe genie event to get content download progress
   */
  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        let res = data;
        console.log('event bus........', res);
        // Show download percentage
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
              this.currentCount++;
              console.log('current download count:', this.currentCount);
              console.log('queuedIdentifiers count:', this.queuedIdentifiers.length);
            }

            if (this.queuedIdentifiers.length === this.currentCount) {
              this.isDownloadStarted = false;
              this.currentCount = 0;
              this.isDownlaodCompleted = true;
              this.isDownloadStarted = false;
              this.downloadIdentifiers.length = 0;
              this.queuedIdentifiers.length = 0;
            }
          } else {
            this.course.isAvailableLocally = true;
            this.setChildContents();
            // this.events.publish('savedResources:update', {
            //   update: true
            // });
          }
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
      this.showMessage(this.translateLanguageConstant('ERROR_NO_INTERNET_MESSAGE'));
    }
  }

  /**
   * Get executed when user click on start button
   */
  startContent() {
    if (this.startData && this.startData.length) {
      let firstChild = _.first(_.values(this.startData), 1);
      this.navigateToChildrenDetailsPage(firstChild, 1);
    }
  }

  /**
   * Function to get loader instance
   */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_COURSE_INITIATED, this.course.contentType);
    let loader = this.getLoader();
    loader.present();
    let url = this.baseUrl + ShareUrl.COLLECTION + this.course.identifier;
    if (this.course.isAvailableLocally) {
      this.shareUtil.exportEcar(this.course.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_COURSE_SUCCESS, this.course.contentType);
        this.social.share("", "", "file://" + path, url);
      }, error => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: this.translateLanguageConstant('SHARE_CONTENT_FAILED'),
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_COURSE_SUCCESS, this.course.contentType);
      this.social.share("", "", "", url);
    }
  }

  generateShareInteractEvents(interactType, subType, contentType) {
    let values = new Map();
    values["ContentType"] = contentType;
    this.telemetryService.interact(
      generateInteractTelemetry(interactType,
        subType,
        Environment.HOME,
        PageId.CONTENT_DETAIL, values,
        undefined,
        this.corRelationList)
    );
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.course.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }
  }

  generateQRSessionEndEvent(pageId: string, qrData: string) {
    if (pageId !== undefined) {
      this.telemetryService.end(generateEndTelemetry(
        "qr",
        Mode.PLAY,
        pageId,
        qrData,
        "qr",
        "",
        undefined,
        this.corRelationList
      ));
    }
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryService.impression(generateImpressionTelemetry(ImpressionType.DETAIL,
      PageId.COURSE_DETAIL, "",
      Environment.HOME,
      objectId,
      objectType,
      objectVersion, undefined, this.corRelationList));
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    this.telemetryService.start(generateStartTelemetry(PageId.COURSE_DETAIL,
      objectId,
      objectType,
      objectVersion,
      undefined,
      this.corRelationList
    ));
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    this.telemetryService.end(generateEndTelemetry(objectType,
      Mode.PLAY,
      PageId.COURSE_DETAIL,
      objectId,
      objectType,
      objectVersion,
      undefined,
      this.corRelationList
    ));
  }

}