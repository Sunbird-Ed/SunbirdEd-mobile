import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './../pipes/pipes.module';
import { NgModule } from "@angular/core";
import { CourseCard } from "./card/course/course-card";

import { HomeAnnouncementCard } from './card/home/home-announcement-card'
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from "ionic2-rating";
import { IonicImageLoader } from "ionic-image-loader";
import { ViewMoreActivityListComponent } from './view-more-activity-list/view-more-activity-list';
import { SignInCardComponent } from './sign-in-card/sign-in-card';

@NgModule({
    declarations: [
        CourseCard,
        HomeAnnouncementCard,
        ViewMoreActivityListComponent,
        SignInCardComponent
    ],
    imports: [
        IonicPageModule.forChild(CourseCard),
        TranslateModule.forChild(),
        Ionic2RatingModule,
        IonicImageLoader,
        PipesModule
    ],
    exports: [
        CourseCard,
        HomeAnnouncementCard,
        ViewMoreActivityListComponent,
        SignInCardComponent
    ]
})
export class ComponentsModule { }
