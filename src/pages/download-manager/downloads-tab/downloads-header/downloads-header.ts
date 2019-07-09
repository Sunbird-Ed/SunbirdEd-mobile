import { AppStorageInfo } from './../../download-manager.interface';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'downloads-header',
  templateUrl: 'downloads-header.html'
})
export class DownloadsHeaderComponent {

  @Input() storageInfo: AppStorageInfo;
  @Input() appName: string;

  constructor() {

  }
}
