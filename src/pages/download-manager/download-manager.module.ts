import { NoDownloadsComponent } from './no-downloads/no-downloads';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadManagerPage } from './download-manager';


@NgModule({
  declarations: [
    DownloadManagerPage,
    NoDownloadsComponent
  ],
  imports: [
    IonicPageModule.forChild(DownloadManagerPage),
  ],
})
export class DownloadManagerPageModule {}
