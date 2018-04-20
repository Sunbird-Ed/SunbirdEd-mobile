import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform, PopoverController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { CourseService, AuthService, EnrolledCoursesRequest, PageAssembleService, PageAssembleCriteria, QRScanner } from 'sunbird';
import { CourseCard } from './../../component/card/course/course-card';
import { DocumentDirection } from 'ionic-angular/platform/platform';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { CourseFilter, CourseFilterCallback } from './filters/course.filter';

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage implements OnInit {

  /**
   * Contains enrolled course
   */
  enrolledCourse: Array<any>;

  /**
   * Contains popular and latest courses ist
   */
  popularAndLatestCourses: Array<any>;

  /**
   * Contains user id
   */
  userId: string;

  /**
   * Flag to show/hide loader
   */
  showLoader: boolean;

  /**
   * Style
   */
  currentStyle = "ltr";

  /**
   * Course service to get enrolled courses
   */
  public courseService: CourseService;

  /**
   * Auth service to get user id.
   */
  public authService: AuthService;

  /**
   * Contains reference of ionic nav controller
   */
  public navCtrl: NavController;

  /**
   * Contains reference of ionic platform
   */
  public platform: Platform;

  /**
   * Contains reference of page api service
   */
  public pageService: PageAssembleService;

  /**
   * Contains reference of page api service
   */
  public ngZone: NgZone;

  guestUser: boolean = false;

  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl To navigate user from one page to another
   * @param {CourseService} courseService Service to get enrolled courses
   * @param {AuthService} authService To get logged-in user data
   * @param {Platform} platform Ionic platform
   * @param {PageAssembleService} pageService Service to get latest and popular courses
   * @param {NgZone} ngZone To bind data
   */
  constructor(navCtrl: NavController, courseService: CourseService, authService: AuthService, platform: Platform,
    pageService: PageAssembleService, ngZone: NgZone, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController) {
    this.navCtrl = navCtrl;
    this.courseService = courseService;
    this.authService = authService;
    this.platform = platform;
    this.pageService = pageService;
    this.ngZone = ngZone;
  }

  viewMoreEnrolledCourses() {
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: 'Courses In Progress',
      userId: this.userId,
      pageName: 'course.EnrolledCourses'
    })
  }

  viewAllCourses(searchQuery, headerTitle) {
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: headerTitle,
      pageName: 'course.PopularContent',
      requestParams: searchQuery
    })
  }
  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(): void {
    console.log('making api call to get enrolled courses');
    let option = {
      userId: this.userId,
      refreshEnrolledCourses: false
    };
    this.courseService.getEnrolledCourses(option, (data: any) => {
      if (data) {
        data = JSON.parse(data);
        this.enrolledCourse = data.result.courses ? data.result.courses : [];
        console.log('enrolled courses details', data);
        this.spinner(false);
      }
    }, (error: any) => {
      console.log('error while loading enrolled courses', error);
      this.spinner(false);
    });
  }

  /**
   * To get popular course.
   *
   * It internally calls course handler of genie sdk
   */
  getPopularAndLatestCourses(): void {
    let criteria = new PageAssembleCriteria();
    criteria.name = "Course";
    this.pageService.getPageAssemble(criteria, (res: any) => {
      res = JSON.parse(res);
      this.ngZone.run(() => {
        let sections = JSON.parse(res.sections);
        let newSections = [];
        sections.forEach(element => {
          element.display = JSON.parse(element.display);
          newSections.push(element);
        });
        this.popularAndLatestCourses = newSections;
        console.log('Popular courses', this.popularAndLatestCourses);
      });
    }, (error: string) => {
      console.log('Page assmble error', error);
    });
  }

  /**
   * To start / stop spinner
   */
  spinner(flag: boolean) {
    this.ngZone.run(() => {
      this.showLoader = flag;
    });
  }

  /**
   * Get user id.
   *
   * Used to get enrolled course(s) of logged-in user
   */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null || session === "null") {
        console.log('session expired');
        this.guestUser = true;
      } else {
        let sessionObj = JSON.parse(session);
        this.userId = sessionObj["userToken"];
        this.guestUser = false;
        this.getEnrolledCourses();
      }
    });
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('courses component initialized...');
    this.spinner(true);
    this.getUserId();
    this.getPopularAndLatestCourses();
  }

  /**
   * Change language / direction
   */
  changeLanguage(event) {
    if (this.currentStyle === "ltr") {
      this.currentStyle = "rtl";
    } else {
      this.currentStyle = "ltr";
    }

    this.platform.setDir(this.currentStyle as DocumentDirection, true);
  }

  scanQRCode() {
    const that = this;
    const callback: QRResultCallback = {
      dialcode(scanResult, dialCode) {
        that.navCtrl.push(SearchPage, { dialCode: dialCode });
      },
      content(scanResult, contentId) {
        // that.navCtrl.push(SearchPage);
      }
    }

    this.qrScanner.startScanner(undefined, undefined, undefined, callback);
  }

  search() {
    const contentType: Array<string> = [
      "Course",
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType})
  }

  showFilter() {
    const that = this;

    const callback: CourseFilterCallback = {
      applyFilter(filter) {
        that.ngZone.run(() => {
          let criteria = new PageAssembleCriteria();
          criteria.name = "Course";
          criteria.filters = filter;
          that.pageService.getPageAssemble(criteria, (res: any) => {
            res = JSON.parse(res);
            that.ngZone.run(() => {
              let sections = JSON.parse(res.sections);
              let newSections = [];
              sections.forEach(element => {
                element.display = JSON.parse(element.display);
                newSections.push(element);
              });
              that.popularAndLatestCourses = newSections;
              console.log('Popular courses', that.popularAndLatestCourses);
            });
          }, (error: string) => {
            console.log('Page assmble error', error);
          });
        })
      }
    }

    let filter = this.popCtrl.create(CourseFilter, {callback: callback}, {cssClass: 'course-filter'});
    filter.present();
  }
}
