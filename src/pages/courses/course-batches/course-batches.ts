import { Component } from '@angular/core';
import { CourseService, AuthService, EnrolledCoursesRequest } from 'sunbird';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

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
export class CourseBatchesComponent {

  tabBarElement: any;

  /**
   * To hold course indentifier
   */
  identifier: string;

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
   * Contains http service reference
   */
  public http: HttpClient;

  constructor(courseService: CourseService, navCtrl: NavController, navParams: NavParams, http: HttpClient) {
    this.courseService = courseService;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    console.log('Hello CourseBatchesComponent Component =>');
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

  }

  /**
   * Ion life cycle hook. Used to get list of batches
   */
  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
    const option = {
      courseId: this.navParams.get('identifier')
    }

    /*this.courseService.getCourseBatches(option, (data: any) => {
      console.log('batches response received');
      console.log('data ==>', data);
      this.batches = data.content;
      console.log('this.bathcs', this.batches);

    },
    error => {
      console.log('error while fetching course batches');
    });*/

    this.http.get('http://www.mocky.io/v2/5ab148cf2e00004900e8ba6a').subscribe(
      (data: any) => {
        this.batches = data.content;
        console.log('this.bathcs', this.batches);
      },
      (error: any) => {
        console.log('error while fetching course batches');
      }
    );
  }

  /**
   * Ion life cycle hook
   */
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }
}