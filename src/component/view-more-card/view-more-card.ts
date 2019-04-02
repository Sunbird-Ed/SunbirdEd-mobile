import { CollectionDetailsPage } from './../../pages/collection-details/collection-details';
import { CollectionDetailsEtbPage } from './../../pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from './../../pages/content-details/content-details';
import { EnrolledCourseDetailsPage } from './../../pages/enrolled-course-details/enrolled-course-details';

import { Input, NgZone, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, PopoverController } from 'ionic-angular';
import { ContentType, MimeType, ContentCard } from '../../app/app.constant';
import { CourseUtilService } from '../../service/course-util.service';
import { CourseBatchesRequest, CourseEnrollmentType, CourseBatchStatus, CourseService } from 'sunbird';
import { CommonUtilService } from '@app/service';
import { EnrollmentDetailsPage } from '@app/pages/enrolled-course-details/enrollment-details/enrollment-details';
import * as _ from 'lodash';

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

  @Input() enrolledCourses: any;

  @Input() guestUser: any;

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
  batches: any;
  loader: any;

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
    public events: Events,
    private commonUtilService: CommonUtilService,
    private courseService: CourseService,
    private popoverCtrl: PopoverController
    ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  checkRetiredOpenBatch(content: any, layoutName?: string): void {
    this.loader = this.commonUtilService.getLoader();
    this.loader.present();
    let anyOpenBatch: Boolean = false;
    this.enrolledCourses = this.enrolledCourses || [];
    const retiredBatches = this.enrolledCourses.filter((element) =>  {
      if (element.contentId === content.identifier && element.batch.status === 1 && element.cProgress !== 100) {
        anyOpenBatch = true;
      }
      if (element.contentId === content.identifier && element.batch.status === 2 && element.cProgress !== 100) {
        return element;
      }
    });
    if (anyOpenBatch || !retiredBatches.length) {
      // open the batch directly
      this.navigateToDetailsPage(content, layoutName);
    } else if (retiredBatches.length) {
      this.navigateToBatchListPopup(content, layoutName, retiredBatches);
    }
  }

  navigateToBatchListPopup(content: any, layoutName?: string, retiredBatched?: any): void {
    const upcommingBatches = [];
    const courseBatchesRequest: CourseBatchesRequest = {
      courseId: layoutName === ContentCard.LAYOUT_INPROGRESS ? content.contentId : content.identifier,
      enrollmentType: CourseEnrollmentType.OPEN,
      status: [CourseBatchStatus.NOT_STARTED, CourseBatchStatus.IN_PROGRESS]
    };
    const reqvalues = new Map();
    reqvalues['enrollReq'] = courseBatchesRequest;
    // this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
    //   InteractSubtype.ENROLL_CLICKED,
    //     Environment.HOME,
    //     PageId.CONTENT_DETAIL, undefined,
    //     reqvalues);

    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      if (!this.guestUser) {
        // loader.present();
        this.courseService.getCourseBatches(courseBatchesRequest)
          .then((data: any) => {
            data = JSON.parse(data);
            this.zone.run(() => {
              this.batches = data.result.content;
              if (this.batches.length) {
                _.forEach(this.batches, (batch, key) => {
                    upcommingBatches.push(batch);
                });
                this.loader.dismiss();
                const popover = this.popoverCtrl.create(EnrollmentDetailsPage,
                  {
                    upcommingBatches: this.batches,
                    retiredBatched: retiredBatched
                  },
                  { cssClass: 'enrollement-popover' }
                );
                // this.navCtrl.push(EnrollmentDetailsPage, {
                //   ongoingBatches: ongoingBatches,
                //   upcommingBatches: upcommingBatches
                // });
              } else {
                this.loader.dismiss();
                this.navigateToDetailsPage(content, layoutName);
                // this.commonUtilService.showToast('NO_BATCHES_AVAILABLE');
              }
            });
          })
          .catch((error: any) => {
            console.log('error while fetching course batches ==>', error);
          });
      } else {
        // this.navCtrl.push(CourseBatchesPage);
      }
    } else {
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }


  navigateToDetailsPage(content: any, layoutName) {
    this.zone.run(() => {
      this.loader.dismiss();
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
