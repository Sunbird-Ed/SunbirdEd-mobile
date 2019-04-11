import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { NavController } from 'ionic-angular';
import { CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { Component, Input, OnInit } from '@angular/core';
import { MimeType, ContentType } from '../../app/app.constant';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import {
  TelemetryObject, InteractType
} from 'sunbird-sdk';
import { InteractSubtype } from '@app/service/telemetry-constants';

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
    public navCtrl: NavController,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';

  }

  ngOnInit() {

  }

  navigateToDetailPage(course) {

    const identifier = course.contentData.contentId || course.contentData.identifier;

    const type = this.telemetryGeneratorService.isCollection(course.contentData.mimeType) ?
      course.contentData.contentType : ContentType.RESOURCE;

    const telemetryObject: TelemetryObject = new TelemetryObject(identifier, type, '');
    const values = new Map();
    values['sectionName'] = this.sectionName;
    values['positionClicked'] = this.index;

    if (!course.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable) {
      return false;
    }

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      this.env,
      this.pageName ? this.pageName : this.layoutName,
      telemetryObject,
      values);
    if (course.mimeType === MimeType.COLLECTION) {
      this.navCtrl.push(CollectionDetailsEtbPage, {
        content: course
      });
    } else {
      this.navCtrl.push(ContentDetailsPage, {
        content: course.contentData
      });
    }
  }

}
