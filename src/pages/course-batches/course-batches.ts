import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {CourseService, EnrollCourseRequest} from 'sunbird';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {EventTopics} from '../../app/app.constant';
import {CommonUtilService} from '../../service/common-util.service';
import {AuthService, OauthSession} from 'sunbird-sdk';

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
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private courseService: CourseService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private commonUtilService: CommonUtilService,
    private events: Events
  ) {
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
            batchId: item.id,
            courseId: item.courseId
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
    this.authService.getSession().subscribe((session: OauthSession) => {
      if (!session) {
        this.zone.run(() => {
          this.isGuestUser = true;
        });
      } else {
        this.zone.run(() => {
          this.isGuestUser = false;
          this.userId = session.userToken;
          this.getBatchesByCourseId();
        });
      }
    }, () => {
    })
  }


  /**
   * To get batches, passed from enrolled-course-details page via navParams
   */
  getBatchesByCourseId(): void {
    this.ongoingBatches = this.navParams.get('ongoingBatches');
    this.upcommingBatches = this.navParams.get('upcommingBatches');
  }

  spinner(flag) {
    this.zone.run(() => {
      this.showLoader = false;
    });
  }
}
