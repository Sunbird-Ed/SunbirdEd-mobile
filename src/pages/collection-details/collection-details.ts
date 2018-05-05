import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, Platform, Navbar, PopoverController } from 'ionic-angular';
import { ContentService, FileUtil, Start, PageId, Environment, Mode, Impression, ImpressionType, TelemetryService, End, Rollup } from 'sunbird';
import { NgModel } from '@angular/forms';
import * as _ from 'lodash';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseDetailPage } from '../course-detail/course-detail';
import { ContentActionsComponent } from '../../component/content-actions/content-actions';
import { ConfirmAlertComponent } from '../../component/confirm-alert/confirm-alert';
import { TranslateService } from '@ngx-translate/core';
import { generateImpressionWithRollup, generateStartWithRollup, generateEndWithRollup } from '../../app/telemetryutil';

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
   * To hold
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

  downloadPercentage: number;

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
  private objId;
  private objType;
  private objVer;

  public showLoading = false;

  /**
   * Telemetry roll up object
   */
  public objRollup: Rollup;

  @ViewChild(Navbar) navBar: Navbar;
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, zone: NgZone,
    private events: Events, toastCtrl: ToastController, loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    private fileUtil: FileUtil,
    private platform: Platform,
    private telemetryService: TelemetryService, private translate: TranslateService) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.loadingCtrl = loadingCtrl;
    console.warn('Inside new module..........................');
    this.platform.registerBackButtonAction(() => {
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      this.navCtrl.pop();
    }, 0)
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
    const option = { contentId: identifier, refreshContentDetails: refreshContentDetails }
    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('Content details ==>>>>>', data);
        if (data && data.result) {
          this.extractApiResponse(data);
        }
        loader.dismiss();
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
    this.objType = data.result.contentType;
    this.objVer = this.contentDetail.pkgVersion;
    this.generateRollUp();
    this.generateStartEvent(this.contentDetail.identifier, this.contentDetail.contentType, this.contentDetail.pkgVersion);
    this.generateImpressionEvent(this.contentDetail.identifier, this.contentDetail.contentType, this.contentDetail.pkgVersion);
    switch (data.result.isAvailableLocally) {
      case true: {
        this.showLoading = false;
        console.log("Content locally available. Geting child content... @@@");
        this.contentDetail.size = data.result.sizeOnDevice;
        this.setChildContents();
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
    } else {
      this.contentDetail.contentTypesCount;
    }
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
      this.zone.run(() => {
        data = JSON.parse(data);

        if (data.result && data.result.length && this.isDownloadStarted) {
          _.forEach(data.result, (value, key) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            this.showMessage('Unable to fetch content', false);
          }
        }
        console.log('Success: content imported successfully... @@@', data);
        // this.showChildrenLoader = false;
      })
    },
      error => {
        this.zone.run(() => {
          console.log('error while loading content details', error);
          const message = 'Something went wrong, please check after some time';
          this.showMessage(message, false);
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

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.zone.run(() => {
      this.resetVariables();
      this.cardData = this.navParams.get('content');
      let depth = this.navParams.get('depth');
      if (depth !== undefined) {
        this.depth = depth;
        this.showDownloadBtn = false;
        this.isDepthChild = true;
      } else {
        this.isDepthChild = false;
      }
      this.identifier = this.cardData.contentId || this.cardData.identifier;
      this.setContentDetails(this.identifier, true);
      this.subscribeGenieEvent();
    })
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      this.navCtrl.pop();
    }
  }

  navigateToDetailsPage(content: any, depth) {
    console.log('Card details... @@@', content);
    console.log('Content depth... @@@', depth);
    this.zone.run(() => {
      if (content.contentType === 'Course') {
        console.warn('Inside CourseDetailPage >>>');
        this.navCtrl.push(CourseDetailPage, {
          content: content,
          depth: depth
        })
      } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
        console.warn('Inside CollectionDetailsPage >>>');
        this.isDepthChild = true;
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth
        })
      } else {
        console.warn('Inside ContentDetailsPage >>>');
        this.navCtrl.push(ContentDetailsPage, {
          content: content,
          depth: depth
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
    this.downloadProgress = '';
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
          this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
          if (this.downloadProgress === 100) {
            this.showLoading = false;
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
              this.events.publish('savedResources:update', {
                update: true
              });
            }
          } else {
            this.setChildContents();
            this.events.publish('savedResources:update', {
              update: true
            });
          }
        }

      });
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


  /**
   * Download single content
   */
  downloadAllContent(): void {
    this.downloadProgress = '0 %';
    this.showLoading = true;
    this.isDownloadStarted = true;
    this.downloadPercentage = 0;
    this.importContent(this.downloadIdentifiers, true);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.downloadProgress = '';
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
      if (data === 0) {
        this.translateAndDisplayMessage('MSG_RESOURCE_DELETED', false);
        this.events.publish('savedResources:update', {
          update: true
        });
        this.navCtrl.pop();
        /*this.resetVariables();
        this.setContentDetails(this.identifier, false);
        this.events.publish('savedResources:update', {
          update: true
        });*/
      }
    });
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryService.impression(generateImpressionWithRollup(
      ImpressionType.DETAIL,
      PageId.COLLECTION_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion,
      this.objRollup
    ));
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    this.telemetryService.start(generateStartWithRollup(
      PageId.COLLECTION_DETAIL,
      objectId,
      objectType,
      objectVersion,
      this.objRollup
    ));
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    this.telemetryService.end(generateEndWithRollup(
      objectType,
      Mode.PLAY,
      PageId.COLLECTION_DETAIL,
      objectId,
      objectType,
      objectVersion,
      this.objRollup
    ));
  }

  showDownloadAlert(myEvent) {
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
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, (response) => {
      this.showLoading = false;
      this.navCtrl.pop();
    }, (error) => {
      this.showLoading = false;
      this.navCtrl.pop();
    });
  }
}
