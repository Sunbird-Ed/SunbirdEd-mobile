import { Component, NgZone, OnInit } from '@angular/core';
import { CourseService, AuthService } from 'sunbird';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as _ from 'lodash';

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

   filterList: {
     'ONGOING' : 'VIEW_ONGOING_BATCHES',
     'UPCOMING' : 'VIEW_UPCOMING_BATCHES'
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
    authService: AuthService, toastCtrl: ToastController) {
    this.courseService = courseService;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.zone = zone;
    this.authService = authService;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.selectedFilter = 'View ongoing batches';
    this.toastCtrl = toastCtrl;
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
        this.navCtrl.pop();
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
      if (session === undefined || session == null || session === "null") {
        console.log('session expired');
        this.zone.run(() => { this.isGuestUser = true; });
      } else {
        this.zone.run(() => { 
          let sessionObj = JSON.parse(session);
          this.isGuestUser = false;
          this.userId = sessionObj["userToken"];
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

  toggleDetails(data) {
    this.selectedFilter = data.title;
  }

  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
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

  signIn() {
    let message = 'Sign in functionality is under progress'
    this.showMessage(message)
  }

  ngOnInit(): void {
    this.tabBarElement.style.display = 'none';
    this.getUserId();
  }

  changeFilter(selectedFilter: string) {
    this.selectedFilter = selectedFilter;
  }
}
