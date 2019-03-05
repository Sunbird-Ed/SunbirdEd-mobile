import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { CommonUtilService } from '@app/service';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Generated class for the NewCourseCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'new-course-card',
  templateUrl: 'new-course-card.html'
})
export class NewCourseCardComponent implements OnInit {

  text: string;
  @Input() course: any;
  @Input() layoutTitle: any;

  @Input() layoutName: string;

  @Input() pageName: string;

  @Input() onProfile = false;

  @Input() index: number;

  @Input() sectionName: string;

  @Input() env: string;

  /**
   * To show card as disbled or Greyed-out when device is offline
   */
  // @Input() cardDisabled = false;

  /**
   * Contains default image path.
   *
   * It gets used when perticular course does not have a course/content icon
   */
  defaultImg: string;


  constructor(
    public commonUtilService: CommonUtilService,
    public navCtrl: NavController
  ) {
    console.log('Hello NewCourseCardComponent Component');
    this.text = 'Hello World';

  }

  ngOnInit() {

  }

  navigateToDetailPage(course) {

    if (!course.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable) {
      return false;
    }
    this.navCtrl.push(ContentDetailsPage, {
      content: course.contentData
    });

  }

}
