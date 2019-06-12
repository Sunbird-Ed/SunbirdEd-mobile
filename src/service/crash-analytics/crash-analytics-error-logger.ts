import { ErrorHandler, Inject, Optional } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { ViewController, NavControllerBase, App } from 'ionic-angular';
import { ActivePageService } from '@app/service/active-page/active-page-service';
import { TelemetryService, SunbirdSdk } from 'sunbird-sdk';

export class CrashAnalyticsErrorLogger implements ErrorHandler {

    private appVersion = '';
    private appId = '';

    constructor(
        @Optional() private appVersionService: AppVersion,
        @Optional() private activePageService: ActivePageService,
        @Optional() private app: App,
    ) {
        window.addEventListener('unhandledrejection', this.handleError);

        this.appVersionService.getPackageName().then((res: any) => {
            if (res) { this.appId = res; }
        });

        this.appVersionService.getVersionNumber().then((res: any) => {
            if (res) { this.appVersion = res; }
        });

    }

    handleError(error: any): void {
        let stackTace = '';
        let errorPageId = '';

        if (typeof error === 'string') {
            error = new Error(error);
        }

        if (error && error.stack) {
            stackTace = error.stack.slice(0, 250); // 250 characters limited for Telemetry purpose.
        }

        if (this.app && this.activePageService) {
            const navObj: NavControllerBase = this.app.getActiveNavs()[0];
            const activeView: ViewController = navObj.getActive();
            errorPageId = this.activePageService.computePageId((<any>activeView).instance);
        }

        SunbirdSdk.instance.telemetryService.error({
            errorCode: '',
            errorType: error.name || '',
            stacktrace: stackTace,
            pageId: errorPageId
        });

        throw error;
    }

}
