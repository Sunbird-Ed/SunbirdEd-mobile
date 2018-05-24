import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform, PopoverController, Events, ToastController } from 'ionic-angular';
import { IonicPage, Slides } from 'ionic-angular';
import { SharedPreferences, CourseService, AuthService, EnrolledCoursesRequest, PageAssembleService, PageAssembleCriteria, QRScanner, FrameworkDetailsRequest, CategoryRequest, FrameworkService, Impression, ImpressionType, PageId, Environment, TelemetryService, ProfileService, ContentDetailRequest, ContentService } from 'sunbird';
import { CourseCard } from './../../component/card/course/course-card';
import { DocumentDirection } from 'ionic-angular/platform/platform';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { CourseFilter, CourseFilterCallback } from './filters/course.filter';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { generateImpressionEvent } from '../../app/telemetryutil';


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
  selectedLanguage = 'en';

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
  constructor(navCtrl: NavController, 
    courseService: CourseService, 
    authService: AuthService, 
    platform: Platform,
    pageService: PageAssembleService, 
    ngZone: NgZone, 
    private qrScanner: SunbirdQRScanner, 
    private popCtrl: PopoverController, 
    private framework: FrameworkService, 
    public telemetryService: TelemetryService, 
    private events: Events, 
    private profileService: ProfileService, 
    private contentService: ContentService, 
    private toastCtrl: ToastController,
    private preference: SharedPreferences,
    private translate: TranslateService,
    private network: Network) {
    this.navCtrl = navCtrl;
    this.courseService = courseService;
    this.authService = authService;
    this.platform = platform;
    this.pageService = pageService;
    this.ngZone = ngZone;

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
        if (session === undefined || session == null || session === "null") {
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
          if (that.network.type === 'none') {
						that.getMessageByConst('ERROR_NO_INTERNET_MESSAGE');
					} else {
						that.getMessageByConst('UNKNOWN_QR');
					}
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
    this.telemetryService.impression(generateImpressionEvent(
      ImpressionType.VIEW,
      PageId.COURSES,
      Environment.HOME,"","",""
    ));
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
