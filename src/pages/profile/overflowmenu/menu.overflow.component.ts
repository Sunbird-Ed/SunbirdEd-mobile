import {
    Component,
    ViewChild
} from '@angular/core';
import { NavParams, ViewController, App, Nav, ToastController } from "ionic-angular";

import { SettingsPage } from "../../settings/settings";
import {
    OAuthService,
    SharedPreferences,
    ProfileType,
    Profile,
    UserSource,
    TabsPage,
    ContainerService
} from "sunbird";
import { OnboardingPage } from "../../onboarding/onboarding";
import {
    InteractType,
    InteractSubtype,
    PageId,
    Environment,
    TelemetryService,
    ProfileService
} from "sunbird";
import {
    initTabs,
    GUEST_STUDENT_TABS,
    GUEST_TEACHER_TABS,
    LOGIN_TEACHER_TABS
  } from '../../../app/module.service';
import { generateInteractTelemetry } from "../../../app/telemetryutil";
import { UserAndGroupsPage } from "../../user-and-groups/user-and-groups";

import { Network } from "@ionic-native/network";
import { TranslateService } from "@ngx-translate/core";
import { ReportsPage } from "../../reports/reports";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { AppGlobalService } from "../../../service/app-global.service";

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
        private network: Network,
        private translate: TranslateService,
        private toastCtrl: ToastController,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private appGlobal: AppGlobalService,
        private container: ContainerService
    ) {
        this.items = this.navParams.get("list");
        this.profile = this.navParams.get("profile") || {};
    }

    showToast(toastCtrl: ToastController, message: String) {
        this.items = this.navParams.get("list") || [];

    }

    close(event, i) {
        this.viewCtrl.dismiss(JSON.stringify({
            "content": event.target.innerText,
            "index": i
        }));
        switch (i) {
            case "USERS_AND_GROUPS":
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.USER_GROUP_CLICKED,
                    Environment.USER,
                    PageId.PROFILE
                );
                this.app.getActiveNav().push(UserAndGroupsPage, { profile: this.profile });
                break;

            case "REPORTS":
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.REPORTS_CLICKED,
                    Environment.USER,
                    PageId.PROFILE
                );
                this.app.getActiveNav().push(ReportsPage, { profile: this.profile });
                break;

            case "SETTINGS": {
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
            case "LOGOUT":
                if (this.network.type === 'none') {
                    let toast = this.toastCtrl.create({
                        message: this.translateMessage("NEED_INTERNET_TO_CHANGE"),
                        duration: 2000,
                        position: 'bottom'
                    });
                    toast.present();
                }
                else {
                    this.generateLogoutInteractTelemetry(InteractType.TOUCH,
                        InteractSubtype.LOGOUT_INITIATE, "");
                    this.oauth.doLogOut();
                    (<any>window).splashscreen.clearPrefs();

                    this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN', (val) => {
                        if (val != "") {
                            let profile: Profile = new Profile();
                            profile.uid = val;
                            profile.handle = "Guest1";
                            profile.profileType = ProfileType.TEACHER;
                            profile.source = UserSource.LOCAL;

                            this.profileService.setCurrentProfile(true, profile, res => { 
                                navigateToAptPage();
                            }, error => { 
                                navigateToAptPage();
                            });
                        } else {
                            this.profileService.setAnonymousUser(success => {
                                navigateToAptPage();
                             }, error => { 
                                navigateToAptPage();
                             });
                        }
                    });

                   
                }

                break;
        }
    }

    navigateToAptPage(){
        if (this.appGlobal.DISPLAY_ONBOARDING_PAGE) {
            this.app.getRootNav().setRoot(OnboardingPage);
        } else {
            this.preferences.getString('selected_user_type', (val) => {
                this.appGlobal.getGuestUserInfo();
                if (val == ProfileType.STUDENT) {
                    initTabs(this.container, GUEST_STUDENT_TABS);
                } else if (val == ProfileType.TEACHER) {
                    initTabs(this.container, GUEST_TEACHER_TABS);
                }
            });
            this.app.getRootNav().setRoot(TabsPage, {
                loginMode: 'guest'
            });
        }
        this.generateLogoutInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGOUT_SUCCESS, "");
    }

    /**
     * Used to Translate message to current Language
     * @param {string} messageConst - Message Constant to be translated
     * @returns {string} translatedMsg - Translated Message
     */
    translateMessage(messageConst: string): string {
        let translatedMsg = '';
        this.translate.get(messageConst).subscribe(
            (value: any) => {
                translatedMsg = value;
            }
        );
        return translatedMsg;
    }

    generateLogoutInteractTelemetry(interactType, interactSubtype, uid) {
        let valuesMap = new Map();
        valuesMap["UID"] = uid;
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