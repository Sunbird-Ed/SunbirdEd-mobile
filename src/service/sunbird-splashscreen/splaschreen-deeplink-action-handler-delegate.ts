import { SplashscreenActionHandlerDelegate } from '@app/service/sunbird-splashscreen/splashscreen-action-handler-delegate';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, MimeType, ActionType } from '@app/app';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { ContentService, Content } from 'sunbird-sdk';
import { App } from 'ionic-angular';
import { AppGlobalService } from '@app/service';
import { SearchPage } from '@app/pages/search';
import { PageId } from '../telemetry-constants';
import { CommonUtilService } from '../common-util.service';

@Injectable()
export class SplaschreenDeeplinkActionHandlerDelegate implements SplashscreenActionHandlerDelegate {
  identifier: any;
  constructor(@Inject('CONTENT_SERVICE') private contentService: ContentService,
    private appGlobalServices: AppGlobalService,
    private app: App,
    private commonUtilService: CommonUtilService) {
  }

  handleNotification(data) {
    switch (data.actionData.actionType) {
      case ActionType.UPDATE_APP:
        console.log('updateApp');
        break;
      case ActionType.COURSE_UPDATE:
        this.identifier = data.actionData.identifier;
        break;
      case ActionType.CONTENT_UPDATE:
        this.identifier = data.actionData.identifier;
        break;
      case ActionType.BOOK_UPDATE:
        this.identifier = data.actionData.identifier;
        break;
      default:
        console.log('Default Called');
        break;
    }
  }

  onAction(type: string, action?: { identifier: string }): Observable<undefined> {
    const navObj = this.app.getRootNavs()[0];
    const identifier: any = action !== undefined ? action.identifier : undefined;
    if (identifier) {
      switch (type) {
        case 'content': {
          const loader = this.commonUtilService.getLoader();
          loader.present();
          return this.contentService.getContentDetails({
            contentId: identifier || this.identifier
          }).catch(() => {
            loader.dismiss();
            return Observable.of(undefined);
          }).do(async (content: Content) => {
            loader.dismiss();
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
    return Observable.of(undefined);
  }
}
