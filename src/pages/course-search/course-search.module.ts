import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseSearchPage } from './course-search';

@NgModule({
  declarations: [
    CourseSearchPage,
  ],
  entryComponents: [
   CourseSearchPage
  ],
  imports: [
    IonicPageModule.forChild(CourseSearchPage),
  ],
})
export class CourseSearchPageModule {}
