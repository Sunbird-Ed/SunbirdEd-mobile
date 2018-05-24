import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import { Component, NgZone } from '@angular/core';
import { NavController, PopoverController, Events, ToastController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import {
  SharedPreferences, CourseService, AuthService,
  PageAssembleService, PageAssembleCriteria,
  Impression, ImpressionType, PageId, Environment, TelemetryService,
  ProfileService, ContentDetailRequest, ContentService
} from 'sunbird';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { CourseFilter, CourseFilterCallback } from './filters/course.filter';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { ContentType, MimeType } from '../../app/app.constant';


@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {

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

  guestUser: boolean = false;

  showSignInCard: boolean = false;

  isOnBoardingCardCompleted: boolean = false;
  onBoardingProgress: number = 0;
  selectedLanguage = 'en';

  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl To navigate user from one page to another
   * @param {CourseService} courseService Service to get enrolled courses
   * @param {AuthService} authService To get logged-in user data
   * @param {PageAssembleService} pageService Service to get latest and popular courses
   * @param {NgZone} ngZone To bind data
   */
  constructor(private navCtrl: NavController,
    private courseService: CourseService,
    private authService: AuthService,
    private pageService: PageAssembleService,
    private ngZone: NgZone,
    private qrScanner: SunbirdQRScanner,
    private popCtrl: PopoverController,
    private telemetryService: TelemetryService,
    private events: Events,
    private profileService: ProfileService,
    private contentService: ContentService,
    private toastCtrl: ToastController,
    private preference: SharedPreferences,
    private translate: TranslateService,
    private network: Network) {

    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
      }
    });

    this.events.subscribe('onboarding-card:completed', (param) => {
      this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
    });

    this.events.subscribe('onboarding-card:increaseProgress', (progress) => {
      this.onBoardingProgress = progress.cardProgress;
    });

    this.events.subscribe('savedResources:update', (res) => {
      if (res && res.update) {
        this.getEnrolledCourses();
      }
    });

    this.events.subscribe('onAfterLanguageChange:update', (res) => {
      if (res && res.selectedLanguage) {
        this.selectedLanguage = res.selectedLanguage;
        this.getPopularAndLatestCourses();
      }
    });
  }

  ionViewWillEnter() {
    console.log('courses component initialized...');
    this.getCourseTabData();
  }

  ionViewDidEnter() {
    this.generateImpressionEvent();
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
          if (element.display.name) {
            if (_.has(element.display.name, this.selectedLanguage)) {
              let langs = [];
              _.forEach(element.display.name, function (value, key) {
                langs[key] = value;
              });
              element.name = langs[this.selectedLanguage];
            }
          }
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
    let that = this;
    return new Promise((resolve, reject) => {
      that.authService.getSessionData((session) => {
        if (session === null || session === "null") {
          console.log('session expired');
          that.guestUser = true;
          that.getCurrentUser();
          reject('session expired');
        } else {
          let sessionObj = JSON.parse(session);
          that.userId = sessionObj["userToken"];
          that.guestUser = false;
          that.getEnrolledCourses();
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
   * It will fetch the guest user profile details
   */
  getCurrentUser(): void {
    this.preference.getString('selected_user_type', (val) => {
			if (val == "teacher") {
				this.showSignInCard = true;
			} else if (val == "student") {
				this.showSignInCard = false;
			}
		})


    this.profileService.getCurrentUser(
      (res: any) => {
        let profile = JSON.parse(res);
        if (profile.board && profile.board.length
          && profile.grade && profile.grade.length
          && profile.medium && profile.medium.length
          && profile.subject && profile.subject.length) {
          this.isOnBoardingCardCompleted = true;
          this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
        }
      },
      (err: any) => {
        this.isOnBoardingCardCompleted = false;
      });
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

        that.contentService.getContentDetail(request, (response) => {
          let data = JSON.parse(response);
          that.showContentDetails(data.result);
        }, (error) => {
          console.log("Error " + error);
          if (that.network.type === 'none') {
            that.getMessageByConst('ERROR_NO_INTERNET_MESSAGE');
          } else {
            that.getMessageByConst('UNKNOWN_QR');
          }
        });
      }
    }

    this.qrScanner.startScanner(undefined, undefined, undefined, callback, PageId.COURSES);
  }

  showContentDetails(content) {
    if (content.contentType === ContentType.COURSE) {
      console.log('Calling course details page');
      this.navCtrl.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === MimeType.COLLECTION) {
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
    this.navCtrl.push(SearchPage, { contentType: ContentType.FOR_COURSE_TAB, source: PageId.COURSES })
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
                if (element.display.name) {
                  if (_.has(element.display.name, this.selectedLanguage)) {
                    let langs = [];
                    _.forEach(element.display.name, function (value, key) {
                      langs[key] = value;
                    });
                    element.name = langs[this.selectedLanguage];
                  }
                }
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

  showMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

  getMessageByConst(constant) {
    this.translate.get(constant).subscribe(
      (value: any) => {
        this.showMessage(value);
      }
    );
  }
}
