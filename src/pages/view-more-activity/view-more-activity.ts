import {
  IonicPage,
  NavController,
  NavParams,
  Events
} from 'ionic-angular';
import {
  Component,
  NgZone,
  OnInit,
  Input
} from '@angular/core';
import {
  ContentService,
  CourseService,
  PageId,
  Environment,
  ImpressionType,
  LogLevel,
  ContentFilterCriteria,
  TelemetryObject,
  InteractType,
  InteractSubtype
} from 'sunbird';
import * as _ from 'lodash';
import {
  ContentType,
  ViewMore,
  MimeType
} from '../../app/app.constant';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseUtilService } from '../../service/course-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';
import { CollectionDetailsEtbPage } from '../collection-details-etb/collection-details-etb';

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
  // adding for ETBV2 integration, to show saved resources after recentlyViewed
  savedResources: Array<any>;

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
    this.events.subscribe('savedResources:update', async(res) => {
      if (res && res.update) {
        if (this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_SAVED) {
          this.getLocalContents(false, this.downloadsOnlyToggle);
        } else if (this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED) {
           await this.getLocalContents(true, this.downloadsOnlyToggle);
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

    this.contentService.getSearchCriteriaFromRequest(this.searchQuery)
      .then((criteria: any) => {
        const contentSearchCriteria = JSON.parse(criteria);
        contentSearchCriteria.limit = 10;
        contentSearchCriteria.offset = this.offset === 0 ? contentSearchCriteria.offset : this.offset;

        this.contentService.searchContent(contentSearchCriteria, true, false, false)
          .then((data: any) => {
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
                  console.log('**1 search List =>', this.searchList);

                }
              } else {
                this.loadMoreBtn = false;
              }
              loader.dismiss();
            });
            this.generateImpressionEvent();
            this.generateLogEvent(data.result);
          })
          .catch(() => {
            console.error('Error: while fetching view more content');
            loader.dismiss();
          });
      }).catch(() => {
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
  async mapper() {
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
        await this.getLocalContents(true);
        this.getLocalContents();
        break;

      default:
        this.search();
    }
    console.log('search List =>' , this.searchList);
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
    this.courseService.getEnrolledCourses(option)
      .then((data: any) => {
        if (data) {
          data = JSON.parse(data);
          this.searchList = data.result.courses ? data.result.courses : [];
          this.loadMoreBtn = false;
          console.log('**2 searchList =>', this.searchList);
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
   async getLocalContents(recentlyViewed?: boolean, downloaded?: boolean) {
    const loader = this.commonUtilService.getLoader();
    loader.present();

    const requestParams: ContentFilterCriteria = {
      uid: this.uid,
      audience: this.audience,
      recentlyViewed: recentlyViewed,
      downloadedOnly: downloaded
    };

    if (recentlyViewed) {
      requestParams.contentTypes = ContentType.FOR_RECENTLY_VIEWED;
      requestParams.limit = 20;
    } else {
      requestParams.contentTypes = ContentType.FOR_LIBRARY_TAB;
    }

    this.contentService.getAllLocalContents(requestParams)
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
          // if saved resources are available
        });
        this.ngZone.run(() => {
          if ((this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED) && recentlyViewed) {
            this.searchList = contentData;
          }
          //
          if ((this.navParams.get('pageName') === ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED) && !recentlyViewed) {
           this.savedResources = contentData;
              for (let i = 0 ; i < this.searchList.length; i++) {
                  const index = this.savedResources.findIndex( (el) => {
                  return el.identifier === this.searchList[i].identifier;
              });

              if (index !== -1) {
                this.savedResources.splice(index, 1);
              }
          }
          //  this.recentlyViewed.push(...this.savedResources);
           this.searchList.push(...this.savedResources);
          }
          console.log('content data is =>' , contentData);
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
      this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier).then(() => {
        this.showOverlay = false;
      }).catch(() => {
        this.showOverlay = false;
      });
    });
  }


  showDisabled(resource) {
    return !resource.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable;
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

  navigateToDetailPage(content: any): boolean {
    if (!content.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable) {
      return false;
    }
    const identifier = content.contentId || content.identifier;
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = identifier;
    telemetryObject.type = this.isResource(content.contentType) ? ContentType.RESOURCE : content.contentType;


    const values = new Map();
    values['sectionName'] = this.sectionName;
    values['positionClicked'] = this.index;

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      this.env,
      this.pageName ? this.pageName : this.layoutName,
      telemetryObject,
      values);
    if (content.mimeType === MimeType.COLLECTION) {
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
}
