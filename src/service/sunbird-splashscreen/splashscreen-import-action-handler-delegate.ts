import {SplashscreenActionHandlerDelegate} from "@app/service/sunbird-splashscreen/splashscreen-action-handler-delegate";
import {Observable} from "rxjs";
import {
  ContentEventType,
  ContentImportProgress,
  ContentService,
  EventNamespace,
  EventsBusService,
  ProfileService,
  TelemetryService
} from "sunbird-sdk";
import {Inject, Injectable} from "@angular/core";

@Injectable()
export class SplashscreenImportActionHandlerDelegate implements SplashscreenActionHandlerDelegate {
  constructor(@Inject('CONTENT_SERVICE') private contentService: ContentService,
              @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
              @Inject('PROFILE_SERVICE') private profileService: ProfileService,
              @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService) {
  }

  onAction(type: string, payload: { filePath: string }): Observable<undefined> {
    const filePath = 'file://' + payload.filePath;
    const fileExtenstion = filePath.split('.').pop();

    switch (fileExtenstion) {
      case 'ecar': {
        return Observable.of(undefined)
          .do(async () => {
            await this.contentService.importEcar({
              isChildContent: false,
              destinationFolder: cordova.file.externalDataDirectory,
              sourceFilePath: filePath,
              correlationData: []
            }).toPromise();
          }).mergeMap(() => {
            return this.eventsBusService.events(EventNamespace.CONTENT)
              .filter(e => e.type === ContentEventType.IMPORT_PROGRESS)
              .takeUntil(
                this.eventsBusService.events(EventNamespace.CONTENT)
                  .filter(e => e.type === ContentEventType.IMPORT_COMPLETED)
              )
          }).do((event: ContentImportProgress) => {
            splashscreen.setImportProgress(event.payload.currentCount, event.payload.totalCount);
          }).mapTo(undefined) as any;
      }
      case 'epar': {
        return this.profileService.importProfile({
          sourceFilePath: filePath
        }).mapTo(undefined) as any;
      }
      case 'gsa': {
        return this.telemetryService.importTelemetry({
          sourceFilePath: filePath
        }).mapTo(undefined) as any;
      }
      default:
        return Observable.of(undefined);
    }
  }
}
