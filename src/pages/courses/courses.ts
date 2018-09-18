import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import {
  Component,
  NgZone,
  OnInit
} from '@angular/core';
import {
  NavController,
  PopoverController,
  Events} from 'ionic-angular';
import { AppVersion } from "@ionic-native/app-version";
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
import { Network } from '@ionic-native/network';
import {
  ProfileConstants,
  EventTopics,
  PreferenceKey
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
  enrolledCourse: Array<any>;

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
  showLoader: boolean = true;

  /**
   * Flag to show latest and popular course loader
   */
  pageApiLoader: boolean = true;

  guestUser: boolean = false;

  showSignInCard: boolean = false;

  isNetworkAvailable: boolean;
  showWarning: boolean = false;

  isOnBoardingCardCompleted: boolean = false;
  onBoardingProgress: number = 0;
  selectedLanguage = 'en';
  appLabel: string;

  courseFilter: any;

  appliedFilter: any;

  filterIcon = "./assets/imgs/ic_action_filter.png";

  profile: any;

  isVisible: boolean = false;


  /**
   * To queue downloaded identifier
   */
  queuedIdentifiers: Array<any> = [];

  downloadPercentage: number = 0;

  showOverlay: boolean = false;

  resumeContentData: any;
  tabBarElement: any;
  private mode: string = "soft";
  isFilterApplied: boolean = false;

  callback: QRResultCallback;
  pageFilterCallBack: PageFilterCallback


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
    private network: Network,
    private appGlobal: AppGlobalService,
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

    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
    }
    this.network.onDisconnect().subscribe(() => {
      this.isNetworkAvailable = false;
    });
    this.network.onConnect().subscribe(() => {
      this.isNetworkAvailable = true;
    });

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

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.COURSES,
      Environment.HOME
    );

    this.appGlobal.generateConfigInteractEvent(PageId.COURSES, this.isOnBoardingCardCompleted);
    this.preference.getString('show_app_walkthrough_screen')
      .then(value => {
        if (value === 'true') {
          const driver = new Driver({
            allowClose: true,
            closeBtnText: this.commonUtilService.translateMessage('DONE'),
            showButtons: true
          });

          setTimeout(() => {
            driver.highlight({
              element: '#qrIcon',
              popover: {
                title: this.commonUtilService.translateMessage('ONBOARD_SCAN_QR_CODE'),
                description: "<img src='assets/imgs/ic_scanqrdemo.png' /><p>" + this.commonUtilService.translateMessage('ONBOARD_SCAN_QR_CODE_DESC', this.appLabel) + "</p>",
                showButtons: true,         // Do not show control buttons in footer
                closeBtnText: this.commonUtilService.translateMessage('DONE'),
              }
            });

            let element = document.getElementById("driver-highlighted-element-stage");
            var img = document.createElement("img");
            img.src = "assets/imgs/ic_scan.png";
            img.id = "qr_scanner";
            element.appendChild(img);
          }, 100);

          this.preference.putString('show_app_walkthrough_screen', 'false');
        }
      });
  }

  subscribeUtilityEvents() {
    //Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', (upgrade) => {
      if (upgrade) {
        this.appGlobal.openPopover(upgrade)
      }
    });

    this.events.subscribe('onboarding-card:completed', (param) => {
      this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
    });

    this.events.subscribe(AppGlobalService.PROFILE_OBJ_CHANGED, () => {
      this.getCourseTabData();
    })

    this.events.subscribe(EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY, (data) => {
      if (data.update) {
        this.getEnrolledCourses(true);
      }
    })

    this.events.subscribe('onboarding-card:increaseProgress', (progress) => {
      this.onBoardingProgress = progress.cardProgress;
    });

    this.events.subscribe('course:resume', (data) => {
      this.resumeContentData = data.content;
      this.getContentDetails(data.content);
    });

    this.events.subscribe(EventTopics.ENROL_COURSE_SUCCESS, (res) => {
      if (res && res.batchId) {
        this.getEnrolledCourses(true);
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
        if (data === "COURSES") {
          if (this.appliedFilter) {
            this.filterIcon = "./assets/imgs/ic_action_filter.png";
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
  getEnrolledCourses(returnRefreshedCourses: boolean = false): void {
    this.spinner(true);

    let option = {
      userId: this.userId,
      refreshEnrolledCourses: true,
      returnRefreshedEnrolledCourses: returnRefreshedCourses
    };

    this.courseService.getEnrolledCourses(option, (data: any) => {
      if (data) {
        data = JSON.parse(data);
        this.ngZone.run(() => {
          this.enrolledCourse = data.result.courses ? data.result.courses : [];
          this.spinner(false);
        });
      }
    }, (error: any) => {
      console.log('error while loading enrolled courses', error);
      this.spinner(false);
    });
  }

  /**
   * To get popular course.
   *
   * It internally calls course handler of genie sdk
   */
  getPopularAndLatestCourses(pageAssembleCriteria: PageAssembleCriteria = undefined): void {
    this.pageApiLoader = true;
    if (pageAssembleCriteria == undefined) {
      let criteria = new PageAssembleCriteria();
      criteria.name = "Course";
      criteria.mode = "soft";

      if (this.appliedFilter) {
        let filterApplied = false;
        Object.keys(this.appliedFilter).forEach(key => {
          if (this.appliedFilter[key].length > 0) {
            filterApplied = true;
          }
        })

        if (filterApplied) {
          criteria.mode = "hard";
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
        pageAssembleCriteria.filters.board = this.applyProfileFilter(this.profile.board, pageAssembleCriteria.filters.board, "board");
      }

      if (this.profile.medium && this.profile.medium.length) {
        pageAssembleCriteria.filters.medium = this.applyProfileFilter(this.profile.medium, pageAssembleCriteria.filters.medium, "medium");
      }

      if (this.profile.grade && this.profile.grade.length) {
        pageAssembleCriteria.filters.gradeLevel = this.applyProfileFilter(this.profile.grade, pageAssembleCriteria.filters.gradeLevel, "gradeLevel");
      }

      if (this.profile.subject && this.profile.subject.length) {
        pageAssembleCriteria.filters.subject = this.applyProfileFilter(this.profile.subject, pageAssembleCriteria.filters.subject, "subject");
      }
    }

    this.pageService.getPageAssemble(pageAssembleCriteria, (res: any) => {
      res = JSON.parse(res);
      this.ngZone.run(() => {
        let sections = JSON.parse(res.sections);
        let newSections = [];
        sections.forEach(element => {
          element.display = JSON.parse(element.display);
          if (element.display.name) {
            if (_.has(element.display.name, this.selectedLanguage)) {
              let langs = [];
              _.forEach(element.display.name, function (value, key) {
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
    }, (error: string) => {
      console.log('Page assmble error', error);
      this.ngZone.run(() => {
        this.pageApiLoader = false;
        if (error === 'CONNECTION_ERROR') {
          this.isNetworkAvailable = false;
          this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
        } else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
          this.commonUtilService.showToast('ERROR_FETCHING_DATA');
        }
      });
    });
  }


  applyProfileFilter(profileFilter: Array<any>, assembleFilter: Array<any>, categoryKey?: string) {
    if (categoryKey) {
      let nameArray = [];
      profileFilter.forEach(filterCode => {
        let nameForCode = this.appGlobal.getNameForCodeInFramework(categoryKey, filterCode);

        if (!nameForCode) {
          nameForCode = filterCode;
        }

        nameArray.push(nameForCode);
      })

      profileFilter = nameArray;
    }


    if (!assembleFilter) {
      assembleFilter = [];
    }
    assembleFilter = assembleFilter.concat(profileFilter);

    let unique_array = [];

    for (let i = 0; i < assembleFilter.length; i++) {
      if (unique_array.indexOf(assembleFilter[i]) == -1 && assembleFilter[i].length > 0) {
        unique_array.push(assembleFilter[i])
      }
    }

    assembleFilter = unique_array;

    if (assembleFilter.length == 0) {
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
      this.guestUser = !this.appGlobal.isUserLoggedIn();

      if (this.guestUser) {
        this.getCurrentUser();
        reject('session expired');
      } else {
        let sessionObj = this.appGlobal.getSessionData();
        this.userId = sessionObj[ProfileConstants.USER_TOKEN];
        this.getEnrolledCourses();
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
      }
    }, 10);

    this.enrolledCourse = [];
    this.popularAndLatestCourses = [];

    this.getUserId()
      .then(() => {
        this.getPopularAndLatestCourses();
      })
      .catch(error => {
        console.log("Error while Fetching Data", error);
        this.getPopularAndLatestCourses();
      });
  }

  /**
   * It will fetch the guest user profile details
   */
  getCurrentUser(): void {
    let profileType = this.appGlobal.getGuestUserType();
    if (profileType === ProfileType.TEACHER && this.appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER) {
      this.showSignInCard = true;
    } else {
      this.showSignInCard = false;
    }


    this.profile = this.appGlobal.getCurrentUser();
    if (this.profile && this.profile.syllabus && this.profile.syllabus[0] && this.profile.board && this.profile.board.length
      && this.profile.grade && this.profile.grade.length
      && this.profile.medium && this.profile.medium.length
      && this.profile.subject && this.profile.subject.length) {
      this.isOnBoardingCardCompleted = true;
      this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
    }
  }

  scanQRCode() {
    this.qrScanner.startScanner(undefined, undefined, undefined, PageId.COURSES);
  }

  search() {
    this.navCtrl.push(SearchPage, { contentType: ["Course"], source: PageId.COURSES })
  }

  ionViewDidEnter() {
    this.isVisible = true;
  }

  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
      this.isVisible = false;
      this.showOverlay = false;
      this.downloadPercentage = 0;
    })
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
          let criteria = new PageAssembleCriteria();
          criteria.name = "Course";
          criteria.filters = filter;


          that.courseFilter = appliedFilter;
          that.appliedFilter = filter;

          let filterApplied = false;

          that.isFilterApplied = false;

          let values = new Map();
          values["filters"] = filter;
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
          })

          if (filterApplied) {
            criteria.mode = "hard";
            that.filterIcon = "./assets/imgs/ic_action_filter_applied.png";
          } else {
            criteria.mode = "soft";
            that.filterIcon = "./assets/imgs/ic_action_filter.png";
          }

          that.getPopularAndLatestCourses(criteria);
        })
      }
    }

    let filterOptions = {
      callback: this.pageFilterCallBack,
      pageId: PageId.COURSES
    }
    // Already apllied filter
    if (this.courseFilter) {
      filterOptions['filter'] = this.courseFilter;
      this.showFilterPage(filterOptions);
    } else {
      //TODO: Need to add loader
      this.formAndFrameworkUtilService.getCourseFilterConfig().then((data) => {
        filterOptions['filter'] = data;
        this.showFilterPage(filterOptions);
      }).catch(() => {
          console.error("Error Occurred!");
        });
    }

  }

  showFilterPage(filterOptions) {
    this.popCtrl.create(PageFilter, filterOptions, { cssClass: 'resource-filter' }).present();
  }

  checkEmptySearchResult(isAfterLanguageChange = false) {
    let flags = [];
    _.forEach(this.popularAndLatestCourses, function (value, key) {
      if (value.contents && value.contents.length) {
        flags[key] = true;
      }
    });

    if (flags.length && _.includes(flags, true)) {
    } else {
      if (!isAfterLanguageChange) this.commonUtilService.showToast('NO_CONTENTS_FOUND', this.isVisible);
    }
  }

  showOfflineWarning() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 3000);
  }

  retryShowingPopularCourses(showRefresh = false) {
    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
      if (showRefresh) {
        this.getCourseTabData();
      }
    }
  }

  getContentDetails(content) {
    let identifier = content.contentId || content.identifier;
    this.contentService.getContentDetail({ contentId: identifier }, (data: any) => {
      data = JSON.parse(data);
      if (data && data.result && data.result.isAvailableLocally) {
        this.showOverlay = false;
        this.navigateToContentDetailsPage(content);
      }
      else {
        this.subscribeGenieEvent();
        this.showOverlay = true;
        this.importContent([identifier], false);
      }
    },
      (error: any) => {
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
        pageName: 'course.EnrolledCourses'
      };
    }
    else {
      searchQuery = updateFilterInSearchQuery(searchQuery, this.appliedFilter, this.profile, this.mode, this.isFilterApplied, this.appGlobal);
      title = headerTitle;
      params = {
        headerTitle: headerTitle,
        pageName: 'course.PopularContent',
        requestParams: searchQuery
      };
    }
    let values = new Map();
		values["SectionName"] = title;
		this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
				InteractSubtype.VIEWALL_CLICKED,
				Environment.HOME,
				PageId.COURSES,undefined,
				values);
    this.navCtrl.push(ViewMoreActivityPage, params);
  }

  navigateToContentDetailsPage(content) {
    let identifier = content.contentId || content.identifier;
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
    }

    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      this.ngZone.run(() => {
        this.tabBarElement.style.display = 'none';
        if (data.result && data.result.length) {
          let importStatus = data.result[0];

          if (importStatus.status !== 'ENQUEUED_FOR_DOWNLOAD') {
            this.removeOverlayAndShowError();
          }
        }
      });
    },
      () => {
        this.ngZone.run(() => {
          this.removeOverlayAndShowError();
        });
      });
  }

  /**
   * This method removes the loading/downloading overlay and displays the error message 
   * and also shows the bottom navigation bar
   * 
   */
  removeOverlayAndShowError(): any {
    this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
    this.tabBarElement.style.display = 'flex';
    this.showOverlay = false;
  }


  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.ngZone.run(() => {
        let res = JSON.parse(data);
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadPercentage = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
        }

        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport' && this.downloadPercentage === 100) {
          this.showOverlay = false;
          this.navigateToContentDetailsPage(this.resumeContentData);
        }
      });
    });
  }

  cancelDownload() {
    this.ngZone.run(() => {
      this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier, () => {
        this.tabBarElement.style.display = 'flex';
        this.showOverlay = false;
      }, () => {
          this.tabBarElement.style.display = 'flex';
          this.showOverlay = false;
        });
    });
  }

  ionViewCanLeave() {
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
    });
  }
}
