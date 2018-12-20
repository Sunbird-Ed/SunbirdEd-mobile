import { ContentRatingAlertComponent } from './content-rating-alert/content-rating-alert';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CourseCard } from './card/course/course-card';
import { IncompleteProfileCard } from './card/incomplete-profile/incomplete-profile-card';
import { HomeAnnouncementCard } from './card/home/home-announcement-card';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageLoader } from 'ionic-image-loader';
import { SignInCardComponent } from './sign-in-card/sign-in-card';
import { OnboardingCardComponent } from './onboarding-card/onboarding-card';
import { OnboardingAlert } from './onboarding-alert/onboarding-alert';
import { OnboardingService } from './onboarding-card/onboarding.service';
import { PBHorizontal } from './pbhorizontal/pb-horizontal';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert';
import { ReportIssuesComponent } from './report-issues/report-issues';
import { FormAndFrameworkUtilService } from '../pages/profile/formandframeworkutil.service';
import { AssessmentDetailsComponent } from './assessment-details/assessment-details';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ViewMoreCardComponent } from './view-more-card/view-more-card';
import { ViewCreditsComponent } from './view-credits/view-credits';
import { ProfileAvatarComponent } from './profile-avatar/profile-avatar';
import { DialogPopupComponent } from './dialog-popup/dialog-popup';
import { BookmarkComponent } from './bookmark/bookmark';
import { UnenrollAlertComponent } from './unenroll-alert/unenroll-alert';

@NgModule({
    declarations: [
        CourseCard,
        IncompleteProfileCard,
        HomeAnnouncementCard,
        ViewMoreCardComponent,
        SignInCardComponent,
        OnboardingCardComponent,
        OnboardingAlert,
        PBHorizontal,
        ConfirmAlertComponent,
        // ContentActionsComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent,
        AssessmentDetailsComponent,
        ViewCreditsComponent,
        ProfileAvatarComponent,
        DialogPopupComponent,
        BookmarkComponent,
        UnenrollAlertComponent
    ],
    imports: [
        IonicPageModule.forChild(CourseCard),
        TranslateModule.forChild(),
        Ionic2RatingModule,
        IonicImageLoader,
        PipesModule,
        NgxDatatableModule,
        IonicModule
    ],
    exports: [
        CourseCard,
        IncompleteProfileCard,
        HomeAnnouncementCard,
        ViewMoreCardComponent,
        SignInCardComponent,
        OnboardingCardComponent,
        OnboardingAlert,
        PBHorizontal,
        ConfirmAlertComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent,
        AssessmentDetailsComponent,
        ViewCreditsComponent,
        ProfileAvatarComponent,
        DialogPopupComponent,
        BookmarkComponent,
        UnenrollAlertComponent
        // ContentActionsComponent
    ],
    entryComponents: [
        OnboardingAlert,
        ConfirmAlertComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent,
        ViewCreditsComponent,
        DialogPopupComponent,
        UnenrollAlertComponent
    ],
    providers: [
        OnboardingService,
        FormAndFrameworkUtilService
    ]
})
export class ComponentsModule { }
