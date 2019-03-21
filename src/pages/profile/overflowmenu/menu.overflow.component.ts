import {CommonUtilService} from './../../../service/common-util.service';
import {Component, ViewChild} from '@angular/core';
import {App, Nav, NavParams, ViewController} from 'ionic-angular';
import {SettingsPage} from '../../settings/settings';
import {UserAndGroupsPage} from '../../user-and-groups/user-and-groups';
import {TranslateService} from '@ngx-translate/core';
import {ReportsPage} from '../../reports/reports';
import {TelemetryGeneratorService} from '../../../service/telemetry-generator.service';
import {LogoutHandlerService} from '../../../service/handlers/logout-handler.service';
import {AppGlobalService} from '../../../service/app-global.service';
import {
    Environment,
    InteractSubtype,
    InteractType,
    PageId,
} from '../../../service/telemetry-constants';
import { ContainerService } from '@app/service/container.services';

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
      private logoutHandlerService: LogoutHandlerService,
      private app: App,
      private translate: TranslateService,
      private telemetryGeneratorService: TelemetryGeneratorService,
      private appGlobalService: AppGlobalService,
      private container: ContainerService,
      private commonUtilService: CommonUtilService,
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
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.SETTINGS_CLICKED,
                    Environment.USER,
                    PageId.PROFILE,
                    null,
                    undefined,
                    undefined
                );
                this.app.getActiveNav().push(SettingsPage);
                break;
            }
            case 'LOGOUT':
                if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
                    this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
                } else {
                  this.logoutHandlerService.onLogout();
                }
                break;
        }
    }
}
