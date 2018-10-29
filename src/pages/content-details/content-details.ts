import { ContentRatingAlertComponent } from './../../component/content-rating-alert/content-rating-alert';
import { ContentActionsComponent } from './../../component/content-actions/content-actions';
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
  LoadingController,
  PopoverController,
  Navbar,
  Platform,
  IonicApp
} from 'ionic-angular';
import {
  ContentService,
  CourseService,
  FileUtil,
  ImpressionType,
  PageId,
  Environment,
  Mode,
  ShareUtil,
  InteractType,
  InteractSubtype,
  Rollup,
  BuildParamService,
  SharedPreferences,
  ProfileType,
  CorrelationData,
  ProfileService,
  ProfileRequest,
  TelemetryObject
} from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import * as _ from 'lodash';
import {
  Map
} from '../../app/telemetryutil';
import {
  EventTopics,
  ProfileConstants,
  PreferenceKey
} from '../../app/app.constant';
import { ShareUrl } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { AlertController } from 'ionic-angular';
import { UserAndGroupsPage } from '../user-and-groups/user-and-groups';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';
import { ViewCreditsComponent } from '../../component/view-credits/view-credits';

@IonicPage()
@Component({
  selector: 'page-content-details',
  templateUrl: 'content-details.html',
})
export class ContentDetailsPage {

  /**
   * To hold Content details
   */
  content: any;

  /**
   * is child content
   */
  isChildContent = false;

  /**
   * Contains content details
   */
  contentDetails: any;

  /**
   * Contains content identifier
   */
  identifier: string;

  /**
   * To hold previous state data
   */
  cardData: any;

  /**
   * Content depth
   */
  depth: string;

  /**
   * Download started flag
   */
  isDownloadStarted = false;

  /**
   * Contains download progress
   */
  downloadProgress: string;

  /**
   *
   */
  cancelDownloading = false;

  /**
   * Contains loader instance
   */
  loader: any;

  /**
   * To hold user id
   */
  userId = '';

  /**
   * To hold network status
   */
  isNetworkAvailable: boolean;

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Contains ref of navigation controller
   */
  public navCtrl: NavController;

  /**
   * Contains ref of navigation params
   */
  public navParams: NavParams;

  /**
   * Contains reference of zone service
   */
  public zone: NgZone;

  /**
   * Contains reference of ionic toast controller
   */
  public toastCtrl: ToastController;

  /**
   * Contains reference of LoadingController
   */
  public loadingCtrl: LoadingController;

  public objRollup: Rollup;

  private resume;

  isContentPlayed = false;

  /**
   * User Rating
   *
   * Used to handle update content workflow
   */
  isUpdateAvail = false;

  /**
   * User Rating
   *
   */
  userRating = 0;

  /**
   * currently used to identify that its routed from QR code results page
   * Can be sent from any page, where after landing on details page should download or play content automatically
   */
  downloadAndPlay: boolean;
  private ratingComment = '';
  private corRelationList: Array<CorrelationData>;

  /**
   * This flag helps in knowing when the content player is closed and the user is back on content details page.
   */
  public isPlayerLaunched = false;

  guestUser = false;

  launchPlayer: boolean;

  profileType = '';
  isResumedCourse: boolean;

  objId;
  objType;
  objVer;
  didViewLoad: boolean;
  backButtonFunc = undefined;
  baseUrl = '';
  shouldGenerateEndTelemetry = false;
  source = '';
  unregisterBackButton: any;
  userCount = 0;
  shouldGenerateTelemetry = true;

  /**
   *
   * @param navCtrl
   * @param navParams
   * @param contentService
   * @param zone
   * @param events
   * @param toastCtrl
   */
  @ViewChild(Navbar) navBar: Navbar;
  constructor(navCtrl: NavController,
    navParams: NavParams,
    contentService: ContentService,
    zone: NgZone,
    private events: Events,
    toastCtrl: ToastController,
    loadingCtrl: LoadingController,
    private fileUtil: FileUtil,
    private popoverCtrl: PopoverController,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private platform: Platform,
    private buildParamService: BuildParamService,
    private network: Network,
    private courseService: CourseService,
    private preference: SharedPreferences,
    private appGlobalService: AppGlobalService,
    private alertCtrl: AlertController,
    private ionicApp: IonicApp,
    private profileService: ProfileService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService) {

    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    this.objRollup = new Rollup();

    this.getUserId();
    this.subscribePlayEvent();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.handlePageResume();
    this.handleNetworkAvailability();

  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.cardData = this.navParams.get('content');
    this.isChildContent = this.navParams.get('isChildContent');
    this.cardData.depth = this.navParams.get('depth') === undefined ? '' : this.navParams.get('depth');
    this.corRelationList = this.navParams.get('corRelation');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.isResumedCourse = Boolean(this.navParams.get('isResumedCourse'));
    this.source = this.navParams.get('source');
    this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
    this.downloadAndPlay = this.navParams.get('downloadAndPlay');
    if (!this.isResumedCourse) {
      this.generateTelemetry();
    }
    if (this.isResumedCourse === true) {
      this.navCtrl.insert(this.navCtrl.length() - 1, EnrolledCourseDetailsPage, {
        content: this.navParams.get('resumedCourseCardData')
      });
    }
    this.setContentDetails(this.identifier, true, false);
    this.subscribeGenieEvent();
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.events.unsubscribe('genie.event');
    this.resume.unsubscribe();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
        true, this.cardData.identifier, this.corRelationList);
      this.handleNavBackButton();
    };
    this.handleDeviceBackButton();

    if (!AppGlobalService.isPlayerLaunched) {
      this.calculateAvailableUserCount();
    }
  }

  handleNavBackButton() {
    this.didViewLoad = false;
    this.generateEndEvent(this.objId, this.objType, this.objVer);
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
    }
    this.popToPreviousPage(true);
    this.backButtonFunc();
  }

  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
        false, this.cardData.identifier, this.corRelationList);
      this.didViewLoad = false;
      this.dismissPopup();
      this.popToPreviousPage();
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
      }
      this.backButtonFunc();
    }, 11);
  }

  handlePageResume() {
    // This is to know when the app has come to foreground
    this.resume = this.platform.resume.subscribe(() => {
      this.isContentPlayed = true;
      if (this.isPlayerLaunched && !this.guestUser) {
        this.isPlayerLaunched = false;
        this.setContentDetails(this.identifier, false, false /* No Automatic Rating for 1.9.0 */);
      }
      this.updateContentProgress();
    });
  }

  handleNetworkAvailability() {
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

  subscribePlayEvent() {
    this.buildParamService.getBuildConfigParam('BASE_URL')
      .then(response => {
        this.baseUrl = response;
      })
      .catch(() => {
      });
    this.launchPlayer = this.navParams.get('launchplayer');
    this.events.subscribe('playConfig', (config) => {
        this.playContent(config.streaming);
    });
  }

  /**
   * Get the session to know if the user is logged-in or guest
   *
   */
  checkLoggedInOrGuestUser() {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
  }

  calculateAvailableUserCount() {
    const profileRequest: ProfileRequest = {
      local: true,
      server: false
    };
    this.profileService.getAllUserProfile(profileRequest).then((profiles) => {
      if (profiles) {
        this.userCount = JSON.parse(profiles).length;
      }
      if (this.appGlobalService.isUserLoggedIn()) {
        this.userCount += 1;
      }
    }).catch(() => {
    });
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
  rateContent(popupType: string) {
    if (!this.guestUser) {
      const paramsMap = new Map();
      if (this.isContentPlayed || (this.content.downloadable
        && this.content.contentAccess.length)) {

        paramsMap['IsPlayed'] = 'Y';
        const popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
          content: this.content,
          pageId: PageId.CONTENT_DETAIL,
          rating: this.userRating,
          comment: this.ratingComment,
          popupType: popupType
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
        paramsMap['IsPlayed'] = 'N';
        this.commonUtilService.showToast('TRY_BEFORE_RATING');
      }
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.RATING_CLICKED,
        Environment.HOME,
        PageId.CONTENT_DETAIL,
        undefined,
        paramsMap,
        this.objRollup,
        this.corRelationList);
    } else {
      if (this.profileType === ProfileType.TEACHER) {
        this.commonUtilService.showToast('SIGNIN_TO_USE_FEATURE');
      }
    }
  }

  /**
   * To set content details in local variable
   *
   * @param {string} identifier identifier of content / course
   */
  setContentDetails(identifier, refreshContentDetails: boolean | true, showRating: boolean) {
    let loader;
    if (!showRating) {
      loader = this.getLoader();
      loader.present();
    }
    const option = {
      contentId: identifier,
      refreshContentDetails: refreshContentDetails,
      attachFeedback: true,
      attachContentAccess: true
    };

    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        if (data && data.result) {
          this.extractApiResponse(data);
          if (!showRating) {
            loader.dismiss();
          }
        } else {
          if (!showRating) {
            loader.dismiss();
          }
        }

        if (showRating) {
          if (this.userRating === 0) {
            this.rateContent('automatic');
          }
        }
      });
    },
      (error: any) => {
        const data = JSON.parse(error);
        console.log('Error received', data);
        loader.dismiss();
        if (this.isDownloadStarted) {
          this.content.downloadable = false;
          this.isDownloadStarted = false;
        }
        if (data.error === 'CONNECTION_ERROR') {
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else if (data.error === 'SERVER_ERROR' || data.error === 'SERVER_AUTH_ERROR') {
          this.commonUtilService.showToast('ERROR_FETCHING_DATA');
        } else {
          this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        }
        this.navCtrl.pop();
      });
  }

  extractApiResponse(data) {
    this.content = data.result.contentData;
    this.content.downloadable = data.result.isAvailableLocally;

    this.content.contentAccess = data.result.contentAccess ? data.result.contentAccess : [];

    if (this.cardData && this.cardData.hierarchyInfo) {
      data.result.hierarchyInfo = this.cardData.hierarchyInfo;
      this.isChildContent = true;
    }

    this.content.playContent = JSON.stringify(data.result);
    if (this.content.gradeLevel && this.content.gradeLevel.length && typeof this.content.gradeLevel !== 'string') {
      this.content.gradeLevel = this.content.gradeLevel.join(', ');
    }
    if (this.content.attributions && this.content.attributions.length) {
      this.content.attributions = this.content.attributions.join(', ');
    }
    if (this.content.me_totalRatings) {
      const rating = this.content.me_totalRatings.split('.');
      if (rating && rating[0]) {
        this.content.me_totalRatings = rating[0];
      }
    }
    this.objId = this.content.identifier;
    this.objVer = this.content.pkgVersion;

    // User Rating
    const contentFeedback: any = data.result.contentFeedback;
    if (contentFeedback !== undefined && contentFeedback.length !== 0) {
      this.userRating = contentFeedback[0].rating;
      this.ratingComment = contentFeedback[0].comments;
    }

    // Check locally available
    if (Boolean(data.result.isAvailableLocally)) {
      if (data.result.isUpdateAvailable && !this.isUpdateAvail) {
        this.isUpdateAvail = true;
      } else {
        this.isUpdateAvail = false;
      }
    } else {
      this.content.size = this.content.size;
    }

    if (this.content.me_totalDownloads) {
      this.content.me_totalDownloads = this.content.me_totalDownloads.split('.')[0];
    }

    if (this.navParams.get('isResumedCourse')) {
      this.cardData.contentData = this.content;
      this.cardData.pkgVersion = this.content.pkgVersion;
      this.generateTelemetry();
    }

    if (this.shouldGenerateTelemetry) {
      this.generateDetailsInteractEvent();
      this.shouldGenerateEndTelemetry = false;
    }

    if (this.downloadAndPlay) {
      if (!this.content.downloadable) {
        /**
         * Content is not downloaded then call the following method
         * It will download the content and play it
         */
        this.downloadContent();
      } else {
        /**
         * If the content is already downloaded then just play it
         */
        this.showSwitchUserAlert(false);
      }
    }
  }

  generateTelemetry() {
    if (!this.didViewLoad && !this.isContentPlayed) {
      this.generateRollUp();
      const contentType = this.cardData.contentData ? this.cardData.contentData.contentType : this.cardData.contentType;
      this.objType = contentType;
      this.generateImpressionEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
      this.generateStartEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
    }
    this.didViewLoad = true;
  }

  generateDetailsInteractEvent() {
    const values = new Map();
    values['isUpdateAvailable'] = this.isUpdateAvail;
    values['isDownloaded'] = this.content.downloadable;

    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.content.identifier;
    telemetryObject.type = this.content.contentType;
    telemetryObject.version = this.content.pkgVersion;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
      ImpressionType.DETAIL,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      telemetryObject,
      values,
      this.objRollup,
      this.corRelationList);
  }

  generateRollUp() {
    const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    if (hierarchyInfo === null) {
      this.objRollup.l1 = this.identifier;
    } else {
      _.forEach(hierarchyInfo, (value, key) => {
        if (key === 0) {
          this.objRollup.l1 = value.identifier;
        } else if (key === 1) {
          this.objRollup.l2 = value.identifier;
        } else if (key === 2) {
          this.objRollup.l3 = value.identifier;
        } else if (key === 3) {
          this.objRollup.l4 = value.identifier;
        }
      });
    }
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.DETAIL, '',
      PageId.CONTENT_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      this.objRollup,
      this.corRelationList);
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = objectId;
    telemetryObject.type = objectType;
    telemetryObject.version = objectVersion;
    this.telemetryGeneratorService.generateStartTelemetry(
      PageId.CONTENT_DETAIL,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = objectId;
    telemetryObject.type = objectType;
    telemetryObject.version = objectVersion;
    this.telemetryGeneratorService.generateEndTelemetry(
      objectType,
      Mode.PLAY,
      PageId.CONTENT_DETAIL,
      Environment.HOME,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateQRSessionEndEvent(pageId: string, qrData: string) {
    if (pageId !== undefined) {
      const telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      telemetryObject.version = '';
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

  /**
 * It will Dismiss active popup
 */
  dismissPopup() {
    const activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._overlayPortal.getActive();

    if (activePortal) {
      activePortal.dismiss();
    } else {
      this.navCtrl.pop();
    }
  }

  popToPreviousPage(isNavBack?) {
    if (this.isResumedCourse) {
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
    } else {
      if (isNavBack) {
        this.navCtrl.pop();
      }
    }
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers: Array<string>, isChild: boolean) {
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
  importContent(identifiers: Array<string>, isChild: boolean) {
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    };

    // Call content service
    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      if (data.result && data.result[0].status === 'NOT_FOUND') {
        this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
      }
    },
      error => {
        console.log('error while loading content details', error);
        if (this.isDownloadStarted) {
          this.content.downloadable = false;
          this.isDownloadStarted = false;
        }
        this.commonUtilService.showToast('SOMETHING_WENT_WRONG');
      });
  }


  /**
   * Subscribe genie event to get content download progress
   */
  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        const res = data;
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress === -1 ? '0' : res.data.downloadProgress;
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.isDownloadStarted) {
            this.isDownloadStarted = false;
            this.cancelDownloading = false;
            this.content.downloadable = true;
            this.setContentDetails(this.identifier, false, false);
            this.downloadProgress = '';
            this.events.publish('savedResources:update', {
              update: true
            });
          }
        }

        // For content update available
        if (res.data && res.type === 'contentUpdateAvailable') {
          this.zone.run(() => {
            this.isUpdateAvail = true;
          });
        }
      });
    });
  }

  /**
   * Download content
   */
  downloadContent() {
    this.zone.run(() => {
      if (this.isNetworkAvailable) {
        this.downloadProgress = '0';
        this.isDownloadStarted = true;
        this.importContent([this.identifier], this.isChildContent);
      } else {
        this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
      }
    });
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, () => {
      this.zone.run(() => {
        this.isDownloadStarted = false;
        this.downloadProgress = '';
        if (!this.isUpdateAvail) {
          this.content.downloadable = false;
        }
      });
    }, (error: any) => {
      this.zone.run(() => {
        console.log('Error: download error =>>>>>', error);
      });
    });
  }


  /**
   * alert for playing the content
   */
  showSwitchUserAlert(isStreaming: boolean) {
    if (!AppGlobalService.isPlayerLaunched && this.userCount > 1) {
      const profile = this.appGlobalService.getCurrentUser();

      const alert = this.alertCtrl.create({
        title: this.commonUtilService.translateMessage('PLAY_AS'),
        mode: 'wp',
        message: profile.handle,
        cssClass: 'confirm-alert',
        buttons: [
          {
            text: this.commonUtilService.translateMessage('YES'),
            cssClass: 'alert-btn-delete',
            handler: () => {
              this.playContent(isStreaming);
            }
          },
          {
            text: this.commonUtilService.translateMessage('CHANGE_USER'),
            cssClass: 'alert-btn-cancel',
            handler: () => {
              const playConfig: any = {};
              playConfig.playContent = true;
              playConfig.streaming = true;
              this.navCtrl.push(UserAndGroupsPage, {
                playConfig: playConfig
              });
            }
          },
          {
            text: 'x',
            role: 'cancel',
            cssClass: 'closeButton',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
    } else {
      this.playContent(isStreaming);
    }

  }

  /**
   * Play content
   */
  playContent(isStreaming: boolean) {
    // set the boolean to true, so when the content player is closed, we get to know that
    // we are back from content player
    this.downloadAndPlay = false;
    if (!AppGlobalService.isPlayerLaunched) {
      AppGlobalService.isPlayerLaunched = true;
    }

    this.zone.run(() => {
      this.isPlayerLaunched = true;
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.CONTENT_PLAY,
        Environment.HOME,
        PageId.CONTENT_DETAIL,
        undefined,
        undefined,
        this.objRollup,
        this.corRelationList);
    });
    const request: any = {};
    request.streaming = isStreaming;
    (<any>window).geniecanvas.play(this.content.playContent, JSON.stringify(request));
  }

  getUserId() {
    if (this.appGlobalService.getSessionData()) {
      this.userId = this.appGlobalService.getSessionData()[ProfileConstants.USER_TOKEN];
    } else {
      this.userId = '';
    }
  }

  updateContentProgress() {
    const stateData = this.navParams.get('contentState');
    if (stateData !== undefined && stateData.batchId && stateData.courseId && this.userId) {
      const data = {
        courseId: stateData.courseId,
        batchId: stateData.batchId,
        contentId: this.identifier,
        userId: this.userId,
        status: 2,
        progress: 100
      };

      this.courseService.updateContentState(data, () => {
        this.zone.run(() => {
          this.events.publish(EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY, {
            update: true
          });
        });
      }, (error: any) => {
        this.zone.run(() => {
          console.log('Error: while updating content state =>>>>>', error);
        });
      });
    }
  }


  /**
   * Function to get loader instance
   */
  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 3000,
      spinner: 'crescent'
    });
  }

  showOverflowMenu(event) {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.KEBAB_MENU_CLICKED,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      undefined,
      undefined,
      this.objRollup,
      this.corRelationList);
    const popover = this.popoverCtrl.create(ContentActionsComponent, {
      content: this.content,
      isChild: this.isChildContent,
      objRollup: this.objRollup,
      corRelationList: this.corRelationList
    }, {
        cssClass: 'content-action'
      });
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      this.zone.run(() => {
        if (data === 'delete.success') {
          this.content.downloadable = false;
        }
      });
    });
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_LIBRARY_INITIATED, this.content.contentType);
    const loader = this.getLoader();
    loader.present();
    const url = this.baseUrl + ShareUrl.CONTENT + this.content.identifier;
    if (this.content.downloadable) {
      this.shareUtil.exportEcar(this.content.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.content.contentType);
        this.social.share('', '', 'file://' + path, url);
      }, () => {
        loader.dismiss();
        this.commonUtilService.showToast('SHARE_CONTENT_FAILED');
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.content.contentType);
      this.social.share('', '', '', url);
    }

  }

  generateShareInteractEvents(interactType, subType, contentType) {
    const values = new Map();
    values['ContentType'] = contentType;
    this.telemetryGeneratorService.generateInteractTelemetry(interactType,
      subType,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      undefined,
      values,
      this.objRollup,
      this.corRelationList);
  }
  /**
  * Function to View Credits
  */
  viewCredits() {
    const popUp = this.popoverCtrl.create(
      ViewCreditsComponent,
      {
        content: this.content,
        pageId: PageId.CONTENT_DETAIL,
        rollUp: this.objRollup,
        correlation: this.corRelationList
      },
      {
        cssClass: 'view-credits'
      }
    );
    popUp.present({
      ev: event
    });
    popUp.onDidDismiss(data => {
    });
  }

  /**
   * method generates telemetry on click Read less or Read more
   * @param {string} param string as read less or read more
   * @param {object} objRollup object roll up
   * @param corRelationList corelationList
   */
  readLessorReadMore(param, objRollup, corRelationList) {
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.objId;
    telemetryObject.type = this.objType;
    telemetryObject.version = this.objVer;
    this.commonUtilService.readLessOrReadMore(param, objRollup, corRelationList, telemetryObject);
  }
}
