import {
  Component,
  NgZone,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import {
  ContentService,
  FileUtil
} from 'sunbird';
import { AppGlobalService, CommonUtilService, TelemetryGeneratorService, CourseUtilService } from '@app/service';
import {
  IonicPage,
  NavController,
  NavParams,
  Events,
  Platform,
  Navbar,
  PopoverController,
  ToastController,
  ViewController
} from 'ionic-angular';
/**
 * Generated class for the SbDownloadPopupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sb-download-popup',
  templateUrl: 'sb-download-popup.html'
})
export class SbDownloadPopupComponent implements OnChanges {
  @ViewChild(Navbar) navBar: Navbar;
  public didViewLoad: boolean;


  @Output() cancelDownloadEmit = new EventEmitter();
  @Input() queuedIdentifiers: any;
  @Input() currentCount: any;
  @Input() downloadSize: any;
  @Input() collectionName: any;
  @Input() downloadProgress: any;
  @Input() contentName: any;
  @Input() isUpdateAvail: any;
  @Input() showDownload: any;
  @Input() contentAvailableLocally: any;
  constructor(private events: Events,
    private zone: NgZone,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private contentService: ContentService,
    private navCtrl: NavController,
    private fileUtil: FileUtil,
    private navParams: NavParams,
    private viewCtrl: ViewController) {
  }

  togglePopover() {
    console.log('caldddd');
  }
  cancelDownload() {
    this.cancelDownloadEmit.emit();
    console.log('cald');
  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    console.log('contentName', this.contentName);
    console.log('CollectionName', this.collectionName);
    console.log('IsUpdateAvail', this.isUpdateAvail);
    console.log('Download Progress', this.downloadProgress);
    console.log('showDownload', this.showDownload);
    console.log('contentAvailableLocally', this.contentAvailableLocally);
    if (changes['queuedIdentifiers']) {
      this.queuedIdentifiers = this.queuedIdentifiers;
      console.log('this.queuedIdentifiers', this.queuedIdentifiers);
    }
    if (changes['currentCount']) {
      this.currentCount = this.currentCount;
      console.log('this.currentCount', this.currentCount);
    }
    if (changes['downloadSize']) {
      this.downloadSize = this.downloadSize;
      console.log('this.downloadSize', this.currentCount);
    }
    if (changes['downloadProgress']) {
      this.downloadProgress = this.downloadProgress;
      console.log('this.downloadProgress', this.downloadProgress);
      if (this.downloadProgress === 100 && this.contentName && this.contentAvailableLocally) {
        console.log('DownloadProgress Dissmiss()');
        // this.viewCtrl.dismiss();
        this.showDownload = false;
      } else if (this.contentName && this.downloadProgress && this.contentAvailableLocally) {
        console.log('AvailableLocally Dismisss()');
        // this.viewCtrl.dismiss();
        this.showDownload = false;
      } else if (this.contentName && this.contentAvailableLocally) {
        console.log('AvailableLocally Dismisss()');
        this.showDownload = false;
       // this.viewCtrl.dismiss();
      }
    }
    if (changes['contentName']) {
      this.contentName = this.contentName;
      console.log('this.contentName', this.contentName);
    }
  }
}
