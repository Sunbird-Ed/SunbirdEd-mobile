import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { ContentDetailsPage } from './../../pages/content-details/content-details';
import { CourseDetailPage } from './../../pages/course-detail/course-detail';

import { Input, NgZone } from '@angular/core';
import { Component } from '@angular/core';
import { ImageLoader } from "ionic-image-loader";
import { NavController, NavParams } from 'ionic-angular';

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

  public zone: NgZone;

  /**
   * Contains default image path.
   *
   * Get used when content / course does not have appIcon or courseLogo
   */
  defaultImg: string;

  /**
   * Default method of cass SearchListComponent
   */
  constructor(navCtrl: NavController, navParams: NavParams, zone: NgZone) {
    console.log('View more activity Component');
    this.defaultImg = 'assets/imgs/ic_launcher.png';
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.zone = zone;
  }

  navigateToDetailsPage(content: any) {
    console.log('View more ard details... @@@', content);
    this.zone.run(() => {

      if (content.contentType === 'Course') {
        console.log('Inside course details');
        this.navCtrl.push(CourseDetailPage, {
          content: content
        })
      } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
        console.log('Inside collection details');
        this.navCtrl.push(CollectionDetailsPage, {
          content: content
        })
      } else {
        console.log('Inside content details');
        this.navCtrl.push(ContentDetailsPage, {
          content: content
        })
      }
    })
  }

  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }


}
