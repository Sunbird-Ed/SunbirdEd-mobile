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

@NgModule({
  declarations: [
    CollectionDetailsEtbPage,
  ],
  entryComponents: [],
  imports: [
    IonicPageModule.forChild(CollectionDetailsEtbPage),
    TranslateModule.forChild(),
    ComponentsModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule,
    PipesModule
  ],
  providers: [],
  exports: [
    CollectionDetailsEtbPage
  ]
})
export class CollectionDetailsEtbPageModule { }
