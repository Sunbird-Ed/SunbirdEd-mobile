import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {
  Content,
  ContentEventType,
  ContentImportRequest,
  ContentImportResponse,
  ContentImportStatus,
  ContentRequest,
  ContentSearchCriteria,
  ContentSearchResult,
  ContentService,
  Course,
  CourseService,
  DownloadEventType,
  DownloadProgress,
  EventsBusEvent,
  EventsBusService,
  SearchType
} from 'sunbird-sdk';
import * as _ from 'lodash';
import {ContentType, ViewMore} from '../../app/app.constant';
import {ContentDetailsPage} from '../content-details/content-details';
import {CourseUtilService} from '../../service/course-util.service';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {CommonUtilService} from '../../service/common-util.service';
import {Environment, ImpressionType, LogLevel, PageId,} from '../../service/telemetry-constants';
import {Subscription} from "rxjs";

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
   * Flag to show / hide downloads only button
   */
  showDownloadsOnlyToggle = false;

  /**
   * value for downloads only toggle button, may have true/false
   */
  downloadsOnlyToggle = false;


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
   * Flag to switch between view-more-card in view
   */
  localContentsCard = false;

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
  uid: any;
  audience: any;
  defaultImg: string;
  private eventSubscription: Subscription;

  constructor(
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private ngZone: NgZone,
    @Inject('EVENTS_BUS_SERVICE') private eventBusService: EventsBusService,
    @Inject('COURSE_SERVICE') private courseService: CourseService,
    private courseUtilService: CourseUtilService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
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
    this.showDownloadsOnlyToggle = this.navParams.get('showDownloadOnlyToggle');
    this.uid = this.navParams.get('uid');
    this.audience = this.navParams.get('audience');
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
        if (this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_SAVED) {
          this.getLocalContents(false, this.downloadsOnlyToggle);
        } else if (this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED) {
          this.getLocalContents(true, this.downloadsOnlyToggle);
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
    const searchCriteria: ContentSearchCriteria = {
      searchType: SearchType.FILTER
    };
    this.contentService.searchContent(searchCriteria, this.searchQuery).toPromise()
      .then((data: ContentSearchResult) => {
        this.ngZone.run(() => {
          if (data && data.contentDataList) {
            this.loadMoreBtn = data.contentDataList.length >= this.searchLimit;
            if (this.isLoadMore) {
              _.forEach(data.contentDataList, (value) => {
                this.searchList.push(value);
              });
            } else {
              this.searchList = data.contentDataList;
            }
          } else {
            this.loadMoreBtn = false;
          }
          loader.dismiss();
        });
        this.generateImpressionEvent();
        this.generateLogEvent(data);
      })
      .catch(() => {
        console.error('Error: while fetching view more content');
        loader.dismiss();
      });
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
      case ViewMore.PAGE_COURSE_ENROLLED:
        this.pageType = 'enrolledCourse';
        this.loadMoreBtn = false;
        this.localContentsCard = false;
        this.getEnrolledCourse();
        break;

      case ViewMore.PAGE_COURSE_POPULAR:
        this.pageType = 'popularCourses';
        this.localContentsCard = false;
        this.search();
        break;

      case ViewMore.PAGE_RESOURCE_SAVED:
        this.loadMoreBtn = false;
        this.localContentsCard = true;
        this.getLocalContents();
        break;

      case ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED:
        this.loadMoreBtn = false;
        this.localContentsCard = true;
        this.getLocalContents(true);
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
      refreshEnrolledCourses: false,
      returnRefreshedEnrolledCourses: true
    };
    this.courseService.getEnrolledCourses(option).toPromise()
      .then((data: Course[]) => {
        if (data) {
          // data = JSON.parse(data);
          this.searchList = data ? data : [];
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
  getLocalContents(recentlyViewed?: boolean, downloaded?: boolean) {
    const loader = this.commonUtilService.getLoader();
    loader.present();

    const requestParams: ContentRequest = {
      uid: this.uid,
      audience: this.audience,
      recentlyViewed: recentlyViewed,
      localOnly: downloaded,
      contentTypes: recentlyViewed ? ContentType.FOR_RECENTLY_VIEWED : ContentType.FOR_LIBRARY_TAB,
      limit: recentlyViewed ? 20 : 0
    };
    this.contentService.getContents(requestParams).toPromise()
      .then(data => {
        const contentData = [];
        _.forEach(data, (value) => {
          value.contentData.lastUpdatedOn = value.lastUpdatedTime;
          if (value.contentData.appIcon) {
            if (value.contentData.appIcon.includes('http:') || value.contentData.appIcon.includes('https:')) {
              if (this.commonUtilService.networkInfo.isNetworkAvailable) {
                value.contentData.appIcon = value.contentData.appIcon;
              } else {
                value.contentData.appIcon = this.defaultImg;
              }
            } else if (value.basePath) {
              value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
            }
          }
          contentData.push(value);
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
    this.contentService.getContentDetails({contentId: identifier}).toPromise()
      .then((data: Content) => {
        if (Boolean(data.isAvailableLocally)) {
          this.navCtrl.push(ContentDetailsPage, {
            content: {identifier: content.lastReadContentId},
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
    const option: ContentImportRequest = {
      contentImportArray: this.courseUtilService.getImportContentRequestBody(identifiers, isChild),
      contentStatusArray: []
    };

    this.contentService.importContent(option).toPromise()
      .then((data: ContentImportResponse[]) => {
        this.ngZone.run(() => {
          if (data && data.length) {
            _.forEach(data, (value) => {
              if (value.status === ContentImportStatus.ENQUEUED_FOR_DOWNLOAD) {
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
    this.eventSubscription = this.eventBusService.events().subscribe((event: EventsBusEvent) => {
      this.ngZone.run(() => {
        if (event.type === DownloadEventType.PROGRESS) {
          const downloadEvent = event as DownloadProgress;
          this.downloadPercentage = downloadEvent.payload.progress === -1 ? 0 : downloadEvent.payload.progress;
        }
        if (event.payload && event.type === ContentEventType.IMPORT_COMPLETED && this.downloadPercentage === 100) {
          this.showOverlay = false;
          this.navCtrl.push(ContentDetailsPage, {
            content: {identifier: this.resumeContentData.lastReadContentId},
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
    }) as any;
  }

  cancelDownload() {
    this.ngZone.run(() => {
      this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier)
        .toPromise().then(() => {
        this.showOverlay = false;
      }).catch(() => {
        this.showOverlay = false;
      });
    });
  }

  downloadsOnlyToggleChange(e) {
    if (this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_SAVED) {
      this.getLocalContents(false, this.downloadsOnlyToggle);
    } else if (this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED) {
      this.getLocalContents(true, this.downloadsOnlyToggle);
    }
  }

  showDisabled(resource) {
    return !resource.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable;
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave() {
    this.ngZone.run(() => {
      if (this.eventSubscription) {
        this.eventSubscription.unsubscribe();
      }
      this.tabBarElement.style.display = 'flex';
      this.isLoadMore = false;
      this.showOverlay = false;
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
}
