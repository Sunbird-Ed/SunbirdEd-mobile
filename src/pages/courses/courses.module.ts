import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { TranslateModule } from '@ngx-translate/core';
// TODO: remove it before pushing the code
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { ComponentsModule } from "../../component/components.module";

@NgModule({
  declarations: [
    CoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild(),
    HttpModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [HttpClient],
  exports: [
    CoursesPage
  ]
})
export class CoursesPageModule {}
