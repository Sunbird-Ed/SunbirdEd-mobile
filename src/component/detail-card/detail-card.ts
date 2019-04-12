import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {Content} from "sunbird-sdk";

/**
 * Generated class for the DetailCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'detail-card',
  templateUrl: 'detail-card.html'
})
export class DetailCardComponent implements OnInit {
  @Input() contentDetail: Content;
  @Input() defaultAppIcon: string;
  @Input() localImage: string;
  @Input() showDownloadBtn: boolean;
  @Input() isDepthChild: boolean;
  @Input() isDownloadStarted: boolean;
  @Input() queuedIdentifiers: boolean;
  @Input() currentCount: boolean;


  @Output() downloadAllContent = new EventEmitter();
  @Output() showOverflowMenuEvent = new EventEmitter();
  @Output() shareEvent = new EventEmitter();
  text: string;

  constructor() {
  }

  ngOnInit() {
  }

  downloadAllContents() {
    this.downloadAllContent.emit();
    console.log('emited!');
  }

  showOverflowMenu() {
    this.showOverflowMenuEvent.emit();
  }

  share() {
    this.shareEvent.emit();
  }

}
