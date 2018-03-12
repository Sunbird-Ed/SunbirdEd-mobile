import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { TranslateModule } from '@ngx-translate/core';
import { CourseCard } from '../../component/card/course/course-card';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    CoursesPage,
    CourseCard
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild(),
    Ionic2RatingModule
  ],
  exports: [
    CoursesPage
  ]
})
export class CoursesPageModule {}
