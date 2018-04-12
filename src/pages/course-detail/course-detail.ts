import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { CourseBatchesPage } from './../course-batches/course-batches';
import { ContentService } from 'sunbird';
import { NgModel } from '@angular/forms';
import * as _ from 'lodash';

/**
 * Generated class for the CourseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-detail',
  templateUrl: 'course-detail.html',
})
export class CourseDetailPage {
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
   * Layout name
   */
  layoutName: string;

  /**
   * Contains
   */
  showDownloadBtn: string;

  /**
   * 
   */
  contentPlayBtn = false;

  /**
   * Contains download progress
   */
  showDownloadProgress: boolean;

  totalDownload: number;

  currentCount: number;

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

  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, zone: NgZone,
    private events: Events, toastCtrl: ToastController) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    console.warn('Inside new module..........................');
  }

  /**
   * To set content details in local variable
   * 
   * @param {string} identifier identifier of content / course
   */
  setContentDetails(identifier, refreshContentDetails: boolean | true) {
    const option = { contentId: identifier, refreshContentDetails: refreshContentDetails }
    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('Content details ==>>>>>', data);
        if (data && data.result) {
          this.checkContentType(data);
        }
      });
    },
      error => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showErrorMessage(message, true);
      });
  }

  /**
   * 
   * @param {object} data 
   */
  checkContentType(data) {
    this.details = data.result;
    console.log('Contane base path ===>>>>', this.details);
    this.contentDetail = data.result.contentData ? data.result.contentData : [];
    let mimeType = this.contentDetail.mimeType;
    this.contentDetail.contentTypesCount = this.contentDetail.contentTypesCount ? JSON.parse(this.contentDetail.contentTypesCount) : '';
    if (mimeType === 'application/vnd.ekstep.content-collection' && data.result.isAvailableLocally === false) {
      this.importContent([this.identifier], false);
      this.contentDetail.contentSize = this.contentDetail.size ? this.getReadableFileSize(+this.contentDetail.size) : '';
      this.showDownloadBtn = 'downloadAll';
    } else if (data.result.isAvailableLocally === true && mimeType !== 'application/vnd.ekstep.content-collection') {
      this.setChildContents();
      this.contentDetail.contentSize = this.getReadableFileSize(data.result.sizeOnDevice);
      this.contentPlayBtn = true;
    } else if (data.result.isAvailableLocally === true && mimeType === 'application/vnd.ekstep.content-collection') {
      this.contentPlayBtn = true;
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
      data = JSON.parse(data);
      console.log('Success: Import content =>', data);
      if (data.result && data.result[0].status === 'NOT_FOUND') {
        const message = 'Unable to fetch content';
        this.showErrorMessage(message, false);
        this.showChildrenLoader = false;
      }
    },
      error => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showErrorMessage(message, false);
        this.showChildrenLoader = false;
      });
  }

  /**
   * Function to set child contents
   */
  setChildContents() {
    this.showChildrenLoader = true;
    const option = { contentId: this.identifier, hierarchyInfo: null, level: 1 };
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents ===>>>', data);
      this.zone.run(() => {
        this.childrenData = data.result;
        this.showChildrenLoader = false;
        this.showDownloadAllBtn(data.result.children || []);
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
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.cardData = this.navParams.get('content');
    this.layoutName = this.navParams.get('layoutType');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.setContentDetails(this.identifier, true);
    this.subscribeGenieEvent();
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
        // Show download percentage
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress + ' %';
        }

        // Get executed when user clicks on download all button
        if (this.downloadIdentifiers.length && res.type === 'contentImportProgress') {
          this.showDownloadProgress = true;
          this.totalDownload = res.data.totalCount;
          this.currentCount = res.data.currentCount;
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
            this.setChildContents();
            this.setContentDetails(this.identifier, false);
        }
      });
    });
  }

  /**
   * Show error messages
   * 
   * @param message
   */
  showErrorMessage(message: string, isPop: boolean | false): void {
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
  downloadContent() {
    this.importContent([this.identifier], false);
  }

  /**
   * 
   */
  playContent() {
    let details = JSON.stringify(this.details);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.events.unsubscribe('genie.event');
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
    });

    console.log('download content identifiers', this.downloadIdentifiers);
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
   * Navigate user to batch list page
   * 
   * @param {string} id 
   */
  navigateToBatchListPage(id: string): void {
    this.navCtrl.push(CourseBatchesPage, { identifier: this.identifier });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnrolledCourseDetailsPage');
  }
}
