import { ProfileSettingsPageModule } from '../pages/profile-settings/profile-settings.module';
import { ContentDetailsPageModule } from './../pages/content-details/content-details.module';
import { CollectionDetailsPageModule } from './../pages/collection-details/collection-details.module';
import { CollectionDetailsEtbPageModule } from './../pages/collection-details-etb/collection-details-etb.module';
import { ViewMoreActivityPageModule } from './../pages/view-more-activity/view-more-activity.module';
import { EnrolledCourseDetailsPageModule } from './../pages/enrolled-course-details/enrolled-course-details.module';
import { CourseBatchesPageModule } from './../pages/course-batches/course-batches.module';
import { GuestProfilePage } from '../pages/profile/guest-profile/guest-profile';
import { ProfilePage } from '../pages/profile/profile';
import { ResourcesPage } from '../pages/resources/resources';
import { CoursesPageModule } from '../pages/courses/courses.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ResourcesPageModule } from '../pages/resources/resources.module';
import { OnboardingPageModule } from '../pages/onboarding/onboarding.module';
import { LanguageSettingsPageModule } from '../pages/language-settings/language-settings.module';
import { UserTypeSelectionPageModule } from '../pages/user-type-selection/user-type-selection.module';
import { QRScannerModule } from '../pages/qrscanner/qrscanner.module';
import { SearchModule } from '../pages/search/search.module';
import { CoursesPage } from '../pages/courses/courses';
import { PageFilterMoudule } from '../pages/page-filter/page.filter.module';
import { UserAndGroupsPageModule } from '../pages/user-and-groups/user-and-groups.module';
import { ReportsPageModule } from '../pages/reports/reports.module';
import { UserReportModule } from '../pages/reports/user-report/user-report.module';
import { QrCodeResultPageModule } from '../pages/qr-code-result/qr-code-result.module';
import { TermsAndConditionsPageModule } from '@app/pages/terms-and-conditions/terms-and-conditions.module';
import { ContainerService, TabOptions } from '../service/container.services';
import { DownloadManagerPageModule } from '../pages/download-manager/download-manager.module';
import { DownloadManagerPage } from '../pages/download-manager/download-manager';
import { ActiveDownloadsPageModule } from '../pages/active-downloads/active-downloads.module';
import { StorageSettingsPageModule } from '../pages/storage-settings/storage-settings.module';
import { TextbookViewMorePageModule } from '../pages/textbook-view-more/textbook-view-more.module';


// const HOME_TAB = { root: HomePage, icon: "home", label: "HOME_BNAV", index: 0, tabsHideOnSubPages: true };
const COURSE_TAB = {
    root: CoursesPage,
    icon: 'courses',
    label: 'COURSES_BNAV',
    index: 2,
    tabsHideOnSubPages: true
};

const COURSE_TAB_DISABLED = {
    root: '',
    icon: 'courses',
    label: 'COURSES_BNAV',
    index: 2,
    tabsHideOnSubPages: true,
    disabled: true
};

const SCANNER_TAB = {
    root: '',
    icon: 'qrscanner',
    // label: 'LIBRARY_BNAV',
    index: 3,
    tabsHideOnSubPages: true
};
const LIBRARY_TAB = {
    root: ResourcesPage,
    icon: 'resources',
    label: 'LIBRARY_BNAV',
    index: 1,
    tabsHideOnSubPages: true,
    isSelected: true
};
const GUEST_PROFILE_TAB = {
    root: GuestProfilePage,
    icon: 'profile',
    label: 'PROFILE_BNAV',
    index: 5,
    tabsHideOnSubPages: true
};
const GUEST_PROFILE_SWITCH_TAB = {
    root: GuestProfilePage,
    icon: 'profile',
    label: 'PROFILE_BNAV',
    index: 5,
    tabsHideOnSubPages: true,
    isSelected: true
};
const PROFILE_TAB = {
    root: ProfilePage,
    icon: 'profile',
    label: 'PROFILE_BNAV',
    index: 5,
    tabsHideOnSubPages: true
};

const DOWNLOADS_TAB = {
    root: '',
    icon: 'downloads',
    label: 'DOWNLOAD_BNAV',
    index: 4,
    tabsHideOnSubPages: true
};

const DOWNLOADS_TAB_DISABLED = {
    root: DownloadManagerPage,
    icon: 'downloads',
    label: 'DOWNLOAD_BNAV',
    index: 4,
    tabsHideOnSubPages: true,
    // disabled: true,
    // availableLater: true    // This flag holds value for indicating that this tab will be available in the later releases
};

export const GUEST_TEACHER_TABS = [
    // HOME_TAB,
    LIBRARY_TAB,
    COURSE_TAB,
    SCANNER_TAB,
    DOWNLOADS_TAB_DISABLED,
    GUEST_PROFILE_TAB
];

export const LOGIN_TEACHER_TABS = [
    // HOME_TAB,
    LIBRARY_TAB,
    COURSE_TAB,
    SCANNER_TAB,
    DOWNLOADS_TAB_DISABLED,
    PROFILE_TAB
];

export const GUEST_STUDENT_TABS = [
    LIBRARY_TAB,
    COURSE_TAB_DISABLED,
    SCANNER_TAB,
    DOWNLOADS_TAB_DISABLED,
    GUEST_PROFILE_TAB
];

export const GUEST_TEACHER_SWITCH_TABS = [
    // HOME_TAB,
    LIBRARY_TAB,
    COURSE_TAB,
    SCANNER_TAB,
    DOWNLOADS_TAB_DISABLED,
    GUEST_PROFILE_SWITCH_TAB
];

export const GUEST_STUDENT_SWITCH_TABS = [
    LIBRARY_TAB,
    COURSE_TAB_DISABLED,
    SCANNER_TAB,
    DOWNLOADS_TAB_DISABLED,
    GUEST_PROFILE_SWITCH_TAB
];

export const initTabs = (container: ContainerService, tabs: Array<TabOptions>) => {
    container.removeAllTabs();

    /* istanbul ignore else  */
    if (tabs && tabs.length > 0) {
        tabs.forEach(tabOptions => {
            container.addTab(tabOptions);
        });
    }
};

export const PluginModules = [
    CoursesPageModule,
    ProfilePageModule,
    ResourcesPageModule,
    OnboardingPageModule,
    LanguageSettingsPageModule,
    UserTypeSelectionPageModule,
    CourseBatchesPageModule,
    EnrolledCourseDetailsPageModule,
    QRScannerModule,
    SearchModule,
    CollectionDetailsPageModule,
    CollectionDetailsEtbPageModule,
    ContentDetailsPageModule,
    ViewMoreActivityPageModule,
    PageFilterMoudule,
    UserAndGroupsPageModule,
    ReportsPageModule,
    UserReportModule,
    ProfileSettingsPageModule,
    QrCodeResultPageModule,
    TermsAndConditionsPageModule,
    DownloadManagerPageModule,
    ActiveDownloadsPageModule,
    StorageSettingsPageModule,
    TextbookViewMorePageModule
];
