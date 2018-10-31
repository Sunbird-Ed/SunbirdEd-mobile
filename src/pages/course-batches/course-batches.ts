import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import {
  CourseService,
  AuthService,
  CourseBatchesRequest,
  CourseBatchStatus,
  CourseEnrollmentType,
  EnrollCourseRequest
} from 'sunbird';
import {
  IonicPage,
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
import * as _ from 'lodash';
import {
  ProfileConstants,
  EventTopics
} from '../../app/app.constant';
import { CommonUtilService } from '../../service/common-util.service';

/**
 * Generated class for the CourseBatchesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-course-batches',
  templateUrl: 'course-batches.html',
})
export class CourseBatchesPage implements OnInit {

  /**
   * Contains user id
   */
  userId: string;

  /**
   * To hold course indentifier
   */
  identifier: string;

  /**
   * Loader
   */
  showLoader: boolean;

  /**
   * Contains upcomming batches list
   */
  upcommingBatches: Array<any> = [];

  /**
   * Contains ongoing batches list
   */
  ongoingBatches: Array<any> = [];

  /**
   * Flag to check guest user
   */
  isGuestUser = false;

  filterList: any = {
    'ONGOING': 'VIEW_ONGOING_BATCHES',
    'UPCOMING': 'VIEW_UPCOMING_BATCHES'
  };

  /**
   * Contains batches list
   */
  public batches: Array<any>;

  /**
   * Selected filter
   */
  selectedFilter: string;

  /**
   * Default method of class CourseBatchesComponent
   *
   * @param {CourseService} courseService To get batches list
   * @param {NavController} navCtrl To redirect form one page to another
   * @param {NavParams} navParams To get url params
   * @param {NgZone} zone To bind data
   * @param {AuthService} authService To get logged-in user data
   */
  constructor(
    private courseService: CourseService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private authService: AuthService,
    private commonUtilService: CommonUtilService,
    private events: Events
  ) {

    this.filterList.ONGOING = this.commonUtilService.translateMessage('VIEW_ONGOING_BATCHES');
    this.filterList.UPCOMING = this.commonUtilService.translateMessage('VIEW_UPCOMING_BATCHES');
    // this.selectedFilter = this.filterList.ONGOING;
  }

  ngOnInit(): void {
    this.getUserId();
  }

  /**
   * Enroll logged-user into selected batch
   *
   * @param {any} item contains details of select batch
   */
  enrollIntoBatch(item: any): void {
    const enrollCourseRequest: EnrollCourseRequest = {
      userId: this.userId,
      courseId: item.courseId,
      contentId: item.courseId,
      batchId: item.id
    };
    this.courseService.enrollCourse(enrollCourseRequest)
      .then((data: any) => {
        data = JSON.parse(data);
        this.zone.run(() => {
          console.log('You have successfully enrolled...');
          this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_ENROLLED'));
          this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
            batchId: item.id
          });
          this.navCtrl.pop();
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
          this.getBatchesByCourseId();
        });
      }
    });
  }

  /**
   * To get batches by course id
   */
  getBatchesByCourseId(status: CourseBatchStatus = CourseBatchStatus.IN_PROGRESS): void {
    console.log('getting course batches.... =>');
    this.showLoader = true;
    const courseBatchesRequest: CourseBatchesRequest = {
      courseId: this.navParams.get('identifier'),
      enrollmentType: CourseEnrollmentType.OPEN,
      status: status
    };

    this.courseService.getCourseBatches(courseBatchesRequest,
      (data: any) => {
        data = JSON.parse(data);
        console.log('Batches received successfully... =>', data);
        this.zone.run(() => {
          this.ongoingBatches = [];
          this.upcommingBatches = [];

          this.batches = data.result.content;
          this.spinner(false);
          _.forEach(data.result.content, (value, key) => {
            if (value.status === 1) {
              this.ongoingBatches.push(value);
            } else {
              this.upcommingBatches.push(value);
            }
          });

          if (status === CourseBatchStatus.IN_PROGRESS) {
            this.selectedFilter = this.filterList.ONGOING;
          } else {
            this.selectedFilter = this.filterList.UPCOMING;
          }

        });
      },
      (error: any) => {
        console.log('error while fetching course batches ==>', error);
        this.spinner(false);
      });
  }

  spinner(flag) {
    this.zone.run(() => {
      this.showLoader = false;
    });
  }

  changeFilter(filter: string) {
    if (filter === 'ONGOING') {
      this.selectedFilter = this.filterList.ONGOING;
      this.getBatchesByCourseId(CourseBatchStatus.IN_PROGRESS);
    } else {
      this.selectedFilter = this.filterList.UPCOMING;
      this.getBatchesByCourseId(CourseBatchStatus.NOT_STARTED);
    }
  }

}
