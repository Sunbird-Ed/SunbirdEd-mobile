import { TextbookTocService } from './textbook-toc-service';
import { TextBookTocPage } from './textbook-toc/textbook-toc';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionDetailsEtbPage } from './collection-details-etb';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';
import { Ionic2RatingModule } from 'ionic2-rating';
import { ComponentsModule } from '../../component/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { ContentShareHandler } from '@app/service/content/content-share-handler';

@NgModule({
  declarations: [
    CollectionDetailsEtbPage,
    TextBookTocPage
  ],
  entryComponents: [TextBookTocPage],
  imports: [
    IonicPageModule.forChild(CollectionDetailsEtbPage),
    TranslateModule.forChild(),
    ComponentsModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule,
    PipesModule
  ],
  providers: [
    ContentShareHandler, 
    TextbookTocService],
  exports: [
    CollectionDetailsEtbPage,
    TextBookTocPage
  ]
})
export class CollectionDetailsEtbPageModule { }
