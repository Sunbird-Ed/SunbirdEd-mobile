import { ContentRatingAlertComponent } from './content-rating-alert/content-rating-alert';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from './../pipes/pipes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CourseCard } from './card/course/course-card';
import { ResourceCard } from './card/resource/resource-card';
import { IncompleteProfileCard } from './card/incomplete-profile/incomplete-profile-card';
import { IonicPageModule, IonicModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageLoader } from 'ionic-image-loader';
import { SignInCardComponent } from './sign-in-card/sign-in-card';
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
import { EditContactVerifyPopupComponent } from './edit-contact-verify-popup/edit-contact-verify-popup';
import { EditContactDetailsPopupComponent } from './edit-contact-details-popup/edit-contact-details-popup';
import { CollectionChild } from './collection-child/collection-child';

@NgModule({
    declarations: [
        CourseCard,
        IncompleteProfileCard,
        ViewMoreCardComponent,
        SignInCardComponent,
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
        UnenrollAlertComponent,
        EditContactDetailsPopupComponent,
        EditContactVerifyPopupComponent,
        ResourceCard,
        CollectionChild
    ],
    imports: [
        IonicPageModule.forChild(CourseCard),
        TranslateModule.forChild(),
        Ionic2RatingModule,
        IonicImageLoader,
        PipesModule,
        BrowserAnimationsModule,
        NgxDatatableModule,
        IonicModule,
        IonicPageModule.forChild(ResourceCard),
        IonicPageModule.forChild(CollectionChild)
    ],
    exports: [
        CourseCard,
        IncompleteProfileCard,
        ViewMoreCardComponent,
        SignInCardComponent,
        PBHorizontal,
        ConfirmAlertComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent,
        AssessmentDetailsComponent,
        ViewCreditsComponent,
        ProfileAvatarComponent,
        DialogPopupComponent,
        BookmarkComponent,
        UnenrollAlertComponent,
        EditContactDetailsPopupComponent,
        EditContactVerifyPopupComponent,
        ResourceCard,
        CollectionChild
        // ContentActionsComponent
    ],
    entryComponents: [
        ConfirmAlertComponent,
        ReportIssuesComponent,
        ContentRatingAlertComponent,
        ViewCreditsComponent,
        DialogPopupComponent,
        UnenrollAlertComponent,
        EditContactDetailsPopupComponent,
        EditContactVerifyPopupComponent
    ],
    providers: [
        FormAndFrameworkUtilService
    ]
})
export class ComponentsModule { }
