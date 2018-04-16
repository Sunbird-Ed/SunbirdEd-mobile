import { PipesModule } from './../pipes/pipes.module';
import { NgModule } from "@angular/core";
import { CourseCard } from "./card/course/course-card";

import { HomeAnnouncementCard } from './card/home/home-announcement-card'
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from "ionic2-rating";
import { IonicImageLoader } from "ionic-image-loader";
import { ViewMoreActivityListComponent } from './view-more-activity-list/view-more-activity-list';

@NgModule({
    declarations: [
        CourseCard, HomeAnnouncementCard, ViewMoreActivityListComponent
    ],
    imports: [
        IonicPageModule.forChild(CourseCard),
        Ionic2RatingModule,
        IonicImageLoader,
        PipesModule
    ],
    exports: [
        CourseCard, HomeAnnouncementCard, ViewMoreActivityListComponent
    ]
})
export class ComponentsModule { }
