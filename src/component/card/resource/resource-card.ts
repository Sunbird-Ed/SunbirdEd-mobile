import {
  Component,
  Input,
  OnInit,
  Inject
} from '@angular/core';
import {
  NavController,
  Events
} from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '../../../pages/enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '../../../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../../../pages/content-details/content-details';
import { ContentType, MimeType, ContentCard, PreferenceKey, CardSectionName } from '../../../app/app.constant';
import { CourseUtilService } from '../../../service/course-util.service';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import {TelemetryObject, SharedPreferences} from 'sunbird-sdk';
import { CollectionDetailsEtbPage } from '../../../pages/collection-details-etb/collection-details-etb';
import {InteractType, InteractSubtype} from '../../../service/telemetry-constants';

/**
 * The course card component
 */
@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.html'
})
export class ResourceCard implements OnInit {

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
  savedResourcesSection = CardSectionName.SECTION_SAVED_RESOURCES;
  recentViewedSection = CardSectionName.SECTION_RECENT_RESOURCES;

  /**
   * Default method of class CourseCard
   *
   * @param navCtrl To navigate user from one page to another
   */
  constructor(public navCtrl: NavController,
    private courseUtilService: CourseUtilService,
    private events: Events,
    private telemetryGeneratorService: TelemetryGeneratorService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  isResource(contentType) {
    return contentType === ContentType.STORY ||
      contentType === ContentType.WORKSHEET;
  }

  /**
   * Navigate to the course/content details page
   *
   * @param {string} layoutName
   * @param {object} content
   */
  navigateToDetailPage(content: any, layoutName: string): void {
    const identifier = content.contentId || content.identifier;
    let telemetryObject: TelemetryObject ;
    if (layoutName === this.layoutInProgress) {
      telemetryObject = new TelemetryObject(identifier, ContentType.COURSE, undefined);
    } else {
      const ObjectType = this.isResource(content.contentType) ? ContentType.RESOURCE : content.contentType;
      telemetryObject = new TelemetryObject(identifier, ObjectType, undefined);
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
      this.saveContentContext(content);
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      this.navCtrl.push(CollectionDetailsEtbPage, {
        content: content
      });
    } else {
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      });
    }
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

    // store the contentContextMap in shared preference and access it from SDK
    this.preferences.putString(PreferenceKey.CONTENT_CONTEXT, JSON.stringify(contentContextMap)).toPromise().then();
  }
}

