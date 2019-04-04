import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details';
import {
  SharedPreferences,
  EnrollCourseRequest,
  AuthService,
  CourseService,
  TelemetryObject,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  CourseBatchesRequest,
  CourseEnrollmentType,
  CourseBatchStatus
} from 'sunbird';
import { PreferenceKey, ProfileConstants, EventTopics, ContentType, MimeType, ContentCard } from '@app/app/app.constant';
import { CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';

/**
 * Generated class for the EnrollmentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enrollment-details',
  templateUrl: 'enrollment-details.html'
})
export class EnrollmentDetailsPage {

  ongoingBatches: any;
  upcommingBatches: any;
  retiredBatched: any;
  userId: any;
  isGuestUser: boolean;
  layoutInProgress: string;
  sectionName: any;
  index: any;
  layoutName: any;
  pageName: any;
  env: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private events: Events,
    private preference: SharedPreferences,
    private authService: AuthService,
    private zone: NgZone,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private courseService: CourseService
    ) {
    this.ongoingBatches = this.navParams.get('ongoingBatches');
    this.upcommingBatches = this.navParams.get('upcommingBatches');
    this.retiredBatched = this.navParams.get('retiredBatched');
    this.getUserId();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnrollmentDetailsPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  resumeCourse(content: any) {
    this.saveContentContext(content);
    if (content.lastReadContentId && content.status === 1) {
      this.events.publish('course:resume', {
        content: content
      });
    } else {
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    }
  }

  saveContentContext(content: any) {
    const contentContextMap = new Map();
    // store content context in the below map
    contentContextMap['userId'] = content.userId;
    contentContextMap['courseId'] = content.courseId;
    contentContextMap['batchId'] = content.batchId;
    if (content.batch) {
      contentContextMap['batchStatus'] = content.batch.status;
    }

    // store the contentContextMap in shared preference and access it from SDK
    this.preference.putString(PreferenceKey.CONTENT_CONTEXT, JSON.stringify(contentContextMap));
  }

  enrollIntoBatch(content: any): void {
    const courseBatchesRequest: CourseBatchesRequest = {
      courseId: content.contentId ? content.contentId : content.identifier,
      enrollmentType: CourseEnrollmentType.OPEN,
      status: [CourseBatchStatus.NOT_STARTED, CourseBatchStatus.IN_PROGRESS]
    };
    const reqvalues = new Map();
    reqvalues['enrollReq'] = courseBatchesRequest;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.ENROLL_CLICKED,
        Environment.HOME,
        PageId.CONTENT_DETAIL, undefined,
        reqvalues);
    const enrollCourseRequest: EnrollCourseRequest = {
      userId: this.userId,
      courseId: content.courseId,
      contentId: content.courseId,
      batchId: content.id,
      batchStatus: content.status
    };
    this.courseService.enrollCourse(enrollCourseRequest)
      .then((data: any) => {
        data = JSON.parse(data);
        this.zone.run(() => {
          console.log('You have successfully enrolled...');
          this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_ENROLLED'));
          this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
            batchId: content.id,
            courseId: content.courseId
          });
          this.viewCtrl.dismiss();
          this.navigateToDetailPage(content);
        });
      })
      .catch((error: any) => {
        console.log('error while enrolling into batch ==>', error);
        this.zone.run(() => {
          error = JSON.parse(error);
          if (error && error.error === 'CONNECTION_ERROR') {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_NO_INTERNET_MESSAGE'));
          } else if (error && error.error === 'USER_ALREADY_ENROLLED_COURSE') {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('ALREADY_ENROLLED_COURSE'));
          }
        });
      });
  }

  /**
   * Get logged-user id. User id is needed to enroll user into batch.
   */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null || session === 'null') {
        console.log('session expired');
        this.zone.run(() => { this.isGuestUser = true; });
      } else {
        this.zone.run(() => {
          const sessionObj = JSON.parse(session);
          this.isGuestUser = false;
          this.userId = sessionObj[ProfileConstants.USER_TOKEN];
        });
      }
    });
  }

  navigateToDetailPage(content: any, layoutName?: string): void {
    const identifier = content.contentId || content.identifier;
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = identifier;
    if (layoutName === this.layoutInProgress) {
      telemetryObject.type = ContentType.COURSE;
    } else {
      telemetryObject.type = this.isResource(content.contentType) ? ContentType.RESOURCE : content.contentType;
    }


    const values = new Map();
    values['sectionName'] = this.sectionName;
    values['positionClicked'] = this.index;

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      this.env,
      this.pageName ? this.pageName : this.layoutName,
      telemetryObject,
      values
    );

    if (content.contentType === ContentType.COURSE) {
      content.contentId = !content.contentId ? content.courseId : content.contentId;
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      // this.navCtrl.push(CollectionDetailsPage, {
        this.navCtrl.push(CollectionDetailsEtbPage, {
        content: content
      });
    } else {
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      });
    }
  }

  isResource(contentType) {
    return contentType === ContentType.STORY ||
      contentType === ContentType.WORKSHEET;
  }

}
