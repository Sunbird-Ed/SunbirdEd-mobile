import {SplashscreenActionHandlerDelegate} from "./splashscreen-action-handler-delegate";
import {Observable} from "rxjs";
import {Inject, Injectable} from "@angular/core";
import {TelemetryService, InteractType} from "sunbird-sdk";
import {Environment} from "@app/service/telemetry-constants";

interface TelemetryActionPayload {
  eid: 'IMPRESSION' | 'INTERACT',
  extraInfo?: {
    isFirstTime?: boolean
  }
}

@Injectable()
export class SplashcreenTelemetryActionHandlerDelegate implements SplashscreenActionHandlerDelegate {
  constructor(@Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService) {
  }

  onAction(type: string, payload: TelemetryActionPayload): Observable<undefined> {
    switch (payload.eid) {
      case 'IMPRESSION': {
        return this.telemetryService.impression({
          env: Environment.HOME,
          pageId: 'splash'
        }).mapTo(undefined);
      }
      case 'INTERACT': {
        return this.telemetryService.interact({
          env: Environment.HOME,
          type: InteractType.OTHER,
          pageId:'splash',
          id:'splash',
          subType: 'splash',
          valueMap: {
            ...payload.extraInfo!
          }
        }).mapTo(undefined);
      }
      default: {
        return Observable.of(undefined);
      }
    }
  }
}
