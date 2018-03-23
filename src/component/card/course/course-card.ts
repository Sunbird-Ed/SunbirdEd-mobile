import { Component, Input } from "@angular/core";
import { NavController } from 'ionic-angular';
import { CourseDetailComponent } from "../../../pages/courses/course-detail/course-detail";


/**
 * The course card component 
 */
@Component({
  selector: 'course-card',
  templateUrl: 'course-card.html'
})
export class CourseCard {

  /**
   * Contains course details
   */
  @Input() course: any;

  /**
   * Contains layout name
   * 
   * @example layoutName = Inprogress / popular
   */
  @Input() layoutName: string;

  /**
   * Contains default image path.
   * 
   * It gets used when perticular course does not have a course/content icon
   */
  defaultImg: string;

  /**
   * Default method of class CourseCard
   */
  constructor(public navCtrl: NavController) {
    this.defaultImg = 'assets/imgs/ic_action_course.png';
  }

  /**
   * Navigate to the course/content details page
   * 
   * @param {string} id content identifier
   */
  navigateToCourseDetailPage(id: string, layoutName: string): void {
    this.navCtrl.push(CourseDetailComponent, { identifier: id, layoutType: layoutName });
  }
}
