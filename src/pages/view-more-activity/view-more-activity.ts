import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Component, NgZone, OnInit } from '@angular/core';
import { ContentService, CourseService, PageId, Environment, ImpressionType, LogLevel } from 'sunbird';
import * as _ from 'lodash';
import { ContentType } from '../../app/app.constant';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseUtilService } from '../../service/course-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';

@IonicPage()
@Component({
  selector: 'page-view-more-activity',
  templateUrl: 'view-more-activity.html',
})

export class ViewMoreActivityPage implements OnInit {

  /**
 * Contains search query
 */
  searchQuery: any;

  /**
 * To hold search result
 */
  searchList: any;

  /**
* Contains tab bar element ref
*/
  tabBarElement: any;

  /**
 * Flag to show / hide button
 */
  loadMoreBtn = true;

  /**
	 * Offset
	 */
  offset = 0;

  /**
	 * Contains search limit
	 */
  searchLimit = 10;

  /**
	 * Total search count
	 */
  totalCount: number;

  /**
	 * Load more flag
	 */
  isLoadMore = false;

  /**
	 * Header title
	 */
  headerTitle: string;

  /**
	 * Default page type
	 */
  pageType = 'library';

  /**
	 * To queue downloaded identifier
	 */
  queuedIdentifiers: Array<any> = [];

  downloadPercentage = 0;

  showOverlay = false;

  resumeContentData: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private ngZone: NgZone,
    private contentService: ContentService,
    private courseService: CourseService,
    private courseUtilService: CourseUtilService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.subscribeUtilityEvents();
  }

  /**
	 * Angular life cycle hooks
	 */
  ngOnInit() {
    this.tabBarElement.style.display = 'none';
  }

  /**
	 * Ionic default life cycle hook
	 */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.searchQuery = this.navParams.get('requestParams');
    if (this.headerTitle !== this.navParams.get('headerTitle')) {
      this.headerTitle = this.navParams.get('headerTitle');
      this.offset = 0;
      this.loadMoreBtn = true;
      this.mapper();
    }
  }

  subscribeUtilityEvents() {
    this.events.subscribe('savedResources:update', (res) => {
      if (res && res.update) {
        if (this.navParams.get('pageName') === 'resource.SavedResources') {
          this.getLocalContents();
        }
      }
    });

    this.events.subscribe('viewMore:Courseresume', (data) => {
      this.resumeContentData = data.content;
      this.getContentDetails(data.content);
    });
  }

  /**
	 * Search content
	 */
  search() {
    const loader = this.commonUtilService.getLoader();
    loader.present();

    this.contentService.getSearchCriteriaFromRequest(this.searchQuery).then((success: any) => {
      const reqBody = JSON.parse(success);
      reqBody.limit = 10;
      reqBody.offset = this.offset === 0 ? reqBody.offset : this.offset;
      this.contentService.searchContent(reqBody, true, false, false) .then((data: any) => {
        data = JSON.parse(data);
        this.ngZone.run(() => {
          if (data.result && data.result.contentDataList) {
            this.loadMoreBtn = data.result.contentDataList.length < this.searchLimit ? false : true;
            if (this.isLoadMore) {
              _.forEach(data.result.contentDataList, (value) => {
                this.searchList.push(value);
              });
            } else {
              this.searchList = data.result.contentDataList;
            }
          } else {
            this.loadMoreBtn = false;
          }
          loader.dismiss();
        });
        this.generateImpressionEvent();
        this.generateLogEvent(data.result);
      }) .catch(() => {
        console.error('Error: while fetching view more content');
        loader.dismiss();
      });
    }) .catch(() => {
      console.error('Error: while fetching view more content');
      loader.dismiss();
    });
  }

  private generateImpressionEvent() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.SEARCH, '',
      PageId.VIEW_MORE,
      Environment.HOME, '', '', '');
  }

  private generateLogEvent(searchResult) {
    if (searchResult != null) {
      const contentArray: Array<any> = searchResult.contentDataList;
      const params = new Array<any>();
      const paramsMap = new Map();
      paramsMap['SearchResults'] = contentArray.length;
      paramsMap['SearchCriteria'] = searchResult.request;
      params.push(paramsMap);
      this.telemetryGeneratorService.generateLogEvent(LogLevel.INFO,
        PageId.VIEW_MORE,
        Environment.HOME,
        ImpressionType.SEARCH, params);
    }
  }

  /**
	 * Load more result
	 */
  loadMore() {
    this.isLoadMore = true;
    this.offset = this.offset + this.searchLimit;
    if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('NO_INTERNET_TITLE'));
    } else {
      this.mapper();
    }
  }


  /**
	 * Mapper to call api based on page.Layout name
	 */
  mapper() {
    const pageName = this.navParams.get('pageName');
    switch (pageName) {
      case 'course.EnrolledCourses':
        this.pageType = 'enrolledCourse';
        this.loadMoreBtn = false;
        this.getEnrolledCourse();
        break;
      case 'course.PopularContent':
        this.pageType = 'popularCourses';
        this.search();
        break;
      case 'resource.SavedResources':
        this.loadMoreBtn = false;
        this.getLocalContents();
        break;
      default:
        this.search();
    }
  }

  /**
	 * Get enrolled courses
	 */
  getEnrolledCourse() {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.pageType = 'enrolledCourse';
    const option = {
      userId: this.navParams.get('userId'),
      refreshEnrolledCourses: false
    };
    this.courseService.getEnrolledCourses(option)
     .then((data: any) => {
      if (data) {
        data = JSON.parse(data);
        this.searchList = data.result.courses ? data.result.courses : [];
        this.loadMoreBtn = false;
      }
      loader.dismiss();
    })
     .catch((error: any) => {
      console.error('error while loading enrolled courses', error);
      loader.dismiss();
    });
  }

  /**
	 * Get local content
	 */
  getLocalContents() {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    const requestParams = {
      contentTypes: ContentType.FOR_LIBRARY_TAB
    };
    this.contentService.getAllLocalContents(requestParams)
      .then(data => {
        const contentData = [];
        _.forEach(data, (value) => {
          value.contentData.lastUpdatedOn = value.lastUpdatedTime;
          if (value.contentData.appIcon) {
            value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
          }
          contentData.push(value.contentData);
        });
        this.ngZone.run(() => {
          this.searchList = contentData;
          loader.dismiss();
          this.loadMoreBtn = false;
        });
      })
      .catch(() => {
        loader.dismiss();
      });
  }

  getContentDetails(content) {
    const identifier = content.contentId || content.identifier;
    this.contentService.getContentDetail({ contentId: identifier })
    .then((data: any) => {
      data = JSON.parse(data);
      if (Boolean(data.result.isAvailableLocally)) {
        this.navCtrl.push(ContentDetailsPage, {
          content: { identifier: content.lastReadContentId },
          depth: '1',
          contentState: {
            batchId: content.batchId ? content.batchId : '',
            courseId: identifier
          },
          isResumedCourse: true,
          isChildContent: true,
          resumedCourseCardData: this.resumeContentData
        });
      } else {
        this.subscribeGenieEvent();
        this.showOverlay = true;
        this.importContent([identifier], false);
      }

    })
      .catch((error: any) => {
        console.log(error);
      });
  }

  importContent(identifiers, isChild) {
    this.queuedIdentifiers.length = 0;
    const option = {
      contentImportMap: this.courseUtilService.getImportContentRequestBody(identifiers, isChild),
      contentStatusArray: []
    };

    this.contentService.importContent(option)
     .then((data: any) => {
      data = JSON.parse(data);
      this.ngZone.run(() => {
        if (data.result && data.result.length) {
          _.forEach(data.result, (value) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            this.showOverlay = false;
            this.downloadPercentage = 0;
            this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
          }
        }
      });
    })
      .catch(() => {
        this.ngZone.run(() => {
          this.showOverlay = false;
          this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
        });
      });
  }

  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.ngZone.run(() => {
        data = JSON.parse(data);
        const res = data;
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadPercentage = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
        }
        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport' && this.downloadPercentage === 100) {
          this.showOverlay = false;
          this.navCtrl.push(ContentDetailsPage, {
            content: { identifier: this.resumeContentData.lastReadContentId },
            depth: '1',
            contentState: {
              batchId: this.resumeContentData.batchId ? this.resumeContentData.batchId : '',
              courseId: this.resumeContentData.contentId || this.resumeContentData.identifier
            },
            isResumedCourse: true,
            isChildContent: true,
            resumedCourseCardData: this.resumeContentData
          });
        }
      });
    });
  }

  cancelDownload() {
    this.ngZone.run(() => {
      this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier) .then(() => {
        this.showOverlay = false;
      }) .catch(() => {
        this.showOverlay = false;
      });
    });
  }

  /**
	 * Ionic life cycle hook
	 */
  ionViewCanLeave() {
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
      this.tabBarElement.style.display = 'flex';
      this.isLoadMore = false;
      this.pageType = this.pageType;
      this.showOverlay = false;
    });
  }
}
