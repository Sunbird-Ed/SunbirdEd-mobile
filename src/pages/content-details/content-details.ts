import { ContentRatingAlertComponent } from './../../component/content-rating-alert/content-rating-alert';
import { ContentActionsComponent } from './../../component/content-actions/content-actions';
import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, PopoverController, Navbar, Platform } from 'ionic-angular';
import { ContentService, CourseService, FileUtil, ImpressionType, PageId, Environment, TelemetryService, Mode, End, ShareUtil, InteractType, InteractSubtype, Rollup, BuildParamService, AuthService, SharedPreferences, ProfileType, CorrelationData } from 'sunbird';
import { SocialSharing } from "@ionic-native/social-sharing";
import * as _ from 'lodash';
import { generateInteractTelemetry, Map, generateStartTelemetry, generateImpressionTelemetry, generateEndTelemetry } from '../../app/telemetryutil';
import { TranslateService } from '@ngx-translate/core';

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

  userId: string = '';

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
    private buildParamService: BuildParamService,
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

    //This is to know when the app has gone to background
    this.pause = platform.pause.subscribe(() => {

    });

    //This is to know when the app has come to foreground
    this.resume = platform.resume.subscribe(() => {
      if (this.isPlayerLaunched && !this.guestUser) {
        this.isPlayerLaunched = false;
        if (this.userRating === 0) {
          this.rateContent();
        }
      }
      this.isContentPlayed = true;
      this.updateContentProgress();
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
  rateContent() {
    if (!this.guestUser) {
      let ratingData = {
        identifier: this.identifier,
        pageId: PageId.CONTENT_DETAIL,
        rating: this.userRating,
        comment: this.ratingComment
      }

      if (this.isContentPlayed || (this.content.downloadable && this.content.contentAccess.length)) {
        this.telemetryService.interact(generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.RATING_CLICKED,
          Environment.HOME,
          PageId.CONTENT_DETAIL, null,
          this.objRollup,
          this.corRelationList
        ));
        let popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
          content: this.content,
          pageId: PageId.CONTENT_DETAIL,
          rating: this.userRating,
          comment: this.ratingComment
        }, {
            cssClass: 'onboarding-alert'
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
        this.translateAndDisplayMessage('TRY_BEFORE_RATING', false);
      }
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
  setContentDetails(identifier, refreshContentDetails: boolean | true) {
    let loader = this.getLoader();
    loader.present();
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
          loader.dismiss();
        } else {
          loader.dismiss();
        }
      });
    },
      error => {
        loader.dismiss();
        this.translateAndDisplayMessage('ERROR_CONTENT_NOT_AVAILABLE', true);
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
    this.objId = this.content.identifier;
    this.objType = this.content.contentType;
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

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.cardData = this.navParams.get('content');
    this.isChildContent = this.navParams.get('isChildContent');
    this.cardData.depth = this.navParams.get('depth') === undefined ? '' : this.navParams.get('depth');
    this.corRelationList = this.navParams.get('corRelation');
    console.log("this.corRelation", "" + JSON.stringify(this.corRelationList));

    this.identifier = this.cardData.contentId || this.cardData.identifier;
    if (!this.didViewLoad) {
      this.generateRollUp();
      this.generateStartEvent(this.cardData.identifier, this.cardData.contentType, this.cardData.pkgVersion);
      this.generateImpressionEvent(this.cardData.identifier, this.cardData.contentType, this.cardData.pkgVersion);
    }
    this.didViewLoad = true;
    // this.resetVariables();
    this.setContentDetails(this.identifier, true);
    this.subscribeGenieEvent();
    // this.events.unsubscribe('savedResources:update');
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.events.unsubscribe('genie.event');
    this.pause.unsubscribe();
    this.resume.unsubscribe();
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
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
        correlationData: []
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
            this.setContentDetails(this.identifier, true);
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
    this.downloadProgress = '0';
    this.isDownloadStarted = true;
    this.importContent([this.identifier], this.isChildContent);
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, (data: any) => {
      this.zone.run(() => {
        console.log('download cancel success', data);
        this.isDownloadStarted = false;
        this.downloadProgress = '';
        this.content.downloadable = false;
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
        status: 2
      };

      this.courseService.updateContentState(data, (data: any) => {
        let res = JSON.parse(data);
        this.zone.run(() => {
          console.log('Course progress updated...', res);
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
      if (data === 0) {
        this.content.downloadable = false;
        this.translateAndDisplayMessage('MSG_RESOURCE_DELETED', false);
        this.events.publish('savedResources:update', {
          update: true
        });
      }
      if (data === 'delete.success') {
        this.content.downloadable = false;
      }
    });
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_LIBRARY_INITIATED, this.content.contentType);
    let loader = this.getLoader();
    loader.present();
    let url = this.baseUrl + "/public/#!/content/" + + this.content.identifier;
    if (this.content.downloadable) {
      this.shareUtil.exportEcar(this.content.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.content.contentType);
        this.social.share("", "", "file://" + path, url);
      }, error => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: "Unable to share content.",
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
}
