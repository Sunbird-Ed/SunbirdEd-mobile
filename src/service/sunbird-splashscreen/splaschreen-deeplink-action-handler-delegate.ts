import { SplashscreenActionHandlerDelegate } from '@app/service/sunbird-splashscreen/splashscreen-action-handler-delegate';
import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, MimeType, ActionType, EventTopics } from '@app/app';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import {
  ContentService,
  Content,
  SharedPreferences,
  CourseService,
  Batch,
  EnrollCourseRequest,
  OAuthSession,
  AuthService,
  FetchEnrolledCourseRequest,
  Course
} from 'sunbird-sdk';
import { App, Events } from 'ionic-angular';
import { AppGlobalService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { SearchPage } from '@app/pages/search';
import { PageId, InteractType, InteractSubtype, Environment } from '../telemetry-constants';

@Injectable()
export class SplaschreenDeeplinkActionHandlerDelegate implements SplashscreenActionHandlerDelegate {
  identifier: any;
  isGuestUser: any;
  userId: string;
  enrolledCourses: any;

  constructor(
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    @Inject('COURSE_SERVICE') private courseService: CourseService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private appGlobalServices: AppGlobalService,
    private events: Events,
    private zone: NgZone,
    private app: App) {
      this.getUserId();
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

  onAction(type: string, action?: { identifier: string } ): Observable<undefined> {
    const navObj = this.app.getActiveNavs()[0];
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
    } else {
      this.checkCourseRedirect();
    }
    return Observable.of(undefined);
  }

  checkCourseRedirect() {
    this.preferences.getString('batch_detail').toPromise()
    .then( resp => {
      if (resp) {
        this.enrollIntoBatch(JSON.parse(resp));
        this.preferences.putString('batch_detail', '').toPromise();
      }
    });
  }

  /**
   * Enroll logged-user into selected batch
   *
   * @param {any} batch contains details of select batch
   */
  enrollIntoBatch(batch: Batch): void {
    const navObj = this.app.getActiveNavs()[0];
    if (!this.isGuestUser) {
      const enrollCourseRequest: EnrollCourseRequest = {
        batchId: batch.id,
        courseId: batch.courseId,
        userId: this.userId,
        batchStatus: batch.status
      };
      const loader = this.commonUtilService.getLoader();
      loader.present();
      const reqvalues = new Map();
      reqvalues['enrollReq'] = enrollCourseRequest;
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.ENROLL_CLICKED,
          Environment.HOME,
          PageId.COURSE_BATCHES, undefined,
          reqvalues);

      this.courseService.enrollCourse(enrollCourseRequest).toPromise()
        .then((data: boolean) => {
          this.zone.run(() => {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_ENROLLED'));
            this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
              batchId: batch.id,
              courseId: batch.courseId
            });
            loader.dismiss();
            this.getEnrolledCourses();
            // navObj.pop();
          });
        }, (error) => {
          this.zone.run(() => {
            loader.dismiss();
            if (error && error.code === 'NETWORK_ERROR') {
              this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_NO_INTERNET_MESSAGE'));
            } else if (error && error.response
              && error.response.body && error.response.body.params && error.response.body.params.err === 'USER_ALREADY_ENROLLED_COURSE') {
              this.commonUtilService.showToast(this.commonUtilService.translateMessage('ALREADY_ENROLLED_COURSE'));
              this.getEnrolledCourses();
            }
            loader.dismiss();
          });
        });
    }
}

  /**
   * Get logged-user id. User id is needed to enroll user into batch.
   */
  getUserId(): void {
    this.authService.getSession().subscribe((session: OAuthSession) => {
      if (!session) {
        this.zone.run(() => {
          this.isGuestUser = true;
        });
      } else {
        this.zone.run(() => {
          this.isGuestUser = false;
          this.userId = session.userToken;
        });
      }
    }, () => {
    });
  }

  navigateToCoursePage() {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.preferences.getString('course_data').toPromise()
    .then( resp => {
      if (resp) {
        const navObj = this.app.getActiveNavs()[0];
        setTimeout(() => {
          navObj.push(EnrolledCourseDetailsPage, {
            content: JSON.parse(resp)
          });
          loader.dismiss();
          this.preferences.putString('course_data', '').toPromise();
        }, 2000);
      }
    });
  }

  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(refreshEnrolledCourses: boolean = true, returnRefreshedCourses: boolean = false): void {
    const option: FetchEnrolledCourseRequest = {
      userId: this.userId,
      returnFreshCourses: returnRefreshedCourses
    };
    this.courseService.getEnrolledCourses(option).toPromise()
      .then((enrolledCourses) => {
        if (enrolledCourses) {
          this.zone.run(() => {
            this.enrolledCourses = enrolledCourses ? enrolledCourses : [];
            if (this.enrolledCourses.length > 0) {
              const courseList: Array<Course> = [];
              for (const course of this.enrolledCourses) {
                courseList.push(course);
              }
              this.appGlobalServices.setEnrolledCourseList(courseList);
              this.navigateToCoursePage();
            }
          });
        }
      }, (err) => {
      });
  }

}
