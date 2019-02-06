import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { CollectionDetailsEtbPage } from './../../pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from './../../pages/content-details/content-details';
import { EnrolledCourseDetailsPage } from './../../pages/enrolled-course-details/enrolled-course-details';

import { Input, NgZone, OnInit } from '@angular/core';
import { Component } from '@angular/core';
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
  selector: 'view-more-card',
  templateUrl: 'view-more-card.html'
})
export class ViewMoreCardComponent implements OnInit {

  /**
   * Contains content details
   */
  @Input() content: any;

  /**
   * Page name
   */
  @Input() type: string;

  /**
   * To show card as disbled or Greyed-out when device is offline
   */
  @Input() cardDisabled = false;

  /**
   * Contains default image path.
   *
   * Get used when content / course does not have appIcon or courseLogo
   */
  defaultImg: string;

  /**
   * checks wheather batch is expired or not
   */
  batchExp: Boolean = false;

  /**
   * Default method of cass SearchListComponent
   * @param {NavController} navCtrl To navigate user from one page to another
   * @param {NavParams} navParams ref of navigation params
   * @param {NgZone} ngZone To bind data
   */
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    public courseUtilService: CourseUtilService,
    public events: Events) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  navigateToDetailsPage(content: any, layoutName) {
    this.zone.run(() => {
      if (layoutName === 'enrolledCourse' || content.contentType === ContentType.COURSE) {
        this.navCtrl.push(EnrolledCourseDetailsPage, {
          content: content
        });
      } else if (content.mimeType === MimeType.COLLECTION) {
        // this.navCtrl.push(CollectionDetailsPage, {
          this.navCtrl.push(CollectionDetailsEtbPage, {
          content: content
        });
      } else {
        this.navCtrl.push(ContentDetailsPage, {
          content: content
        });
      }
    });
  }

  resumeCourse(content: any) {
    if (content.lastReadContentId && content.status === 1) {
      this.events.publish('course:resume', {
        content: content
      });
    } else {
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    }
  }

  ngOnInit() {
    if (this.type === 'enrolledCourse') {
      this.content.cProgress = this.courseUtilService.getCourseProgress(this.content.leafNodesCount, this.content.progress);
      this.content.cProgress = parseInt(this.content.cProgress, 10);
    }
    this.checkBatchExpiry();
  }

  checkBatchExpiry() {
    if (this.content.batch && this.content.batch.status === 2) {
      this.batchExp = true;
    } else {
      this.batchExp = false;
    }
  }
}
