import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
  @Input() contentDetail: any;
  @Input() defaultAppIcon: string;
  @Input() localImage: string;
  @Input() showDownloadBtn: boolean;
  @Input() isDepthChild: boolean;
  @Input() isDownloadStarted: boolean;


  @Output() downloadAllContent = new EventEmitter();
  text: string;

  constructor() {
  }

  ngOnInit() {
  }

  downloadAllContents() {
    this.downloadAllContent.emit();
    console.log('emited!');
  }

}
