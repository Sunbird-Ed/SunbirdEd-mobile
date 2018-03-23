import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { CourseService, AuthService, EnrolledCoursesRequest, ContentService } from 'sunbird';
import { CourseCard } from './../../component/card/course/course-card';
import { DocumentDirection } from 'ionic-angular/platform/platform';

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
   * Http service to make api call
   */
  public http: HttpClient;

  /**
   * Course service to get enrolled courses
   */
  public courseService: CourseService;

  /**
   * Auth service to get user id
   */
  public authService: AuthService;

  currentStyle = "ltr";

  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl Reference of nav controller to navigate user from one page to another
   * @param {HttpClient} http Reference of http client service to make api call
   */
  constructor(public navCtrl: NavController, http: HttpClient, courseService: CourseService, authService: AuthService,
  private contentService: ContentService, public platform: Platform) {
    this.http = http;
    this.courseService = courseService;
    this.authService = authService;
    // TODO: remove this hardcodec id before pushing the code
    this.userId = '659b011a-06ec-4107-84ad-955e16b0a48a';
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
    this.http.get('http://www.mocky.io/v2/5aa9ff1c330000ba092da65a').subscribe(
      (data: any) => {
        this.popularAndLatestCourses = data.result.response.sections ? data.result.response.sections : [];
      },
      (error: any) => {
        console.log('error while fetching popular courses');
      }
    );
  }

  /**
   * To start and stop loader
   */
  spinner(flag: boolean){
    this.showLoader = flag;
  }
 
  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('courses component initialized...');
    this.spinner(true);
    this.getEnrolledCourses();
    this.getPopularAndLatestCourses();
  }

  changeLanguage(event) {
    if (this.currentStyle === "ltr") {
      this.currentStyle = "rtl";
    } else {
      this.currentStyle = "ltr";
    }

    this.platform.setDir(this.currentStyle as DocumentDirection, true);
  }
}
