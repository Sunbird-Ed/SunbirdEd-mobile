import { Nav, ToastController } from "ionic-angular";
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
import { Network } from "@ionic-native/network";
import { TranslateService } from "@ngx-translate/core";

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
        private preferences: SharedPreferences,
        private network: Network,
        private translate: TranslateService,
        private toastCtrl: ToastController
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
                            this.profileService.setCurrentProfile(true, profileRequest, res => { }, error => { });
                        } else {
                            this.profileService.setAnonymousUser(success => { }, error => { });
                        }
                    });

                    this.app.getRootNav().setRoot(OnboardingPage);
                    this.generateLogoutInteractTelemetry(InteractType.OTHER,
                        InteractSubtype.LOGOUT_SUCCESS, "");
                }

                break;
            }

        }
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