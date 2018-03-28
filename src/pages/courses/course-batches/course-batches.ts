import { Component, NgZone, OnInit } from '@angular/core';
import { CourseService, AuthService, EnrolledCoursesRequest } from 'sunbird';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CourseBatchesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'course-batches',
  templateUrl: 'course-batches.html'
})
export class CourseBatchesComponent implements OnInit {

  /**
   * Contains user id
   */
  userId: string;

  /**
   * Contains tab bar element ref
   */
  tabBarElement: any;

  /**
   * To hold course indentifier
   */
  identifier: string;

  /**
   * Loader
   */
  showLoader: boolean;

  shownGroup = null;

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
   * Default method of class CourseBatchesComponent
   * 
   * @param {CourseService} courseService To get batches list
   * @param {NavController} navCtrl To redirect form one page to another
   * @param {NavParams} navParams To get url params
   * @param {NgZone} zone To bind data 
   * @param {AuthService} authService To get logged-in user data
   */
  constructor(courseService: CourseService, navCtrl: NavController, navParams: NavParams, zone: NgZone,
    authService: AuthService) {
    this.courseService = courseService;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.zone = zone;
    this.authService = authService;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
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
      });
    },
      (error: any) => {
        console.log('error while enrolling into batch ==>', error);
      });
  }

  /**
   * Get logged-user id. User id is needed to enroll user into batch.
   */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.log('session expired')
      } else {
        let sessionObj = JSON.parse(session);
        this.userId = sessionObj["userToken"];
      }
    });
  }

  /**
   * To get batches by course id
   */
  getBatchesByCourseId(): void {
    this.showLoader = true;
    const option = {
      courseIds: [this.navParams.get('identifier')]
    }
    this.courseService.getCourseBatches(option, (data: any) => {
      data = JSON.parse(data);
      this.zone.run(() => {
        console.log('getCourseBatches', data);
        this.batches = data.result.content;
        this.showLoader = false;
      });
    },
      (error: any) => {
        console.log('error while fetching course batches ==>', error);
        this.showLoader = false;
      });
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

  ngOnInit(): void {
    this.tabBarElement.style.display = 'none';
    this.getUserId();
    this.getBatchesByCourseId();
  }
}