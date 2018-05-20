import { ContentRatingAlertComponent } from './../../component/content-rating-alert/content-rating-alert';
import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, Platform, Navbar, PopoverController } from 'ionic-angular';
import { CourseBatchesPage } from './../course-batches/course-batches';
import { ContentService, FileUtil, ImpressionType, PageId, Environment, TelemetryService, Start, Mode, End, AuthService } from 'sunbird';
import * as _ from 'lodash';
import { generateImpressionEvent } from '../../app/telemetryutil';

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

  details: any;

  course: any;

  userId: string = '';

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

  private objId;
  private objType;
  private objVer;
  @ViewChild(Navbar) navBar: Navbar;
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, private telemetryService: TelemetryService, zone: NgZone,
    private events: Events, toastCtrl: ToastController, private fileUtil: FileUtil,
    private platform: Platform,
    public popoverCtrl: PopoverController,
    public authService: AuthService) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.toastCtrl = toastCtrl;
    console.warn('Inside course details page');
    this.platform.registerBackButtonAction(() => {
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      this.navCtrl.pop();
    }, 0)
    this.authService.getSessionData((res: string) => {
      if (res === undefined || res === "null") {
        this.userId = '';
      } else {
        res = JSON.parse(res);
        this.userId = res["userToken"];
      }
    });
  }

  /**
   * Function to rate content
   */
  rateContent() {
    if (this.userId) {
      // TODO: check content is played or not
      let popUp = this.popoverCtrl.create(ContentRatingAlertComponent, {
        content: this.course,
      }, {
          cssClass: 'onboarding-alert'
        });
      popUp.present({
        ev: event
      });
      popUp.onDidDismiss(data => {
        if (data === 'rating.success') {
          this.navCtrl.pop();
        }
      });
    }
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
          this.extractApiResponse(data);
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
   * To check content is locally available or not.
   * If not then make import content api call else make getChildContents api call to get children
   */
  extractApiResponse(data): void {
    // this.contentDetail = data.result.contentData ? data.result.contentData : [];
    this.course = data.result.contentData ? data.result.contentData : [];
    if (this.course.status != 'Live') {
      this.navCtrl.pop();
    }
    if (this.course.me_totalDownloads) {
      this.course.me_totalDownloads = this.course.me_totalDownloads.split('.')[0];
    }

    this.objId = this.course.identifier;
    this.objType = this.course.contentType;
    this.objVer = this.course.pkgVersion;

    this.generateStartEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
    this.generateImpressionEvent(this.course.identifier, this.course.contentType, this.course.pkgVersion);
    this.setCourseStructure();

    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Course locally available. Geting child content... @@@");
        this.course.size = data.result.sizeOnDevice;
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
  }

  /**
   * Set course structure info
   */
  setCourseStructure() {
    this.showChildrenLoader = true;
    this.course.contentTypesCount = this.course.contentTypesCount ? JSON.parse(this.course.contentTypesCount) : '';
  }

  /**
   * Function to set child contents
   */
  setChildContents() {
    console.log('Making child contents api call... @@@');
    const option = { contentId: this.identifier, hierarchyInfo: null, level: 1 };
    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: child contents ===>>>', data);
      this.zone.run(() => {
        if (data && data.result && data.result.children) {
          this.childrenData = data.result.children;
        } else {
          this.childrenData = [];
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
          // this.showChildrenLoader = false;
        })
      });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.cardData = this.navParams.get('content');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    this.setContentDetails(this.identifier, true);
    this.subscribeGenieEvent();
  }

  ionViewDidEnter() {
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.generateEndEvent(this.objId, this.objType, this.objVer);
      this.navCtrl.pop();
    }
  }

  generateImpressionEvent(objectId, objectType, objectVersion) {
    this.telemetryService.impression(generateImpressionEvent(ImpressionType.DETAIL,
      PageId.COURSE_DETAIL,
      Environment.HOME,
      objectId,
      objectType,
      objectVersion));
  }

  generateStartEvent(objectId, objectType, objectVersion) {
    let start = new Start();
    start.type = objectType;
    start.pageId = PageId.COURSE_DETAIL;
    start.env = Environment.HOME;
    start.mode = Mode.PLAY;
    start.objId = objectId;
    start.objType = objectType;
    start.objVer = objectVersion;
    this.telemetryService.start(start);
  }

  generateEndEvent(objectId, objectType, objectVersion) {
    let end = new End();
    end.type = objectType;
    end.pageId = PageId.COURSE_DETAIL;
    end.env = Environment.HOME;
    end.mode = Mode.PLAY;
    end.objId = objectId;
    end.objType = objectType;
    end.objVer = objectVersion;
    this.telemetryService.end(end);
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
          this.downloadProgress = res.data.downloadProgress === -1 ? '0 %' : res.data.downloadProgress + ' %';
        }

        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          this.setChildContents();
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
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
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
    this.navCtrl.push(CourseBatchesPage, { identifier: this.identifier });
  }
}
