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
  ToastController
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
  constructor(private events: Events,
    private zone: NgZone,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private contentService: ContentService,
    private navCtrl: NavController,
    private fileUtil: FileUtil,
    private navParams: NavParams) {
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
  }
}
