import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { TranslateModule } from '@ngx-translate/core';
// TODO: remove it before pushing the code
import { HttpModule } from '@angular/http';
import { GenieSDKServiceProvider } from 'sunbird';
import { FrameworkModule } from "sunbird";
import { IonicImageLoader } from "ionic-image-loader";
import { ComponentsModule } from "../../component/components.module";
import { Ionic2RatingModule } from "ionic2-rating";
import { DirectivesModule } from './../../directives/directives.module';
import { CourseFilter } from './filters/course.filter';
import { CourseFilterOptions } from './filters/options/filter.options';
import { ResourcesPageModule } from '../resources/resources.module';

@NgModule({
  declarations: [
    CoursesPage,
    CourseFilter,
    CourseFilterOptions
  ],
  entryComponents: [
    CourseFilter,
    CourseFilterOptions
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild(),
    ResourcesPageModule,
    HttpModule,
    ComponentsModule,
    FrameworkModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule
  ],
  providers: [GenieSDKServiceProvider],
  exports: [
    CoursesPage,
  ]
})
export class CoursesPageModule { }
