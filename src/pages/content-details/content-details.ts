import {Component, Inject, NgZone, ViewChild} from '@angular/core';
import {
  AlertController,
  Events,
  IonicApp,
  IonicPage,
  Navbar,
  NavController,
  NavParams,
  Platform,
  PopoverController
} from 'ionic-angular';
import {SocialSharing} from '@ionic-native/social-sharing';
import * as _ from 'lodash';
import {ShareUtil} from 'sunbird';
import {PreferenceKey} from '../../app/app.constant';
import {Map, ShareUrl} from '@app/app';
import {BookmarkComponent, ContentActionsComponent, ContentRatingAlertComponent} from '@app/component';
import {AppGlobalService, CourseUtilService} from '@app/service';
import {EnrolledCourseDetailsPage} from '@app/pages/enrolled-course-details';
import {Network} from '@ionic-native/network';
import {UserAndGroupsPage} from '../user-and-groups/user-and-groups';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {CommonUtilService} from '../../service/common-util.service';
import {DialogPopupComponent} from '../../component/dialog-popup/dialog-popup';
import {
  Content,
  ContentAccess,
  ContentAccessStatus,
  ContentDetailRequest,
  ContentEventType,
  ContentImport,
  ContentImportRequest,
  ContentImportResponse,
  ContentMarkerRequest,
  ContentService,
  CorrelationData,
  DownloadEventType,
  DownloadProgress,
  EventsBusEvent,
  EventsBusService,
  GetAllProfileRequest,
  MarkerType,
  PlayerService,
  ProfileService,
  Rollup,
  SharedPreferences,
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

declare const cordova;

@IonicPage()
@Component({
  selector: 'page-content-details',
  templateUrl: 'content-details.html',
})
export class ContentDetailsPage {
  apiLevel: number;
  appAvailability: string;
  content: Content;
  playingContent: Content;
  isChildContent = false;
  contentDetails: any;
  identifier: string;

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
  userRating = 0;
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
  playOnlineSpinner: boolean;
  @ViewChild(Navbar) navBar: Navbar;
  showMessage: any;
  isUsrGrpAlrtOpen: Boolean = false;
  private resume;
  private ratingComment = '';
  private corRelationList: Array<CorrelationData>;
  private eventSubscription: Subscription;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('EVENTS_BUS_SERVICE') private eventBusService: EventsBusService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    @Inject('PLAYER_SERVICE') private playerService: PlayerService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private events: Events,
    private popoverCtrl: PopoverController,
    private shareUtil: ShareUtil,
    private social: SocialSharing,
    private platform: Platform,
    private appGlobalService: AppGlobalService,
    private alertCtrl: AlertController,
    private ionicApp: IonicApp,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private courseUtilService: CourseUtilService,
    private network: Network,
    private canvasPlayerService: CanvasPlayerService,
    private file: File
  ) {

    this.objRollup = new Rollup();
    // this.userId = this.appGlobalService.getUserId();
    this.subscribePlayEvent();
    this.checkLoggedInOrGuestUser();
    this.checkCurrentUserType();
    this.handlePageResume();
    // this.checkDeviceAPILevel();
    // this.checkappAvailability();
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
    this.playOnlineSpinner = true;

    if (this.isResumedCourse) {
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

    this.setContentDetails(this.identifier, true);
    this.subscribeGenieEvent();
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.resume.unsubscribe();
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
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
      if (this.isPlayerLaunched) {
        this.isPlayerLaunched = false;
        this.setContentDetails(this.identifier, false /* No Automatic Rating for 1.9.0 */);
      }
      // this.updateContentProgress();
    });
  }

  subscribePlayEvent() {
    this.appGlobalService.getBuildConfigValue('BASE_URL')
      .then(response => {
        this.baseUrl = response;
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
    this.isGuestUser = !this.appGlobalService.isUserLoggedIn();
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

  checkCurrentUserType() {
    if (this.isGuestUser) {
      this.appGlobalService.getGuestUserInfo()
        .then((userType) => {
          this.profileType = userType;
        })
        .catch((error) => {
          console.log('Error Occurred', error);
          this.profileType = '';
        });
    }
  }

  checkBookmarkStatus() {
    this.preferences.getString(PreferenceKey.IS_BOOKMARK_VIEWED).toPromise().then(val => {
      if (!val) {
        this.showBookmarkMenu();
      }
    });
  }

  /*
   selectBookmark() {
     this.content.bookmarked = true;
     this.showMessage = true;
     const notifyTimer = Observable.timer(10000);
     notifyTimer.subscribe(e => {
       this.showMessage = false;
     });
   }

   deSelectBookmark() {
     this.content.bookmarked = false;
     if (this.showMessage) {
       this.showMessage = false;
     }
   }
   */
  /**
   * Function to rate content
   */
  rateContent(popupType: string) {
    const paramsMap = new Map();
    if (this.isContentPlayed || this.content.contentAccess.length) {

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
  }

  /**
   * To set content details in local variable
   * @param {string} identifier identifier of content / course
   * @param refreshContentDetails
   * @param showRating
   */

  setContentDetails(identifier, showRating: boolean) {
    let loader;
    if (!showRating) {
      loader = this.commonUtilService.getLoader();
      loader.present();
    }
    const req: ContentDetailRequest = {
      contentId: identifier,
      attachFeedback: true,
      attachContentAccess: true
    };

    this.contentService.getContentDetails(req).toPromise()
      .then((data: Content) => {
        this.zone.run(() => {
          if (data) {
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
    this.content = data;
    this.contentDownloadable[this.content.identifier] = data.isAvailableLocally;
    if (this.content.lastUpdatedTime !== 0) {
      this.playOnlineSpinner = false;
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
    if (this.content.contentData.gradeLevel && this.content.contentData.gradeLevel.length
      && typeof this.content.contentData.gradeLevel !== 'string') {
      this.content.contentData.gradeLevel ? this.content.contentData.gradeLevel.join(', ') : '';
    }
    if (this.content.contentData.attributions && this.content.contentData.attributions.length) {
      this.content.contentData.attributions ? this.content.contentData.attributions.join(', ') : '';
    }
    if (this.content.contentData.me_totalRatings) {
      const rating = this.content.contentData.me_totalRatings.split('.');
      if (rating && rating[0]) {
        this.content.contentData.me_totalRatings = rating[0];
      }
    }
    this.objId = this.content.identifier;
    this.objVer = this.content.contentData.pkgVersion;

    // User Rating
    const contentFeedback: any = data.contentFeedback;
    if (contentFeedback !== undefined && contentFeedback.length !== 0) {
      this.userRating = contentFeedback[0].rating;
      this.ratingComment = contentFeedback[0].comments;
    }

    // Check locally available
    if (Boolean(data.isAvailableLocally)) {
      this.isUpdateAvail = data.isUpdateAvailable && !this.isUpdateAvail;
    } else {
      this.content.contentData.size = this.content.contentData.size;
    }

    if (this.content.contentData.me_totalDownloads) {
      this.content.contentData.me_totalDownloads = this.content.contentData.me_totalDownloads.split('.')[0];
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

    if (this.downloadAndPlay) {
      if (!this.contentDownloadable[this.content.identifier]) {
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
    values['isDownloaded'] = this.contentDownloadable[this.content.identifier];
    values['autoAfterDownload'] = this.downloadAndPlay;

    const telemetryObject = new TelemetryObject(
      this.content.identifier,
      this.content.contentType,
      this.content.contentData.pkgVersion
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
        destinationFolder: cordova.file.externalDataDirectory,
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
      contentStatusArray: []
    };

    // Call content service
    this.contentService.importContent(contentImportRequest).toPromise()
      .then((data: ContentImportResponse[]) => {
        if (data && data[0].status === -1) {
          this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        }
      })
      .catch((error) => {
        console.log('error while loading content details', error);
        if (this.isDownloadStarted) {
          this.contentDownloadable[this.content.identifier] = false;
          this.isDownloadStarted = false;
        }
        this.commonUtilService.showToast('SOMETHING_WENT_WRONG');
      });
  }


  /**
   * Subscribe genie event to get content download progress
   */
  subscribeGenieEvent() {
    this.eventSubscription = this.eventBusService.events().subscribe((event: EventsBusEvent) => {
      this.zone.run(() => {
        if (event.type === DownloadEventType.PROGRESS) {
          const downloadEvent = event as DownloadProgress;
          this.downloadProgress = downloadEvent.payload.progress === -1 ? '0' : Math.round(downloadEvent.payload.progress);
        }

        // Get child content
        if (event.payload && event.type === ContentEventType.IMPORT_COMPLETED) {
          if (this.isDownloadStarted) {
            this.isDownloadStarted = false;
            this.cancelDownloading = false;
            this.contentDownloadable[this.content.identifier] = true;
            this.setContentDetails(this.identifier, false);
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

        // For streaming url available
        // if (event.type === ContentEventType.P) {
        //   console.log('res.data', res.data);
        //   this.zone.run(() => {
        //       this.content.contentData.streamingUrl = res.data.streamingUrl;
        //       if (res.data.identifier === this.identifier) {
        //         if (res.data.streamingUrl) {
        //           // this.playContent.contentData.streamingUrl = res.data.streamingUrl;
        //         } else {
        //           this.playOnlineSpinner = false;
        //         }
        //     }
        //   });
        // }
      });
    }) as any;
  }

  /**
   * Download content
   */
  downloadContent() {
    this.zone.run(() => {
      if (this.commonUtilService.networkInfo.isNetworkAvailable) {
        this.downloadProgress = '0';
        this.isDownloadStarted = true;
        const values = new Map();
        values['network-type'] = this.network.type;
        values['size'] = this.content.contentData.size;
        this.importContent([this.identifier], this.isChildContent);
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
          InteractSubtype.UPDATE_INITIATE ? this.isUpdateAvail : InteractSubtype.DOWNLOAD_INITIATE,
          Environment.HOME,
          PageId.CONTENT_DETAIL,
          undefined,
          values,
          this.objRollup,
          this.corRelationList);
      } else {
        this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
      }
    });
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier).toPromise()
      .then(() => {
        this.zone.run(() => {
          this.telemetryGeneratorService.generateContentCancelClickedTelemetry(this.content, this.downloadProgress);
          this.isDownloadStarted = false;
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

  /** function add eclipses to the texts**/
  addElipsesInLongText(msg: string) {
    if (this.commonUtilService.translateMessage(msg).length >= 12) {
      return this.commonUtilService.translateMessage(msg).slice(0, 8) + '....';
    } else {
      return this.commonUtilService.translateMessage(msg);
    }
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
      values['network-type'] = this.network.type;
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.PLAY_ONLINE,
        Environment.HOME,
        PageId.CONTENT_DETAIL,
        undefined,
        values,
        this.objRollup,
        this.corRelationList);
    }
    if (!AppGlobalService.isPlayerLaunched && this.userCount > 1) {
      const profile = this.appGlobalService.getCurrentUser();
      const alert = this.alertCtrl.create({
        title: this.commonUtilService.translateMessage('PLAY_AS'),
        mode: 'wp',
        message: profile.serverProfile ? profile.serverProfile.firstName : profile.handle,
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
            text: this.addElipsesInLongText('CHANGE_USER'),
            cssClass: 'alert-btn-cancel',
            handler: () => {
              const playConfig: any = {};
              playConfig.playContent = true;
              playConfig.streaming = isStreaming;
              this.navCtrl.push(UserAndGroupsPage, {
                playConfig: playConfig
              });
            }
          },
          {
            text: 'x',
            role: 'cancel',
            cssClass: 'closeButton',
          }
        ]
      });
      this.isUsrGrpAlrtOpen = true;
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

        values['autoAfterDownload'] = this.downloadAndPlay;

        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
          InteractSubtype.CONTENT_PLAY,
          Environment.HOME,
          PageId.CONTENT_DETAIL,
          undefined,
          values,
          this.objRollup,
          this.corRelationList);
      });

      if (isStreaming) {
        const extraInfoMap = {hierarchyInfo: []};
        if (this.cardData && this.cardData.hierarchyInfo) {
          extraInfoMap.hierarchyInfo = this.cardData.hierarchyInfo;
        }

        const playContent = this.playingContent;
        const req: ContentMarkerRequest = {
          uid: this.appGlobalService.getCurrentUser().uid,
          contentId: this.identifier,
          data: JSON.stringify(playContent.contentData),
          marker: MarkerType.PREVIEWED,
          isMarked: true,
          extraInfo: extraInfoMap
        };
        const request: ContentAccess = {
          status: ContentAccessStatus.PLAYED,
          contentId: this.identifier,
          contentType: this.content.contentType
        };
        this.contentService.setContentMarker(req).toPromise()
          .then((data) => {
            console.log('setContentMarker', data);
            this.profileService.addContentAccess(request).subscribe();
          }).catch(() => {
        });
      }
      this.downloadAndPlay = false;
      const request: any = {};
      if (isStreaming) {
        request.streaming = isStreaming;
      }

      this.playerService.getPlayerConfig(this.playingContent, request).subscribe((data) => {
        console.log("responseData", data);

        if (data.metaData.mimeType === 'application/vnd.ekstep.ecml-archive') {
          console.log('externalApplicationStorageDirectory', this.file.externalApplicationStorageDirectory);

          this.file.checkFile(`file://${data.metaData.basePath}`, 'index.ecml').then((isAvailable) => {
            console.log('isAvailable', isAvailable);
            this.canvasPlayerService.xmlToJSon(`${data.metaData.basePath}index.ecml`).then((json) => {
              console.log('response', json);
              data['data'] = json;

              this.navCtrl.push(PlayerPage, {config: data});
            }).catch((error) => {
              console.log('error1', error);
            });
          }).catch((err) => {
            console.log('err', err);
            this.canvasPlayerService.readJSON(`${data.metaData.basePath}index.json`).then((json) => {
              console.log('response', json);
              data['data'] = json;
              this.navCtrl.push(PlayerPage, {config: data});
            }).catch((e) => {
              console.log('readJSON error', e);
            });
          });

        } else {
          this.navCtrl.push(PlayerPage, {config: data});
        }
      });
      //  (<any>window).geniecanvas.play(JSON.stringify(this.playingContent), JSON.stringify(request));
    }
  }

  // TODO
  // checkappAvailability() {
  //   this.deviceInfoService.checkAppAvailability(XwalkConstants.APP_ID)
  //     .then((response: any) => {
  //       this.appAvailability = response;
  //     })
  //     .catch((error: any) => {
  //       console.error('Error ', error);
  //     });
  // }

  // checkDeviceAPILevel() {
  //   this.deviceInfoService.getDeviceAPILevel()
  //     .then((res: any) => {
  //       this.apiLevel = res;
  //     }).catch((error: any) => {
  //       console.error('Error ', error);
  //     });
  // }

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
      pageName: PageId.CONTENT_DETAIL,
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
          this.content.contentData.streamingUrl = this.streamingUrl;
          this.contentDownloadable[this.content.identifier] = false;
          const playContent = this.playingContent;
          playContent.isAvailableLocally = false;
          //   this.content.streamingUrl = this.streamingUrl;
        }
      });
    });
  }

  showBookmarkMenu(event?) {
    const popover = this.popoverCtrl.create(BookmarkComponent, {
      content: this.content,
      isChild: this.isChildContent,
      objRollup: this.objRollup,
      corRelationList: this.corRelationList,
      position: 'bottom'
    }, {
      cssClass: 'bookmark-menu'
    });
    popover.present({
      ev: event
    });
  }

  updateBookmarkPreference() {
    // this.preference.putString(PreferenceKey.IS_BOOKMARK_VIEWED, 'true');
    // this.viewCtrl.dismiss();
    console.log('updateBookmarkPreference');
  }

  /**
   * Shares content to external devices
   */
  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_LIBRARY_INITIATED, this.content.contentType);
    const loader = this.commonUtilService.getLoader();
    loader.present();
    const url = this.baseUrl + ShareUrl.CONTENT + this.content.identifier;
    if (this.contentDownloadable[this.content.identifier]) {
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
      this.social.share(null, null, null, url);
    }

  }

  /**
   * Generates Interact Events
   * @param interactType
   * @param subType
   * @param contentType
   */
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
    this.telemetryGeneratorService.readLessOrReadMore(param, objRollup, corRelationList, telemetryObject);
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
}

