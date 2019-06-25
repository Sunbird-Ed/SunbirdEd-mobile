import { ErrorHandler, Optional } from '@angular/core';
import { ViewController, NavControllerBase, App } from 'ionic-angular';
import { ActivePageService } from '@app/service/active-page/active-page-service';
import { SunbirdSdk, TelemetryErrorRequest } from 'sunbird-sdk';

export class CrashAnalyticsErrorLogger extends ErrorHandler {

    constructor(
        @Optional() private activePageService: ActivePageService,
        @Optional() private app: App,
    ) {
        super();
        window.addEventListener('unhandledrejection', this.handleError);
    }

    handleError(error: Error | string | any): void {
        const telemetryErrorRequest: TelemetryErrorRequest = {
            errorCode: '',
            errorType: '',
            stacktrace: '',
            pageId: ''
        };

        if (error instanceof Error) {
            telemetryErrorRequest.stacktrace = error.stack.slice(0, 250); // 250 characters limited for Telemetry and API purpose.
            telemetryErrorRequest.errorType = error.name || '';
        }

        try {
            const navObj: NavControllerBase = this.app.getActiveNavs()[0];
            const activeView: ViewController = navObj.getActive();
            telemetryErrorRequest.pageId = this.activePageService.computePageId((<any>activeView).instance);
        } catch (e) { }

        if (SunbirdSdk.instance && telemetryErrorRequest.stacktrace) {
            SunbirdSdk.instance.telemetryService.error(telemetryErrorRequest).toPromise();
        }

        super.handleError(error);
    }

}
