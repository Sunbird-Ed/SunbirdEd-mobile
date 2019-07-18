import {Component, Inject, NgZone, ViewChild} from '@angular/core';
import {
  Events,
  IonicApp,
  IonicPage,
  Navbar,
  NavController,
  NavParams,
  Platform,
  PopoverController,
  ToastController
} from 'ionic-angular';
import * as _ from 'lodash';
import {ContentConstants, EventTopics, PreferenceKey, StoreRating, XwalkConstants} from '../../app/app.constant';
import { Map } from '@app/app';
import {
  ConfirmAlertComponent,
  ContentActionsComponent,
  SbPopoverComponent
} from '@app/component';
import {AppGlobalService, AppHeaderService, AppRatingService, CourseUtilService, UtilityService} from '@app/service';
import {EnrolledCourseDetailsPage} from '@app/pages/enrolled-course-details';
import {Network} from '@ionic-native/network';
import {UserAndGroupsPage} from '../user-and-groups/user-and-groups';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {CommonUtilService} from '../../service/common-util.service';
import {DialogPopupComponent} from '../../component/dialog-popup/dialog-popup';
import {
  ChildContentRequest,
  Content,
  ContentDeleteStatus,
  ContentDetailRequest,
  ContentEventType,
  ContentImport,
  ContentImportRequest,
  ContentImportResponse,
  ContentService,
  CorrelationData,
  DownloadEventType,
  DownloadProgress,
  EventsBusEvent,
  EventsBusService,
  GetAllProfileRequest,
  PlayerService,
  ProfileService,
  Rollup,
  SharedPreferences,
  StorageService,
  TelemetryObject
} from 'sunbird-sdk';
import {CanvasPlayerService} from '../player/canvas-player.service';
import {PlayerPage} from '../player/player';
import {File} from '@ionic-native/file';
import {Subscription} from 'rxjs';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  Mode,
  PageId,
} from '../../service/telemetry-constants';
import {FileSizePipe} from '@app/pipes/file-size/file-size';
import {TranslateService} from '@ngx-translate/core';
import {SbGenericPopoverComponent} from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { ContentShareHandler } from '@app/service/content/content-share-handler';
import { AppVersion } from '@ionic-native/app-version';
import { ProfileSwitchHandler } from '@app/service/user-groups/profile-switch-handler';
import { RatingHandler } from '@app/service/rating/rating-handler';
import { ContentUtil } from '@app/util/content-util';

declare const cordova;

@IonicPage()
@Component({
  selector: 'page-content-details',
  templateUrl: 'content-details.html',
})
export class ContentDetailsPage {
  appName: any;
  [x: string]: any;
  apiLevel: number;
  appAvailability: string;
  content: Content;
  playingContent: Content;
  isChildContent = false;
  contentDetails: any;
  identifier: string;
  headerObservable: any;
  new: Boolean = true;

  /**
   * To hold previous state data
   */
  cardData: any;

  /**
   * Content depth
   */
  depth: string;
  isDownloadStarted = false;
  downloadProgress: any;
  cancelDownloading = false;
  loader: any;
  userId = '';
  public objRollup: Rollup;
  isContentPlayed = false;
  /**
   * Used to handle update content workflow
   */
  isUpdateAvail = false;
  /*stores streaming url*/
  streamingUrl: any;
  contentDownloadable: {
    [contentId: string]: boolean;
  } = {};
  /**
   * currently used to identify that its routed from QR code results page
   * Can be sent from any page, where after landing on details page should download or play content automatically
   */
  downloadAndPlay: boolean;
  /**
   * This flag helps in knowing when the content player is closed and the user is back on content details page.
   */
  public isPlayerLaunched = false;
  isGuestUser = false;
  launchPlayer: boolean;
  isResumedCourse: boolean;
  objId;
  objType;
  objVer;
  didViewLoad: boolean;
  contentDetail: any;
  backButtonFunc = undefined;
  shouldGenerateEndTelemetry = false;
  source = '';
  unregisterBackButton: any;
  userCount = 0;
  shouldGenerateTelemetry = true;
  playOnlineSpinner: boolean;
  defaultAppIcon: string;
  @ViewChild(Navbar) navBar: Navbar;
  showMessage: any;
  localImage: any;
  isUsrGrpAlrtOpen: Boolean = false;
  private corRelationList: Array<CorrelationData>;
  private eventSubscription: Subscription;
  defaultLicense: string;
  showChildrenLoader: any;
  showLoading: any;
  hierarchyInfo: any;
  showDownload: boolean;
  contentPath: Array<any>[];
  FileSizePipe: any;
  toast: any;
  childPaths: Array<string> = [];
  breadCrumbData: any;
  networkSubscription: any;
  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('EVENTS_BUS_SERVICE') private eventBusService: EventsBusService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    @Inject('PLAYER_SERVICE') private playerService: PlayerService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private events: Events,
    private popoverCtrl: PopoverController,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private ionicApp: IonicApp,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private courseUtilService: CourseUtilService,
    private canvasPlayerService: CanvasPlayerService,
    private file: File,
    private utilityService: UtilityService,
    private network: Network,
    public toastController: ToastController,
    private fileSizePipe: FileSizePipe,
    private translate: TranslateService,
    private headerService: AppHeaderService,
    private contentShareHandler: ContentShareHandler,
    private appVersion: AppVersion,
    private profileSwitchHandler: ProfileSwitchHandler,
    private ratingHandler: RatingHandler
  ) {
    this.subscribePlayEvent();
    this.checkDeviceAPILevel();
    this.checkappAvailability();
    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
    this.defaultLicense = ContentConstants.DEFAULT_LICENSE;
  }

  ionViewDidLoad() {
    this.appVersion.getAppName()
      .then((appName: any) => {
        this.appName = appName;
    });

    if (!AppGlobalService.isPlayerLaunched) {
      this.calculateAvailableUserCount();
    }

    this.events.subscribe(EventTopics.PLAYER_CLOSED, (data) => {
      if (data.selectedUser) {
        if (!data.selectedUser['profileType']) {
          this.profileService.getActiveProfileSession().toPromise()
            .then((profile) => {
              this.profileSwitchHandler.switchUser(profile);
            });
        } else {
          this.profileSwitchHandler.switchUser(data.selectedUser);
        }
      }
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.headerService.hideHeader();
    this.cardData = this.navParams.get('content');
    this.isChildContent = this.navParams.get('isChildContent');
    this.cardData.depth = this.navParams.get('depth') === undefined ? '' : this.navParams.get('depth');
    this.corRelationList = this.navParams.get('corRelation');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.isResumedCourse = Boolean(this.navParams.get('isResumedCourse'));
    this.source = this.navParams.get('source');
    this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
    this.downloadAndPlay = this.navParams.get('downloadAndPlay');
    this.playOnlineSpinner = true;
    this.contentPath = this.navParams.get('paths');
    this.breadCrumbData = this.navParams.get('breadCrumb');

    if (this.isResumedCourse && !this.isPlayerLaunched) {
      if (this.isUsrGrpAlrtOpen) {
        this.isUsrGrpAlrtOpen = false;
      } else {
        this.navCtrl.insert(this.navCtrl.length() - 1, EnrolledCourseDetailsPage, {
          content: this.navParams.get('resumedCourseCardData')
        });
      }
    } else {
      this.generateTelemetry();
    }

    this.setContentDetails(this.identifier, true, this.isPlayerLaunched);
    this.subscribeSdkEvent();
    this.findHierarchyOfContent();
    this.networkSubscription = this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
      if (available) {
        this.presentToast();
        if (this.toast) {
          this.toast.dismiss();
          this.toast = undefined;
        }
      } else {
        this.presentToastForOffline();
      }
    });
    this.handleDeviceBackButton();
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
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

  handleNavBackButton() {
    this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
      true, this.cardData.identifier, this.corRelationList);
    this.didViewLoad = false;
    this.generateEndEvent(this.objId, this.objType, this.objVer);
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
    }
    this.popToPreviousPage(true);
  }

  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
        false, this.cardData.identifier, this.corRelationList);
      this.didViewLoad = false;
      this.dismissPopup();
      this.popToPreviousPage(false);
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.cardData.identifier);
      }
      this.backButtonFunc();
    }, 11);
  }

  subscribePlayEvent() {
    this.launchPlayer = this.navParams.get('launchplayer');
    this.events.subscribe('playConfig', (config) => {
      this.appGlobalService.setSelectedUser(config['selectedUser']);
      this.playContent(config.streaming);
    });
  }

  // You are Offline Toast
  async presentToastForOffline() {
    this.toast = await this.toastController.create({
      duration: 2000,
      message: this.commonUtilService.translateMessage('NO_INTERNET_TITLE'),
      showCloseButton: true,
      position: 'top',
      closeButtonText: '',
      cssClass: 'toastHeader'
    });
    this.toast.present();
    this.toast.onDidDismiss(() => {
      this.toast = undefined;
    });
  }

  // You are Online Toast
  async presentToast() {
    const toast = await this.toastController.create({
      duration: 2000,
      message: this.commonUtilService.translateMessage('INTERNET_AVAILABLE'),
      showCloseButton: false,
      position: 'top',
      cssClass: 'toastForOnline'
    });
    toast.present();
  }

  calculateAvailableUserCount() {
    const profileRequest: GetAllProfileRequest = {
      local: true,
      server: false
    };
    this.profileService.getAllProfiles(profileRequest)
      .map((profiles) => profiles.filter((profile) => !!profile.handle))
      .toPromise()
      .then((profiles) => {
        if (profiles) {
          this.userCount = profiles.length;
        }
        if (this.appGlobalService.isUserLoggedIn()) {
          this.userCount += 1;
        }
      }).catch((error) => {
        console.error('Error occurred= ', error);
      });
  }

  /**
   * To set content details in local variable
   * @param {string} identifier identifier of content / course
   * @param refreshContentDetails
   * @param showRating
   */

  setContentDetails(identifier, refreshContentDetails: boolean, showRating: boolean) {
    let loader;
    if (!showRating) {
      loader = this.commonUtilService.getLoader();
      loader.present();
    }
    const req: ContentDetailRequest = {
      contentId: identifier,
      attachFeedback: true,
      attachContentAccess: true,
      emitUpdateIfAny: refreshContentDetails
    };

    this.contentService.getContentDetails(req).toPromise()
      .then((data: Content) => {
        this.zone.run(() => {
          if (data) {
            this.extractApiResponse(data);
            if (!showRating) {
              loader.dismiss();
            }
            if (data.contentData.status === 'Retired') {
              this.showRetiredContentPopup();
            }
          } else {
            if (!showRating) {
              loader.dismiss();
            }
          }

          if (showRating) {
            this.isPlayerLaunched = false;
            this.ratingHandler.showRatingPopup(this.isContentPlayed, data, 'automatic', this.corRelationList, this.objRollup);
          }
        });
      })
      .catch((error: any) => {
        loader.dismiss();
        if (this.isDownloadStarted) {
          this.contentDownloadable[this.content.identifier] = false;
          // this.content.downloadable = false;
          this.isDownloadStarted = false;
        }
        if (error.hasOwnProperty('CONNECTION_ERROR') === 'CONNECTION_ERROR') {
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else if (error.hasOwnProperty('SERVER_ERROR') === 'SERVER_ERROR' ||
          error.hasOwnProperty('SERVER_AUTH_ERROR') === 'SERVER_AUTH_ERROR') {
          this.commonUtilService.showToast('ERROR_FETCHING_DATA');
        } else {
          this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        }
        this.navCtrl.pop();
      });
  }

  extractApiResponse(data: Content) {
    if (this.isResumedCourse) {
      this.setChildContents();
    }

    this.content = data;
    this.contentDownloadable[this.content.identifier] = data.isAvailableLocally;
    if (this.content.lastUpdatedTime !== 0) {
      this.playOnlineSpinner = false;
    }
    if (this.content.contentData.appIcon) {
      if (this.content.contentData.appIcon.startsWith('http')) {
        if (this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.content.contentData.appIcon = this.content.contentData.appIcon;
        } else {
          this.content.contentData.appIcon = this.defaultAppIcon;
        }
      } else if (data.basePath) {
        this.content.contentData.appIcon = data.basePath + '/' + this.content.contentData.appIcon;
        console.log('local Image', this.localImage);
      }
    }
    this.content.contentAccess = data.contentAccess ? data.contentAccess : [];
    this.content.contentMarker = data.contentMarker ? data.contentMarker : [];

    if (this.cardData && this.cardData.hierarchyInfo) {
      data.hierarchyInfo = this.cardData.hierarchyInfo;
      this.isChildContent = true;
    }
    if (this.content.contentData.streamingUrl) {
      this.streamingUrl = this.content.contentData.streamingUrl;
    }

    if (!this.isChildContent && this.content.contentMarker.length
      && this.content.contentMarker[0].extraInfoMap
      && this.content.contentMarker[0].extraInfoMap.hierarchyInfo
      && this.content.contentMarker[0].extraInfoMap.hierarchyInfo.length) {
      this.isChildContent = true;
    }

    this.playingContent = data;
    if (this.content.contentData.me_totalRatings) {
      this.content.contentData.me_totalRatings = parseInt(this.content.contentData.me_totalRatings, 10) + '';
    }
    this.objId = this.content.identifier;
    this.objVer = this.content.contentData.pkgVersion;

    // Check locally available
    if (Boolean(data.isAvailableLocally)) {
      this.isUpdateAvail = data.isUpdateAvailable && !this.isUpdateAvail;
    } else {
      this.content.contentData.size = this.content.contentData.size;
    }

    if (this.content.contentData.me_totalDownloads) {
      this.content.contentData.me_totalDownloads = parseInt(this.content.contentData.me_totalDownloads, 10) + '';
    }

    if (this.navParams.get('isResumedCourse')) {
      this.cardData.contentData = this.content;
      this.cardData.pkgVersion = this.content.contentData.pkgVersion;
      this.generateTelemetry();
    }

    if (this.shouldGenerateTelemetry) {
      this.generateDetailsInteractEvent();
      this.shouldGenerateEndTelemetry = false;
    }

    if (this.isPlayerLaunched) {
      this.downloadAndPlay = false;
    }
    if (this.downloadAndPlay) {
      if (!this.contentDownloadable[this.content.identifier] || this.content.isUpdateAvailable) {
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

  /**
 * Function to set child contents
 */
  setChildContents(): void {
    this.showChildrenLoader = true;
    // const option = new ChildContentRequest();
    const resumedCourseCardData = this.navParams.get('resumedCourseCardData');
    const option: ChildContentRequest = {
      contentId: resumedCourseCardData && resumedCourseCardData.contentId ?
        resumedCourseCardData.contentId : resumedCourseCardData.identifier,
      hierarchyInfo: null,
      level: !resumedCourseCardData ? 1 : 0,
    };
    option.hierarchyInfo = null;

    if (resumedCourseCardData && !resumedCourseCardData.batchId) {
      option.level = 1;
    }
    this.contentService.getChildContents(option).toPromise()
      .then((data: any) => {
        this.zone.run(() => {
          if (data && data.children) {
            this.hierarchyInfo = this.getHierarchyInfo(data);
          }
        });
      })
      .catch((error: string) => {
        this.zone.run(() => {
        });
      });
  }

  getHierarchyInfo(childrenData) {
    // step 1: if children.length != 0
    // step 2: then, loopthrough and match identifier
    // step 3: if matches, then, return hirearchy info
    // step 4: else, step 1 again
    let hierarchyInfo: any;
    if (childrenData.children && childrenData.children.length) {
      // hierarchyInfo = childrenData.children.find((ele) => {
      // childrenData.children.forEach(ele => {
      for (let i = 0; i < childrenData.children.length; i++) {
        const ele = childrenData.children[i];
        if (!hierarchyInfo && ele.identifier === this.identifier) {
          return ele;
        } else if (!hierarchyInfo) {
          hierarchyInfo = this.getHierarchyInfo(ele);
          if (hierarchyInfo) {
            return hierarchyInfo;
          }
        }
      }
    }
  }

  generateTelemetry() {
    if (!this.didViewLoad && !this.isContentPlayed) {
      this.objRollup = ContentUtil.generateRollUp(this.cardData.hierarchyInfo, this.identifier);
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
    values['isDownloaded'] = this.contentDownloadable[this.content.identifier];
    values['autoAfterDownload'] = this.downloadAndPlay ? true : false;
    const contentType = this.cardData.contentData ? this.cardData.contentData.contentType : this.cardData.contentType;

    const telemetryObject = new TelemetryObject(
      this.content.identifier,
      this.cardData.contentData ? this.cardData.contentData.contentType : this.cardData.contentType,
      this.content.contentData.pkgVersion,
    );

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
      ImpressionType.DETAIL,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      telemetryObject,
      values,
      this.objRollup,
      this.corRelationList);
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
    const telemetryObject = new TelemetryObject(objectId, objectType, objectVersion);
    this.telemetryGeneratorService.generateStartTelemetry(
      PageId.CONTENT_DETAIL,
      telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    const telemetryObject = new TelemetryObject(objectId, objectType, objectVersion);
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
  getImportContentRequestBody(identifiers: Array<string>, isChild: boolean): Array<ContentImport> {
    const requestParams = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        destinationFolder: this.storageService.getStorageDestinationDirectoryPath(),
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
    const contentImportRequest: ContentImportRequest = {
      contentImportArray: this.getImportContentRequestBody(identifiers, isChild),
      contentStatusArray: [],
      fields: ['appIcon', 'name', 'subject', 'size', 'gradeLevel']
    };

    // Call content service
    this.contentService.importContent(contentImportRequest).toPromise()
      .then((data: ContentImportResponse[]) => {
        if (data && data[0].status === -1) {
          this.showDownload = false;
          this.isDownloadStarted = false;
          this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        }
      })
      .catch((error) => {
        console.log('error while loading content details', error);
        if (this.isDownloadStarted) {
          this.showDownload = false;
          this.contentDownloadable[this.content.identifier] = false;
          this.isDownloadStarted = false;
        }
        this.commonUtilService.showToast('SOMETHING_WENT_WRONG');
      });
  }

  /**
   * Subscribe Sunbird-SDK event to get content download progress
   */
  subscribeSdkEvent() {
    this.eventSubscription = this.eventBusService.events().subscribe((event: EventsBusEvent) => {
      this.zone.run(() => {
        if (event.type === DownloadEventType.PROGRESS) {
          const downloadEvent = event as DownloadProgress;
          if (downloadEvent.payload.identifier === this.content.identifier) {
            this.showDownload = true;
            this.isDownloadStarted = true;
            this.downloadProgress = downloadEvent.payload.progress === -1 ? '0' : downloadEvent.payload.progress;
            this.downloadProgress = Math.round(this.downloadProgress);
            if (isNaN(this.downloadProgress)) {
              this.downloadProgress = 0;
            }
            if (this.downloadProgress === 100) {
              this.showLoading = false;
              this.showDownload = false;
              this.content.isAvailableLocally = true;
            }
          }
        }


        // Get child content
        if (event.type === ContentEventType.IMPORT_COMPLETED) {
          if (this.isDownloadStarted) {
            this.isDownloadStarted = false;
            this.cancelDownloading = false;
            this.contentDownloadable[this.content.identifier] = true;
            this.setContentDetails(this.identifier, false, false);
            this.downloadProgress = '';
            this.events.publish('savedResources:update', {
              update: true
            });
          }
        }


        // For content update available
        if (event.payload && event.type === ContentEventType.UPDATE) {
          this.zone.run(() => {
            this.isUpdateAvail = true;
          });
        }

        if (event.payload && event.type === ContentEventType.STREAMING_URL_AVAILABLE) {
          this.zone.run(() => {
            const eventPayload = event.payload;
            if (eventPayload.contentId === this.content.identifier) {
              if (eventPayload.streamingUrl) {
                this.streamingUrl = eventPayload.streamingUrl;
                this.playingContent.contentData.streamingUrl = eventPayload.streamingUrl;
              } else {
                this.playOnlineSpinner = false;
              }
            }
          });
        }
      });
    }) as any;
  }

  /**
   * confirming popUp content
   */
  openConfirmPopUp() {
    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      const popover = this.popoverCtrl.create(ConfirmAlertComponent, {
        sbPopoverMainTitle: this.content.contentData.name,
        icon: null,
        metaInfo:
          '1 item ' + '(' + this.fileSizePipe.transform(this.content.contentData.size, 2) + ')',
        isUpdateAvail: this.contentDownloadable[this.content.identifier] && this.isUpdateAvail,
      }, {
          cssClass: 'sb-popover info',
        });
      popover.present({
        ev: event
      });
      popover.onDidDismiss((canDownload: boolean = false) => {
        if (canDownload) {
          this.downloadContent();
        }
      });
    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }

  /**
   * Download content
   */
  downloadContent() {
    this.zone.run(() => {
      if (this.commonUtilService.networkInfo.isNetworkAvailable) {
        this.showDownload = true;
        this.downloadProgress = '0';
        this.isDownloadStarted = true;
        const values = new Map();
        values['network-type'] = this.network.type;
        values['size'] = this.content.contentData.size;
        this.importContent([this.identifier], this.isChildContent);
        const telemetryObject = new TelemetryObject(this.objId, this.objType, this.objVer);
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
          this.isUpdateAvail ? InteractSubtype.UPDATE_INITIATE : InteractSubtype.DOWNLOAD_INITIATE,
          Environment.HOME,
          PageId.CONTENT_DETAIL,
          telemetryObject,
          values,
          this.objRollup,
          this.corRelationList);
      }
    });
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier).toPromise()
      .then(() => {
        this.zone.run(() => {
          this.telemetryGeneratorService.generateContentCancelClickedTelemetry(this.content, this.downloadProgress);
          this.isDownloadStarted = false;
          this.showDownload = false;
          this.downloadProgress = '';
          if (!this.isUpdateAvail) {
            this.contentDownloadable[this.content.identifier] = false;
          }
        });
      }).catch((error: any) => {
        this.zone.run(() => {
          console.log('Error: download error =>>>>>', error);
        });
      });
  }

  /**
   * alert for playing the content
   */
  showSwitchUserAlert(isStreaming: boolean) {
    if (isStreaming && !this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.commonUtilService.showToast('INTERNET_CONNECTIVITY_NEEDED');
      return false;
    } else {
      const values = new Map();
      const subtype: string = isStreaming ? InteractSubtype.PLAY_ONLINE : InteractSubtype.PLAY_FROM_DEVICE;
      values['networkType'] = this.network.type;
      const telemetryObject = new TelemetryObject(this.objId, this.objType, this.objVer);
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        subtype,
        Environment.HOME,
        PageId.CONTENT_DETAIL,
        telemetryObject,
        values,
        this.objRollup,
        this.corRelationList);
    }

    if (!AppGlobalService.isPlayerLaunched && this.userCount > 2 && this.network.type !== '2g') {
      this.openPlayAsPopup(isStreaming);
      // alert.present();
    } else if (this.network.type === '2g' && !this.contentDownloadable[this.content.identifier]) {
      const popover = this.popoverCtrl.create(SbGenericPopoverComponent, {
        sbPopoverHeading: this.commonUtilService.translateMessage('LOW_BANDWIDTH'),
        sbPopoverMainTitle: this.commonUtilService.translateMessage('LOW_BANDWIDTH_DETECTED'),
        actionsButtons: [
          {
            btntext: this.commonUtilService.translateMessage('PLAY_ONLINE'),
            btnClass: 'popover-color'
          },
          {
            btntext: this.commonUtilService.translateMessage('DOWNLOAD'),
            btnClass: 'sb-btn sb-btn-normal sb-btn-info'
          }
        ],
        icon: {
          md: 'md-sad',
          ios: 'ios-sad',
          className: ''
        },
        metaInfo: '',
        sbPopoverContent: this.commonUtilService.translateMessage('CONSIDER_DOWNLOAD')
      }, {
          cssClass: 'sb-popover warning',
        });
      popover.present();
      popover.onDidDismiss((leftBtnClicked: any) => {
        if (leftBtnClicked == null) {
          return;
        }
        if (leftBtnClicked) {
          if (!AppGlobalService.isPlayerLaunched && this.userCount > 2) {
            this.openPlayAsPopup(isStreaming);
          } else {
            this.playContent(isStreaming);
          }
        } else {
          this.downloadContent();
        }
      });
    } else {
      this.playContent(isStreaming);
    }
  }

  showRetiredContentPopup() {
    const popover = this.popoverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('CONTENT_NOT_AVAILABLE'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_RETIRED_BY_AUTHOR'),
      actionsButtons: [
      ],
      icon: {
        md: 'md-warning',
        ios: 'ios-warning',
        className: ''
      }
    }, {
        cssClass: 'sb-popover warning',
      });
    popover.present({
      ev: event
    });
    popover.onDidDismiss(() => {
      this.navCtrl.pop();
    });
  }

  openPlayAsPopup(isStreaming) {
    const profile = this.appGlobalService.getCurrentUser();
    this.isUsrGrpAlrtOpen = true;
   // if (profile.board.length > 1) {
    const confirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('PLAY_AS'),
      sbPopoverMainTitle: profile.handle,
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('YES'),
          btnClass: 'popover-color'
        },
        {
          btntext: this.commonUtilService.translateMessage('CHANGE_USER'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
        }
      ],
      icon: null
    }, {
        cssClass: 'sb-popover info',
      });
    confirm.present({
      ev: event
    });
    confirm.onDidDismiss((leftBtnClicked: any) => {
      if (leftBtnClicked == null) {
        return;
      }
      if (leftBtnClicked) {
        this.playContent(isStreaming);
      } else {
        const playConfig: any = {};
        playConfig.playContent = true;
        playConfig.streaming = isStreaming;
        this.navCtrl.push(UserAndGroupsPage, {
          playConfig: playConfig
        });
      }
    });
  }

  /**
   * Play content
   */
  playContent(isStreaming: boolean) {
    // set the boolean to true, so when the content player is closed, we get to know that
    // we are back from content player
    if (this.apiLevel < 21 && this.appAvailability === 'false') {
      this.showPopupDialog();
    } else {
      this.downloadAndPlay = false;
      if (!AppGlobalService.isPlayerLaunched) {
        AppGlobalService.isPlayerLaunched = true;
      }
      this.zone.run(() => {
        this.isPlayerLaunched = true;
        const values = new Map();

        values['autoAfterDownload'] = this.downloadAndPlay ? true : false;
        values['isStreaming'] = isStreaming;
        const telemetryObject = new TelemetryObject(this.objId, this.objType, this.objVer);
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
          InteractSubtype.CONTENT_PLAY,
          Environment.HOME,
          PageId.CONTENT_DETAIL,
          telemetryObject,
          values,
          this.objRollup,
          this.corRelationList);
      });

      if (isStreaming) {
        const extraInfoMap = { hierarchyInfo: [] };
        if (this.cardData && this.cardData.hierarchyInfo) {
          extraInfoMap.hierarchyInfo = this.cardData.hierarchyInfo;
        } else if (this.hierarchyInfo && this.hierarchyInfo.hierarchyInfo) {
          extraInfoMap.hierarchyInfo = this.hierarchyInfo.hierarchyInfo;
        }

        const playContent = this.playingContent;
      }
      this.downloadAndPlay = false;
      const request: any = {};
      if (isStreaming) {
        request.streaming = isStreaming;
      }
      request['correlationData'] = this.corRelationList;

      if (this.isResumedCourse) {
        this.playingContent.hierarchyInfo = this.hierarchyInfo.hierarchyInfo;
      }

      this.playerService.getPlayerConfig(this.playingContent, request).subscribe((data) => {
        data['data'] = {};
        if (data.metadata.mimeType === 'application/vnd.ekstep.ecml-archive') {
          if (!isStreaming) {
            this.file.checkFile(`file://${data.metadata.basePath}/`, 'index.ecml').then((isAvailable) => {
              this.canvasPlayerService.xmlToJSon(`${data.metadata.basePath}/index.ecml`).then((json) => {
                data['data'] = json;

                this.navCtrl.push(PlayerPage, { config: data });
              }).catch((error) => {
                console.error('error1', error);
              });
            }).catch((err) => {
              console.error('err', err);
              this.canvasPlayerService.readJSON(`${data.metadata.basePath}/index.json`).then((json) => {
                data['data'] = json;
                this.navCtrl.push(PlayerPage, { config: data });
              }).catch((e) => {
                console.error('readJSON error', e);
              });
            });
          } else {
            this.navCtrl.push(PlayerPage, { config: data });
          }

        } else {
          this.navCtrl.push(PlayerPage, { config: data });
        }
      });
    }
  }

  checkappAvailability() {
    this.utilityService.checkAppAvailability(XwalkConstants.APP_ID)
      .then((response: any) => {
        this.appAvailability = response;
        console.log('check App availability', this.appAvailability);
      })
      .catch((error: any) => {
        console.error('Error ', error);
      });
  }

  checkDeviceAPILevel() {
    this.utilityService.getDeviceAPILevel()
      .then((res: any) => {
        this.apiLevel = res;
      }).catch((error: any) => {
        console.error('Error ', error);
      });
  }

  showDeletePopup() {
    const telemetryObject = new TelemetryObject(this.objId, this.objType, this.objVer);
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.KEBAB_MENU_CLICKED,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      telemetryObject,
      undefined,
      this.objRollup,
      this.corRelationList);
    const confirm = this.popoverCtrl.create(SbPopoverComponent, {
      content: this.content,
      isChild: this.isChildContent,
      objRollup: this.objRollup,
      pageName: PageId.CONTENT_DETAIL,
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
      metaInfo: this.content.contentData.name,
      sbPopoverContent: ' 1 item' + ' (' + this.fileSizePipe.transform(this.content.sizeOnDevice, 2) + ')',
    }, {
        cssClass: 'sb-popover danger',
      });
    confirm.present({
      ev: event
    });
    confirm.onDidDismiss((canDelete: any) => {
      if (canDelete) {
        this.deleteContent();
        // this.viewCtrl.dismiss();
      }
    });
  }

  /**
* Construct content delete request body
*/
  getDeleteRequestBody() {
    const apiParams = {
      contentDeleteList: [{
        contentId: (this.content && this.content.identifier) ? this.content.identifier : '',
        isChildContent: this.isChild
      }]
    };
    return apiParams;
  }

  showToaster(message) {
    const toast = this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getMessageByConstant(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
  }

  deleteContent() {
    const telemetryObject: TelemetryObject = new TelemetryObject(this.content.identifier,
      this.content.contentType, this.content.contentData.pkgVersion);
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.DELETE_CLICKED,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
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
        this.showToaster(this.getMessageByConstant('CONTENT_DELETE_FAILED'));
      } else {
        // Publish saved resources update event
        this.events.publish('savedResources:update', {
          update: true
        });
        this.content.contentData.streamingUrl = this.streamingUrl;
        this.contentDownloadable[this.content.identifier] = false;
        const playContent = this.playingContent;
        playContent.isAvailableLocally = false;
        this.isDownloadStarted = false;
        this.showToaster(this.getMessageByConstant('MSG_RESOURCE_DELETED'));
      }
    }).catch((error: any) => {
      loader.dismiss();
      console.log('delete response: ', error);
      this.showToaster(this.getMessageByConstant('CONTENT_DELETE_FAILED'));
    });
  }

  /**
   * Shares content to external devices
   */
  share() {
    this.contentShareHandler.shareContent(this.content, this.corRelationList, this.objRollup);
  }

  /**
   * To View Credits popup
   * check if non of these properties exist, then return false
   * else show ViewCreditsComponent
   */
  viewCredits() {
    if (!this.content.contentData.creator && !this.content.contentData.creators) {
      if (!this.content.contentData.contributors && !this.content.contentData.owner) {
        if (!this.content.contentData.attributions) {
          return false;
        }
      }
    }
    this.courseUtilService.showCredits(this.content, PageId.CONTENT_DETAIL, this.objRollup, this.corRelationList);
  }

  /**
   * method generates telemetry on click Read less or Read more
   * @param {string} param string as read less or read more
   * @param {object} objRollup object roll up
   * @param corRelationList correlation List
   */
  readLessorReadMore(param, objRollup, corRelationList) {
    const telemetryObject = new TelemetryObject(this.objId, this.objType, this.objVer);
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      param = 'read-more-clicked' === param ? InteractSubtype.READ_MORE_CLICKED : InteractSubtype.READ_LESS_CLICKED,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      undefined,
      telemetryObject,
      objRollup,
      corRelationList
    );
  }

  showPopupDialog() {
    const popover = this.popoverCtrl.create(DialogPopupComponent, {
      title: this.commonUtilService.translateMessage('ANDROID_NOT_SUPPORTED'),
      body: this.commonUtilService.translateMessage('ANDROID_NOT_SUPPORTED_DESC'),
      buttonText: this.commonUtilService.translateMessage('INSTALL_CROSSWALK')
    }, {
        cssClass: 'popover-alert'
      });
    popover.present();
  }

  mergeProperties(mergeProp) {
    return ContentUtil.mergeProperties(this.content.contentData, mergeProp);
  }

  findHierarchyOfContent() {
    if (this.cardData && this.cardData.hierarchyInfo && this.breadCrumbData) {
      this.cardData.hierarchyInfo.forEach((element) => {
        const contentName = this.breadCrumbData.get(element.identifier);
        this.childPaths.push(contentName);
      });
      this.childPaths.push(this.breadCrumbData.get(this.cardData.identifier));
    }
  }

}
