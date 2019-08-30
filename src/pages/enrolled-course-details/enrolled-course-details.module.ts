import { CourseBatchesPageModule } from './../course-batches/course-batches.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from './enrolled-course-details';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';
import { Ionic2RatingModule } from 'ionic2-rating';
import { ComponentsModule } from './../../component/components.module';
import { DirectivesModule } from './../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { EnrollmentDetailsPageModule } from './enrollment-details/enrollment-details.module';
import { ContentShareHandler } from '@app/service/content/content-share-handler';

@NgModule({
  declarations: [
    EnrolledCourseDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EnrolledCourseDetailsPage),
    TranslateModule.forChild(),
    CourseBatchesPageModule,
    ComponentsModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule,
    PipesModule,
    EnrollmentDetailsPageModule
  ],
  providers: [
    ContentShareHandler
  ],
  exports: [
    EnrolledCourseDetailsPage
  ]
})
export class EnrolledCourseDetailsPageModule { }
