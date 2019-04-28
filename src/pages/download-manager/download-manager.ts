// import { SortAttribute } from './download-manager.interface';
import { DownloadManagerPageInterface, AppStorageInfo } from './download-manager.interface';
import { MenuOverflow } from './../../app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonUtilService } from '@app/service';
import { SbPopoverComponent } from './../../component/popups/sb-popover/sb-popover';
import { Component, NgZone, Inject, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ContentRequest, ContentService } from 'sunbird-sdk';
import { Content } from 'sunbird-sdk';
import { downloadsDummyData } from './downloads-spec.data';
import { AppHeaderService } from '@app/service';
import { ActiveDownloadsPage } from '../active-downloads/active-downloads';
// import { NoDownloadsComponent } from './../../component/downloads/no-downloads';

/**
 * Generated class for the DownloadManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download-manager',
  templateUrl: 'download-manager.html',
})
export class DownloadManagerPage implements DownloadManagerPageInterface, OnInit {
  headerObservable: any;
  // constructor() { }

  storageInfo: AppStorageInfo;
  // downloadedContents: Content[];
  downloadedContents: any;

  ngOnInit() {
    // throw new Error('not implemented');
    this.downloadedContents = downloadsDummyData;
  }

  deleteContents(contentIds: string[]): void {
    throw new Error('not implemented');
  }

  onSortCriteriaChange(sortAttribute): Content[] {
    throw new Error('not implemented');
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
    private ngZone: NgZone,
    private popoverCtrl: PopoverController,
    private commonUtilService: CommonUtilService,
    private viewCtrl: ViewController,
    private headerServie: AppHeaderService, private events: Events,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
  ) {
    // this.downloadedContentList = downloadsDummyData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadManagerPage');
  }
  ionViewWillEnter() {
    this.events.subscribe('update_header', (data) => {
      this.headerServie.showHeaderWithHomeButton(['download']);
    });
    this.headerObservable = this.headerServie.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });

    this.headerServie.showHeaderWithHomeButton(['download']);
  }
  ionViewWillLeave(): void {
    // if (this.eventSubscription) {
    //   this.eventSubscription.unsubscribe();
    // }
    this.events.unsubscribe('update_header');
    this.headerObservable.unsubscribe();
  }

  handleHeaderEvents($event) {
    console.log('inside handleHeaderEvents', $event);
    switch ($event.name) {
      case 'download': this.download();
        break;
    }
  }

  download() {
    this.navCtrl.push(ActiveDownloadsPage);
  }
}
