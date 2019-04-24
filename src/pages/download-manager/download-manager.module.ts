import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadManagerPage } from './download-manager';

@NgModule({
  declarations: [
    DownloadManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadManagerPage),
  ],
})
export class DownloadManagerPageModule {}
