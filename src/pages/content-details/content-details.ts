import { ContentActionsComponent } from './../../component/content-actions/content-actions';
import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, PopoverController, Navbar, Platform } from 'ionic-angular';
import { ContentService, FileUtil, ImpressionType, PageId, Environment, TelemetryService,  Mode, End, ShareUtil, InteractType, InteractSubtype, Rollup } from 'sunbird';
import { SocialSharing } from "@ionic-native/social-sharing";
import * as _ from 'lodash';
import { generateInteractEvent, Map, generateImpressionWithRollup, generateStartWithRollup, generateInteractWithRollup } from '../../app/telemetryutil';
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
   * To show download button if content locally not available
   */
  showDownloadBtn: boolean = false;

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
   * To play content
   */
  playContentBtn: boolean = false;

  /**
   * Contains loader instance
   */
  loader: any;

  downloadingText: string = 'DOWNLOADING... ';

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


  private objId;
  private objType;
  private objVer;
  private didViewLoad: boolean;
  private backButtonFunc = undefined;
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
    private social: SocialSharing, private platform: Platform, private translate: TranslateService) {
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
      refreshContentDetails: refreshContentDetails
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
    this.content.playContent = JSON.stringify(data.result);
    if (this.content.gradeLevel && this.content.gradeLevel.length) {
      this.content.gradeLevel = this.content.gradeLevel.join(", ");
    }
    this.objId = this.content.identifier;
    this.objType = data.result.contentType;
    this.objVer = this.content.pkgVersion;


    // Check locally available
    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Content locally available. Lets play the content");
        this.content.size = data.result.sizeOnDevice;
        // this.playContentBtn = true;
        break;
      }
      case false: {
        console.log("Content locally not available. Import started... @@@");
        // this.showDownloadBtn = true;
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

    this.telemetryService.impression(generateImpressionWithRollup(
      ImpressionType.DETAIL,
      PageId.CONTENT_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      this.objRollup
    ));
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    this.telemetryService.start(generateStartWithRollup(
      PageId.CONTENT_DETAIL,
      objectId,
      objectType,
      objectVersion,
      this.objRollup
    ));
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    let end = new End();
    end.type = objectType;
    end.pageId = PageId.CONTENT_DETAIL;
    end.env = Environment.HOME;
    end.mode = Mode.PLAY;
    end.objId = objectId;
    end.objType = objectType;
    end.objVer = objectVersion;
    this.telemetryService.end(end);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.cardData = this.navParams.get('content');
    this.cardData.depth = this.navParams.get('depth') === undefined ? '' : this.navParams.get('depth');
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
      // this.showDownloadBtn = true;
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
        // TODO - check with Anil for destination folder path
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
    this.importContent([this.identifier], false);
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, (data: any) => {
      this.isDownloadStarted = false;
      this.downloadProgress = '';
      this.content.downloadable = false;
    }, (error: any) => {
      console.log('Error: download error =>>>>>', error)
    })
  }

  /**
   * Play content
   */
  playContent() {
    this.telemetryService.interact(
      generateInteractWithRollup(InteractType.TOUCH,
        InteractSubtype.CONTENT_PLAY,
        Environment.HOME,
        PageId.CONTENT_DETAIL, null, this.objRollup)
    );
    (<any>window).geniecanvas.play(this.content.playContent);
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
      isChild: false
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
    });
  }

  share() {
    this.generateShareInteractEvents(InteractType.TOUCH, InteractSubtype.SHARE_LIBRARY_INITIATED, this.content.contentType);
    let loader = this.getLoader();
    loader.present();
    let url = "https://staging.open-sunbird.org/public/#!/content/" + this.content.identifier;
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
      generateInteractEvent(interactType,
        subType,
        Environment.HOME,
        PageId.CONTENT_DETAIL, values)
    );
  }
}
