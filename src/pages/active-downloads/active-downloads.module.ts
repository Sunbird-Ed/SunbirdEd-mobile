import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveDownloadsPage } from './active-downloads';

@NgModule({
  declarations: [
    ActiveDownloadsPage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveDownloadsPage),
  ],
})
export class ActiveDownloadsPageModule {}
