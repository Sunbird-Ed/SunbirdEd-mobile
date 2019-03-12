import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  NavController,
  Events
} from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '../../../pages/enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '../../../pages/collection-details/collection-details';
import { CollectionDetailsEtbPage } from '../../../pages/collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '../../../pages/content-details/content-details';
import { ContentType, MimeType, ContentCard, PreferenceKey } from '../../../app/app.constant';
import { CourseUtilService } from '../../../service/course-util.service';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { InteractType, InteractSubtype, TelemetryObject, SharedPreferences } from 'sunbird';

/**
 * The course card component
 */
@Component({
  selector: 'course-card',
  templateUrl: 'course-card.html'
})
export class CourseCard implements OnInit {

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

  @Input() onProfile = false;

  @Input() index: number;

  @Input() sectionName: string;

  @Input() env: string;

  /**
   * To show card as disbled or Greyed-out when device is offline
   */
  @Input() cardDisabled = false;

  /**
   * Contains default image path.
   *
   * It gets used when perticular course does not have a course/content icon
   */
  defaultImg: string;

  layoutInProgress = ContentCard.LAYOUT_INPROGRESS;
  layoutPopular = ContentCard.LAYOUT_POPULAR;
  layoutSavedContent = ContentCard.LAYOUT_SAVED_CONTENT;
  batchExp: Boolean = false;

  /**
   * Default method of class CourseCard
   *
   * @param navCtrl To navigate user from one page to another
   */
  constructor(public navCtrl: NavController,
    private courseUtilService: CourseUtilService,
    private events: Events,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private preference: SharedPreferences) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  /**
   * Navigate to the course/content details page
   *
   * @param {string} layoutName
   * @param {object} content
   */
  navigateToDetailPage(content: any, layoutName: string): void {
    const identifier = content.contentId || content.identifier;
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = identifier;
    if (layoutName === this.layoutInProgress) {
      telemetryObject.type = ContentType.COURSE;
    } else {
      telemetryObject.type = this.isResource(content.contentType) ? ContentType.RESOURCE : content.contentType;
    }


    const values = new Map();
    values['sectionName'] = this.sectionName;
    values['positionClicked'] = this.index;

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      this.env,
      this.pageName ? this.pageName : this.layoutName,
      telemetryObject,
      values);
    if (layoutName === this.layoutInProgress || content.contentType === ContentType.COURSE) {
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
  }

  isResource(contentType) {
    return contentType === ContentType.STORY ||
      contentType === ContentType.WORKSHEET;
  }

  resumeCourse(content: any) {
    this.saveContentContext(content);
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
    if (this.layoutName === this.layoutInProgress) {
      this.course.cProgress = (this.courseUtilService.getCourseProgress(this.course.leafNodesCount, this.course.progress));
      this.course.cProgress = parseInt(this.course.cProgress, 10);
      if (this.course.batch && this.course.batch.status === 2) {
        this.batchExp = true;
      } else {
        this.batchExp = false;
      }
    }
  }


  saveContentContext(content: any) {
    const contentContextMap = new Map();
    // store content context in the below map
    contentContextMap['userId'] = content.userId;
    contentContextMap['courseId'] = content.courseId;
    contentContextMap['batchId'] = content.batchId;
    if (content.batch) {
      contentContextMap['batchStatus'] = content.batch.status;
    }

    // store the contentContextMap in shared preference and access it from SDK
    this.preference.putString(PreferenceKey.CONTENT_CONTEXT, JSON.stringify(contentContextMap));
  }
}

