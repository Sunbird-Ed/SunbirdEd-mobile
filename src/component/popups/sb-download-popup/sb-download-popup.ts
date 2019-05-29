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
  Events,
  Navbar,
  ViewController
} from 'ionic-angular';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
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
  @Input() contentSize: any;
  private popupUpdate: any;
  private constContentSize: any;
  constructor(private events: Events,
    private zone: NgZone,
    private viewCtrl: ViewController,
    private fileSizePipe: FileSizePipe) {
  }

  togglePopover() {
    console.log('caldddd');
  }
  cancelDownload() {
    this.cancelDownloadEmit.emit();
    this.showDownload = false;
    console.log('cald');
  }
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
   this.popupUpdate = this.isUpdateAvail && this.contentAvailableLocally;
   this.constContentSize = this.fileSizePipe.transform(this.contentSize, 2);
    if (changes['queuedIdentifiers']) {
      this.queuedIdentifiers = this.queuedIdentifiers;
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
        this.showDownload = false;
       } else if (this.contentName && this.downloadProgress && this.contentAvailableLocally) {
        console.log('AvailableLocally Dismisss()');
        this.showDownload = false;
      } else if (this.contentName && this.contentAvailableLocally) {
        console.log('AvailableLocally Dismisss()');
        this.showDownload = false;
      }
    }
    if (changes['contentName']) {
      this.contentName = this.contentName;
      console.log('this.contentName', this.contentName);
    }
  }
}
