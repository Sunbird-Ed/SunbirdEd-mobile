import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { ContentDetailsPage } from './../../pages/content-details/content-details';
import { CourseDetailPage } from './../../pages/course-detail/course-detail';

import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { ImageLoader } from "ionic-image-loader";
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';

/**
 * Generated class for the ViewMoreActivityListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-more-activity-list',
  templateUrl: 'view-more-activity-list.html'
})
export class ViewMoreActivityListComponent {

  /**
   * Contains content details
   */
  @Input() content: any;

  /**
   * Page name
   */
  @Input() type: string;

  /**
   * Contains ref of navigation controller 
   */
  public navCtrl: NavController;

  /**
   * Contains ref of navigation params
   */
  public navParams: NavParams;

  /**
   * Contains default image path.
   * 
   * Get used when content / course does not have appIcon or courseLogo
   */
  defaultImg: string;

  /**
   * Default method of cass SearchListComponent
   */
  constructor(navCtrl: NavController, navParams: NavParams) {
    console.log('View more activity Component');
    this.defaultImg = 'assets/imgs/ic_action_course.png';
    this.navCtrl = navCtrl;
    this.navParams = navParams;
  }

  navigateToDetailsPage(content: any) {
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
      console.log('1234567      ');
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      })
    }
  }

  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }
}
