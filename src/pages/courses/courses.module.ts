import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { TranslateModule } from '@ngx-translate/core';
// TODO: remove it before pushing the code
import { IonicImageLoader } from 'ionic-image-loader';
import { ComponentsModule } from '../../component/components.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { DirectivesModule } from './../../directives/directives.module';
import { ResourcesPageModule } from '../resources/resources.module';

@NgModule({
  declarations: [
    CoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild(),
    ResourcesPageModule,
    ComponentsModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule
  ],
  providers: [],
  exports: [
    CoursesPage,
  ]
})
export class CoursesPageModule { }
