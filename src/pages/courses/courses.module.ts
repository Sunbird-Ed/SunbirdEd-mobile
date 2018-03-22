import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { TranslateModule } from '@ngx-translate/core';
import { CourseCard } from '../../component/card/course/course-card';
import { Ionic2RatingModule } from "ionic2-rating";
// TODO: remove it before pushing the code
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FrameworkModule } from "sunbird";
import { IonicImageLoader } from "ionic-image-loader";


@NgModule({
  declarations: [
    CoursesPage,
    CourseCard
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild(),
    Ionic2RatingModule,
    HttpModule,
    HttpClientModule,
    FrameworkModule,
    IonicImageLoader
  ],
  providers: [HttpClient],
  exports: [
    CoursesPage
  ]
})
export class CoursesPageModule {
}
