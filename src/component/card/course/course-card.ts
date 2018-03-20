import { Component, Input } from "@angular/core";

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

  rate: string = "4";

  /**
   * Default method of class CourseCard
   */
  constructor() {
    this.defaultImg = 'assets/imgs/ic_action_course.png';
  }
}
