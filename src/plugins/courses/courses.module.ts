import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild()
  ],
  exports: [
    CoursesPage
  ]
})
export class CoursesPageModule {}
