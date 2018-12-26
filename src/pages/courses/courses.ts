import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import {
  NavController,
  PopoverController,
  Events
} from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { IonicPage } from 'ionic-angular';
import {
  SharedPreferences,
  CourseService,
  PageAssembleService,
  PageAssembleCriteria,
  ImpressionType,
  PageId,
  Environment,
  ContentService,
  ProfileType,
  PageAssembleFilter,
  InteractType,
  InteractSubtype
} from 'sunbird';
import {
  QRResultCallback,
  SunbirdQRScanner
} from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { ContentDetailsPage } from '../content-details/content-details';
import * as _ from 'lodash';
import {
  ProfileConstants,
  EventTopics,
  PreferenceKey,
  ContentType,
  PageName,
  ContentCard,
  ViewMore
} from '../../app/app.constant';
import {
  PageFilterCallback,
  PageFilter
} from '../page-filter/page.filter';
import { AppGlobalService } from '../../service/app-global.service';
import Driver from 'driver.js';
import { CourseUtilService } from '../../service/course-util.service';
import { updateFilterInSearchQuery } from '../../util/filter.util';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage implements OnInit {

  /**
   * Contains enrolled course
   */
  enrolledCourses: Array<any>;

  /**
   * Contains popular and latest courses ist
   */
  popularAndLatestCourses: Array<any>;

  /**
   * Contains user id
   */
  userId: string;

  /**
   * Flag to show/hide loader
   */
  showLoader = true;

  layoutInProgress = ContentCard.LAYOUT_INPROGRESS;
  layoutPopular = ContentCard.LAYOUT_POPULAR;

  /**
   * Flag to show latest and popular course loader
   */
  pageApiLoader = true;
  guestUser = false;
  showSignInCard = false;
  showWarning = false;
  isOnBoardingCardCompleted = false;
  onBoardingProgress = 0;
  selectedLanguage = 'en';
  appLabel: string;
  courseFilter: any;
  appliedFilter: any;
  filterIcon = './assets/imgs/ic_action_filter.png';
  profile: any;
  isVisible = false;
  inProgressSection = 'In-Progress Course';

  /**
   * To queue downloaded identifier
   */
  queuedIdentifiers: Array<any> = [];
  downloadPercentage = 0;
  showOverlay = false;
  resumeContentData: any;
  tabBarElement: any;
  private mode = 'soft';
  isFilterApplied = false;
  callback: QRResultCallback;
  pageFilterCallBack: PageFilterCallback;

  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl To navigate user from one page to another
   * @param {CourseService} courseService Service to get enrolled courses
   * @param {PageAssembleService} pageService Service to get latest and popular courses
   * @param {NgZone} ngZone To bind data
   */
  constructor(
    private appVersion: AppVersion,
    private navCtrl: NavController,
    private courseService: CourseService,
    private pageService: PageAssembleService,
    private ngZone: NgZone,
    private qrScanner: SunbirdQRScanner,
    private popCtrl: PopoverController,
    private events: Events,
    private contentService: ContentService,
    private preference: SharedPreferences,
    private appGlobalService: AppGlobalService,
    private courseUtilService: CourseUtilService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
      .then(val => {
        if (val && val.length) {
          this.selectedLanguage = val;
        }
      });

    this.subscribeUtilityEvents();


    this.appVersion.getAppName()
      .then((appName: any) => {
        this.appLabel = appName;
      });
  }

  /**
 * Angular life cycle hooks
 */
  ngOnInit() {
    this.getCourseTabData();
  }
  ionViewDidEnter() {
    this.isVisible = true;
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.COURSES,
      Environment.HOME
    );

    this.appGlobalService.generateConfigInteractEvent(PageId.COURSES, this.isOnBoardingCardCompleted);
    this.preference.getString('show_app_walkthrough_screen')
      .then(value => {
        if (value === 'true') {
          const driver = new Driver({
            allowClose: true,
            closeBtnText: this.commonUtilService.translateMessage('DONE'),
            showButtons: true,
          });

          setTimeout(() => {
            driver.highlight({
              element: '#qrIcon',
              popover: {
                title: this.commonUtilService.translateMessage('ONBOARD_SCAN_QR_CODE'),
                description: '<img src=\'assets/imgs/ic_scanqrdemo.png\' /><p>' +
                  this.commonUtilService.translateMessage('ONBOARD_SCAN_QR_CODE_DESC', this.appLabel) + '</p>',
                showButtons: true,         // Do not show control buttons in footer
                closeBtnText: this.commonUtilService.translateMessage('DONE'),
              }
            });

            const element = document.getElementById('driver-highlighted-element-stage');
            const img = document.createElement('img');
            img.src = 'assets/imgs/ic_scan.png';
            img.id = 'qr_scanner';
            element.appendChild(img);
          }, 100);
          this.telemetryGeneratorService.generatePageViewTelemetry(PageId.ONBOARDING_QR_SHOWCASE, Environment.ONBOARDING, PageId.COURSES);
          this.preference.putString('show_app_walkthrough_screen', 'false');
        }
      });
    this.events.subscribe('event:showScanner', (data) => {
      if (data.pageName === PageId.COURSES) {
        this.qrScanner.startScanner(PageId.COURSES, false);
      }
    });
  }

  ionViewCanLeave() {
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
    });
  }

  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
      this.isVisible = false;
      this.showOverlay = false;
      this.downloadPercentage = 0;
    });
  }

  subscribeUtilityEvents() {
    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', (upgrade) => {
      if (upgrade) {
        this.appGlobalService.openPopover(upgrade);
      }
    });

    this.events.subscribe('onboarding-card:completed', (param) => {
      this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
    });

    this.events.subscribe(AppGlobalService.PROFILE_OBJ_CHANGED, () => {
      this.getCourseTabData();
    });

    this.events.subscribe(EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY, (data) => {
      if (data.update) {
        this.getEnrolledCourses(true, true);
      }
    });

    this.events.subscribe('onboarding-card:increaseProgress', (progress) => {
      this.onBoardingProgress = progress.cardProgress;
    });

    this.events.subscribe('course:resume', (data) => {
      this.resumeContentData = data.content;
      this.getContentDetails(data.content);
    });

    this.events.subscribe(EventTopics.ENROL_COURSE_SUCCESS, (res) => {
      if (res && res.batchId) {
        this.getEnrolledCourses(false, false);
      }
    });

    this.events.subscribe('onAfterLanguageChange:update', (res) => {
      if (res && res.selectedLanguage) {
        this.selectedLanguage = res.selectedLanguage;
        this.getPopularAndLatestCourses();
      }
    });

    this.events.subscribe('tab.change', (data) => {
      this.ngZone.run(() => {
        if (data === 'COURSES') {
          if (this.appliedFilter) {
            this.filterIcon = './assets/imgs/ic_action_filter.png';
            this.courseFilter = undefined;
            this.appliedFilter = undefined;
            this.isFilterApplied = false;
            this.getPopularAndLatestCourses();
          }
        }
      });
    });
  }

  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(refreshEnrolledCourses: boolean = true, returnRefreshedCourses: boolean = false): void {
    this.spinner(true);

    const option = {
      userId: this.userId,
      refreshEnrolledCourses: refreshEnrolledCourses,
      returnRefreshedEnrolledCourses: returnRefreshedCourses
    };
    this.courseService.getEnrolledCourses(option)
      .then((enrolledCourses: any) => {
        if (enrolledCourses) {
          enrolledCourses = JSON.parse(enrolledCourses);
          this.ngZone.run(() => {
            this.enrolledCourses = enrolledCourses.result.courses ? enrolledCourses.result.courses : [];
            // maintain the list of courses that are enrolled, and store them in appglobal
            if (this.enrolledCourses.length > 0) {
              const courseList: Array<any> = [];

              for (const course of this.enrolledCourses) {
                courseList.push(course);
              }

              this.appGlobalService.setEnrolledCourseList(courseList);
            }

            this.spinner(false);
          });
        }
      })
      .catch((error: any) => {
        console.log('error while loading enrolled courses', error);
        this.spinner(false);
      });
  }

  /**
   * To get popular course.
   *
   * It internally calls course handler of genie sdk
   */
  getPopularAndLatestCourses(pageAssembleCriteria?: PageAssembleCriteria): void {
    this.pageApiLoader = true;
    if (pageAssembleCriteria === undefined) {
      const criteria = new PageAssembleCriteria();
      criteria.name = PageName.COURSE;
      criteria.mode = 'soft';

      if (this.appliedFilter) {
        let filterApplied = false;
        Object.keys(this.appliedFilter).forEach(key => {
          if (this.appliedFilter[key].length > 0) {
            filterApplied = true;
          }
        });

        if (filterApplied) {
          criteria.mode = 'hard';
        }
        criteria.filters = this.appliedFilter;
      }
      pageAssembleCriteria = criteria;
    }
    this.mode = pageAssembleCriteria.mode;
    if (this.profile && !this.isFilterApplied) {
      if (!pageAssembleCriteria.filters) {
        pageAssembleCriteria.filters = new PageAssembleFilter();
      }

      if (this.profile.board && this.profile.board.length) {
        pageAssembleCriteria.filters.board = this.applyProfileFilter(this.profile.board, pageAssembleCriteria.filters.board, 'board');
      }

      if (this.profile.medium && this.profile.medium.length) {
        pageAssembleCriteria.filters.medium = this.applyProfileFilter(this.profile.medium, pageAssembleCriteria.filters.medium, 'medium');
      }

      if (this.profile.grade && this.profile.grade.length) {
        pageAssembleCriteria.filters.gradeLevel = this.applyProfileFilter(this.profile.grade,
          pageAssembleCriteria.filters.gradeLevel, 'gradeLevel');
      }

      if (this.profile.subject && this.profile.subject.length) {
        pageAssembleCriteria.filters.subject = this.applyProfileFilter(this.profile.subject,
          pageAssembleCriteria.filters.subject, 'subject');
      }
    }
    this.pageService.getPageAssemble(pageAssembleCriteria).then((res: any) => {
      res = JSON.parse(res);
      this.ngZone.run(() => {
        const sections = JSON.parse(res.sections);
        const newSections = [];
        sections.forEach(element => {
          element.display = JSON.parse(element.display);
          if (element.display.name) {
            if (_.has(element.display.name, this.selectedLanguage)) {
              const langs = [];
              _.forEach(element.display.name, (value, key) => {
                langs[key] = value;
              });
              element.name = langs[this.selectedLanguage];
            }
          }
          newSections.push(element);
        });

        this.popularAndLatestCourses = newSections;
        this.pageApiLoader = !this.pageApiLoader;
        this.checkEmptySearchResult();
      });
    }).catch((error: string) => {
      console.log('Page assmble error', error);
      this.ngZone.run(() => {
        this.pageApiLoader = false;
        if (error === 'CONNECTION_ERROR') {
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
          this.commonUtilService.showToast('ERROR_FETCHING_DATA');
        }
      });
    });
  }

  applyProfileFilter(profileFilter: Array<any>, assembleFilter: Array<any>, categoryKey?: string) {
    if (categoryKey) {
      const nameArray = [];
      profileFilter.forEach(filterCode => {
        let nameForCode = this.appGlobalService.getNameForCodeInFramework(categoryKey, filterCode);

        if (!nameForCode) {
          nameForCode = filterCode;
        }

        nameArray.push(nameForCode);
      });

      profileFilter = nameArray;
    }

    if (!assembleFilter) {
      assembleFilter = [];
    }
    assembleFilter = assembleFilter.concat(profileFilter);

    const unique_array = [];

    for (let i = 0; i < assembleFilter.length; i++) {
      if (unique_array.indexOf(assembleFilter[i]) === -1 && assembleFilter[i].length > 0) {
        unique_array.push(assembleFilter[i]);
      }
    }

    assembleFilter = unique_array;

    if (assembleFilter.length === 0) {
      return undefined;
    }

    return assembleFilter;
  }

  /**
   * To start / stop spinner
   */
  spinner(flag: boolean) {
    this.ngZone.run(() => {
      this.showLoader = flag;
    });
  }

  /**
   * Get user id.
   *
   * Used to get enrolled course(s) of logged-in user
   */
  getUserId() {
    return new Promise((resolve, reject) => {
      this.guestUser = !this.appGlobalService.isUserLoggedIn();

      if (this.guestUser) {
        this.getCurrentUser();
        this.appGlobalService.setEnrolledCourseList([]);
        reject('session expired');
      } else {
        this.profile = this.appGlobalService.getCurrentUser();
        const sessionObj = this.appGlobalService.getSessionData();
        this.userId = sessionObj[ProfileConstants.USER_TOKEN];
        this.getEnrolledCourses(true, false);
        resolve();
      }
    });
  }

  /**
   *
   * @param refresher
   */
  getCourseTabData(refresher?) {
    setTimeout(() => {
      if (refresher) {
        refresher.complete();
        this.telemetryGeneratorService.generatePullToRefreshTelemetry(PageId.COURSES, Environment.HOME);
      }
    }, 10);

    this.enrolledCourses = [];
    this.popularAndLatestCourses = [];

    this.getUserId()
      .then(() => {
        this.getPopularAndLatestCourses();
      })
      .catch(error => {
        console.log('Error while Fetching Data', error);
        this.getPopularAndLatestCourses();
      });
  }

  /**
   * It will fetch the guest user profile details
   */
  getCurrentUser(): void {
    const profileType = this.appGlobalService.getGuestUserType();
    if (profileType === ProfileType.TEACHER && this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER) {
      this.showSignInCard = true;
    } else {
      this.showSignInCard = false;
    }
  }

  scanQRCode() {
    this.qrScanner.startScanner(PageId.COURSES);
  }

  search() {
    this.navCtrl.push(SearchPage, { contentType: ContentType.FOR_COURSE_TAB, source: PageId.COURSES });
  }

  showFilter() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.FILTER_BUTTON_CLICKED,
      Environment.HOME,
      PageId.COURSES, undefined);
    const that = this;

    this.pageFilterCallBack = {
      applyFilter(filter, appliedFilter) {
        that.ngZone.run(() => {
          const criteria = new PageAssembleCriteria();
          criteria.name = PageName.COURSE;
          criteria.filters = filter;
          that.courseFilter = appliedFilter;
          that.appliedFilter = filter;

          let filterApplied = false;

          that.isFilterApplied = false;

          const values = new Map();
          values['filters'] = filter;
          that.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.APPLY_FILTER_CLICKED,
            Environment.HOME,
            PageId.COURSE_PAGE_FILTER,
            undefined,
            values
          );

          Object.keys(that.appliedFilter).forEach(key => {
            if (that.appliedFilter[key].length > 0) {
              filterApplied = true;
              that.isFilterApplied = true;
            }
          });

          if (filterApplied) {
            criteria.mode = 'hard';
            that.filterIcon = './assets/imgs/ic_action_filter_applied.png';
          } else {
            criteria.mode = 'soft';
            that.filterIcon = './assets/imgs/ic_action_filter.png';
          }

          that.getPopularAndLatestCourses(criteria);
        });
      }
    };

    const filterOptions = {
      callback: this.pageFilterCallBack,
      pageId: PageId.COURSES
    };
    // Already apllied filter
    if (this.courseFilter) {
      filterOptions['filter'] = this.courseFilter;
      this.showFilterPage(filterOptions);
    } else {
      // TODO: Need to add loader
      this.formAndFrameworkUtilService.getCourseFilterConfig().then((data) => {
        filterOptions['filter'] = data;
        this.showFilterPage(filterOptions);
      }).catch(() => {
        console.error('Error Occurred!');
      });
    }

  }

  showFilterPage(filterOptions) {
    this.popCtrl.create(PageFilter, filterOptions, { cssClass: 'resource-filter' }).present();
  }

  checkEmptySearchResult(isAfterLanguageChange = false) {
    const flags = [];
    _.forEach(this.popularAndLatestCourses, (value, key) => {
      if (value.contents && value.contents.length) {
        flags[key] = true;
      }
    });

    if (flags.length && _.includes(flags, true)) {
    } else {
      if (!isAfterLanguageChange) {
        this.commonUtilService.showToast('NO_CONTENTS_FOUND', this.isVisible);
      }
    }
  }

  showOfflineWarning() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 3000);
  }

  retryShowingPopularCourses(showRefresh = false) {
    if (this.commonUtilService.networkInfo.isNetworkAvailable && showRefresh) {
      this.getCourseTabData();
    }
  }

  getContentDetails(content) {
    const identifier = content.contentId || content.identifier;
    this.contentService.getContentDetail({ contentId: identifier })
      .then((data: any) => {
        data = JSON.parse(data);
        if (data && data.result && data.result.isAvailableLocally) {
          this.showOverlay = false;
          this.navigateToContentDetailsPage(content);
        } else {
          this.subscribeGenieEvent();
          this.showOverlay = true;
          this.importContent([identifier], false);
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
      });
  }

  navigateToViewMoreContentsPage(showEnrolledCourses: boolean, searchQuery?: any, headerTitle?: string) {
    let params;
    let title;
    if (showEnrolledCourses) {
      title = this.commonUtilService.translateMessage('COURSES_IN_PROGRESS');
      params = {
        headerTitle: 'COURSES_IN_PROGRESS',
        userId: this.userId,
        pageName: ViewMore.PAGE_COURSE_ENROLLED
      };
    } else {
      searchQuery = updateFilterInSearchQuery(searchQuery, this.appliedFilter, this.profile,
        this.mode, this.isFilterApplied, this.appGlobalService);
      title = headerTitle;
      params = {
        headerTitle: headerTitle,
        pageName: ViewMore.PAGE_COURSE_POPULAR,
        requestParams: searchQuery
      };
    }
    const values = new Map();
    values['SectionName'] = title;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEWALL_CLICKED,
      Environment.HOME,
      PageId.COURSES, undefined,
      values);
    this.navCtrl.push(ViewMoreActivityPage, params);
  }

  navigateToContentDetailsPage(content) {
    const identifier = content.contentId || content.identifier;
    this.navCtrl.push(ContentDetailsPage, {
      content: { identifier: content.lastReadContentId },
      depth: '1',
      contentState: {
        batchId: content.batchId ? content.batchId : '',
        courseId: identifier
      },
      isResumedCourse: true,
      isChildContent: true,
      resumedCourseCardData: content
    });
  }

  importContent(identifiers, isChild) {
    const option = {
      contentImportMap: this.courseUtilService.getImportContentRequestBody(identifiers, isChild),
      contentStatusArray: []
    };

    this.contentService.importContent(option)
      .then((data: any) => {
        data = JSON.parse(data);
        this.ngZone.run(() => {
          this.tabBarElement.style.display = 'none';
          if (data.result && data.result.length) {
            const importStatus = data.result[0];

            if (importStatus.status !== 'ENQUEUED_FOR_DOWNLOAD') {
              this.removeOverlayAndShowError();
            }
          }
        });
      })
      .catch(() => {
        this.ngZone.run(() => {
          this.removeOverlayAndShowError();
        });
      });
  }

  /**
   * This method removes the loading/downloading overlay and displays the error message
   * and also shows the bottom navigation bar
   */
  removeOverlayAndShowError(): any {
    this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
    this.tabBarElement.style.display = 'flex';
    this.showOverlay = false;
  }

  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.ngZone.run(() => {
        const res = JSON.parse(data);
        if (res.type === 'downloadProgress'
          && res.data.downloadProgress) {
          this.downloadPercentage = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
        }

        if (res.data
          && res.data.status === 'IMPORT_COMPLETED'
          && res.type === 'contentImport'
          && this.downloadPercentage === 100) {
          this.showOverlay = false;
          this.navigateToContentDetailsPage(this.resumeContentData);
        }
      });
    });
  }

  cancelDownload() {
    this.ngZone.run(() => {
      this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier).then(() => {
        this.tabBarElement.style.display = 'flex';
        this.showOverlay = false;
      }).catch(() => {
        this.tabBarElement.style.display = 'flex';
        this.showOverlay = false;
      });
    });
  }

}
