import { PipesModule } from './../../../pipes/pipes.module';
import { Component, Input } from "@angular/core";
import { NavController } from 'ionic-angular';
import { ImageLoader } from "ionic-image-loader";
import { EnrolledCourseDetailsPage } from "../../../pages/enrolled-course-details/enrolled-course-details";
import { CourseDetailPage } from './../../../pages/course-detail/course-detail';
import { CollectionDetailsPage } from '../../../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../../../pages/content-details/content-details';

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

  @Input() pageName: string;

  @Input() onProfile: boolean = false;

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
  navigateToCourseDetailPage(content: any, layoutName: string): void {
    /*console.log('card info...', content);
    console.log('page name ->', this.pageName);
    if (this.pageName === 'library') {
      layoutName = 'SavedResources';
    }
    if (layoutName === 'SavedResources') {
      this.navCtrl.push(CourseDetailPage, {
        layoutType: layoutName,
        content: content
      });
    } else {
      this.navCtrl.push(layoutName === 'Inprogress' ? EnrolledCourseDetailsPage : CourseDetailPage, {
        layoutType: layoutName,
        content: content
      });
    }*/

    console.log('Card details... @@@', content);
    if (content.contentType === 'Course') {
      console.log('12345');
      this.navCtrl.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      console.log('123456');
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      console.log('1234567');
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      })
    }
  }

  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }
}
