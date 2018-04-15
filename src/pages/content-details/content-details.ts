import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { ContentService } from 'sunbird';
import { NgModel } from '@angular/forms';
import * as _ from 'lodash';

/**
 * Generated class for the ContentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
   * To hide menu
   */
  tabBarElement: any;

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
   * @param zone 
   * @param events 
   * @param toastCtrl 
   */
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
        }
      });
    },
      error => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showErrorMessage(message, true);
      });
  }

  extractApiResponse(data) {
    this.content = data.result.contentData;
    this.content.downloadable = data.result.isAvailableLocally;
    this.content.playContentData = JSON.stringify(data);

    // Check locally available
    switch (data.result.isAvailableLocally) {
      case true: {
        console.log("Content locally available. Lets play the content");
        this.content.size = data.result.sizeOnDevice;
        this.playContentBtn = true;
        break;
      }
      case false: {
        console.log("Content locally not available. Import started... @@@");
        this.showDownloadBtn = true;
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

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.cardData = this.navParams.get('content');
    this.cardData.depth = this.navParams.get('depth') === undefined ? '' : this.navParams.get('depth');
    this.identifier = this.cardData.contentId || this.cardData.identifier;
    // this.resetVariables();
    this.setContentDetails(this.identifier, true);
    this.subscribeGenieEvent();
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.events.unsubscribe('genie.event');
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
      }
    },
      error => {
        console.log('error while loading content details', error);
        const message = 'Something went wrong, please check after some time';
        this.showErrorMessage(message, false);
      });
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
          if (this.isDownloadStarted) {
            this.isDownloadStarted = false;
            this.cancelDownloading = false;
            this.showDownloadBtn = false;
            this.setContentDetails(this.identifier, true);
            this.playContentBtn = true;
          } 
        }
      });
    });
  }

  /**
   * Download content
   */
  downloadContent() {
    this.downloadProgress = '0 %';
    this.isDownloadStarted = true;
    this.importContent([this.identifier], false);
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.identifier, (data: any) => {
      console.log('Success: download success =>>>>>', data)
      this.isDownloadStarted = false;
      this.downloadProgress = '0 %';
      this.playContentBtn = false;
    }, (error: any) => {
      console.log('Error: download error =>>>>>', error)
    })
  }

  /**
   * Play content
   */
  playContent() {
    console.log('Needed Genie canvas data...', this.content.playContentData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContentDetailsPage');
  }
}
