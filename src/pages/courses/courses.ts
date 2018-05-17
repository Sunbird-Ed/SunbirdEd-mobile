import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform, PopoverController, Events, ToastController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { CourseService, AuthService, PageAssembleService, PageAssembleCriteria, Impression, ImpressionType, PageId, Environment, TelemetryService, ProfileService, ContentDetailRequest, ContentService } from 'sunbird';
import { DocumentDirection } from 'ionic-angular/platform/platform';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { CourseFilter, CourseFilterCallback } from './filters/course.filter';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';

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
  showLoader: boolean = true;

  /**
   * Flag to show latest and popular course loader
   */
  pageApiLoader: boolean = true;

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

  isOnBoardingCardCompleted: boolean = false;
  onBoardingProgress: number = 0;

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
    pageService: PageAssembleService, ngZone: NgZone, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController, public telemetryService: TelemetryService, private events: Events, private profileService: ProfileService, private contentService: ContentService, private toastCtrl: ToastController) {
    this.navCtrl = navCtrl;
    this.courseService = courseService;
    this.authService = authService;
    this.platform = platform;
    this.pageService = pageService;
    this.ngZone = ngZone;

    this.events.subscribe('onboarding-card:completed', (param) => {
      this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
    });

    this.events.subscribe('onboarding-card:increaseProgress', (progress) => {
      this.onBoardingProgress = progress.cardProgress;
    });
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
    this.spinner(true);
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
    this.pageApiLoader = true;
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
        this.pageApiLoader = !this.pageApiLoader;
      });
    }, (error: string) => {
      console.log('Page assmble error', error);
      this.pageApiLoader = !this.pageApiLoader;
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
  getUserId() {
    return new Promise((resolve, reject) => {
      this.authService.getSessionData((session) => {
        if (session === undefined || session == null || session === "null") {
          console.log('session expired');
          this.guestUser = true;
          this.getCurrentUser();
          reject('session expired');
        } else {
          let sessionObj = JSON.parse(session);
          this.userId = sessionObj["userToken"];
          this.guestUser = false;
          this.getEnrolledCourses();
          resolve();
        }
      });
    });
  }

  /**
   *
   * @param refresher
   */
  getCourseTabData(refresher?) {
    setTimeout(() => {
      if (refresher) {
        refresher.complete();
      }
    }, 10);
    this.enrolledCourse = [];
    this.popularAndLatestCourses = [];
    this.getUserId()
      .then(() => {

      })
      .catch(error => {
        console.log("Error while Fetching Data", error);
      });

    this.getPopularAndLatestCourses();
  }
  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('courses component initialized...');
    this.getCourseTabData();
  }

  /**
   * It will fetch the guest user profile details
   */
  getCurrentUser(): void {
    this.profileService.getCurrentUser(
      (res: any) => {
        let profile = JSON.parse(res);
        if (profile.board && profile.board.length && profile.grade && profile.grade.length && profile.medium && profile.medium.length && profile.subject && profile.subject.length) {
          this.isOnBoardingCardCompleted = true;
          this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
        }
      },
      (err: any) => {
        this.isOnBoardingCardCompleted = false;
      });
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
        let request: ContentDetailRequest = {
          contentId: contentId
        }
        that.contentService.getContentDetail(request, (response)=> {
          let data = JSON.parse(response);
          that.showContentDetails(data.result);
        }, (error)=> {
          console.log("Error " + error);
          let toast = that.toastCtrl.create({
            message: "No content found associated with that QR code",
            duration: 3000
          })

          toast.present();
        });
      }
    }

    this.qrScanner.startScanner(undefined, undefined, undefined, callback,PageId.COURSES);
  }

  showContentDetails(content) {
    if (content.contentType === 'Course') {
      console.log('Calling course details page');
      this.navCtrl.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      console.log('Calling collection details page');
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      console.log('Calling content details page');
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      })
    }
  }

  search() {
    const contentType: Array<string> = [
      "Course",
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType, source: PageId.COURSES })
  }

  ionViewDidEnter() {
    this.generateImpressionEvent();
  }

  generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.COURSES;
    impression.env = Environment.HOME;
    this.telemetryService.impression(impression);
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

    let filter = this.popCtrl.create(CourseFilter, { callback: callback }, { cssClass: 'course-filter' });
    filter.present();
  }
}
