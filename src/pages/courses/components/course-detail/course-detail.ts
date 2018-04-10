import { ParentDetailsComponent } from './../parent-details/parent-details';
import { CourseBatchesComponent } from './../course-batches/course-batches';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { ContentService } from 'sunbird';
import { NgModel } from '@angular/forms';
import * as _ from 'lodash';

/**
 * Generated class for the CourseDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'course-detail',
  templateUrl: 'course-detail.html'
})
export class CourseDetailComponent {

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
   * To hold course hierarchy 
   */
  hierarchyInfo: any;

  /**
   * Contains course structure information
   */
  courseStructure: any;

  /**
   * To get course structure keys
   */
  objectKeys = Object.keys;

  /**
   * Help to show / hide buttons 
   */
  layoutName: string;

  /**
   * Contains download progress
   */
  downloadProgress: any;

  /**
   * Contains carry forward data from courses page
   */
  cardData: any;

  /**
   * To hold content identifier
   */
  identifier: string;

  /**
   * Show more info flag
   */
  showMoreFlag = false;

  /**
   * Contains list of identifiers which are locally not available at SDK 
   */
  downloadableIdentifiers = [];

  /**
   * Contains content size which are locally not available at SDK
   */
  contentDownloadSize: string;

  downloadObject: { totalCount: number, currentCount: 0 };
  showDownloadProgress: boolean;
  totalDownload: number;
  currentCount: number;
  isDownloadComplete = false;
  showResumeBtn: boolean;
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
   * 
   * @param navCtrl 
   * @param navParams 
   * @param contentService 
   */
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, zone: NgZone,
    private events: Events, toastCtrl: ToastController) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  /** 
   * To get content details
   */
  getContentDetails(identifier) {
    const option = {
      contentId: identifier,
      attachFeedback: false,
      attachContentAccess: false,
      refreshContentDetails: false
    }

    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('content details response ==>', data);
        if (data && data.result) {
          this.contentDetail = data.result.contentData ? data.result.contentData : [];
          this.contentDetail.contentTypesCount = this.contentDetail.contentTypesCount ? JSON.parse(this.contentDetail.contentTypesCount) : '';
          if (data.result.isAvailableLocally === false) {
            this.importContent([this.identifier], false);
          } else {
            this.getChildContents();
          }
        }
      });
    },
      error => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showErrorMessage(message, true);
      });
  }

  navigateToChildrenDetailsPage(content, depth) {
    this.navCtrl.push(ParentDetailsComponent, {
      content: content,
      depth: depth
    });
  }

  resumeContent(identifier) {
    console.log('resume content..... =>>>');
    this.childrenData = [];
    this.showResumeBtn = false;
    this.getContentDetails(identifier);
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


  buildImportContentReq(identifiers, isChild: boolean) {
    let reqBody = []
    _.forEach(identifiers, (value, key) => {
      reqBody.push({
        isChildContent: isChild,
        // TODO - check with Anil for destination folder path
        destinationFolder: '/storage/emulated/0/Android/data/org.sunbird.app/files',
        contentId: value,
        correlationData: []
      })
    });

    console.log('reqbody', reqBody);
    return reqBody;
  }

  /**
   * To import content
   */
  importContent(identifiers, isChild: boolean | false): void {
    console.log('importing content ==> ', identifiers);
    this.showChildrenLoader = this.downloadableIdentifiers.length === 0 ? true : false;
    const option = {
      contentImportMap: _.extend({}, this.buildImportContentReq(identifiers, isChild)),
      contentStatusArray: []
    }
    // Call content service
    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Import data =>', data);
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
   * Get child contents
   */
  getChildContents(): void {
    console.log('import child content');
    this.showChildrenLoader = true;
    const option = {
      contentId: this.identifier,
      hierarchyInfo: null,
      level: 1
    };

    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Import child content data success ==>', data)
      this.zone.run(() => {
        this.childrenData = data.result;
        this.showChildrenLoader = false;
        let childData = data.result.children || [];
        this.enableDownloadAllBtn(childData);
      });
    },
      (error: string) => {
        console.log('error while fetching child content', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      });
  }

  enableDownloadAllBtn(data) {
    let size = 0;
    this.zone.run(() => {
      _.forEach(data, (value, key) => {
        if (value.isAvailableLocally === false) {
          this.downloadableIdentifiers.push(value.contentData.identifier);
          size += value.contentData.size;
        }
      });
      this.contentDownloadSize = this.getFileSize(size);
    });

    console.log('download content identifiers', this.downloadableIdentifiers);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.cardData = this.navParams.get('content');
    this.layoutName = this.navParams.get('layoutType');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.showResumeBtn = this.cardData.lastReadContentId ? true : false;
    this.getContentDetails(this.identifier);
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

        if (this.downloadableIdentifiers.length && res.type === 'contentImportProgress') {
          this.zone.run(() => {
          this.showDownloadProgress = true;
          this.totalDownload = res.data.totalCount;
          this.currentCount = res.data.currentCount;
          console.log('totalDownload', this.totalDownload)
          })
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.downloadableIdentifiers.length > 0) {
            // this.showDownloadProgress = false;
            this.isDownloadComplete = true;
          } else {
            this.getChildContents();
          }
        }
      });
    });
  }

  getFileSize(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l)
      n = n / 1024;
    return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
  }

  toggleDetails(flag) {
    this.showMoreFlag = !flag;
  }

  /**
   * Ionic default function
   */
  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.events.unsubscribe('genie.event');
  }

  /**
   * Navigate user to batch list page
   * 
   * @param {string} id 
   */
  navigateToBatchListPage(id: string): void {
    this.navCtrl.push(CourseBatchesComponent, { identifier: this.identifier });
  }
}
