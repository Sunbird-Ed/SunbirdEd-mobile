import { ContentRatingAlertComponent } from './content-rating-alert/content-rating-alert';
// import { ContentActionsComponent } from './content-actions/content-actions';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './../pipes/pipes.module';
import { NgModule } from "@angular/core";
import { CourseCard } from "./card/course/course-card";
import { IncompleteProfileCard } from "./card/incomplete-profile/incomplete-profile-card"

import { HomeAnnouncementCard } from './card/home/home-announcement-card'
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from "ionic2-rating";
import { IonicImageLoader } from "ionic-image-loader";
import { ViewMoreActivityListComponent } from './view-more-activity-list/view-more-activity-list';
import { SignInCardComponent } from './sign-in-card/sign-in-card';
import { OnboardingCardComponent } from './onboarding-card/onboarding-card';
import { OnboardingAlert } from './onboarding-alert/onboarding-alert';
import { OnboardingService } from './onboarding-card/onboarding.service';
import { PBHorizontal } from './pbhorizontal/pb-horizontal';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert';
import { ReportIssuesComponent } from './report-issues/report-issues';
import { FormAndFrameworkUtilService } from '../pages/profile/formandframeworkutil.service';


@NgModule({
    declarations: [
        CourseCard,
        IncompleteProfileCard,
        HomeAnnouncementCard,
        ViewMoreActivityListComponent,
        SignInCardComponent,
        OnboardingCardComponent,
        OnboardingAlert,
        PBHorizontal,
        ConfirmAlertComponent,
        // ContentActionsComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent
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
        IncompleteProfileCard,
        HomeAnnouncementCard,
        ViewMoreActivityListComponent,
        SignInCardComponent,
        OnboardingCardComponent,
        OnboardingAlert,
        PBHorizontal,
        ConfirmAlertComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent
        // ContentActionsComponent
    ],
    entryComponents: [
        OnboardingAlert,
        ConfirmAlertComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent
    ],
    providers: [OnboardingService,
        FormAndFrameworkUtilService]
})
export class ComponentsModule { }
