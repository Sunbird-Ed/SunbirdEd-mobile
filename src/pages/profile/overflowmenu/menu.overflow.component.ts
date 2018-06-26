import { Nav } from "ionic-angular";
import { Component, ViewChild } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { App } from "ionic-angular";

import { SettingsPage } from "../../settings/settings";
import { OAuthService, SharedPreferences, ProfileType } from "sunbird";
import { OnboardingPage } from "../../onboarding/onboarding";
import { Interact, InteractType, InteractSubtype, PageId, Environment, TelemetryService, ProfileService } from "sunbird";
import { generateInteractTelemetry } from "../../../app/telemetryutil";

@Component({
    selector: 'menu-overflow',
    templateUrl: 'menu.overflow.html'
})

export class OverflowMenuComponent {
    @ViewChild(Nav) nav;
    items: Array<string>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private oauth: OAuthService,
        private telemetryService: TelemetryService,
        private app: App,
        private profileService: ProfileService,
        private preferences: SharedPreferences
    ) {
        this.items = this.navParams.get("list") || [];
    }

    close(event, i) {
        this.viewCtrl.dismiss(JSON.stringify({
            "content": event.target.innerText,
            "index": i
        }));
        switch (i) {
            case 0: {
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
            case 1: {
                this.generateLogoutInteractTelemetry(InteractType.TOUCH,
                    InteractSubtype.LOGOUT_INITIATE, "");
                this.oauth.doLogOut();
                (<any>window).splashscreen.clearPrefs();

                this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN', (val) => {
                    if (val != "") {
                        let profileRequest = {
                            uid: val,
                            handle: "Guest1", //req
                            avatar: "avatar", //req
                            language: "en", //req
                            age: -1,
                            day: -1,
                            month: -1,
                            standard: -1,
                            profileType: ProfileType.TEACHER
                        };
                        this.profileService.setCurrentProfile(true, profileRequest, res => {}, error => {});
                    } else {
                        this.profileService.setAnonymousUser(success => {}, error => {});
                    }
                });

                this.app.getRootNav().setRoot(OnboardingPage);
                this.generateLogoutInteractTelemetry(InteractType.OTHER,
                    InteractSubtype.LOGOUT_SUCCESS, "");
                break;
            }

        }
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