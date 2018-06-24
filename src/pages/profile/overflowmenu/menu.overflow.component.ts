import { Nav } from "ionic-angular";
import { Component, ViewChild } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { ToastController, App } from "ionic-angular";
import { SettingsPage } from "../../settings/settings";
import { ReportPage } from '../../settings/reports/reports'
import { GroupReportListPage } from '../../settings/reports/group-report-list/group-report-list'
import { OAuthService } from "sunbird";
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

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private oauth: OAuthService,
        private telemetryService: TelemetryService,
        private app: App,
        private profileService: ProfileService
    ) {
        this.items = this.navParams.get("list");
    }

    showToast(toastCtrl: ToastController, message: String) {

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
                this.profileService.setAnonymousUser(success => {

                },
                    error => {

                    });
                this.app.getRootNav().setRoot(OnboardingPage);
                this.generateLogoutInteractTelemetry(InteractType.OTHER,
                    InteractSubtype.LOGOUT_SUCCESS, "");
                break;
            }

        }
    }

    goToReports(){

        this.app.getActiveNav().push(ReportPage);
    }
    goToGroupReports(){
       
        this.app.getActiveNav().push(GroupReportListPage);
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
                undefined));
    }

}