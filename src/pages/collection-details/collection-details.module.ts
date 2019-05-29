import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionDetailsPage } from './collection-details';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';
import { Ionic2RatingModule } from 'ionic2-rating';
import { ComponentsModule } from '../../component/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CollectionDetailsPage,
  ],
  entryComponents: [],
  imports: [
    IonicPageModule.forChild(CollectionDetailsPage),
    TranslateModule.forChild(),
    ComponentsModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule,
    PipesModule
  ],
  providers: [],
  exports: [
    CollectionDetailsPage
  ]
})
export class CollectionDetailsPageModule { }
