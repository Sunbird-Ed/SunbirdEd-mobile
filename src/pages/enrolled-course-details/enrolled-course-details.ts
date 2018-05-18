import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, PopoverController } from 'ionic-angular';
import { ContentService, FileUtil } from 'sunbird';
import * as _ from 'lodash';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { ContentActionsComponent } from '../../component/content-actions/content-actions';
import { ReportIssuesComponent } from '../../component/report-issues/report-issues';
import { TranslateService } from '@ngx-translate/core';

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
  downloadSize: number = 0;

  /**
   * Flag to show / hide resume button
   */
  showResumeBtn: boolean;

  /**
   * Contains card data of previous state
   */
  courseCardData: any;

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
  currentCount: number = 0;
  isDownloadComplete = false;
  queuedIdentifiers: Array<string> = [];
  isDownloadStarted: boolean = false;
  isDownlaodCompleted: boolean = false;

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

  constructor(navCtrl: NavController,
    navParams: NavParams,
    contentService: ContentService,
    zone: NgZone,
    private events: Events,
    toastCtrl: ToastController,
    private fileUtil: FileUtil,
    public popoverCtrl: PopoverController,
    private translate: TranslateService) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  showOverflowMenu(event) {
    let popover = this.popoverCtrl.create(ContentActionsComponent, {
      content: this.course,
    }, {
        cssClass: 'content-action'
      });
    popover.present({
      ev: event
    });

    popover.onDidDismiss(data => {
      if (data === 'delete.success') {
        this.navCtrl.pop();
      } else if (data === 'flag.success') {
        this.navCtrl.pop();
      }
    });
  }

  translateLanguageConstant(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
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
        this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
        this.navCtrl.pop();
      });
  }

  /**
   * Function to extract api response. Check content is locally available or not.
   * If locally available then make childContents api call else make import content api call
   * 
   * @param data 
   */
  extractApiResponse(data): void {
    if (data.result.contentData) {
      if (data.result.contentData.status != 'Live') {
        this.showMessage(this.translateLanguageConstant('ERROR_CONTENT_NOT_AVAILABLE'));
        this.navCtrl.pop();
      }
      this.course = data.result.contentData;
    } else {
      this.showMessage(this.translateLanguageConstant('ERROR_CONTENT_NOT_AVAILABLE'));
      this.navCtrl.pop();
    }

    this.course.isAvailableLocally = data.result.isAvailableLocally;

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
    } else if (this.courseCardData.contentTypesCount && !_.isObject(this.courseCardData.contentTypesCount)) {
      this.course.contentTypesCount = JSON.parse(this.courseCardData.contentTypesCount);
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
          // this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
          // this.showChildrenLoader = false;
        }

        if (data.result && data.result.length && this.isDownloadStarted) {
          _.forEach(data.result, (value, key) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
            this.restoreDownloadState();
          }
        }
      });
    },
      (error: any) => {
        this.zone.run(() => {
          if (this.isDownloadStarted) {
            this.restoreDownloadState();
          } else {
            this.showMessage(this.translateLanguageConstant('ERROR_FETCHING_DATA'));
            this.showChildrenLoader = false;
          }
        });
      });
  }

  restoreDownloadState() {
    this.isDownloadStarted = false;
  }

  downloadAllContent() {
    this.isDownloadStarted = true;
    this.downloadProgress = 0;
    this.importContent(this.downloadIdentifiers, true);
  }

  /**
   * Function to set child contents
   */
  setChildContents(): void {
    // this.zone.run(() => { this.showChildrenLoader = true;});
    this.showChildrenLoader = true;
    const option = { contentId: this.identifier, hierarchyInfo: null };
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents ===>>>', data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
          this.startData = data.result.children;
        }
        this.showChildrenLoader = false;
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

  showMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getContentsSize(data) {
    console.log('downloadSize ==>>>', this.downloadSize);
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
    console.log('downloadIdentifiers =====>>>>>>>>>', this.downloadIdentifiers);
  }

  /**
   * Function gets executed when user click on resume course button.
   * 
   * @param {string} identifier 
   */
  resumeContent(identifier): void {
    console.log('resume content..... =>>>');
    this.childrenData.length = 0;
    this.showResumeBtn = false;
    this.setContentDetails(identifier);
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.downloadSize = 0;
    console.log('Inside enrolled course details page');
    this.tabBarElement.style.display = 'none';
    this.courseCardData = this.navParams.get('content');
    this.identifier = this.courseCardData.contentId || this.courseCardData.identifier;
    this.showResumeBtn = this.courseCardData.lastReadContentId ? true : false;
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
          this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
              this.currentCount++;
              console.log('current download count:', this.currentCount);
              console.log('queuedIdentifiers count:', this.queuedIdentifiers.length);
            }

            if (this.queuedIdentifiers.length === this.currentCount) {
              this.isDownloadStarted = false;
              this.currentCount = 0;
              this.isDownlaodCompleted = true;
              this.isDownloadStarted = false;
              this.downloadIdentifiers.length = 0;
              this.queuedIdentifiers.length = 0;
            }
          } else {
            this.course.isAvailableLocally = true;
            this.setChildContents();
            this.events.publish('savedResources:update', {
              update: true
            });
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
    if (this.startData && this.startData.length) {
      let firstChild = _.first(_.values(this.startData), 1);
      this.navigateToChildrenDetailsPage(firstChild, 1);
    }
  }
}
