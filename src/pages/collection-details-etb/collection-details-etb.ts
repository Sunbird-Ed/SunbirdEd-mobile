import { TextBookTocPage } from './textbook-toc/textbook-toc';
import { ActiveDownloadsPage } from './../active-downloads/active-downloads';
import {Component, Inject, NgZone, ViewChild, OnInit, ElementRef, ViewChildren, QueryList, ChangeDetectorRef} from '@angular/core';
import { Content as iContent, ScrollEvent } from 'ionic-angular';
import { Events, IonicPage, Navbar, NavController, NavParams, Platform, PopoverController, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as _ from 'lodash';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import {
  ConfirmAlertComponent, ContentActionsComponent, ContentRatingAlertComponent, SbPopoverComponent
} from '@app/component';
import { ContentType, MimeType, ShareUrl } from '@app/app';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import {
  AppGlobalService, AppHeaderService, CommonUtilService, CourseUtilService, TelemetryGeneratorService, UtilityService
} from '@app/service';
import {
  Content, ContentAccess, ContentAccessStatus, ContentDeleteStatus, ContentDetailRequest, ContentEventType,
  ContentExportRequest, ContentExportResponse, ContentImport, ContentImportCompleted, ContentImportRequest,
  ContentImportResponse, ContentImportStatus, ContentMarkerRequest, ContentService, ContentUpdate, CorrelationData,
  DownloadEventType, DownloadProgress, EventsBusEvent, EventsBusService, MarkerType, Profile, ProfileService,
  ProfileType, Rollup, StorageService, TelemetryErrorCode, TelemetryObject, ContentImportProgress
} from 'sunbird-sdk';
import { Subscription } from 'rxjs';
import {
  Environment, ErrorType, ImpressionType, InteractSubtype, InteractType, Mode, PageId
} from '../../service/telemetry-constants';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { ComingSoonMessageService } from '@app/service/coming-soon-message.service';
import { ContentShareHandler } from '@app/service/content/content-share-handler';
import { TextbookTocService } from './textbook-toc-service';

/**
 * Generated class for the CollectionDetailsEtbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare const cordova;

@IonicPage()
@Component({
  selector: 'page-collection-details-etb',
  templateUrl: 'collection-details-etb.html',
})
export class CollectionDetailsEtbPage implements OnInit {

  @ViewChildren('filteredItems') public filteredItemsQueryList: QueryList<any>;

  facets: any;
  selected: boolean;
  isSelected: boolean;
  headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: []
  };

  contentDetail?: Content;
  childrenData?: Array<any>;
  mimeTypes = [
    { name: 'ALL', selected: true, value: ['all'], iconNormal: '', iconActive: ''},
    { name: 'VIDEOS', value: ['video/mp4', 'video/x-youtube', 'video/webm'], iconNormal: './assets/imgs/play.svg',
    iconActive: './assets/imgs/play-active.svg'},
    { name: 'DOCS', value: ['application/pdf', 'application/epub', 'application/msword'], iconNormal: './assets/imgs/doc.svg',
    iconActive: './assets/imgs/doc-active.svg'},
    { name: 'INTERACTION',
      value: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.h5p-archive', 'application/vnd.ekstep.html-archive'],
      iconNormal: './assets/imgs/touch.svg', iconActive: './assets/imgs/touch-active.svg'
    },
    // { name: 'AUDIOS', value: MimeType.AUDIO, iconNormal: './assets/imgs/audio.svg', iconActive: './assets/imgs/audio-active.svg'},
  ];
  activeMimeTypeFilter = ['all'];
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

  localResourseCount: number;
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
  content: any;
  data: any;
  isChild = false;
  contentId: string;
  batchDetails: any;
  pageName: any;
  headerObservable: any;
  breadCrumb = new Map();
  scrollPosition = 0;
  currentFilter: string = 'ALL';
  // Local Image
  localImage = '';
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild(iContent) ionContent: iContent;
  @ViewChild('stickyPillsRef') stickyPillsRef: ElementRef;
  private eventSubscription: Subscription;

  showDownload: boolean;
  networkSubscription: any;
  toast: any;
  contentTypesCount: any;
  stckyUnitTitle?: string;
  isChapterVisible = false;
  importProgressMessage: string;

  constructor(
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('EVENTS_BUS_SERVICE') private eventBusService: EventsBusService,
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private events: Events,
    private popoverCtrl: PopoverController,
    private platform: Platform,
    private translate: TranslateService,
    private social: SocialSharing,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private courseUtilService: CourseUtilService,
    private utilityService: UtilityService,
    public viewCtrl: ViewController,
    private toastController: ToastController,
    private fileSizePipe: FileSizePipe,
    private headerService: AppHeaderService,
    private comingSoonMessageService: ComingSoonMessageService,
    private contentShareHandler: ContentShareHandler,
    private changeDetectionRef: ChangeDetectorRef,
    private textbookTocService: TextbookTocService
  ) {
    this.objRollup = new Rollup();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
    this.content = this.navParams.get('content');
    this.data = this.navParams.get('data');
    this.batchDetails = this.navParams.get('batchDetails');
    this.pageName = this.navParams.get('pageName');
  }

  /**
	 * Angular life cycle hooks
	 */
  ngOnInit() {
  }

  ionViewDidLoad() {
    window['scrollWindow'] = this.ionContent;
    this.registerDeviceBackButton();
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter() {
    this.zone.run(() => {
      this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
        this.handleHeaderEvents(eventName);
      });
      this.headerConfig = this.headerService.getDefaultPageConfig();
      this.headerConfig.actionButtons = ['download'];
      this.headerConfig.showHeader = false;
      this.headerConfig.showBurgerMenu = false;
      this.headerService.updatePageConfig(this.headerConfig);
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
      this.shownGroup = null;

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
        this.markContent();
      }

      this.didViewLoad = true;
      this.setContentDetails(this.identifier, true);
      this.subscribeSdkEvent();
      this.networkSubscription = this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
        if (available) {
          if (this.toast) {
            this.toast.dismiss();
            this.toast = undefined;
          }
        } else {
          this.presentToastWithOptions();
        }
      });
    });
    this.ionContent.ionScroll.subscribe((event) => {
      this.scrollPosition = event.scrollTop;
    });
    this.registerDeviceBackButton();
  }

  async markContent() {
    const addContentAccessRequest: ContentAccess = {
      status: ContentAccessStatus.PLAYED,
      contentId: this.identifier,
      contentType: this.content.contentType
    };
    const profile: Profile = await this.appGlobalService.getCurrentUser();
    this.profileService.addContentAccess(addContentAccessRequest).toPromise().then();
    const contentMarkerRequest: ContentMarkerRequest = {
      uid: profile.uid,
      contentId: this.identifier,
      data: JSON.stringify(this.content.contentData),
      marker: MarkerType.PREVIEWED,
      isMarked: true,
      extraInfo: {}
    };
    this.contentService.setContentMarker(contentMarkerRequest).toPromise().then();
  }

  async presentToastWithOptions() {
    this.toast = await this.toastController.create({
      message: this.commonUtilService.translateMessage('NO_INTERNET_TITLE'),
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: '',
      cssClass: 'toastAfterHeader'
    });
    this.toast.present();
    this.toast.onDidDismiss(() => {
      this.toast = undefined;
    });
  }

  // toggle the card
  toggleGroup(group, content) {
    let isCollapsed = true;
    if (this.isGroupShown(group)) {
      isCollapsed = false;
      this.shownGroup = null;
    } else {
      isCollapsed = false;
      this.shownGroup = group;
    }
    const values = new Map();
    values['isCollapsed'] = isCollapsed;
    const telemetryObject = new TelemetryObject(content.identifier, ContentType.TEXTBOOK_UNIT, content.pkgVersion);
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.UNIT_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      telemetryObject,
      values,
      undefined,
      this.corRelationList
    );
  }

  // to check whether the card is toggled or not
  isGroupShown(group) {
    return this.shownGroup === group;
  }

  changeValue(event, text) {
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
        .catch(() => {
          this.profileType = '';
        });
    }
  }

  /**
   * To set content details in local variable
   * @param {string} identifier identifier of content / course
   */
  setContentDetails(identifier, refreshContentDetails: boolean) {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    const option: ContentDetailRequest = {
      contentId: identifier,
      attachFeedback: true,
      attachContentAccess: true,
      emitUpdateIfAny: refreshContentDetails
    };
    this.contentService.getContentDetails(option).toPromise()
      .then((data: Content) => {
        this.zone.run(() => {
          loader.dismiss().then(() => {
            if (data) {
              this.extractApiResponse(data);
            }
          });
        });
      })
      .catch(() => {
        loader.dismiss();
        this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        this.navCtrl.pop();
      });
  }

  async showCommingSoonPopup(childData: any) {
    const message = await this.comingSoonMessageService.getComingSoonMessage(childData);
    if (childData.contentData.mimeType === MimeType.COLLECTION && !childData.children) {
      const popover = this.popoverCtrl.create(SbGenericPopoverComponent, {
        sbPopoverHeading: this.commonUtilService.translateMessage('CONTENT_COMMING_SOON'),
        sbPopoverMainTitle: message ? this.commonUtilService.translateMessage(message) :
          this.commonUtilService.translateMessage('CONTENT_IS_BEEING_ADDED') + childData.contentData.name,
        actionsButtons: [
          {
            btntext: this.commonUtilService.translateMessage('OKAY'),
            btnClass: 'popover-color'
          }
        ],
      }, {
          cssClass: 'sb-popover warning',
        });
      popover.present({
        ev: event
      });
    }
  }

  /**
   * Function to extract api response.
   */
  extractApiResponse(data: Content) {
    this.contentDetail = data;
    this.contentDetail.isAvailableLocally = data.isAvailableLocally;

    if (this.contentDetail.contentData.appIcon) {
      if (this.contentDetail.contentData.appIcon.includes('http:') || this.contentDetail.contentData.appIcon.includes('https:')) {
        if (this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.contentDetail.contentData.appIcon = this.contentDetail.contentData.appIcon;
        } else {
          this.contentDetail.contentData.appIcon = this.defaultAppIcon;
        }
      } else if (data.basePath) {
        this.localImage = data.basePath + '/' + this.contentDetail.contentData.appIcon;
      }
    }
    this.objId = this.contentDetail.identifier;
    this.objVer = this.contentDetail.contentData.pkgVersion;
    if (this.contentDetail.contentData.gradeLevel && this.contentDetail.contentData.gradeLevel.length) {
      this.contentDetail.contentData.gradeLevel ? this.contentDetail.contentData.gradeLevel.join(', ') : '';
    }
    if (this.contentDetail.contentData.attributions && this.contentDetail.contentData.attributions.length) {
      this.contentDetail.contentData.attributions ? this.contentDetail.contentData.attributions.join(', ') : '';
    }
    if (this.contentDetail.contentData.me_totalRatings) {
      const rating = this.contentDetail.contentData.me_totalRatings.split('.');
      if (rating && rating[0]) {
        this.contentDetail.contentData.me_totalRatings = rating[0];
      }
    }

    // User Rating
    const contentFeedback: any = data.contentFeedback ? data.contentFeedback : [];
    if (contentFeedback !== undefined && contentFeedback.length !== 0) {
      this.userRating = contentFeedback[0].rating;
      this.ratingComment = contentFeedback[0].comments;
    }


    if (Boolean(data.isAvailableLocally)) {
      this.showLoading = false;
      this.refreshHeader();
      if (data.isUpdateAvailable && !this.isUpdateAvailable) {
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

    if (this.contentDetail.contentData.me_totalDownloads) {
      this.contentDetail.contentData.me_totalDownloads = this.contentDetail.contentData.me_totalDownloads.split('.')[0];
    }
    this.setCollectionStructure();
  }

  setCollectionStructure() {
    this.showChildrenLoader = true;
    if (this.contentDetail.contentData.contentTypesCount) {
      if (!_.isObject(this.contentDetail.contentData.contentTypesCount)) {
        this.contentTypesCount = JSON.parse(this.contentDetail.contentData.contentTypesCount);
      } else {
        this.contentTypesCount = this.contentDetail.contentData.contentTypesCount;
      }
      // this.contentDetail.contentData.contentTypesCount = JSON.parse(this.contentDetail.contentData.contentTypesCount);
    } else if (this.cardData.contentTypesCount) {
      if (!_.isObject(this.cardData.contentTypesCount)) {
        this.contentTypesCount = JSON.parse(this.cardData.contentTypesCount);
        // this.contentDetail.contentData.contentTypesCount = JSON.parse(this.cardData.contentTypesCount);
      }
    } /*else {
      this.contentDetail.contentTypesCount;
    }*/
  }

  generateRollUp() {
    const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    if (hierarchyInfo === null) {
      this.objRollup.l1 = this.identifier;
    } else {
      _.forEach(hierarchyInfo, (value, key) => {
        switch (key) {
          case 0:
            this.objRollup.l1 = value.identifier;
            break;
          case 1:
            this.objRollup.l2 = value.identifier;
            break;
          case 2:
            this.objRollup.l3 = value.identifier;
            break;
          case 3:
            this.objRollup.l4 = value.identifier;
            break;
        }
      });
    }
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers: Array<string>, isChild: boolean): Array<ContentImport> {
    const requestParams: ContentImport[] = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        destinationFolder: this.storageService.getStorageDestinationDirectoryPath(),
        contentId: value,
        correlationData: this.corRelationList ? this.corRelationList : []
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
    if (this.showLoading && !this.isDownloadStarted) {
      this.headerService.hideHeader();
    }
    const option: ContentImportRequest = {
      contentImportArray: this.getImportContentRequestBody(identifiers, isChild),
      contentStatusArray: ['Live'],
      fields: ['appIcon', 'name', 'subject', 'size', 'gradeLevel'],
    };
    // Call content service
    this.contentService.importContent(option).toPromise()
      .then((data: ContentImportResponse[]) => {
        this.zone.run(() => {
          if (data && data.length && this.isDownloadStarted) {
            _.forEach(data, (value) => {
              if (value.status === ContentImportStatus.ENQUEUED_FOR_DOWNLOAD) {
                this.queuedIdentifiers.push(value.identifier);
              } else if (value.status === ContentImportStatus.NOT_FOUND) {
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
                this.refreshHeader();
              }
            }
            if (this.faultyIdentifiers.length > 0) {
              const stackTrace: any = {};
              stackTrace.parentIdentifier = this.cardData.identifier;
              stackTrace.faultyIdentifiers = this.faultyIdentifiers;
              this.telemetryGeneratorService.generateErrorTelemetry(Environment.HOME,
                TelemetryErrorCode.ERR_DOWNLOAD_FAILED,
                ErrorType.SYSTEM,
                PageId.COLLECTION_DETAIL,
                JSON.stringify(stackTrace),
              );
              this.commonUtilService.showToast('UNABLE_TO_FETCH_CONTENT');
            }
          } else if (data && data[0].status === ContentImportStatus.NOT_FOUND) {
            this.showLoading = false;
            this.refreshHeader();
            this.showChildrenLoader = false;
            this.childrenData.length = 0;
          }
        });
      })
      .catch((error: any) => {
        this.zone.run(() => {
          // if (this.isDownloadStarted) {
          this.showDownloadBtn = true;
          this.isDownloadStarted = false;
          this.showLoading = false;
          this.refreshHeader();
          if (Boolean(this.isUpdateAvailable)) {
            //  this.showChildrenLoader = true;
            this.setChildContents();
          } else {
            if (error && (error.error === 'NETWORK_ERROR' || error.error === 'CONNECTION_ERROR')) {
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
    this.showChildrenLoader = true;
    const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
    const option = { contentId: this.identifier, hierarchyInfo: hierarchyInfo }; // TODO: remove level
    this.contentService.getChildContents(option).toPromise()
      .then((data: Content) => {
        this.zone.run(() => {
          if (data && data.children) {
            this.breadCrumb.set(data.identifier, data.contentData.name);
            if (this.textbookTocService.textbookIds.rootUnitId && this.activeMimeTypeFilter !== ['all']) {
              this.onFilterMimeTypeChange(this.mimeTypes[0].value, 0, this.mimeTypes[0].name);
            }
            this.childrenData = data.children;
            this.changeDetectionRef.detectChanges();
          }

          if (!this.isDepthChild) {
            this.downloadSize = 0;
            this.localResourseCount = 0;
            this.getContentsSize(data.children || []);
          }
          this.showChildrenLoader = false;
          const divElement = this.filteredItemsQueryList.find((f) => f.nativeElement.id);
          let carouselIndex = this.childrenData
            .findIndex((d: Content) => {
                return divElement.nativeElement.id === d.identifier;
            });

          if (this.textbookTocService.textbookIds.rootUnitId) {
            carouselIndex = this.childrenData.findIndex((content) => this.textbookTocService.textbookIds.rootUnitId === content.identifier);
            // carouselIndex = carouselIndex > 0 ? carouselIndex : 0;
          }
          this.toggleGroup(carouselIndex, this.content);
          if (this.textbookTocService.textbookIds.contentId) {
            setTimeout(() => {
              (this.stickyPillsRef.nativeElement as HTMLDivElement).classList.add('sticky');
              window['scrollWindow'].getScrollElement()
              .scrollBy(0, document.getElementById(this.textbookTocService.textbookIds.contentId).offsetTop - 165);
              this.textbookTocService.resetTextbookIds();
            }, 0);
          }
          this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.IMPORT_COMPLETED,
            Environment.HOME,
            PageId.COLLECTION_DETAIL
          );
        });
      })
      .catch(() => {
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      });
    // this.ionContent.scrollTo(0, this.scrollPosition);
  }

  getContentsSize(data) {
    _.forEach(data, (value) => {
      this.breadCrumb.set(value.identifier, value.contentData.name);
      if (value.contentData.size) {
        this.downloadSize += Number(value.contentData.size);
      }
      if (!value.children) {
        if (value.isAvailableLocally) {
          this.localResourseCount++;
        }
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
          corRelation: this.corRelationList,
          breadCrumb: this.breadCrumb
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
      corRelation: this.corRelationList,
      breadCrumb: this.breadCrumb
    });
  }

  /**
   * Reset all values
   */
  resetVariables() {
    this.isDownloadStarted = false;
    this.showLoading = false;
    this.refreshHeader();
    this.downloadProgress = 0;
    this.cardData = '';
    this.childrenData;
    this.contentDetail = undefined;
    this.showDownload = false;
    this.showDownloadBtn = false;
    this.downloadIdentifiers = [];
    this.queuedIdentifiers = [];
    this.showDownloadBtn = false;
    this.isDownloadCompleted = false;
    this.currentCount = 0;
    this.downloadPercentage = 0;
    this.isUpdateAvailable = false;
  }

  /**
   * Subscribe Sunbird-SDK event to get content download progress
   */
  subscribeSdkEvent() {
    this.eventSubscription = this.eventBusService.events().subscribe((event: EventsBusEvent) => {
      this.zone.run(() => {
        if (event.type === DownloadEventType.PROGRESS) {
          const downloadEvent = event as DownloadProgress;

          if (downloadEvent.payload.identifier === this.contentDetail.identifier) {
            this.downloadProgress = downloadEvent.payload.progress === -1 ? 0 : downloadEvent.payload.progress;
            if (this.downloadProgress === 100) {
              this.showLoading = false;
              this.refreshHeader();
              this.contentDetail.isAvailableLocally = true;
            }
          }
        }

        // Get child content
        if (event.type === ContentEventType.IMPORT_COMPLETED) {
          const contentImportedEvent = event as ContentImportCompleted;

          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, contentImportedEvent.payload.contentId)) {
              this.currentCount++;
              this.downloadPercentage = +((this.currentCount / this.queuedIdentifiers.length) * (100)).toFixed(0);
            }
            if (this.queuedIdentifiers.length === this.currentCount) {
              this.showLoading = false;
              this.refreshHeader();
              this.isDownloadStarted = false;
              this.showDownloadBtn = false;
              this.isDownloadCompleted = true;
              this.showDownload = false;
              this.contentDetail.isAvailableLocally = true;
              this.downloadPercentage = 0;
              this.updateSavedResources();
              this.setChildContents();
            }
          } else if (this.parentContent && contentImportedEvent.payload.contentId === this.contentDetail.identifier) {
            // this condition is for when the child content update is available and we have downloaded parent content
            // but we have to refresh only the child content.
            this.showLoading = false;
            this.refreshHeader();
            this.setContentDetails(this.identifier, false);
          } else {
            if (this.isUpdateAvailable && contentImportedEvent.payload.contentId === this.contentDetail.identifier) {
              this.showLoading = false;
              this.refreshHeader();
              this.setContentDetails(this.identifier, false);
            } else {
              if (contentImportedEvent.payload.contentId === this.contentDetail.identifier) {
                this.showLoading = false;
                this.refreshHeader();
                this.updateSavedResources();
                this.setChildContents();
                this.contentDetail.isAvailableLocally = true;
              }

            }
          }
        }

        if (event.type === ContentEventType.IMPORT_PROGRESS) {
          this.importProgressMessage =  this.commonUtilService.translateMessage('EXTRACTING_CONTENT') + ' ' +
            Math.floor((event.payload.currentCount / event.payload.totalCount) * 100) +
            '% (' + event.payload.currentCount + ' / ' + event.payload.totalCount + ')';
            if (event.payload.currentCount === event.payload.totalCount) {
              let timer = 30;
              const interval = setInterval(() => {
                this.importProgressMessage = `Getting things ready in ${timer--}  seconds`;
                if (timer === 0) {
                  this.importProgressMessage = 'Getting things ready';
                  clearInterval(interval);
                }
              }, 1000);
            }
        }

        // For content update available
        const hierarchyInfo = this.cardData.hierarchyInfo ? this.cardData.hierarchyInfo : null;
        const contentUpdateEvent = event as ContentUpdate;
        if (contentUpdateEvent.type === ContentEventType.UPDATE && hierarchyInfo === null) {
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
    }) as any;
  }

  updateSavedResources() {
    this.events.publish('savedResources:update', {
      update: true
    });
  }

  share() {
    this.contentShareHandler.shareContent(this.contentDetail, this.corRelationList, this.objRollup);
  }

  /**
   * Download single content
   */
  downloadAllContent(): void {
    this.downloadProgress = 0;
    this.showLoading = true;
    this.isDownloadStarted = true;
    this.downloadPercentage = 0;
    this.showDownload = true;
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
    const telemetryObject = new TelemetryObject(objectId, objectType, objectVersion);
    this.telemetryGeneratorService.generateStartTelemetry(
      PageId.COLLECTION_DETAIL,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    const telemetryObject = new TelemetryObject(objectId, objectType, objectVersion);
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
      const telemetryObject = new TelemetryObject(qrData, 'qr', '');
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

  showDownloadConfirmationAlert(myEvent) {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      let contentTypeCount;
      if (this.downloadIdentifiers.length) {
        contentTypeCount = this.downloadIdentifiers.length;
      } else {
        contentTypeCount = '';
      }

      const popover = this.popoverCtrl.create(ConfirmAlertComponent, {
        sbPopoverHeading: this.commonUtilService.translateMessage('DOWNLOAD'),
        sbPopoverMainTitle: this.contentDetail.contentData.name,
        actionsButtons: [
          {
            btntext: this.commonUtilService.translateMessage('DOWNLOAD'),
            btnClass: 'popover-color'
          },
        ],
        icon: null,
        metaInfo: this.commonUtilService.translateMessage('ITEMS', contentTypeCount)
          + ' (' + this.fileSizePipe.transform(this.downloadSize, 2) + ')',
      }, {
          cssClass: 'sb-popover info',
        });
      popover.present({
        ev: event
      });
      popover.onDidDismiss((canDownload: boolean = false) => {
        if (canDownload) {
          this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
            'download-all-button-clicked',
            Environment.HOME,
            PageId.COLLECTION_DETAIL,
            undefined,
            undefined,
            this.objRollup,
            this.corRelationList);
          this.downloadAllContent();
          this.events.publish('header:decreasezIndex');
        } else {
          // Cancel Clicked Telemetry
          this.generateCancelDownloadTelemetry(this.contentDetail);
        }
      });
    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }

  cancelDownload() {
    this.telemetryGeneratorService.generateCancelDownloadTelemetry(this.contentDetail);
    this.contentService.cancelDownload(this.identifier).toPromise()
      .then(() => {
        this.zone.run(() => {
          this.showLoading = false;
          this.refreshHeader();
          this.navCtrl.pop();
        });
      }).catch(() => {
        this.zone.run(() => {
          this.showLoading = false;
          this.refreshHeader();
          this.navCtrl.pop();
        });
      });
  }
  generateCancelDownloadTelemetry(content: any) {
    const values = new Map();
    const telemetryObject = new TelemetryObject(content.identifier || content.contentId, content.contentType, content.pkgVersion);
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.CLOSE_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      telemetryObject,
      values);
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
    const telemetryObject = new TelemetryObject(this.objId, this.objType, this.objVer);
    this.telemetryGeneratorService.readLessOrReadMore(param, objRollup, corRelationList, telemetryObject);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave() {
    this.downloadProgress = 0;
    this.headerObservable.unsubscribe();
    this.events.publish('header:setzIndexToNormal');
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
      if (this.toast) {
        this.toast.dismiss();
        this.toast = undefined;
      }
    }
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }

  }
  showPopOver() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      'delete-from-device-button-clicked',
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      undefined,
      undefined,
      this.objRollup,
      this.corRelationList);
    let contentTypeCount;
    let metaInfo: string;

    if (this.localResourseCount) {
      contentTypeCount = this.localResourseCount + '';
      metaInfo = this.commonUtilService.translateMessage('ITEMS', contentTypeCount) +
        ' (' + this.fileSizePipe.transform(this.contentDetail.sizeOnDevice, 2) + ')';
    } else {
      metaInfo = this.fileSizePipe.transform(this.contentDetail.sizeOnDevice, 2);
    }

    const confirm = this.popoverCtrl.create(SbPopoverComponent, {
      content: this.contentDetail,
      isChild: this.isDepthChild,
      objRollup: this.objRollup,
      pageName: PageId.COLLECTION_DETAIL,
      corRelationList: this.corRelationList,
      sbPopoverHeading: this.commonUtilService.translateMessage('DELETE'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_DELETE'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('REMOVE'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      sbPopoverContent: metaInfo,
      metaInfo: this.contentDetail.contentData.name
    }, {
        cssClass: 'sb-popover danger',
      });
    confirm.present({
      ev: event
    });
    confirm.onDidDismiss((canDelete: any) => {
      if (canDelete) {
        this.deleteContent();
      }
    });
  }

  /**
 * Construct content delete request body
 */
  getDeleteRequestBody() {
    const apiParams = {
      contentDeleteList: [{
        contentId: (this.contentDetail && this.contentDetail.identifier) ? this.contentDetail.identifier : '',
        isChildContent: this.isChild
      }]
    };
    return apiParams;
  }

  deleteContent() {
    const telemetryObject: TelemetryObject = new TelemetryObject(
      this.contentDetail.identifier,
      this.contentDetail.contentType,
      this.contentDetail.contentData.pkgVersion);
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      telemetryObject,
      undefined,
      this.objRollup,
      this.corRelationList);
    const tmp = this.getDeleteRequestBody();
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.contentService.deleteContent(tmp).toPromise().then((res: any) => {
      loader.dismiss();
      if (res && res.status === ContentDeleteStatus.NOT_FOUND) {
        this.commonUtilService.showToast('CONTENT_DELETE_FAILED');
      } else {
        // Publish saved resources update event
        this.events.publish('savedResources:update', {
          update: true
        });
        this.commonUtilService.showToast('MSG_RESOURCE_DELETED');
        this.viewCtrl.dismiss('delete.success');
      }
    }).catch(() => {
      loader.dismiss();
      this.commonUtilService.showToast('CONTENT_DELETE_FAILED');
      this.viewCtrl.dismiss();
    });
  }

  refreshHeader() {
    this.headerConfig = this.headerService.getDefaultPageConfig();
    this.headerConfig.actionButtons = ['download'];
    this.headerConfig.showBurgerMenu = false;
    this.headerConfig.showHeader = true;
    this.headerService.updatePageConfig(this.headerConfig);
    this.events.publish('header:setzIndexToNormal');
  }
  handleHeaderEvents($event) {
    switch ($event.name) {
      case 'back': this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.COLLECTION_DETAIL, Environment.HOME,
        true, this.cardData.identifier, this.corRelationList);
        this.handleBackButton();
        break;
      case 'download': this.redirectToActivedownloads();
        break;

    }
  }

  private redirectToActivedownloads() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.ACTIVE_DOWNLOADS_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL);
    this.navCtrl.push(ActiveDownloadsPage);
  }

  async onFilterMimeTypeChange(val, idx, currentFilter?) {
    const values = new Map();
    values['filter'] = currentFilter;
    this.activeMimeTypeFilter = val;
    this.currentFilter = this.commonUtilService.translateMessage(currentFilter);
    this.mimeTypes.forEach((type) => {
      type.selected = false;
    });
    this.mimeTypes[idx].selected = true;
    this.filteredItemsQueryList.changes
      .do((v) => {
        this.changeDetectionRef.detectChanges();
        values['contentLength'] = v.length;
      })
      .subscribe();
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.FILTER_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      undefined,
      values);
  }

  openTextbookToc() {
    this.shownGroup = null;
    this.navCtrl.push(TextBookTocPage, {
      childrenData: this.childrenData,
      parentId: this.identifier
    });
    const values = new Map();
    values['selectChapterVisible'] = this.isChapterVisible;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DROPDOWN_CLICKED,
      Environment.HOME,
      PageId.COLLECTION_DETAIL,
      undefined,
      values
    );
  }

  onScroll(event: ScrollEvent) {
    const titles = document.querySelectorAll('[data-sticky-unit]');

    const currentTitle = Array.from(titles).filter((title) => {
      return title.getBoundingClientRect().top < 150;
    }).slice(-1)[0];

    if (currentTitle) {
      this.isChapterVisible = true;
      this.zone.run(() => {
        this.stckyUnitTitle = currentTitle.getAttribute('data-sticky-unit');
      });
    }

    if (event.scrollTop >= 205) {
      (this.stickyPillsRef.nativeElement as HTMLDivElement).classList.add('sticky');
      return;
    }

    (this.stickyPillsRef.nativeElement as HTMLDivElement).classList.remove('sticky');
  }
}
