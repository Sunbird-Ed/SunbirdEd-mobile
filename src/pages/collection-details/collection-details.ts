import { Component, NgZone, ViewChild } from '@angular/core';
import {
  IonicPage, NavController, NavParams, Events, ToastController,
  LoadingController, Platform, Navbar, PopoverController
} from 'ionic-angular';
import {
  ContentService, FileUtil,
  PageId, Environment, Mode, ImpressionType, TelemetryService, Rollup, InteractType, InteractSubtype,
  ShareUtil, BuildParamService, AuthService, SharedPreferences, ProfileType, CorrelationData, TelemetryObject
} from 'sunbird';
import * as _ from 'lodash';
import { ContentDetailsPage } from '../content-details/content-details';
import { ContentActionsComponent } from '../../component/content-actions/content-actions';
import { ConfirmAlertComponent } from '../../component/confirm-alert/confirm-alert';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ContentRatingAlertComponent } from '../../component/content-rating-alert/content-rating-alert';
import { ContentType, MimeType, ShareUrl } from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { Network } from '@ionic-native/network';
import { AppGlobalService } from '../../service/app-global.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

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
     * Contains Parent Content Details
     */
  parentContent: any;

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

  objId;
  objType;
  objVer;

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
  public source: string = "";

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
    public appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService) {

    this.objRollup = new Rollup();

    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.handleNetworkAvaibility();
  }

  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.didViewLoad = false;
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
      }
      this.navCtrl.pop();
      this.backButtonFunc();
    }, 10)
  }

  handleNetworkAvaibility() {
    this.buildParamService.getBuildConfigParam("BASE_URL")
      .then(response => {
        this.baseUrl = response
      })
      .catch(() => {
      });

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
        this.commonUtilService.showToast('TRY_BEFORE_RATING');
      }
    } else {
      if (this.profileType == ProfileType.TEACHER) {
        this.commonUtilService.showToast('SIGNIN_TO_USE_FEATURE');
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
    this.preference.getString('selected_user_type')
      .then(val => {
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
        this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        this.navCtrl.pop();
      });
  }

  /**
   * Function to extract api response.
   */
  extractApiResponse(data) {
    this.contentDetail = data.result.contentData ? data.result.contentData : [];
    this.contentDetail.isAvailableLocally = data.result.isAvailableLocally;
    this.objId = this.contentDetail.identifier;
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
    }


    if (Boolean(data.result.isAvailableLocally)) {
      this.showLoading = false;
      if (data.result.isUpdateAvailable && !this.isUpdateAvailable) {
        this.isUpdateAvailable = true;
        this.showLoading = true;
        this.importContent([this.identifier], false);
      } else {
        this.isUpdateAvailable = false;
        this.setChildContents();
      }
    } else {
      this.showLoading = true;
      this.importContent([this.identifier], false);
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
    _.forEach(identifiers, (value) => {
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
          _.forEach(data.result, (value) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            if (this.isDownloadStarted) {
              this.showDownloadBtn = true;
              this.isDownloadStarted = false;
              this.showLoading = false;
            }
            this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
          }
        } else if (data.result && data.result[0].status === 'NOT_FOUND') {
          this.showLoading = false;
          this.showChildrenLoader = false;
          this.childrenData.length = 0;
        }
      })
    },
      error => {
        this.zone.run(() => {
          console.log('error while loading content details', error);
          if (this.isDownloadStarted) {
            this.showDownloadBtn = true;
            this.isDownloadStarted = false;
            this.showLoading = false;
          }
          this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
          this.showChildrenLoader = false;
        })
      });
  }

  /**
   * Function to set child contents
   */
  setChildContents() {
    let hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    const option = { contentId: this.identifier, hierarchyInfo: hierarchyInfo }; // TODO: remove level
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
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
    _.forEach(data, (value) => {
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
      _.forEach(data, (value) => {
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
    this.navBar.backButtonClick = () => {
      this.handleNavBackButton();
    }
    this.handleDeviceBackButton();
  }

  handleNavBackButton(){
    this.didViewLoad = false;
    this.generateEndEvent(this.objId, this.objType, this.objVer);
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
    }
    this.navCtrl.pop();
    this.backButtonFunc();
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

      //check for parent content
      this.parentContent = this.navParams.get('parentContent');

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
    let stateData = this.navParams.get('contentState');

    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        })
      } else if (content.mimeType === MimeType.COLLECTION) {
        this.isDepthChild = true;
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        })
      } else {
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

        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          if (res.data.downloadProgress === -1 || res.data.downloadProgress === '-1') {
            this.downloadProgress = 0;
          } else {
            this.downloadProgress = res.data.downloadProgress;
          }

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
          } else if (this.parentContent) {
            //this condition is for when the child content update is available and we have downloaded parent content
            // but we have to refresh only the child content.
            this.setContentDetails(this.identifier, false);
          } else {
            if (this.isUpdateAvailable) {
              this.setContentDetails(this.identifier, false);
            } else {
              this.updateSavedResources();
              this.setChildContents();
              this.contentDetail.isAvailableLocally = true;
            }
          }
        }

        //For content update available
        let hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;

        if (res.data && res.type === 'contentUpdateAvailable' && hierarchyInfo === null) {
          this.zone.run(() => {
            if (this.parentContent) {
              let parentIdentifier = this.parentContent.contentId || this.parentContent.identifier;
              this.showLoading = true;
              this.importContent([parentIdentifier], false);
            } else {
              this.setContentDetails(this.identifier, false);
            }
          });
        }
      });
    });
  }

  updateSavedResources() {
    this.events.publish('savedResources:update', {
      update: true
    });
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
      }, () => {
        loader.dismiss();
        this.commonUtilService.showToast('SHARE_CONTENT_FAILED');
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
      if (data === 'delete.success' || data === 'flag.success') {
        this.navCtrl.pop();
      }
    });
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.DETAIL, "",
      PageId.COLLECTION_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      this.objRollup,
      this.corRelationList);
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    let telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = objectId;
    telemetryObject.type = objectType;
    telemetryObject.version = objectVersion;
    this.telemetryGeneratorService.generateStartTelemetry(
      PageId.COLLECTION_DETAIL,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    let telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = objectId;
    telemetryObject.type = objectType;
    telemetryObject.version = objectVersion;
    this.telemetryGeneratorService.generateEndTelemetry(
      objectType,
      Mode.PLAY,
      PageId.COLLECTION_DETAIL,
      Environment.HOME,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateQRSessionEndEvent(pageId: string, qrData: string) {

    if (pageId !== undefined) {
      let telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      telemetryObject.version = "";
      this.telemetryGeneratorService.generateEndTelemetry(
        "qr",
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject,
        undefined,
        this.corRelationList);
    }
  }

  generateShareInteractEvents(interactType, subType, contentType) {
    let values = new Map();
    values["ContentType"] = contentType;
    this.telemetryGeneratorService.generateInteractTelemetry(interactType,
      subType,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      undefined,
      values,
      undefined,
      this.corRelationList);
  }

  showDownloadConfirmatioAlert(myEvent) {
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
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE')
    }
  }

  cancelDownload() {
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

}
