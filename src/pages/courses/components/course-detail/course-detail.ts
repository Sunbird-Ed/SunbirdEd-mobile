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

  showMoreFlag = false;

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
  getContentDetails() {
    const option = {
      contentId: this.identifier,
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
            this.importContent();
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
   * To import content
   */
  importContent(): void {
    console.log('importing content ==> ');
    this.showChildrenLoader = true;
    const option = {
      contentImportMap: {
        [0]: {
          isChildContent: false,
          // TODO: need discussion with Swayangjit
          destinationFolder: '/storage/emulated/0/Android/data/org.sunbird.app/files',
          contentId: this.identifier,
          correlationData: []
        }
      },
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
    console.log('import child content')
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
      });
      let childData = data.result.children || []
      this.enableDownloadAllBtn(childData);
    },
      (error: string) => {
        console.log('error while fetching child content', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      });
  }

  enableDownloadAllBtn(data) {
    let filtered_people;
    let downloadContentIds = [];
    this.zone.run(() => {

      _.forEach(data, function (value, key) {
        console.log('isAvailableLocally... => ', value.isAvailableLocally);
        if (value.isAvailableLocally === false) {
          downloadContentIds.push()
        }
      });

      filtered_people = _.filter(data, function (p) {
        return _.includes(false, p.isAvailableLocally);
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
    this.getContentDetails();
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
        // Show download percentage
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress + ' %';
        }
        // Get child content
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          this.getChildContents();
        }
      });
    });
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
