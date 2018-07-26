import { ReportIssuesComponent } from './../../component/report-issues/report-issues';
import { Component, NgZone, ViewChild } from '@angular/core';
import {
  IonicPage, NavController, NavParams, Events, ToastController,
  LoadingController, Platform, Navbar, PopoverController
} from 'ionic-angular';
import {
  ContentService, FileUtil,
  PageId, Environment, Mode, ImpressionType, TelemetryService, Rollup, InteractType, InteractSubtype,
  ShareUtil, BuildParamService, AuthService, SharedPreferences, ProfileType, CorrelationData
} from 'sunbird';
import * as _ from 'lodash';
import { ContentDetailsPage } from '../content-details/content-details';
// import { CourseDetailPage } from '../course-detail/course-detail';
import { ContentActionsComponent } from '../../component/content-actions/content-actions';
import { ConfirmAlertComponent } from '../../component/confirm-alert/confirm-alert';
import { TranslateService } from '@ngx-translate/core';
import {
  generateStartTelemetry,
  generateEndTelemetry, generateInteractTelemetry, generateImpressionTelemetry
} from '../../app/telemetryutil';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ContentRatingAlertComponent } from '../../component/content-rating-alert/content-rating-alert';
import { ContentType, MimeType, ShareUrl } from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { Network } from '@ionic-native/network';
import { AppGlobalService } from '../../service/app-global.service';

/**
 * Generated class for the CollectionDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection-details',
  templateUrl: 'collection-details.html',
})
export class CollectionDetailsPage {

  /**
  * Contains content details
  */
  contentDetail: any;

  /**
   * Contains children content data
   */
  childrenData: Array<any>;

  /**
   * Show loader while importing content
   */
  showChildrenLoader: boolean;

  /**
   * Contains card data of previous state
   */
  cardData: any;

  /**
   * To hold identifier
   */
  identifier: string;

  /**
   * Contains child content import / download progress
   */
  downloadProgress: any;

  /**
   * To get course structure keys
   */
  objectKeys = Object.keys;

  /**
   * Contains
   */
  showDownloadBtn: boolean = false;

  /**
   * Flag downlaoded started
   */
  isDownloadStarted: boolean = false;

  /**
   * Contains current course depth
   */
  depth: string = '1';

  /**
   * Its get true when child is collection.
   * Used to show content depth
   *
   * @example 1.1 Collection 1
   */
  isDepthChild: boolean = false;

  /**
   * To hold content identifiers
   */
  queuedIdentifiers: Array<any> = [];

  /**
   * Download complete falg
   */
  isDownlaodCompleted: boolean = false;

  /**
   * Total downlaod count
   */
  totalDownload: number;

  /**
   * Current download count
   */
  currentCount: number = 0;

  /**
   * Contains identifier(s) of locally not available content(s)
   */
  downloadIdentifiers = [];

  /**
   * Child content size
   */
  downloadSize: number = 0;

  /**
   * Contains total size of locally not available content(s)
   */
  downloadContentsSize: string;

  /**
   * To hold network status
   */
  isNetworkAvailable: boolean;

  downloadPercentage: number;

  private objId;
  private objType;
  private objVer;

  public showLoading = false;

  /**
   * Needed to handle collection auto update workflow
   */
  isUpdateAvailable: boolean = false;

  /**
   * To hold rating data
   */
  userRating: number = 0;

  /**
   * Rating comment
   */
  ratingComment: string = '';


  /**
   * Telemetry roll up object
   */
  public objRollup: Rollup;
  public didViewLoad: boolean;
  public backButtonFunc = undefined;
  public baseUrl = "";


  guestUser: boolean = false;

  profileType: string = '';
  public corRelationList: Array<CorrelationData>;
  public shouldGenerateEndTelemetry: boolean = false;
  public source : string = "";

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public contentService: ContentService,
    public zone: NgZone,
    public events: Events,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public fileUtil: FileUtil,
    public platform: Platform,
    public telemetryService: TelemetryService,
    public authService: AuthService,
    public translate: TranslateService,
    public social: SocialSharing,
    public shareUtil: ShareUtil,
    public buildParamService: BuildParamService,
    public network: Network,
    public preference: SharedPreferences,
    public appGlobalService: AppGlobalService) {
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    console.warn('Inside new module..........................');
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if(this.shouldGenerateEndTelemetry){
        this.generateQRSessionEndEvent(this.source,this.cardData.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }, 10)
    this.objRollup = new Rollup();
    this.buildParamService.getBuildConfigParam("BASE_URL", (response: any) => {
      this.baseUrl = response
    }, (error) => {
      return "";
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
   * Function to rate content
   */
  rateContent() {
    if (!this.guestUser) {
      if (this.contentDetail.isAvailableLocally) {
        let popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
          content: this.contentDetail,
          rating: this.userRating,
          comment: this.ratingComment,
          pageId: PageId.COLLECTION_DETAIL,
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
        this.translateAndDisplayMessage('TRY_BEFORE_RATING');
      }
    } else {
      if (this.profileType == ProfileType.TEACHER) {
        this.translateAndDisplayMessage('SIGNIN_TO_USE_FEATURE');
      }
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
        console.log('Content details ==>>>>>', data);
        loader.dismiss().then(() => {
          if (data && data.result) {
            this.extractApiResponse(data);
          }
        })
      });
    },
      error => {
        console.log('error while loading content details', error);
        loader.dismiss();
        this.translateAndDisplayMessage('ERROR_CONTENT_NOT_AVAILABLE', true);
      });
  }

  /**
   * Function to extract api response.
   */
  extractApiResponse(data) {
    this.contentDetail = data.result.contentData ? data.result.contentData : [];
    this.contentDetail.isAvailableLocally = data.result.isAvailableLocally;
    this.objId = this.contentDetail.identifier;
    // this.objType = this.contentDetail.contentType;
    this.objVer = this.contentDetail.pkgVersion;
    if (this.contentDetail.gradeLevel && this.contentDetail.gradeLevel.length) {
      this.contentDetail.gradeLevel = this.contentDetail.gradeLevel.join(", ");
    }
    if (this.contentDetail.attributions && this.contentDetail.attributions.length) {
      this.contentDetail.attributions = this.contentDetail.attributions.join(", ");
    }
    if (this.contentDetail.me_totalRatings) {
      let rating = this.contentDetail.me_totalRatings.split(".");
      if (rating && rating[0]) {
        this.contentDetail.me_totalRatings = rating[0];
      }
    }

    //User Rating
    let contentFeedback: any = data.result.contentFeedback ? data.result.contentFeedback : [];
    if (contentFeedback !== undefined && contentFeedback.length !== 0) {
      this.userRating = contentFeedback[0].rating;
      this.ratingComment = contentFeedback[0].comments;
      console.log("User Rating  - " + this.userRating);
    }

    switch (data.result.isAvailableLocally) {
      case true: {
        this.showLoading = false;
        this.contentDetail.size = data.result.sizeOnDevice;
        console.log("Content locally available. Looking for is update available or not...");
        // data.result.isUpdateAvailable = true;
        if (data.result.isUpdateAvailable && !this.isUpdateAvailable){
          console.log('update is available. Lets start import again...');
          this.isUpdateAvailable = true;
          this.showLoading = true;
          this.importContent([this.identifier], false);
        } else {
          console.log('Update not available');
          this.isUpdateAvailable = false;
          this.setChildContents();
        }
        break;
      }
      case false: {
        console.log("Content locally not available. Import started... @@@");
        this.showLoading = true;
        this.importContent([this.identifier], false);
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
    }

    if (this.contentDetail.me_totalDownloads) {
      this.contentDetail.me_totalDownloads = this.contentDetail.me_totalDownloads.split('.')[0];
    }
    this.setCollectionStructure();
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

  /**
   * Set collection structure
   */
  setCollectionStructure() {
    this.showChildrenLoader = true;
    if (this.contentDetail.contentTypesCount) {
      this.contentDetail.contentTypesCount = JSON.parse(this.contentDetail.contentTypesCount);
    } else if (this.cardData.contentTypesCount) {
      if (!_.isObject(this.cardData.contentTypesCount)) {
        this.contentDetail.contentTypesCount = JSON.parse(this.cardData.contentTypesCount);
      }
    } /*else {
      this.contentDetail.contentTypesCount;
    }*/
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
        // TODO - check with Anil for destination folder path
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
      this.zone.run(() => {
        data = JSON.parse(data);

        if (data.result && data.result.length && this.isDownloadStarted) {
          _.forEach(data.result, (value, key) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            this.showMessage(this.translateMessage("UNABLE_TO_FETCH_CONTENT"), false);
          }
        } else if(data.result && data.result[0].status === 'NOT_FOUND') {
          this.showLoading = false;
          this.showChildrenLoader = false;
          this.childrenData.length = 0;
        }
        console.log('Success: content imported successfully... @@@', data);
        // this.showChildrenLoader = false;
      })
    },
      error => {
        this.zone.run(() => {
          console.log('error while loading content details', error);
          this.showMessage(this.translateMessage("UNABLE_TO_FETCH_CONTENT"), false);
          this.showChildrenLoader = false;
        })
      });
  }

  /**
   * Function to set child contents
   */
  setChildContents() {
    console.log('Making child contents api call... @@@');
    let hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    const option = { contentId: this.identifier, hierarchyInfo: hierarchyInfo }; // TODO: remove level
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents data =', data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
        }

        if (!this.isDepthChild) {
          this.getContentsSize(data.result.children || []);
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

  getContentsSize(data) {
    this.downloadSize = 0;
    _.forEach(data, (value, key) => {
      if (value.children && value.children.length) {
        this.getContentsSize(value.children);
      }

      if (value.isAvailableLocally === false) {
        this.downloadIdentifiers.push(value.contentData.identifier);
        if (value.contentData.size && !this.isDepthChild) {
          this.downloadSize += +value.contentData.size;
        }
      }
    });
    if (this.downloadIdentifiers.length && !this.isDownlaodCompleted) {
      this.showDownloadBtn = true;
    }
  }
  /**
   *
   * @param {array} data
   */
  showDownloadAllBtn(data) {
    let size = 0;
    this.zone.run(() => {
      _.forEach(data, (value, key) => {
        if (value.isAvailableLocally === false) {
          this.downloadIdentifiers.push(value.contentData.identifier);
          size += +value.contentData.size;
        }
      });
      this.downloadContentsSize = this.getReadableFileSize(+size);
      if (this.downloadIdentifiers.length) {
        this.showDownloadBtn = true;
      }
    });
  }


  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if(this.shouldGenerateEndTelemetry){
        this.generateQRSessionEndEvent(this.source,this.cardData.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.zone.run(() => {
      this.resetVariables();
      this.cardData = this.navParams.get('content');
      this.corRelationList = this.navParams.get('corRelation');
      let depth = this.navParams.get('depth');
      this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
      this.source = this.navParams.get('source');
      
      if (depth !== undefined) {
        this.depth = depth;
        this.showDownloadBtn = false;
        this.isDepthChild = true;
      } else {
        this.isDepthChild = false;
      }
      this.identifier = this.cardData.contentId || this.cardData.identifier;


      if (!this.didViewLoad) {
        this.generateRollUp();
        let contentType = this.cardData.contentData ? this.cardData.contentData.contentType : this.cardData.contentType;
        this.objType = contentType;
        this.generateStartEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
        this.generateImpressionEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
      }
      this.didViewLoad = true;
      this.setContentDetails(this.identifier, true);
      this.subscribeGenieEvent();
    })
  }

  navigateToDetailsPage(content: any, depth) {
    console.log('Card details... @@@', content);
    console.log('Content depth... @@@', depth);
    let stateData = this.navParams.get('contentState');

    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        console.warn('Inside course details page >>>');
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        })
      } else if (content.mimeType === MimeType.COLLECTION) {
        console.warn('Inside CollectionDetailsPage >>>');
        this.isDepthChild = true;
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        })
      } else {
        console.warn('Inside ContentDetailsPage >>>');
        this.navCtrl.push(ContentDetailsPage, {
          isChildContent: true,
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        })
      }
    })
  }

  /**
   * Reset all values
   */
  resetVariables() {
    this.isDownloadStarted = false;
    this.showLoading = false;
    // this.downloadProgress = '';
    this.downloadProgress = 0;
    this.cardData = '';
    this.childrenData = [];
    this.contentDetail = '';
    this.showDownloadBtn = false;
    this.downloadIdentifiers = [];
    // Added on date 16-april
    this.queuedIdentifiers = [];
    this.isDepthChild = this.isDepthChild;
    this.showDownloadBtn = false;
    this.isDownlaodCompleted = false;
    this.currentCount = 0;
    this.downloadPercentage = 0;
    this.isUpdateAvailable = false;
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
          if (res.data.downloadProgress === -1 || res.data.downloadProgress === '-1') {
            this.downloadProgress = 0;
          } else {
            this.downloadProgress = res.data.downloadProgress;
          }

          // this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
          if (this.downloadProgress === 100) {
            this.showLoading = false;
            this.contentDetail.isAvailableLocally = true;
          }
        }
        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          this.showLoading = false;
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
              this.currentCount++;
              console.log('current download count:', this.currentCount);
              console.log('queuedIdentifiers count:', this.queuedIdentifiers.length);
              this.downloadPercentage = +((this.currentCount / this.queuedIdentifiers.length) * (100)).toFixed(0);
            }
            if (this.queuedIdentifiers.length === this.currentCount) {
              this.isDownloadStarted = false;
              this.showDownloadBtn = false;
              this.isDownlaodCompleted = true;
              this.contentDetail.isAvailableLocally = true;
              this.downloadPercentage = 0;
              this.updateSavedResources();
            }
          } else {
            if (this.isUpdateAvailable){
              console.log('Done with auto import. Lets make getContentDetails api call with refreshContentDetails false');
              this.setContentDetails(this.identifier, false);
            } else {
              this.updateSavedResources();
              this.setChildContents();
              this.contentDetail.isAvailableLocally = true;
            }
          }
        }
      });
    });
  }

  updateSavedResources() {
    this.events.publish('savedResources:update', {
      update: true
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
   * Show error messages
   *
   * @param {string}  message Error message
   * @param {boolean} isPop True = navigate to previous state
   */
  showMessage(message: string, isPop: boolean | false): void {
    if (this.isDownloadStarted) {
      this.showDownloadBtn = true;
      this.isDownloadStarted = false;
      this.showLoading = false;
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

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_LIBRARY_INITIATED, this.contentDetail.contentType);
    let loader = this.getLoader();
    loader.present();
    let url = this.baseUrl + ShareUrl.COLLECTION + this.contentDetail.identifier;
    if (this.contentDetail.isAvailableLocally) {
      this.shareUtil.exportEcar(this.contentDetail.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.contentDetail.contentType);
        this.social.share("", "", "file://" + path, url);
      }, error => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: this.translateMessage("SHARE_CONTENT_FAILED"),
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.contentDetail.contentType);
      this.social.share("", "", "", url);
    }
  }

  /**
   * Download single content
   */
  downloadAllContent(): void {
    // this.downloadProgress = '0 %';
    this.downloadProgress = 0;
    this.showLoading = true;
    this.isDownloadStarted = true;
    this.downloadPercentage = 0;
    this.importContent(this.downloadIdentifiers, true);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    // this.downloadProgress = '';
    this.downloadProgress = 0;
    this.events.unsubscribe('genie.event');
  }

  /**
   * To get redable file size
   *
   * @param {number} size
   */
  getReadableFileSize(size): string {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(size, 10) || 0;
    while (n >= 1024 && ++l)
      n = n / 1024;
    return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
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
      content: this.contentDetail,
      isChild: this.isDepthChild
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

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.DETAIL, "",
      PageId.COLLECTION_DETAIL,
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
      PageId.COLLECTION_DETAIL,
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
      PageId.COLLECTION_DETAIL,
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

  generateShareInteractEvents(interactType, subType, contentType) {
    let values = new Map();
    values["ContentType"] = contentType;
    this.telemetryService.interact(
      generateInteractTelemetry(interactType,
        subType,
        Environment.HOME,
        PageId.COLLECTION_DETAIL, values,
        undefined,
        this.corRelationList)
    );
  }

  showDownloadAlert(myEvent) {
    if (this.isNetworkAvailable) {
      let popover = this.popoverCtrl.create(ConfirmAlertComponent, {}, {
        cssClass: 'confirm-alert-box'
      });
      popover.present({
        ev: myEvent
      });
      popover.onDidDismiss((canDownload: boolean = false) => {
        if (canDownload) {
          this.downloadAllContent();
        }
      });
    } else {
      this.translateAndDisplayMessage('ERROR_NO_INTERNET_MESSAGE')
    }
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, (response) => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    }, (error) => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    });
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
