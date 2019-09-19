import { Component, Inject, NgZone } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, Platform, PopoverController, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import { ContentConstants, EventTopics, XwalkConstants } from '../../app/app.constant';
import { Map } from '@app/app';
import { ConfirmAlertComponent } from '@app/component';
import { AppGlobalService, AppHeaderService, CourseUtilService, UtilityService } from '@app/service';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { Network } from '@ionic-native/network';
import { UserAndGroupsPage } from '../user-and-groups/user-and-groups';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';
import { DialogPopupComponent } from '../../component/dialog-popup/dialog-popup';
import {
  Content,
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
  ProfileService,
  Rollup,
  StorageService,
  TelemetryObject,
  Course
} from 'sunbird-sdk';
import { Subscription } from 'rxjs';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  Mode,
  PageId,
} from '../../service/telemetry-constants';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { ContentShareHandler } from '@app/service/content/content-share-handler';
import { AppVersion } from '@ionic-native/app-version';
import { ProfileSwitchHandler } from '@app/service/user-groups/profile-switch-handler';
import { RatingHandler } from '@app/service/rating/rating-handler';
import { ContentUtil } from '@app/util/content-util';
import { ContentPlayerHandler } from '@app/service/content/player/content-player-handler';
import { ChildContentHandler } from '@app/service/content/child-content-handler';
import { ContentDeleteHandler } from '@app/service/content/content-delete-handler';
import { ContentInfo } from '@app/service/content/content-info';

@IonicPage()
@Component({
  selector: 'page-content-details',
  templateUrl: 'content-details.html',
})
export class ContentDetailsPage {
  appName: any;
  isCourse = false;
  apiLevel: number;
  appAvailability: string;
  content: Content;
  playingContent: Content;
  isChildContent = false;
  contentDetails: any;
  identifier: string;
  headerObservable: any;
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
  telemetryObject: TelemetryObject;
  contentDeleteObservable: any;

  get course(): Course | undefined {
    return this.navParams.get('course');
  }

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('EVENTS_BUS_SERVICE') private eventBusService: EventsBusService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private events: Events,
    private popoverCtrl: PopoverController,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private courseUtilService: CourseUtilService,
    private utilityService: UtilityService,
    private network: Network,
    public toastController: ToastController,
    private fileSizePipe: FileSizePipe,
    private headerService: AppHeaderService,
    private contentShareHandler: ContentShareHandler,
    private appVersion: AppVersion,
    private profileSwitchHandler: ProfileSwitchHandler,
    private ratingHandler: RatingHandler,
    private contentPlayerHandler: ContentPlayerHandler,
    private childContentHandler: ChildContentHandler,
    private contentDeleteHandler: ContentDeleteHandler
  ) {
    this.subscribePlayEvent();
    this.checkDeviceAPILevel();
    this.checkappAvailability();
    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
    this.defaultLicense = ContentConstants.DEFAULT_LICENSE;
    this.ratingHandler.resetRating();
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
    this.isPlayedFromCourse();
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
    if (this.contentDeleteObservable) {
      this.contentDeleteObservable.unsubscribe();
    }
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }
  }

  handleNavBackButton() {
    this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.CONTENT_DETAIL, Environment.HOME,
      true, this.cardData.identifier, this.corRelationList);
    this.didViewLoad = false;
    this.generateEndEvent();
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
      this.popToPreviousPage(false);
      this.generateEndEvent();
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

  rateContent(popUpType: string) {
    this.ratingHandler.showRatingPopup(this.isContentPlayed, this.content, popUpType, this.corRelationList, this.objRollup);
  }

  extractApiResponse(data: Content) {
    if (this.isResumedCourse) {
      const resumedCourseCardData = this.navParams.get('resumedCourseCardData');
      const parentIdentifier = resumedCourseCardData && resumedCourseCardData.contentId ?
        resumedCourseCardData.contentId : resumedCourseCardData.identifier;
      this.childContentHandler.setChildContents(parentIdentifier, 0, this.identifier);
    }

    this.content = data;
    this.contentDownloadable[this.content.identifier] = data.isAvailableLocally;
    if (this.content.lastUpdatedTime !== 0) {
      this.playOnlineSpinner = false;
    }
    this.content.contentData.appIcon = ContentUtil.getAppIcon(this.content.contentData.appIcon, data.basePath,
      this.commonUtilService.networkInfo.isNetworkAvailable);
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
    this.telemetryObject = ContentUtil.getTelemetryObject(this.content);

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

  generateTelemetry() {
    if (!this.didViewLoad && !this.isContentPlayed) {
      this.objRollup = ContentUtil.generateRollUp(this.cardData.hierarchyInfo, this.identifier);
      this.telemetryObject = ContentUtil.getTelemetryObject(this.cardData);
      this.generateImpressionEvent(this.cardData.identifier, this.telemetryObject.type, this.cardData.pkgVersion);
      this.generateStartEvent();
    }
    this.didViewLoad = true;
  }

  generateDetailsInteractEvent() {
    const values = new Map();
    values['isUpdateAvailable'] = this.isUpdateAvail;
    values['isDownloaded'] = this.contentDownloadable[this.content.identifier];
    values['autoAfterDownload'] = this.downloadAndPlay ? true : false;

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
      ImpressionType.DETAIL,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      this.telemetryObject,
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

  generateStartEvent() {
    this.telemetryGeneratorService.generateStartTelemetry(
      PageId.CONTENT_DETAIL,
      this.telemetryObject,
      this.objRollup,
      this.corRelationList);
  }

  generateEndEvent() {
    this.telemetryGeneratorService.generateEndTelemetry(
      this.telemetryObject.type,
      Mode.PLAY,
      PageId.CONTENT_DETAIL,
      Environment.HOME,
      this.telemetryObject,
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
      contentStatusArray: ['Live'],
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
            if (event.payload.size) {
              this.content.contentData.size = event.payload.size;
            }

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
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
          this.isUpdateAvail ? InteractSubtype.UPDATE_INITIATE : InteractSubtype.DOWNLOAD_INITIATE,
          Environment.HOME,
          PageId.CONTENT_DETAIL,
          this.telemetryObject,
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
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        subtype,
        Environment.HOME,
        PageId.CONTENT_DETAIL,
        this.telemetryObject,
        values,
        this.objRollup,
        this.corRelationList);
    }

    if (!AppGlobalService.isPlayerLaunched && this.userCount > 2 && this.network.type !== '2g' && !this.isCourse) {
      this.openPlayAsPopup(isStreaming);
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
          if (!AppGlobalService.isPlayerLaunched && this.userCount > 2 && !this.isCourse) {
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
    if (this.apiLevel < 21 && this.appAvailability === 'false') {
      this.showPopupDialog();
    } else {
      const hierachyInfo = this.childContentHandler.contentHierarchyInfo;
      const contentInfo: ContentInfo = {
        telemetryObject: this.telemetryObject,
        rollUp: this.objRollup,
        correlationList: this.corRelationList,
        hierachyInfo: hierachyInfo,
        course: this.course
      };
      if (this.isResumedCourse) {
        this.playingContent.hierarchyInfo = hierachyInfo;
      }
      this.contentPlayerHandler.launchContentPlayer(this.playingContent, isStreaming, this.downloadAndPlay, contentInfo, this.isCourse);
      this.downloadAndPlay = false;
      this.isPlayerLaunched = true;
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
    this.contentDeleteObservable = this.contentDeleteHandler.contentDeleteCompleted$.subscribe(() => {
      this.content.contentData.streamingUrl = this.streamingUrl;
      this.contentDownloadable[this.content.identifier] = false;
      const playContent = this.playingContent;
      playContent.isAvailableLocally = false;
      this.isDownloadStarted = false;
    });
    const contentInfo: ContentInfo = {
      telemetryObject: this.telemetryObject,
      rollUp: this.objRollup,
      correlationList: this.corRelationList,
      hierachyInfo: undefined
    };
    this.contentDeleteHandler.showContentDeletePopup(this.content, this.isChildContent, contentInfo, PageId.CONTENT_DETAIL);
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
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      param = 'read-more-clicked' === param ? InteractSubtype.READ_MORE_CLICKED : InteractSubtype.READ_LESS_CLICKED,
      Environment.HOME,
      PageId.CONTENT_DETAIL,
      undefined,
      this.telemetryObject,
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

  isPlayedFromCourse() {
    this.isCourse = Boolean(this.navParams.get('isCourse'));
    if (this.cardData.hierarchyInfo && this.cardData.hierarchyInfo.length && this.cardData.hierarchyInfo[0].contentType === 'course') {
      this.isCourse = true;
    }
  }

}
