import { ContentDetailsPageModule } from './../pages/content-details/content-details.module';
import { CollectionDetailsPageModule } from './../pages/collection-details/collection-details.module';
import { ViewMoreActivityPageModule } from './../pages/view-more-activity/view-more-activity.module';
import { EnrolledCourseDetailsPageModule } from './../pages/enrolled-course-details/enrolled-course-details.module';
import { CourseBatchesPageModule } from './../pages/course-batches/course-batches.module';
// import { CourseDetailPageModule } from './../pages/course-detail/course-detail.module';

import { ContainerService, TabOptions } from "sunbird";

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
import { PageFilterMoudule } from '../pages/page-filter/page.filter.module';

const HOME_TAB = { root: HomePage, icon: "home", label: "HOME_BNAV", index: 0, tabsHideOnSubPages: true };
const COURSE_TAB = { root: CoursesPage, icon: "courses", label: "COURSES_BNAV", index: 1, tabsHideOnSubPages: true };
const LIBRARY_TAB = { root: ResourcesPage, icon: "resources", label: "LIBRARY_BNAV", index: 2, tabsHideOnSubPages: true, isSelected: true };
const GUEST_PROFILE_TAB = { root: GuestProfilePage, icon: "profile", label: "PROFILE_BNAV", index: 3, tabsHideOnSubPages: true };
const PROFILE_TAB = { root: ProfilePage, icon: "profile", label: "PROFILE_BNAV", index: 3, tabsHideOnSubPages: true };

export const GUEST_TEACHER_TABS = [
    // HOME_TAB,
    COURSE_TAB,
    LIBRARY_TAB,
    GUEST_PROFILE_TAB
]

export const LOGIN_TEACHER_TABS = [
    // HOME_TAB,
    COURSE_TAB,
    LIBRARY_TAB,
    PROFILE_TAB
]

export const GUEST_STUDENT_TABS = [
    LIBRARY_TAB,
    GUEST_PROFILE_TAB
]

export function initTabs(container: ContainerService, tabs: Array<TabOptions>) {
    container.removeAllTabs();

    if (tabs && tabs.length > 0) {
        tabs.forEach(tabOptions => {
            container.addTab(tabOptions);
        })
    } else {
        // TODO: through error / exception.
        console.log("No tab is asigned.");
    }
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
    // CourseDetailPageModule,
    CourseBatchesPageModule,
    EnrolledCourseDetailsPageModule,
    QRScannerModule,
    SearchModule,
    CollectionDetailsPageModule,
    ContentDetailsPageModule,
    ViewMoreActivityPageModule,
    PageFilterMoudule
];
