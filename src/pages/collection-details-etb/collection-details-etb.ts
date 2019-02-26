
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
  Platform,
  Navbar,
  PopoverController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as _ from 'lodash';

import {
  ContentService,
  FileUtil,
  PageId,
  Environment,
  Mode,
  ImpressionType,
  Rollup,
  InteractType,
  InteractSubtype,
  ShareUtil,
  BuildParamService,
  ProfileType,
  CorrelationData,
  TelemetryObject,
  ErrorCode,
  ErrorType
} from 'sunbird';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { ContentActionsComponent, ConfirmAlertComponent, ContentRatingAlertComponent } from '@app/component';
import {
  ContentType,
  MimeType,
  ShareUrl
} from '@app/app';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { AppGlobalService, CommonUtilService, TelemetryGeneratorService, CourseUtilService } from '@app/service';

/**
 * Generated class for the CollectionDetailsEtbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection-details-etb',
  templateUrl: 'collection-details-etb.html',
})
export class CollectionDetailsEtbPage {

  facets: any;
  selected: boolean;
  isSelected: boolean;

  contentDetail: any;
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
  showDownloadBtn = false;

  /**
   * Flag downlaoded started
   */
  isDownloadStarted = false;

  /**
   * Contains current course depth
   */
  depth = '1';

  /**
   * Its get true when child is collection.
   * Used to show content depth
   *
   * @example 1.1 Collection 1
   */
  isDepthChild = false;

  /**
   * To hold content identifiers
   */
  queuedIdentifiers: Array<any> = [];

  faultyIdentifiers: Array<any> = [];

  /**
   * Download complete falg
   */
  isDownloadCompleted = false;

  /**
   * Total download count
   */
  totalDownload: number;

  /**
   * Current download count
   */
  currentCount = 0;

  /**
   * Contains identifier(s) of locally not available content(s)
   */
  downloadIdentifiers = [];

  /**
   * Child content size
   */
  downloadSize = 0;

  /**
   * Contains total size of locally not available content(s)
   */
  downloadContentsSize: string;
  downloadPercentage: number;
  objId;
  objType;
  objVer;
  public showLoading = false;

  /**
   * Needed to handle collection auto update workflow
   */
  isUpdateAvailable = false;

  /**
   * To hold rating data
   */
  userRating = 0;
  isAlreadyEnrolled = false;
  /** sets true , if it comes from courses */
  fromCoursesPage = false;
  /**
   * Rating comment
   */
  ratingComment = '';
  // defaultIcon
  defaultAppIcon: string;
  /**
   * Telemetry roll up object
   */
  public objRollup: Rollup;
  public didViewLoad: boolean;
  public backButtonFunc = undefined;
  public baseUrl = '';
  guestUser = false;
  profileType = '';
  public corRelationList: Array<CorrelationData>;
  public shouldGenerateEndTelemetry = false;
  public source = '';
  isChildClickable = false;
  shownGroup = null;

  // Local Image
  localImage = '';

  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private contentService: ContentService,
    private zone: NgZone,
    private events: Events,
    private popoverCtrl: PopoverController,
    private fileUtil: FileUtil,
    private platform: Platform,
    private translate: TranslateService,
    private social: SocialSharing,
    private shareUtil: ShareUtil,
    private buildParamService: BuildParamService,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private courseUtilService: CourseUtilService
  ) {

    this.objRollup = new Rollup();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.getBaseURL();
    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.COLLECTION_DETAIL, Environment.HOME,
        true, this.cardData.identifier, this.corRelationList);
      this.handleBackButton();
    };
    this.registerDeviceBackButton();
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.zone.run(() => {
      this.resetVariables();
      this.cardData = this.navParams.get('content');
      this.corRelationList = this.navParams.get('corRelation');
      const depth = this.navParams.get('depth');
      this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
      this.source = this.navParams.get('source');
      this.fromCoursesPage = this.navParams.get('fromCoursesPage');
      this.isAlreadyEnrolled = this.navParams.get('isAlreadyEnrolled');
      this.isChildClickable = this.navParams.get('isChildClickable');
      this.facets = this.facets = this.navParams.get('facets');

      // check for parent content
      this.parentContent = this.navParams.get('parentContent');

      if (depth) {
        this.depth = depth;
        this.showDownloadBtn = false;
        this.isDepthChild = true;
      } else {
        this.isDepthChild = false;
      }

      this.identifier = this.cardData.contentId || this.cardData.identifier;

      if (!this.didViewLoad) {
        this.generateRollUp();
        const contentType = this.cardData.contentData ? this.cardData.contentData.contentType : this.cardData.contentType;
        this.objType = contentType;
        this.generateStartEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
        this.generateImpressionEvent(this.cardData.identifier, contentType, this.cardData.pkgVersion);
      }

      this.didViewLoad = true;
      this.setContentDetails(this.identifier, true);
      this.subscribeGenieEvent();
    });
  }
  // toggle the card
   toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }
  // to check whether the card is toggled or not
  isGroupShown(group) {
    return this.shownGroup === group;
  }
  changeValue(event, text) {
    console.log('EVENT Thrown', event);
    console.log('Tetx Inside ChnageValue', text);
    if (!text) {
      this.isSelected = false;
    } else {
      this.isSelected = true;
    }
  }

  handleBackButton() {
    this.didViewLoad = false;
    this.generateEndEvent(this.objId, this.objType, this.objVer);

    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
    }

    this.navCtrl.pop();
    this.backButtonFunc();
  }

  registerDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.COLLECTION_DETAIL, Environment.HOME,
        false, this.cardData.identifier, this.corRelationList);
      this.handleBackButton();
    }, 10);
  }

  getBaseURL() {
    this.buildParamService.getBuildConfigParam('BASE_URL')
      .then(response => {
        this.baseUrl = response;
      })
      .catch((error) => {
        console.error('Error Occurred=> ', error);
      });
  }

  /**
   * Function to rate content
   */
  rateContent() {
    if (!this.guestUser) {
      if (this.contentDetail.isAvailableLocally) {
        const popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
          content: this.contentDetail,
          rating: this.userRating,
          comment: this.ratingComment,
          pageId: PageId.COLLECTION_DETAIL,
        }, {
            cssClass: 'content-rating-alert'
          });
        popUp.present();
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
  /**
 * Get the session to know if the user is logged-in or guest
 *
 */

  checkLoggedInOrGuestUser() {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
  }

  checkCurrentUserType() {
    if (this.guestUser) {
      this.appGlobalService.getGuestUserInfo()
        .then((userType) => {
          this.profileType = userType;
        })
        .catch((error) => {
          console.error('Error Occurred', error);
          this.profileType = '';
        });
    }
  }

  /**
   * To set content details in local variable
   * @param {string} identifier identifier of content / course
   */
  setContentDetails(identifier, refreshContentDetails: boolean | true) {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    const option = {
      contentId: identifier,
      refreshContentDetails: refreshContentDetails,
      attachFeedback: true,
      attachContentAccess: true
    };
    this.contentService.getContentDetail(option)
      .then((data: any) => {
        this.zone.run(() => {
          data = JSON.parse(data);
          // console.log('Data', data);
          loader.dismiss().then(() => {
            if (data && data.result) {
              this.extractApiResponse(data);
            }
          });
        });
      })
      .catch((error: any) => {
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

    if (this.contentDetail.appIcon) {
      if (this.contentDetail.appIcon.includes('http:') || this.contentDetail.appIcon.includes('https:')) {
          if (this.commonUtilService.networkInfo.isNetworkAvailable) {
                  this.contentDetail.appIcon = this.contentDetail.appIcon;
            } else {
                  this.contentDetail.appIcon = this.defaultAppIcon;
            }
      } else if (data.result.basePath) {
        this.localImage = data.result.basePath + '/' + this.contentDetail.appIcon;
      }
    }
    this.objId = this.contentDetail.identifier;
    this.objVer = this.contentDetail.pkgVersion;
    if (this.contentDetail.gradeLevel && this.contentDetail.gradeLevel.length) {
      this.contentDetail.gradeLevel = this.contentDetail.gradeLevel.join(', ');
    }
    if (this.contentDetail.attributions && this.contentDetail.attributions.length) {
      this.contentDetail.attributions = this.contentDetail.attributions.join(', ');
    }
    if (this.contentDetail.me_totalRatings) {
      const rating = this.contentDetail.me_totalRatings.split('.');
      if (rating && rating[0]) {
        this.contentDetail.me_totalRatings = rating[0];
      }
    }

    // User Rating
    const contentFeedback: any = data.result.contentFeedback ? data.result.contentFeedback : [];
    if (contentFeedback !== undefined && contentFeedback.length !== 0) {
      this.userRating = contentFeedback[0].rating;
      this.ratingComment = contentFeedback[0].comments;
    }


    if (Boolean(data.result.isAvailableLocally)) {
      this.showLoading = false;
      if (data.result.isUpdateAvailable && !this.isUpdateAvailable) {
        this.isUpdateAvailable = true;
        this.showLoading = true;
        this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.contentDetail, false);
        this.importContent([this.identifier], false);
      } else {
        this.isUpdateAvailable = false;
        this.setChildContents();
      }
    } else {
      this.showLoading = true;
      this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.contentDetail, true);
      this.importContent([this.identifier], false);
    }

    if (this.contentDetail.me_totalDownloads) {
      this.contentDetail.me_totalDownloads = this.contentDetail.me_totalDownloads.split('.')[0];
    }
    this.setCollectionStructure();
  }

  generateRollUp() {
    const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    if (hierarchyInfo === null) {
      this.objRollup.l1 = this.identifier;
    } else {
      _.forEach(hierarchyInfo, (value, key) => {
        switch (key) {
          case 0: this.objRollup.l1 = value.identifier;
            break;
          case 1: this.objRollup.l2 = value.identifier;
            break;
          case 2: this.objRollup.l3 = value.identifier;
            break;
          case 3: this.objRollup.l4 = value.identifier;
            break;
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
  importContent(identifiers: Array<string>, isChild: boolean, isDownloadAllClicked?) {
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    };

    // Call content service
    this.contentService.importContent(option)
      .then((data: any) => {
        this.zone.run(() => {
          data = JSON.parse(data);

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
                PageId.COLLECTION_DETAIL,
                this.contentDetail,
                this.queuedIdentifiers,
                identifiers.length
              );
            }

            if (this.queuedIdentifiers.length === 0) {
              if (this.isDownloadStarted) {
                this.showDownloadBtn = true;
                this.isDownloadStarted = false;
                this.showLoading = false;
              }
            }
            if (this.faultyIdentifiers.length > 0) {
              const stackTrace: any = {};
              stackTrace.parentIdentifier = this.cardData.identifier;
              stackTrace.faultyIdentifiers = this.faultyIdentifiers;
              this.telemetryGeneratorService.generateErrorTelemetry(Environment.HOME,
                ErrorCode.ERR_DOWNLOAD_FAILED,
                ErrorType.SYSTEM,
                PageId.COLLECTION_DETAIL,
                JSON.stringify(stackTrace),
              );
              this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
            }
          } else if (data.result && data.result[0].status === 'NOT_FOUND') {
            this.showLoading = false;
            this.showChildrenLoader = false;
            this.childrenData.length = 0;
          }
        });
      })
      .catch((error: any) => {
        this.zone.run(() => {
          console.log('error while loading content details', error);
          // if (this.isDownloadStarted) {
          this.showDownloadBtn = true;
          this.isDownloadStarted = false;
          this.showLoading = false;
          if (Boolean(this.isUpdateAvailable)) {
          //  this.showChildrenLoader = true;
            this.setChildContents();
          } else {
            const errorRes = JSON.parse(error);
            if (errorRes && (errorRes.error === 'NETWORK_ERROR' || errorRes.error === 'CONNECTION_ERROR')) {
              this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
            } else {
              this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
            }
            this.showChildrenLoader = false;
            this.navCtrl.pop();
          }
        });
      });
  }

  /**
   * Function to set child contents
   */
  setChildContents() {
    const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    const option = { contentId: this.identifier, hierarchyInfo: hierarchyInfo }; // TODO: remove level
    this.contentService.getChildContents(option)
      .then((data: any) => {
        data = JSON.parse(data);
        this.zone.run(() => {
          if (data && data.result && data.result.children) {
          //  console.log('ChildrenData', this.childrenData);
            this.childrenData = data.result.children;
          }

          if (!this.isDepthChild) {
            this.downloadSize = 0;
            this.getContentsSize(data.result.children || []);
          }
          this.showChildrenLoader = false;
        });
      })
      .catch((error: string) => {
        console.log('Error: while fetching child contents ===>>>', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
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
    if (this.downloadIdentifiers.length && !this.isDownloadCompleted) {
      this.showDownloadBtn = true;
    }
  }

  /**
   * @param {array} data
   */
  showDownloadAllBtn(data) {
    let size = 0;
    this.zone.run(() => {
      _.forEach(data, (value) => {
        if (value.isAvailableLocally === false) {
          this.downloadIdentifiers.push(value.contentData.identifier);
          size += value.contentData.size;
        }
      });
      this.downloadContentsSize = this.getReadableFileSize(+size);
      if (this.downloadIdentifiers.length) {
        this.showDownloadBtn = true;
      }
    });
  }

  navigateToDetailsPage(content: any, depth) {
    const stateData = this.navParams.get('contentState');

    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        });
      } else if (content.mimeType === MimeType.COLLECTION) {
        this.isDepthChild = true;
        this.navCtrl.push(CollectionDetailsEtbPage, {
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        });
      } else {
        this.navCtrl.push(ContentDetailsPage, {
          isChildContent: true,
          content: content,
          depth: depth,
          contentState: stateData,
          corRelation: this.corRelationList
        });
      }
    });
  }
  navigateToContentPage(content: any, depth) {
    const stateData = this.navParams.get('contentState');
    this.navCtrl.push(ContentDetailsPage, {
      isChildContent: true,
      content: content,
      depth: depth,
      contentState: stateData,
      corRelation: this.corRelationList
    });
  }
  /**
   * Reset all values
   */
  resetVariables() {
    this.isDownloadStarted = false;
    this.showLoading = false;
    this.downloadProgress = 0;
    this.cardData = '';
    this.childrenData = [];
    this.contentDetail = '';
    this.showDownloadBtn = false;
    this.downloadIdentifiers = [];
    this.queuedIdentifiers = [];
    this.isDepthChild = this.isDepthChild;
    this.showDownloadBtn = false;
    this.isDownloadCompleted = false;
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
        const res = data;

        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          if (res.data.downloadProgress === -1 || res.data.downloadProgress === '-1') {
            this.downloadProgress = 0;
          } else if (res.data.identifier === this.contentDetail.identifier) {
            this.downloadProgress = res.data.downloadProgress;
          }

          if (this.downloadProgress === 100) {
            this.showLoading = false;
            this.contentDetail.isAvailableLocally = true;
          }
        }
        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {

          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
              this.currentCount++;
              this.downloadPercentage = +((this.currentCount / this.queuedIdentifiers.length) * (100)).toFixed(0);
            }
            if (this.queuedIdentifiers.length === this.currentCount) {
              this.showLoading = false;
              this.isDownloadStarted = false;
              this.showDownloadBtn = false;
              this.isDownloadCompleted = true;
              this.contentDetail.isAvailableLocally = true;
              this.downloadPercentage = 0;
              this.updateSavedResources();
              this.setChildContents();
            }
          } else if (this.parentContent && res.data.identifier === this.contentDetail.identifier) {
            // this condition is for when the child content update is available and we have downloaded parent content
            // but we have to refresh only the child content.
            this.showLoading = false;
            this.setContentDetails(this.identifier, false);
          } else {
            if (this.isUpdateAvailable && res.data.identifier === this.contentDetail.identifier) {
              this.showLoading = false;
              this.setContentDetails(this.identifier, false);
            } else {
              if (res.data.identifier === this.contentDetail.identifier) {
                this.showLoading = false;
                this.updateSavedResources();
                this.setChildContents();
                this.contentDetail.isAvailableLocally = true;
              }

            }
          }
        }

        // For content update available
        const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;

        if (res.data && res.type === 'contentUpdateAvailable' && hierarchyInfo === null) {
          this.zone.run(() => {
            if (this.parentContent) {
              const parentIdentifier = this.parentContent.contentId || this.parentContent.identifier;
              this.showLoading = true;
              this.telemetryGeneratorService.generateSpineLoadingTelemetry(this.contentDetail, false);
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
    const loader = this.commonUtilService.getLoader();
    loader.present();
    const url = this.baseUrl + ShareUrl.COLLECTION + this.contentDetail.identifier;
    if (this.contentDetail.isAvailableLocally) {
      this.shareUtil.exportEcar(this.contentDetail.identifier, path => {
        loader.dismiss();
        this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.contentDetail.contentType);
        this.social.share('', '', 'file://' + path, url);
      }, () => {
        loader.dismiss();
        this.commonUtilService.showToast('SHARE_CONTENT_FAILED');
      });
    } else {
      loader.dismiss();
      this.generateShareInteractEvents(InteractType.OTHER, InteractSubtype.SHARE_LIBRARY_SUCCESS, this.contentDetail.contentType);
      this.social.share('', '', '', url);
    }
  }

  /**
   * Download single content
   */
  downloadAllContent(): void {
    this.downloadProgress = 0;
    this.showLoading = true;
    this.isDownloadStarted = true;
    this.downloadPercentage = 0;
    this.importContent(this.downloadIdentifiers, true, true);
  }

  /**
   * To get readable file size
   * @param {number} size
   */
  getReadableFileSize(size): string {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(size, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
  }

  showOverflowMenu(event) {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.KEBAB_MENU_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      undefined,
      undefined,
      this.objRollup,
      this.corRelationList);

    const popover = this.popoverCtrl.create(ContentActionsComponent, {
      content: this.contentDetail,
      isChild: this.isDepthChild,
      objRollup: this.objRollup,
      pageName: PageId.COLLECTION_DETAIL,
      corRelationList: this.corRelationList
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
      ImpressionType.DETAIL, '',
      PageId.COLLECTION_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      this.objRollup,
      this.corRelationList);
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = { id: objectId, type: objectType, version: objectVersion, rollup: undefined };
    this.telemetryGeneratorService.generateStartTelemetry(
      PageId.COLLECTION_DETAIL,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    const telemetryObject: TelemetryObject = { id: objectId, type: objectType, version: objectVersion, rollup: undefined };
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
      const telemetryObject: TelemetryObject = { id: qrData, type: 'qr', version: '', rollup: undefined };
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

  generateShareInteractEvents(interactType, subType, contentType) {
    const values = new Map();
    values['ContentType'] = contentType;
    this.telemetryGeneratorService.generateInteractTelemetry(interactType,
      subType,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      undefined,
      values,
      undefined,
      this.corRelationList);
  }

  showDownloadConfirmationAlert(myEvent) {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      const popover = this.popoverCtrl.create(ConfirmAlertComponent, {}, {
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
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }

  cancelDownload() {
    this.telemetryGeneratorService.generateCancelDownloadTelemetry(this.contentDetail);
    this.contentService.cancelDownload(this.identifier).then(() => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    }).catch(() => {
      this.zone.run(() => {
        this.showLoading = false;
        this.navCtrl.pop();
      });
    });
  }

  /**
   * Function to View Credits
   */
  viewCredits() {
    this.courseUtilService.showCredits(this.contentDetail, PageId.COLLECTION_DETAIL, this.objRollup, this.corRelationList);
  }

  /**
   * method generates telemetry on click Read less or Read more
   * @param {string} param string as read less or read more
   * @param {object} objRollup object roll up
   * @param corRelationList correlation List
   */
  readLessorReadMore(param, objRollup, corRelationList) {
    const telemetryObject: TelemetryObject = { id: this.objId, type: this.objType, version: this.objVer, rollup: undefined };
    this.telemetryGeneratorService.readLessOrReadMore(param, objRollup, corRelationList, telemetryObject);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    // this.downloadProgress = '';
    this.downloadProgress = 0;
    this.events.unsubscribe('genie.event');
  }

}
