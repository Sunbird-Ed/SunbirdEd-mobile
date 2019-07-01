import { SearchCardComponent } from './search-card/search-card';
import { DetailCardComponent } from './detail-card/detail-card';
import { NewCourseCardComponent } from './new-course-card/new-course-card';
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
import { ViewAllCardComponent } from './view-all-card/view-all-card';
import { TextbookCardComponent } from './textbook-card/textbook-card';
import { CollectionChildComponent } from './collection-child/collection-child';
import { ApplicationHeaderComponent } from './application-header/application-header';
import { SbPopoverComponent } from './popups/sb-popover/sb-popover';
import { SbDownloadPopupComponent } from './popups/sb-download-popup/sb-download-popup';
import { SbGenericPopoverComponent } from './popups/sb-generic-popup/sb-generic-popover';
import { SideMenuComponent } from './side-menu/side-menu';
import { DirectivesModule } from '@app/directives/directives.module';
import { AppRatingAlertComponent } from './app-rating-alert/app-rating-alert';
import { SbNoNetworkPopupComponent } from './popups/sb-no-network-popup/sb-no-network-popup';
import { NotificationItemComponent } from './notification-item/notification-item';

@NgModule({
    declarations: [
        CourseCard,
        IncompleteProfileCard,
        ViewMoreCardComponent,
        SignInCardComponent,
        PBHorizontal,
        ConfirmAlertComponent,
        // ContentActionsComponent,
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
        NewCourseCardComponent,
        ViewAllCardComponent,
        DetailCardComponent,
        SearchCardComponent,
        TextbookCardComponent,
        CollectionChildComponent,
        ApplicationHeaderComponent,
        SbPopoverComponent,
        SbDownloadPopupComponent,
        SbGenericPopoverComponent,
        SideMenuComponent,
        AppRatingAlertComponent,
        SbNoNetworkPopupComponent,
        NotificationItemComponent
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
        DirectivesModule
    ],
    exports: [
        CourseCard,
        IncompleteProfileCard,
        ViewMoreCardComponent,
        SignInCardComponent,
        PBHorizontal,
        ConfirmAlertComponent,
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
        NewCourseCardComponent,
        ViewAllCardComponent,
        DetailCardComponent,
        SearchCardComponent,
        TextbookCardComponent,
        CollectionChildComponent,
        ApplicationHeaderComponent,
        SbPopoverComponent,
        SbDownloadPopupComponent,
        SbGenericPopoverComponent,
        SideMenuComponent,
        AppRatingAlertComponent,
        SbNoNetworkPopupComponent,
        NotificationItemComponent
    ],
    entryComponents: [
        ConfirmAlertComponent,
        ContentRatingAlertComponent,
        ViewCreditsComponent,
        DialogPopupComponent,
        UnenrollAlertComponent,
        EditContactDetailsPopupComponent,
        EditContactVerifyPopupComponent,
        ApplicationHeaderComponent,
        SbPopoverComponent,
        SbDownloadPopupComponent,
        SbGenericPopoverComponent,
        AppRatingAlertComponent,
        SbNoNetworkPopupComponent
    ],
    providers: [
    ]
})
export class ComponentsModule { }
