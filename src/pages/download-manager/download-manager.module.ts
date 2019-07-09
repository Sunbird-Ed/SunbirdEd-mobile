import { DownloadsHeaderComponent } from './downloads-tab/downloads-header/downloads-header';
import { DownloadsTabPage } from './downloads-tab/downloads-tab';
import { NoDownloadsComponent } from './no-downloads/no-downloads';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadManagerPage } from './download-manager';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    DownloadManagerPage,
    NoDownloadsComponent,
    DownloadsTabPage,
    DownloadsHeaderComponent
  ],
  imports: [
    IonicPageModule.forChild(DownloadManagerPage),
    TranslateModule.forChild(),
    PipesModule,
    DirectivesModule,
  ],
})
export class DownloadManagerPageModule {}
