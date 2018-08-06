import { Component, NgZone, OnInit } from '@angular/core';
import { CourseService, AuthService } from 'sunbird';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import * as _ from 'lodash';
import { ProfileConstants, EventTopics } from '../../app/app.constant';
import { TranslateService } from '@ngx-translate/core';

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
  isGuestUser: boolean = false;

  filterList: any = {
    'ONGOING': 'VIEW_ONGOING_BATCHES',
    'UPCOMING': 'VIEW_UPCOMING_BATCHES'
  };

  /**
   * Contains batches list
   */
  public batches: Array<any>;

  /**
   * Contains ref of course service
   */
  public courseService: CourseService;

  /**
   * Contains navigation controller ref
   */
  public navCtrl: NavController;

  /**
   * Contains ref of navigation params
   */
  public navParams: NavParams;

  /**
   * Contains ref of angular NgZone service
   */
  public zone: NgZone;

  /**
   * Contains reference of auth service
   */
  public authService: AuthService;

  /**
   * Contains reference of ionic toast controller
   */
  public toastCtrl: ToastController;

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
  constructor(courseService: CourseService, navCtrl: NavController, navParams: NavParams, zone: NgZone,
    authService: AuthService, toastCtrl: ToastController, private translate: TranslateService, private events: Events) {
    this.courseService = courseService;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.zone = zone;
    this.authService = authService;
    this.toastCtrl = toastCtrl;

    this.filterList.ONGOING = this.translateLanguageConstant('VIEW_ONGOING_BATCHES');
    this.filterList.UPCOMING = this.translateLanguageConstant('VIEW_UPCOMING_BATCHES');
    this.selectedFilter = this.filterList.ONGOING;
  }

  /**
   * Enroll logged-user into selected batch
   *
   * @param {any} item contains details of select batch
   */
  enrollIntoBatch(item: any): void {
    const option = {
      userId: this.userId,
      courseId: item.courseId,
      contentId: item.courseId,
      batchId: item.id
    };
    this.courseService.enrollCourse(option, (data: any) => {
      data = JSON.parse(data);
      this.zone.run(() => {
        console.log('You have successfully enrolled...');
        this.showMessage(this.translateLanguageConstant('COURSE_ENROLLED'));
        this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
          batchId: item.id
        });
        this.navCtrl.pop();
      });
    },
      (error: any) => {
        console.log('error while enrolling into batch ==>', error);
        this.zone.run(() => {
          if (error === 'CONNECTION_ERROR') {
            this.showMessage(this.translateLanguageConstant('ERROR_NO_INTERNET_MESSAGE'));
          } else {
            // TODO: Ask anil to add batch enrollement failed locale
          }
        });
      });
  }

  /**
   * Get logged-user id. User id is needed to enroll user into batch.
   */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null || session === "null") {
        console.log('session expired');
        this.zone.run(() => { this.isGuestUser = true; });
      } else {
        this.zone.run(() => {
          let sessionObj = JSON.parse(session);
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
  getBatchesByCourseId(): void {
    console.log('getting course batches.... =>')
    this.showLoader = true;
    const option = {
      courseIds: [this.navParams.get('identifier')]
    }
    this.courseService.getCourseBatches(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Batches received successfully... =>', data);
      this.zone.run(() => {
        this.batches = data.result.content;
        this.spinner(false);
        _.forEach(data.result.content, (value, key) => {
          if (value.status === 1) {
            this.ongoingBatches.push(value);
          } else {
            this.upcommingBatches.push(value);
          }
        });
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

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  ngOnInit(): void {
    this.getUserId();
  }

  changeFilter(filter: string) {
    if (filter === 'ONGOING') {
      this.selectedFilter = this.filterList.ONGOING;
    } else {
      this.selectedFilter = this.filterList.UPCOMING;
    }
  }

  translateLanguageConstant(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
  }
}
