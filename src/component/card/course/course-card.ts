import { Component, Input } from "@angular/core";
import { NavController } from 'ionic-angular';
import { CourseDetailComponent } from "../../../pages/courses/course-detail/course-detail";
import { ImageLoader } from "ionic-image-loader";

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
   * 
   * @param navCtrl To navigate user from one page to another
   */
  constructor(public navCtrl: NavController) {
    this.defaultImg = 'assets/imgs/ic_action_course.png';
  }

  /**
   * Navigate to the course/content details page
   * 
   * @param {string} layoutName 
   * @param {object} content 
   */
  navigateToCourseDetailPage(layoutName: string, content): void {
    console.log('card info...', content);
    this.navCtrl.push(CourseDetailComponent, {
      layoutType: layoutName,
      content: content
    });
  }

  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }
}
