import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { ContentDetailsPage } from './../../pages/content-details/content-details';
// import { CourseDetailPage } from './../../pages/course-detail/course-detail';
import { EnrolledCourseDetailsPage } from './../../pages/enrolled-course-details/enrolled-course-details';

import { Input, NgZone, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ImageLoader } from "ionic-image-loader";
import { NavController, NavParams, Events } from 'ionic-angular';
import { ContentType, MimeType } from '../../app/app.constant';
import { CourseUtilService } from '../../service/course-util.service';

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
export class ViewMoreActivityListComponent implements OnInit {

  /**
   * Contains content details
   */
  @Input() content: any;

  /**
   * Page name
   */
  @Input() type: string;

  /**
   * Contains default image path.
   *
   * Get used when content / course does not have appIcon or courseLogo
   */
  defaultImg: string;

  /**
   * Default method of cass SearchListComponent
   * @param {NavController} navCtrl To navigate user from one page to another
   * @param {NavParams} navParams ref of navigation params
   * @param {NgZone} ngZone To bind data
   */
  constructor(private navCtrl: NavController, private navParams: NavParams, private zone: NgZone, private courseUtilService: CourseUtilService, private events: Events) {
    console.log('View more activity Component');
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  navigateToDetailsPage(content: any, layoutName) {
    console.log('View more ard details... @@@', content);
    this.zone.run(() => {
      if (layoutName === 'enrolledCourse' || content.contentType === ContentType.COURSE) {
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content
        })
      } else if (content.mimeType === MimeType.COLLECTION) {
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

  resumeCourse(content: any) {
    console.log('Resume course details... @@@', content);
    if (content.lastReadContentId && content.status === 1) {
      this.events.publish('course:resume', {
        content: content
      });
    } else {
      console.log('Inside CollectionDetailsPage');
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      })
    }
  }
  onImageLoad(imgLoader: ImageLoader) {
    console.log("Image Loader " + imgLoader.nativeAvailable);
  }

  ngOnInit() {
    if (this.type === 'enrolledCourse') {
      this.content.cProgress = this.courseUtilService.getCourseProgress(this.content.leafNodesCount, this.content.progress);
    }
  }
}
