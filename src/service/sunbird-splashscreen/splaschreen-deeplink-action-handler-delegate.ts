import { SplashscreenActionHandlerDelegate } from '@app/service/sunbird-splashscreen/splashscreen-action-handler-delegate';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, MimeType } from '@app/app';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { ContentService, Content } from 'sunbird-sdk';
import { App } from 'ionic-angular';
import { AppGlobalService } from '@app/service';
import { SearchPage } from '@app/pages/search';
import { PageId } from '../telemetry-constants';

@Injectable()
export class SplaschreenDeeplinkActionHandlerDelegate implements SplashscreenActionHandlerDelegate {
  constructor(@Inject('CONTENT_SERVICE') private contentService: ContentService,
    private appGlobalServices: AppGlobalService,
    private app: App) {
  }

  onAction(type: string, { identifier }: any): Observable<undefined> {
    const navObj = this.app.getRootNavs()[0];
    switch (type) {
      case 'content': {
          return this.contentService.getContentDetails({
            contentId: identifier
          }).do(async (content: Content) => {
            if (content.contentType === ContentType.COURSE.toLowerCase()) {
              await navObj.push(EnrolledCourseDetailsPage, { content });
            } else if (content.mimeType === MimeType.COLLECTION) {
              await navObj.push(CollectionDetailsEtbPage, { content });
            } else {
              await navObj.push(ContentDetailsPage, { content });
            }
          }).mapTo(undefined) as any;
        }
      case 'dial': {
          navObj.push(SearchPage, { dialCode: identifier, source: PageId.HOME });
          return Observable.of(undefined);
      }
      default: {
        return Observable.of(undefined);
      }
    }
  }
}
