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
  identifier: any;
  constructor(@Inject('CONTENT_SERVICE') private contentService: ContentService,
    private appGlobalServices: AppGlobalService,
    private app: App) {
  }

  /* checks for contentData, and
   * Navigate to the appropriate page based on content type
   */
  // naviagteNotification(contentData: any) {
  //   if (contentData) {
  //     const navObj = this.app.getRootNavs()[0];
  //     if (contentData.contentType === ContentType.COURSE.toLowerCase()) {
  //       navObj.push(EnrolledCourseDetailsPage, {
  //         content: contentData.contentData
  //       });
  //     } else if (contentData.mimeType === MimeType.COLLECTION) {
  //       navObj.push(CollectionDetailsEtbPage, {
  //         content: contentData.contentData
  //       });
  //     } else {
  //       setTimeout(() => {
  //         navObj.push(ContentDetailsPage, {
  //           content: contentData.contentData
  //         });
  //       }, 1000);
  //     }
  //     // const navObj = this.app.getActiveNavs()[0];
  //   }
  // }

  handleNotification(data) {
    switch (data.actionData.actionType) {
      case 'updateApp':
        console.log('updateApp');
        break;
      case 'courseUpdate' || 'contentUpdate' || 'bookUpdate':
        console.log('courseUpdate');
        this.identifier = data.actionData.identifier;
        break;
      default:
        console.log('Default Called');
        break;
    }
  }

  onAction(type: string, { identifier }: any): Observable<undefined> {
    const navObj = this.app.getRootNavs()[0];
    switch (type) {
      case 'content': {
          return this.contentService.getContentDetails({
            contentId: identifier || this.identifier
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
