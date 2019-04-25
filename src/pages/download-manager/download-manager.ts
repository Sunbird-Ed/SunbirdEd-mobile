// import { SortAttribute } from './download-manager.interface';
import { DownloadManagerPageInterface, AppStorageInfo } from './download-manager.interface';
import { MenuOverflow } from './../../app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonUtilService } from '@app/service';
import { SbPopoverComponent } from './../../component/popups/sb-popover/sb-popover';
import { Component, NgZone, Inject, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ContentRequest, ContentService } from 'sunbird-sdk';
import { Content } from 'sunbird-sdk';
import { downloadsDummyData } from './downloads-spec.data';
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

  constructor() { }

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

}
