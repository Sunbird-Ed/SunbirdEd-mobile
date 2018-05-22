import { ContentDetailsPageModule } from './../pages/content-details/content-details.module';
import { CollectionDetailsPageModule } from './../pages/collection-details/collection-details.module';
import { ViewMoreActivityPageModule } from './../pages/view-more-activity/view-more-activity.module';
import { EnrolledCourseDetailsPageModule } from './../pages/enrolled-course-details/enrolled-course-details.module';
import { CourseBatchesPageModule } from './../pages/course-batches/course-batches.module';
import { ChildContentDetailsPageModule } from './../pages/child-content-details/child-content-details.module';
import { CourseDetailPageModule } from './../pages/course-detail/course-detail.module';

import { ContainerService } from "sunbird";

import { GuestProfilePage } from "../pages/profile/guest-profile/guest-profile";
import { ProfilePage } from "../pages/profile/profile";
import { ResourcesPage } from "../pages/resources/resources";
import { CoursesPageModule } from "../pages/courses/courses.module";
import { GroupPageModule } from "../pages/group/group.module";
import { HomePageModule } from "../pages/home/home.module";
import { ProfilePageModule } from "../pages/profile/profile.module";
import { ResourcesPageModule } from "../pages/resources/resources.module";
import { OnboardingPageModule } from "../pages/onboarding/onboarding.module";
import { LanguageSettingsPageModule } from "../pages/language-settings/language-settings.module";
import { UserTypeSelectionPageModule } from "../pages/user-type-selection/user-type-selection.module";
import { QRScannerModule } from "../pages/qrscanner/qrscanner.module";
import { SearchModule } from "../pages/search/search.module";
import { HomePage } from '../pages/home/home';
import { CoursesPage } from '../pages/courses/courses';

export function initUserTabs(container: ContainerService) {
    container.removeAllTabs();
    container.addTab({ root: HomePage, icon: "home", label: "HOME_BNAV", index: 0, tabsHideOnSubPages: true });
    container.addTab({ root: CoursesPage, icon: "courses", label: "COURSES_BNAV", index: 1, tabsHideOnSubPages: true });
    container.addTab({ root: ResourcesPage, icon: "resources", label: "LIBRARY_BNAV", index: 2, tabsHideOnSubPages: true });
    container.addTab({ root: ProfilePage, icon: "profile", label: "PROFILE_BNAV", index: 3, tabsHideOnSubPages: true });
}

export function initGuestTabs(container: ContainerService) {
    container.removeAllTabs();
    container.addTab({ root: HomePage, icon: "home", label: "HOME_BNAV", index: 0, tabsHideOnSubPages: true });
    container.addTab({ root: CoursesPage, icon: "courses", label: "COURSES_BNAV", index: 1, tabsHideOnSubPages: true });
    container.addTab({ root: ResourcesPage, icon: "resources", label: "LIBRARY_BNAV", index: 2, tabsHideOnSubPages: true });
    container.addTab({ root: GuestProfilePage, icon: "profile", label: "PROFILE_BNAV", index: 3, tabsHideOnSubPages: true });
}

export const PluginModules = [
    CoursesPageModule,
    GroupPageModule,
    HomePageModule,
    ProfilePageModule,
    ResourcesPageModule,
    OnboardingPageModule,
    LanguageSettingsPageModule,
    UserTypeSelectionPageModule,
    CourseDetailPageModule,
    ChildContentDetailsPageModule,
    CourseBatchesPageModule,
    EnrolledCourseDetailsPageModule,
    QRScannerModule,
    SearchModule,
    CollectionDetailsPageModule,
    ContentDetailsPageModule,
    ViewMoreActivityPageModule
];
