import { ContentRatingAlertComponent } from './../../component/content-rating-alert/content-rating-alert';
import { ContentActionsComponent } from './../../component/content-actions/content-actions';
import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, PopoverController, Navbar, Platform } from 'ionic-angular';
import { ContentService, CourseService, FileUtil, ImpressionType, PageId, Environment, TelemetryService, Mode, End, ShareUtil, InteractType, InteractSubtype, Rollup, BuildParamService, AuthService, SharedPreferences, ProfileType, CorrelationData } from 'sunbird';
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';
import * as _ from 'lodash';
import { generateInteractTelemetry, Map, generateStartTelemetry, generateImpressionTelemetry, generateEndTelemetry } from '../../app/telemetryutil';
import { TranslateService } from '@ngx-translate/core';
import { EventTopics } from '../../app/app.constant';
import { ShareUrl } from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';

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
  isChildContent: boolean = false;

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
  isDownloadStarted: boolean = false;

  /**
   * Contains download progress
   */
  downloadProgress: string;

  /**
   *
   */
  cancelDownloading: boolean = false;

  /**
   * Contains loader instance
   */
  loader: any;

  /**
   * To hold user id
   */
  userId: string = '';

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

  private pause;
  private resume;

  isContentPlayed: boolean = false;

  /**
   * Used to handle update content workflow
   */
  isUpdateAvail: boolean = false;

  /**
   * User Rating 
   * 
   */
  private userRating: number = 0;
  private ratingComment: string = '';
  private corRelationList: Array<CorrelationData>;

  /**
   * This flag helps in knowing when the content player is closed and the user is back on content details page.
   */
  public isPlayerLaunched: boolean = false;

  guestUser: boolean = false;

  profileType: string = '';

  private objId;
  private objType;
  private objVer;
  private didViewLoad: boolean;
  private backButtonFunc = undefined;
  private baseUrl = "";
  private shouldGenerateEndTelemetry: boolean = false;
  private source: string = "";

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
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, private telemetryService: TelemetryService, zone: NgZone,
    private events: Events, toastCtrl: ToastController, loadingCtrl: LoadingController,
    private fileUtil: FileUtil, public popoverCtrl: PopoverController, private shareUtil: ShareUtil,
    private social: SocialSharing, private platform: Platform, private translate: TranslateService,
    private buildParamService: BuildParamService, private network: Network,
    private authService: AuthService, private courseService: CourseService,
    private preference: SharedPreferences) {
    this.getUserId();
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    console.warn('Inside content details page');
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.didViewLoad = false;
      this.navCtrl.pop();
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
      }
      this.backButtonFunc();
    }, 10)
    this.objRollup = new Rollup();
    this.buildParamService.getBuildConfigParam("BASE_URL", (response: any) => {
      this.baseUrl = response
    }, (error) => {
      return "";
    });

    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();

    //This is to know when the app has come to foreground
    this.resume = platform.resume.subscribe(() => {
      this.isContentPlayed = true;
      if (this.isPlayerLaunched && !this.guestUser) {
        this.isPlayerLaunched = false;
        this.setContentDetails(this.identifier, false, true);
      }
      this.updateContentProgress();
    });

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
   * Get the session to know if the user is logged-in or guest
   * 
   */
  checkLoggedInOrGuestUser() {
    this.authService.getSessionData((session) => {
      if (session === null || session === "null") {
        this.guestUser = true;
      } else {
        this.guestUser = false;
      }
    });
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
  rateContent(popupType: string) {
    if (!this.guestUser) {
      let ratingData = {
        identifier: this.identifier,
        pageId: PageId.CONTENT_DETAIL,
        rating: this.userRating,
        comment: this.ratingComment
      }
      let paramsMap = new Map();
      if (this.isContentPlayed || (this.content.downloadable
        && this.content.contentAccess.length)) {

        paramsMap["IsPlayed"] = "Y";
        let popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
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
        paramsMap["IsPlayed"] = "N";
        this.translateAndDisplayMessage('TRY_BEFORE_RATING', false);
      }
      this.telemetryService.interact(generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.RATING_CLICKED,
        Environment.HOME,
        PageId.CONTENT_DETAIL, paramsMap,
        this.objRollup,
        this.corRelationList
      ));
    } else {
      if (this.profileType == ProfileType.TEACHER) {
        this.translateAndDisplayMessage('SIGNIN_TO_USE_FEATURE');
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
    }

    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('Success: Content details received... @@@', data);
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
            this.rateContent("automatic");
          }
        }
      });
    },
    (error: any) => {
      let data = JSON.parse(error);
      console.log('Error received', data);
        loader.dismiss();
        if (data.error === 'CONNECTION_ERROR') {
          this.translateAndDisplayMessage('ERROR_NO_INTERNET_MESSAGE', true);
        } else if (data.error === 'SERVER_ERROR' || data.error === 'SERVER_AUTH_ERROR') {
          this.translateAndDisplayMessage('ERROR_FETCHING_DATA', true);
        } else {
          this.translateAndDisplayMessage('ERROR_CONTENT_NOT_AVAILABLE', true);
        }
      });
  }

  extractApiResponse(data) {
    this.content = data.result.contentData;
    this.content.downloadable = data.result.isAvailableLocally;

    this.content.contentAccess = data.result.contentAccess ? data.result.contentAccess : [];

    this.content.playContent = JSON.stringify(data.result);
    if (this.content.gradeLevel && this.content.gradeLevel.length) {
      this.content.gradeLevel = this.content.gradeLevel.join(", ");
    }
    if (this.content.attributions && this.content.attributions.length) {
      this.content.attributions = this.content.attributions.join(", ");
    }
    if (this.content.me_totalRatings) {
      let rating = this.content.me_totalRatings.split(".");
      if (rating && rating[0]) {
        this.content.me_totalRatings = rating[0];
      }
    }
    this.objId = this.content.identifier;
    // this.objType = this.content.contentType;
    this.objVer = this.content.pkgVersion;

    //User Rating
    let contentFeedback: any = data.result.contentFeedback;
    if (contentFeedback !== undefined && contentFeedback.length !== 0) {
      this.userRating = contentFeedback[0].rating;
      this.ratingComment = contentFeedback[0].comments;
      console.log("User Rating  - " + this.userRating);
    }

    // Check locally available
    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Content locally available. Lets play the content");
        this.content.size = data.result.sizeOnDevice;
        console.log('Update', data.result.isUpdateAvailable);
        console.log('isUpdateAvail----', this.isUpdateAvail);
        if (data.result.isUpdateAvailable && !this.isUpdateAvail) {
          this.isUpdateAvail = true;
        } else {
          this.isUpdateAvail = false;
        }
        break;
      }
      case false: {
        console.log("Content locally not available. Import started... @@@");
        this.content.size = this.content.size;
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
    }
    if (this.content.me_totalDownloads) {
      this.content.me_totalDownloads = this.content.me_totalDownloads.split('.')[0];
    }

    if (this.navParams.get('isResumedCourse')) {
      console.log('From resume course.......');
      this.cardData.contentData = this.content;
      this.cardData.pkgVersion = this.content.pkgVersion
      this.generateTemetry()
    }
  }

  //
  generateTemetry() {
    console.log('Before =>', this.didViewLoad);
    console.log('is content played', this.isContentPlayed);
    if (!this.didViewLoad && !this.isContentPlayed) {
      this.generateRollUp();
      let contentType = this.cardData.contentData ? this.cardData.contentData.contentType : this.cardData.contentType;
      this.objType = contentType;
      this.generateStartEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
      this.generateImpressionEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
    }
    this.didViewLoad = true;
    console.log('After =>', this.didViewLoad);
  }

  generateRollUp() {
    let hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    if (hierarchyInfo === null) {
      this.objRollup.l1 = this.identifier;
    } else {
      _.forEach(hierarchyInfo, (value, key) => {
        if (key === 0) {
          this.objRollup.l1 = value.identifier
        } else if (key === 1) {
          this.objRollup.l2 = value.identifier
        } else if (key === 2) {
          this.objRollup.l3 = value.identifier
        } else if (key === 3) {
          this.objRollup.l4 = value.identifier
        }
      });
    }
    console.log('generateRollUp', this.objRollup);
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {

    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.DETAIL, "",
      PageId.CONTENT_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      this.objRollup,
      this.corRelationList
    ));
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    this.telemetryService.start(generateStartTelemetry(
      PageId.CONTENT_DETAIL,
      objectId,
      objectType,
      objectVersion,
      this.objRollup,
      this.corRelationList
    ));
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    this.telemetryService.end(generateEndTelemetry(
      objectType,
      Mode.PLAY,
      PageId.CONTENT_DETAIL,
      objectId,
      objectType,
      objectVersion,
      this.objRollup,
      this.corRelationList
    ));
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

  private generateRatingInteractEvent() {
    this.telemetryService.interact(
      generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.CONTENT_PLAY,
        Environment.HOME,
        PageId.CONTENT_DETAIL, null,
        this.objRollup,
        this.corRelationList)
    );
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
    let isResumedCourse = this.navParams.get('isResumedCourse');
    this.source = this.navParams.get('source');
    this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
    if (!isResumedCourse) {
      this.generateTemetry();
    }
    if (isResumedCourse === true) {
      this.navCtrl.insert(this.navCtrl.length() - 1, EnrolledCourseDetailsPage, {
        content: this.navParams.get('resumedCourseCardData')
      })
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
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }
  }

  /**
   * Show error messages
   *
   * @param {string}  message Error message
   * @param {boolean} isPop True = navigate to previous state
   */
  showMessage(message: string, isPop: boolean | false): void {
    if (this.isDownloadStarted) {
      this.content.downloadable = false;
      this.isDownloadStarted = false;
    }

    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      if (isPop) {
        this.navCtrl.pop();
      }
    });

    toast.present();
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers: Array<string>, isChild: boolean) {
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
  importContent(identifiers: Array<string>, isChild: boolean) {
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    }

    // Call content service
    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: Import content =>', data);
      if (data.result && data.result[0].status === 'NOT_FOUND') {
        this.translateAndDisplayMessage('ERROR_CONTENT_NOT_AVAILABLE', false)
      }
    },
      error => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showMessage(message, false);
      });
  }

  translateAndDisplayMessage(constant: any, isPop: boolean = false) {
    this.translate.get(constant).subscribe(
      (value: any) => {
        this.showMessage(value, isPop);
      }
    );
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
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress === -1 ? '0' : res.data.downloadProgress;
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.isDownloadStarted) {
            this.isDownloadStarted = false;
            this.cancelDownloading = false;
            this.content.downloadable = true;
            this.setContentDetails(this.identifier, true, false);
            this.downloadProgress = '';
            this.events.publish('savedResources:update', {
              update: true
            });
          }
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
        this.translateAndDisplayMessage('ERROR_NO_INTERNET_MESSAGE')
      }
    });
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, (data: any) => {
      this.zone.run(() => {
        console.log('download cancel success', data);
        this.isDownloadStarted = false;
        this.downloadProgress = '';
        if (!this.isUpdateAvail) {
          this.content.downloadable = false;
        }
      });
    }, (error: any) => {
      this.zone.run(() => {
        console.log('Error: download error =>>>>>', error)
      })
    })
  }

  /**
   * Play content
   */
  playContent() {
    //set the boolean to true, so when the content player is closed, we get to know that
    //we are back from content player
    this.zone.run(() => {
      this.isPlayerLaunched = true;
      this.telemetryService.interact(
        generateInteractTelemetry(InteractType.TOUCH,
          InteractSubtype.CONTENT_PLAY,
          Environment.HOME,
          PageId.CONTENT_DETAIL, null,
          this.objRollup,
          this.corRelationList)
      );
    });

    (<any>window).geniecanvas.play(this.content.playContent);
  }

  getUserId() {
    this.authService.getSessionData((session: string) => {
      if (session === null || session === "null") {
        this.userId = '';
      } else {
        let res = JSON.parse(session);
        this.userId = res["userToken"] ? res["userToken"] : '';
      }
    });
  }

  updateContentProgress() {
    let stateData = this.navParams.get('contentState');
    console.log('stateData', stateData);
    if (stateData !== undefined && stateData.batchId && stateData.courseId && this.userId) {
      const data = {
        courseId: stateData.courseId,
        batchId: stateData.batchId,
        contentId: this.identifier,
        userId: this.userId,
        status: 2,
        progress: 100
      };

      this.courseService.updateContentState(data, (data: any) => {
        let res = JSON.parse(data);
        this.zone.run(() => {
          console.log('Course progress updated...', res);
          this.events.publish(EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY, {
            update: true
          });
        });
      }, (error: any) => {
        this.zone.run(() => {
          console.log('Error: while updating content state =>>>>>', error)
        })
      })
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

  showOverflowMenu(event) {
    let popover = this.popoverCtrl.create(ContentActionsComponent, {
      content: this.content,
      isChild: this.isChildContent
    }, {
        cssClass: 'content-action'
      });
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      console.log('Delete data received.....', data);
      this.zone.run(() => {
        if (data === 'delete.success') {
          this.content.downloadable = false;
        }
      });
    });
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_LIBRARY_INITIATED, this.content.contentType);
    let loader = this.getLoader();
    loader.present();
    let url = this.baseUrl + ShareUrl.CONTENT + this.content.identifier;
    if (this.content.downloadable) {
      this.shareUtil.exportEcar(this.content.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.content.contentType);
        this.social.share("", "", "file://" + path, url);
      }, error => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: this.translateMessage('SHARE_CONTENT_FAILED'),
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.content.contentType);
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
        this.objRollup,
        this.corRelationList)
    );
  }

  /**
  * Used to Translate message to current Language
  * @param {string} messageConst - Message Constant to be translated
  * @returns {string} translatedMsg - Translated Message
  */
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}
