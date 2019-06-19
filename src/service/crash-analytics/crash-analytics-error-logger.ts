import { ErrorHandler, Optional } from '@angular/core';
import { ViewController, NavControllerBase, App } from 'ionic-angular';
import { ActivePageService } from '@app/service/active-page/active-page-service';
import { SunbirdSdk, TelemetryErrorRequest } from 'sunbird-sdk';

export class CrashAnalyticsErrorLogger implements ErrorHandler {

    constructor(
        @Optional() private activePageService: ActivePageService,
        @Optional() private app: App,
    ) {}

    handleError(error: Error | string | any): void {
        console.log('ERROR', error);
        const telemetryErrorRequest: TelemetryErrorRequest = {
            errorCode: '',
            errorType: '',
            stacktrace: '',
            pageId: ''
        };

        const errorLoggerRequest = {
            stackTrace: '',
            errorType: '',
            pageId: ''
        };

        if (error instanceof Error) {
            telemetryErrorRequest.stacktrace = error.stack.slice(0, 250); // 250 characters limited for Telemetry purpose.
            errorLoggerRequest.stackTrace = error.stack.slice(0, 250); // 250 characters limited for API purpose.
            telemetryErrorRequest.errorType = error.name || '';
            errorLoggerRequest.errorType = error.name || '';
        }

        try {
            const navObj: NavControllerBase = this.app.getActiveNavs()[0];
            const activeView: ViewController = navObj.getActive();
            telemetryErrorRequest.pageId = this.activePageService.computePageId((<any>activeView).instance);
            errorLoggerRequest.pageId = this.activePageService.computePageId((<any>activeView).instance);

            SunbirdSdk.instance.telemetryService.error(telemetryErrorRequest).toPromise();

            // SunbirdSdk.instance.errorLoggerService.logError(errorLoggerRequest).toPromise();

        } catch (e) {}

        throw error;
    }

}
