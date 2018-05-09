import { ChildContentDetailsPage } from './../child-content-details/child-content-details';
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { ContentService, FileUtil } from 'sunbird';
import { NgModel } from '@angular/forms';
import * as _ from 'lodash';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';

/**
 * Generated class for the EnrolledCourseDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enrolled-course-details',
  templateUrl: 'enrolled-course-details.html',
})
export class EnrolledCourseDetailsPage {

  /**
   * Contains content details
   */
  course: any;

  /**
   * To hide menu
   */
  tabBarElement: any;

  /**
   * Contains children content data
   */
  childrenData: Array<any>;

  startData: any;

  /**
   * Show loader while importing content
   */
  showChildrenLoader: boolean;

  /**
   * Contains identifier(s) of locally not available content(s)
   */
  downloadIdentifiers = [];

  /**
   * Contains total size of locally not available content(s)
   */
  downloadSize: string;

  /**
   * Flag to show / hide resume button
   */
  showResumeBtn: boolean;

  /**
   * Contains card data of previous state
   */
  cardData: any;

  /**
   * To get course structure keys
   */
  objectKeys = Object.keys;

  /**
   * To hold identifier
   */
  identifier: string;

  /**
   * Contains child content import / download progress
   */
  downloadProgress: any;

  showDownloadProgress: boolean;
  totalDownload: number;
  currentCount: number;
  isDownloadComplete = false;

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
    private events: Events, toastCtrl: ToastController, private fileUtil: FileUtil) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  /**
   * Set course details by passing course identifier
   * 
   * @param {string} identifier 
   */
  setContentDetails(identifier): void {
    this.contentService.getContentDetail({ contentId: identifier }, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('enrolled course details: ', data);
        if (data && data.result) {
          this.extractApiResponse(data);
        }
      });
    },
      (error: any) => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showErrorMessage(message, true);
      });
  }

  /**
   * Function to extract api response. Check content is locally available or not.
   * If locally available then make childContents api call else make import content api call
   * 
   * @param data 
   */
  extractApiResponse(data): void {
    this.course = data.result.contentData ? data.result.contentData : [];

    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Content locally available. Geting child content... @@@");
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
    this.setCourseStructure();
  }

  /**
   * Set course structure
   */
  setCourseStructure(): void {
    if (this.course.contentTypesCount) {
      this.course.contentTypesCount = JSON.parse(this.course.contentTypesCount);
    } else if (this.cardData.contentTypesCount && !_.isObject(this.cardData.contentTypesCount)) {
      this.course.contentTypesCount = JSON.parse(this.cardData.contentTypesCount);
    }
  }

  /**
   * Log telemetry
   */
  logTelemetry(): void {

  }

  /**
   * Function to get import content api request params
   * 
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild 
   */
  getImportContentRequestBody(identifiers, isChild: boolean) {
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
  importContent(identifiers, isChild: boolean) {
    this.showChildrenLoader = this.downloadIdentifiers.length === 0 ? true : false;
    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody(identifiers, isChild)),
      contentStatusArray: []
    }
    // Call content service
    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: Import content =>', data);
      this.zone.run(() => {
        if (data.result && data.result[0].status === 'NOT_FOUND') {
          const message = 'Unable to fetch content';
          this.showErrorMessage(message, false);
          this.showChildrenLoader = false;
        }
      });
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
  setChildContents(): void {
    // this.zone.run(() => { this.showChildrenLoader = true;});
    this.showChildrenLoader = true;
    const option = { contentId: this.identifier, hierarchyInfo: null, level: 1 };
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents ===>>>', data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
          this.startData = data.result.children;
        }
        this.showChildrenLoader = false;
        // this.showDownloadAllBtn(this.childrenData);
        this.getContentsSize(this.childrenData);
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
   * Redirect to child content details page
   * @param content 
   * @param depth 
   */
  navigateToChildrenDetailsPage(content, depth): void {
    this.zone.run(() => {
      if (content.contentType === 'Course') {
        console.warn('Inside CourseDetailPage >>>');
        this.navCtrl.push(CourseDetailPage, {
          content: content,
          depth: depth
        })
      } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
        console.warn('Inside CollectionDetailsPage >>>');
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
      // this.downloadContentsSize = this.getReadableFileSize(size);
    });

    console.log('download content identifiers', this.downloadIdentifiers);
  }

  getContentsSize(data) {
    this.downloadSize = this.downloadSize;
    _.forEach(data, (value, key) => {
      if (value.children && value.children.length) {
        this.getContentsSize(value.children);
      }

      if (value.isAvailableLocally === false) {
        this.downloadIdentifiers.push(value.contentData.identifier);
        this.downloadSize += +value.contentData.size;
      }
    });
  }

  /**
   * Function gets executed when user click on resume course button.
   * 
   * @param {string} identifier 
   */
  resumeContent(identifier): void {
    console.log('resume content..... =>>>');
    this.childrenData = [];
    this.showResumeBtn = false;
    this.setContentDetails(identifier);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    console.log('Inside enrolled course details page');
    this.tabBarElement.style.display = 'none';
    this.cardData = this.navParams.get('content');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.showResumeBtn = this.cardData.lastReadContentId ? true : false;
    this.setContentDetails(this.identifier);
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
          if (this.downloadIdentifiers.length === 0) {
            this.setChildContents();
          } else {
            this.isDownloadComplete = true;
          }
        }
      });
    });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
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
   * Navigate user to batch list page
   * 
   * @param {string} id 
   */
  navigateToBatchListPage(id: string): void {
    // this.navCtrl.push(CourseBatchesPageModule, { identifier: this.identifier });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnrolledCourseDetailsPage');
  }

  /**
   * Get executed when user click on start button
   */
  startContent() {
    let data = this.childrenData;
    if (this.startData && this.startData.length) {
      let firstChild = _.first(_.values(this.startData), 1);
      this.navigateToChildrenDetailsPage(firstChild, 1);
    }
  }
}
