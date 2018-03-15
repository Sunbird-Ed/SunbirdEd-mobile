import { CourseCard } from './../../component/card/course/course-card';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { ContainerService } from 'sunbird';
import { HttpClient } from '@angular/common/http';

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
   * Http service to make api call
   */
  public http: HttpClient;

  /**
   * 
   * @param navCtrl 
   */
  constructor(public navCtrl: NavController, http: HttpClient) {
    this.http = http;
    // TODO: remove this hardcodec id before pushing the code
    this.userId = '659b011a-06ec-4107-84ad-955e16b0a48a';
  }

  /**
   * To get enrolled course
   */
  getEnrolledCourses() {
    console.log('fetching enrolled course...');
    this.http.get('http://www.mocky.io/v2/5aa8ebdb3200003f22165980').subscribe(
      (data: any) => {
        console.log('enrolled course...', data);
        this.enrolledCourse = data.courses;
        console.log(this.enrolledCourse, 'viveks');
      },
      (error: any) => {
        console.log('error while fetching enrolled courses');
      }
    );
  }

  /**
   * 
   */
  getPopularAndLatestCourses() {
    console.log('insied popular');
    // 
    this.http.get('http://www.mocky.io/v2/5aa9ff1c330000ba092da65a').subscribe(
      (data: any) => {
        this.popularAndLatestCourses = data.result.response.sections ? data.result.response.sections : [];
      },
      (error: any) => {
        console.log('error while fetching papular courses');
      }
    );
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('courses component initialized...');
    this.getEnrolledCourses();
    this.getPopularAndLatestCourses();
  }

}
