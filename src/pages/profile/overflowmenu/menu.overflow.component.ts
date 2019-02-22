import { CommonUtilService } from './../../../service/common-util.service';
import {
    Component,
    ViewChild
} from '@angular/core';
import {
    NavParams,
    ViewController,
    App,
    Nav,
    Events
} from 'ionic-angular';
import { SettingsPage } from '../../settings/settings';
import {
    OAuthService,
    SharedPreferences,
    ProfileType,
    Profile,
    UserSource,
    TabsPage,
    ContainerService,
    InteractType,
    InteractSubtype,
    PageId,
    Environment,
    TelemetryService,
    ProfileService
} from 'sunbird';
import { OnboardingPage } from '../../onboarding/onboarding';
import {
    initTabs,
    GUEST_STUDENT_TABS,
    GUEST_TEACHER_TABS
} from '../../../app/module.service';
import { generateInteractTelemetry } from '../../../app/telemetryutil';
import { UserAndGroupsPage } from '../../user-and-groups/user-and-groups';
import { TranslateService } from '@ngx-translate/core';
import { ReportsPage } from '../../reports/reports';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { AppGlobalService } from '../../../service/app-global.service';
import { PreferenceKey } from '../../../app/app.constant';

@Component({
    selector: 'menu-overflow',
    templateUrl: 'menu.overflow.html'
})

export class OverflowMenuComponent {
    @ViewChild(Nav) nav;
    items: Array<string>;
    profile: any = {};

    constructor(
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private oauth: OAuthService,
        private telemetryService: TelemetryService,
        private app: App,
        private profileService: ProfileService,
        private preferences: SharedPreferences,
        private translate: TranslateService,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private appGlobalService: AppGlobalService,
        private container: ContainerService,
        private commonUtilService: CommonUtilService,
        private events: Events
    ) {
        this.items = this.navParams.get('list');
        this.profile = this.navParams.get('profile') || {};
    }

    showToast() {
        this.items = this.navParams.get('list') || [];

    }

    close(event, i) {
        this.viewCtrl.dismiss(JSON.stringify({
            'content': event.target.innerText,
            'index': i
        }));
        switch (i) {
            case 'USERS_AND_GROUPS':
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.USER_GROUP_CLICKED,
                    Environment.USER,
                    PageId.PROFILE
                );
                this.app.getActiveNav().push(UserAndGroupsPage, { profile: this.profile });
                break;

            case 'REPORTS':
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.REPORTS_CLICKED,
                    Environment.USER,
                    PageId.PROFILE
                );
                this.app.getActiveNav().push(ReportsPage, { profile: this.profile });
                break;

            case 'SETTINGS': {
                this.telemetryService.interact(generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.SETTINGS_CLICKED,
                    Environment.USER,
                    PageId.PROFILE,
                    null,
                    undefined,
                    undefined
                ));
                this.app.getActiveNav().push(SettingsPage);
                break;
            }
            case 'LOGOUT':
                if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
                    this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
                } else {
                    this.generateLogoutInteractTelemetry(InteractType.TOUCH,
                        InteractSubtype.LOGOUT_INITIATE, '');
                    this.oauth.doLogOut();
                    (<any>window).splashscreen.clearPrefs();
                    const profile: Profile = new Profile();
                    this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN')
                        .then(val => {
                            if (val !== '') {
                                profile.uid = val;
                            } else {
                                this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
                            }

                            profile.handle = 'Guest1';
                            profile.profileType = ProfileType.TEACHER;
                            profile.source = UserSource.LOCAL;

                            this.profileService.setCurrentProfile(true, profile).then(() => {
                                this.navigateToAptPage();
                                this.events.publish(AppGlobalService.USER_INFO_UPDATED);
                            }) .catch(() => {
                                this.navigateToAptPage();
                                this.events.publish(AppGlobalService.USER_INFO_UPDATED);
                            });
                        });
                }

                break;
        }
    }

    navigateToAptPage() {
        if (this.appGlobalService.DISPLAY_ONBOARDING_PAGE) {
            this.app.getRootNav().setRoot(OnboardingPage);
        } else {
            this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE)
                .then(val => {
                    this.appGlobalService.getGuestUserInfo();
                    if (val === ProfileType.STUDENT) {
                        initTabs(this.container, GUEST_STUDENT_TABS);
                    } else if (val === ProfileType.TEACHER) {
                        initTabs(this.container, GUEST_TEACHER_TABS);
                    }
                });
            this.app.getRootNav().setRoot(TabsPage, {
                loginMode: 'guest'
            });
        }
        this.generateLogoutInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGOUT_SUCCESS, '');
    }

    generateLogoutInteractTelemetry(interactType, interactSubtype, uid) {
        const valuesMap = new Map();
        valuesMap['UID'] = uid;
        this.telemetryService.interact(
            generateInteractTelemetry(interactType,
                interactSubtype,
                Environment.HOME,
                PageId.LOGOUT,
                valuesMap,
                undefined,
                undefined
            )
        );
    }
}
