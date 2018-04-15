import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { ContentService } from 'sunbird';
import { NgModel } from '@angular/forms';
import * as _ from 'lodash';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseDetailPage } from '../course-detail/course-detail';

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
   * To hide menu
   */
  tabBarElement: any;

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
   * 
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
   * Total downlaod count
   */
  totalDownload: number;

  /**
   * Current download count 
   */
  currentCount: number;

  /**
   * Content details
   */
  details: any;

  /**
   * Contains identifier(s) of locally not available content(s)
   */
  downloadIdentifiers = [];

  /**
   * Contains total size of locally not available content(s)
   */
  downloadContentsSize: string;

  /**
   * Contains loader instance
   */
  loader: any;

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

  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, zone: NgZone,
    private events: Events, toastCtrl: ToastController, loadingCtrl: LoadingController) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.loadingCtrl = loadingCtrl;
    console.warn('Inside new module..........................');
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
      this.details = data.result;
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
        const message = 'Something went wrong, please check after some time';
        this.loader.dismiss();
        this.showErrorMessage(message, true);
      });
  }

  /**
   * Function to extract api response.
   */
  extractApiResponse(data) {
    this.contentDetail = data.result.contentData ? data.result.contentData : [];
    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Content locally available. Geting child content... @@@");
        this.contentDetail.size = data.result.sizeOnDevice;
        this.setChildContents();
        break;
      }
      case false: {
        console.log("Content locally not available. Import started... @@@");
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

  /**
   * Set collection structure
   */
  setCollectionStructure() {
    this.showChildrenLoader = true;
    if (this.contentDetail.contentTypesCount) {
      this.contentDetail.contentTypesCount = JSON.parse(this.contentDetail.contentTypesCount);
    } else if (this.cardData.contentTypesCount) {
      this.contentDetail.contentTypesCount = JSON.parse(this.cardData.contentTypesCount);
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
        destinationFolder: '/storage/emulated/0/Android/data/org.sunbird.app/files',
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
        if (data.result && data.result[0].status === 'NOT_FOUND') {
          const message = 'Unable to fetch content';
          this.showErrorMessage(message, false);
        } else {
          console.log('Success: content imported successfully... @@@', data);
        }
        // this.showChildrenLoader = false;
      })
    },
      error => {
        this.zone.run(() => {
          console.log('error while loading content details', error);
          const message = 'Something went wrong, please check after some time';
          this.showErrorMessage(message, false);
          this.showChildrenLoader = false;
        })
      });
  }

  /**
   * Function to set child contents
   */
  setChildContents() {
    console.log('Making child contents api call... @@@');
    // this.zone.run(() => { this.showChildrenLoader = true; });
    const option = { contentId: this.identifier, hierarchyInfo: null, level: 1 };
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents data =', data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
        }
        if (!this.isDepthChild) {
          this.showDownloadAllBtn(data.result.children || []);
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
          size += value.contentData.size;
        }
      });
      this.downloadContentsSize = this.getReadableFileSize(size);
      console.log('download content identifiers', this.downloadIdentifiers);
      if (this.downloadIdentifiers.length) {
        this.showDownloadBtn = true;
      }
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.resetVariables();
    this.cardData = this.navParams.get('content');
    let depth = this.navParams.get('depth');
    if (depth !== undefined) {
      this.depth = depth;
      this.showDownloadBtn = false;
      this.isDepthChild = true;
    }
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.setContentDetails(this.identifier, true);
    this.subscribeGenieEvent();
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
    this.downloadProgress = '';
    this.cardData = '';
    this.childrenData = [];
    this.contentDetail = '';
    this.showDownloadBtn = false;
    this.downloadIdentifiers = [];
    this.isDepthChild = false;
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
          this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress + ' %';
        }

        if (this.downloadIdentifiers.length && res.type === 'contentImportProgress') {
          this.totalDownload = res.data.totalCount;
          this.currentCount = res.data.currentCount;
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.isDownloadStarted) {
            this.isDownloadStarted = false;
            this.showDownloadBtn = false;
            this.downloadProgress = '0 %';
          } else {
            this.setChildContents();
          }
        }
      });
    });
  }

  /**
   * Show error messages
   * 
   * @param {string}  message Error message
   * @param {boolean} isPop True = navigate to previous state
   */
  showErrorMessage(message: string, isPop: boolean | false): void {
    if (this.isDownloadStarted) {
      this.showDownloadBtn = true;
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
   * Download single content
   */
  downloadAllContent(): void {
    this.isDownloadStarted = true;
    this.importContent(this.downloadIdentifiers, true);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.downloadProgress = '';
    this.tabBarElement.style.display = 'flex';
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
}
