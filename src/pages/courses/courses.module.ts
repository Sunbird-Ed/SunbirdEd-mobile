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
import { ParentDetailsComponent } from './components/parent-details/parent-details';
import { CourseBatchesComponent } from './components/course-batches/course-batches';
import { CourseDetailComponent } from './components/course-detail/course-detail';

@NgModule({
  declarations: [
    CoursesPage,
    CourseDetailComponent,
    CourseBatchesComponent,
    ParentDetailsComponent
  ],
  entryComponents: [CourseDetailComponent, CourseBatchesComponent, ParentDetailsComponent],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild(),
    HttpModule,
    ComponentsModule,
    FrameworkModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule
  ],
  providers: [GenieSDKServiceProvider],
  exports: [
    CoursesPage
  ]
})
export class CoursesPageModule { }
