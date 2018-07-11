import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, PopoverController, Events, ToastController } from 'ionic-angular';
import { AppVersion } from "@ionic-native/app-version";
import { IonicPage } from 'ionic-angular';
import {
  SharedPreferences, CourseService,
  PageAssembleService, PageAssembleCriteria,
  Impression, ImpressionType, PageId, Environment, TelemetryService, ContentDetailRequest, ContentService, ProfileType, PageAssembleFilter, CorrelationData
} from 'sunbird';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
// import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { generateImpressionTelemetry } from '../../app/telemetryutil';
import { ContentType, MimeType, PageFilterConstants, ProfileConstants, EventTopics } from '../../app/app.constant';
import { PageFilterCallback, PageFilter } from '../page-filter/page.filter';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { AppGlobalService } from '../../service/app-global.service';

import Driver from 'driver.js';
import { CourseUtilService } from '../../service/course-util.service';
import { updateFilterInSearchQuery } from '../../util/filter.util';

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
  tabBarElement: any;

  courseFilter: any;

  appliedFilter: any;

  filterIcon = "./assets/imgs/ic_action_filter.png";

  profile: any;

  private isVisible: boolean = false;

  private corRelationList: Array<CorrelationData>;

  /**
   * To queue downloaded identifier
   */
  queuedIdentifiers: Array<any> = [];

  downloadPercentage: number = 0;

  showOverlay: boolean = false;

  resumeContentData: any;


  private mode: string = "soft";

  private isFilterApplied: boolean = false;


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
    private telemetryService: TelemetryService,
    private events: Events,
    private contentService: ContentService,
    private toastCtrl: ToastController,
    private preference: SharedPreferences,
    private translate: TranslateService,
    private network: Network,
    private sharedPreferences: SharedPreferences,
    private appGlobal: AppGlobalService,
    private courseUtilService: CourseUtilService
  ) {

    this.preference.getString('selected_language_code', (val: string) => {
      if (val && val.length) {
        this.selectedLanguage = val;
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

    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
    }
    this.network.onDisconnect().subscribe((data) => {
      this.isNetworkAvailable = false;
    });
    this.network.onConnect().subscribe((data) => {
      this.isNetworkAvailable = true;
    });

    this.appVersion.getAppName()
      .then((appName: any) => {
        this.appLabel = appName;
      });

    this.events.subscribe('tab.change', (data) => {
      this.ngZone.run(() => {
        if (data === "COURSES‌") {
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
	 * Angular life cycle hooks
	 */
  ngOnInit() {
    console.log('courses component initialized...');
    this.getCourseTabData();
  }

  /*   ngAfterViewInit() {
      const driver = new Driver();
      console.log("Driver", driver);
      driver.highlight('#qrIcon');
    } */

  ionViewDidLoad() {
    //this.sharedPreferences.
    this.preference.getString('show_app_walkthrough_screen', (value) => {
      if (value === 'true') {
        const driver = new Driver({
          allowClose: true,
          closeBtnText: this.translateMessage('DONE'),
          showButtons: true
        });

        console.log("Driver", driver);
        setTimeout(() => {
          driver.highlight({
            element: '#qrIcon',
            popover: {
              title: this.translateMessage('ONBOARD_SCAN_QR_CODE'),
              description: "<img src='assets/imgs/ic_scanqrdemo.png' /><p>" + this.translateMessage('ONBOARD_SCAN_QR_CODE_DESC', this.appLabel) + "</p>",
              showButtons: true,         // Do not show control buttons in footer
              closeBtnText: this.translateMessage('DONE'),
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

  viewMoreEnrolledCourses() {
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: 'COURSES_IN_PROGRESS',
      userId: this.userId,
      pageName: 'course.EnrolledCourses'
    })
  }

  viewAllCourses(searchQuery, headerTitle) {

    searchQuery = updateFilterInSearchQuery(searchQuery, this.appliedFilter, this.profile, this.mode, this.isFilterApplied, this.appGlobal);

    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: headerTitle,
      pageName: 'course.PopularContent',
      requestParams: searchQuery
    })
  }

  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(returnRefreshedCourses: boolean = false): void {
    this.spinner(true);
    console.log('making api call to get enrolled courses');

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
          console.log('enrolled courses details', data);
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
        pageAssembleCriteria.filters.board = this.applyProfileFilter(this.profile.board, pageAssembleCriteria.filters.board,"board");
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
        console.log('Popular courses', this.popularAndLatestCourses);
        this.pageApiLoader = !this.pageApiLoader;
        this.checkEmptySearchResult();
      });
    }, (error: string) => {
      console.log('Page assmble error', error);
      this.ngZone.run(() => {
        this.pageApiLoader = false;
        if (error === 'CONNECTION_ERROR') {
          this.isNetworkAvailable = false;
        } else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
          this.getMessageByConst('ERROR_FETCHING_DATA');
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
    let that = this;
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
    let profiletype = this.appGlobal.getGuestUserType();
    if (profiletype == ProfileType.TEACHER) {
      this.showSignInCard = true;
    } else if (profiletype == ProfileType.STUDENT) {
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
    const that = this;
    const callback: QRResultCallback = {
      dialcode(scanResult, dialCode) {
        that.addCorRelation(dialCode, "qr");
        that.navCtrl.push(SearchPage, {
          dialCode: dialCode,
          corRelation: that.corRelationList,
          source: PageId.COURSES,
          shouldGenerateEndTelemetry: true
        });
      },
      content(scanResult, contentId) {
        // that.navCtrl.push(SearchPage);
        let request: ContentDetailRequest = {
          contentId: contentId
        }

        that.contentService.getContentDetail(request, (response) => {
          let data = JSON.parse(response);
          that.addCorRelation(data.result.identifier, "qr")
          that.showContentDetails(data.result, that.corRelationList);
        }, (error) => {
          console.log("Error " + error);
          if (that.network.type === 'none') {
            that.getMessageByConst('ERROR_NO_INTERNET_MESSAGE');
          } else {
            that.getMessageByConst('UNKNOWN_QR');
          }
        });
      }
    }

    this.qrScanner.startScanner(undefined, undefined, undefined, callback, PageId.COURSES);
  }

  addCorRelation(identifier: string, type: string) {
    if (this.corRelationList === undefined) {
      this.corRelationList = new Array<CorrelationData>();
    }
    else {
      this.corRelationList = [];
    }
    let corRelation: CorrelationData = new CorrelationData();
    corRelation.id = identifier;
    corRelation.type = type;
    this.corRelationList.push(corRelation);
  }


  showContentDetails(content, corRelationList) {
    if (content.contentType === ContentType.COURSE) {
      console.log('Calling course details page');
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content,
        corRelation: corRelationList,
        source: PageId.COURSES,
        shouldGenerateEndTelemetry: true
      })
    } else if (content.mimeType === MimeType.COLLECTION) {
      console.log('Calling collection details page');
      this.navCtrl.push(CollectionDetailsPage, {
        content: content,
        corRelation: corRelationList,
        source: PageId.COURSES,
        shouldGenerateEndTelemetry: true
      })
    } else {
      console.log('Calling content details page');
      this.navCtrl.push(ContentDetailsPage, {
        content: content,
        corRelation: corRelationList,
        source: PageId.COURSES,
        shouldGenerateEndTelemetry: true
      })
    }
  }

  search() {
    const contentType: Array<string> = [
      "Course",
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType, source: PageId.COURSES })
  }

  ionViewDidEnter() {


    this.isVisible = true;

    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW, "",
      PageId.COURSES,
      Environment.HOME, "", "", "",
      undefined, undefined
    ));
  }

  ionViewWillLeave(): void {
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
      this.isVisible = false;
      this.showOverlay = false;
      this.downloadPercentage = 0;
    })
  }


  showFilter() {
    const that = this;

    const callback: PageFilterCallback = {
      applyFilter(filter, appliedFilter) {
        that.ngZone.run(() => {
          let criteria = new PageAssembleCriteria();
          criteria.name = "Course";
          criteria.filters = filter;


          that.courseFilter = appliedFilter;
          that.appliedFilter = filter;

          let filterApplied = false;

          that.isFilterApplied = false;

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
      callback: callback
    }

    // Already apllied filter
    if (this.courseFilter) {
      filterOptions['filter'] = this.courseFilter;
    } else {
      filterOptions['filter'] = PageFilterConstants.COURSE_FILTER;
    }

    let filter = this.popCtrl.create(PageFilter, filterOptions, { cssClass: 'resource-filter' });
    filter.present();
  }

  showMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

  /**
   *
   */
  checkEmptySearchResult(isAfterLanguageChange = false) {
    let flags = [];
    _.forEach(this.popularAndLatestCourses, function (value, key) {
      if (value.contents && value.contents.length) {
        flags[key] = true;
      }
    });

    if (flags.length && _.includes(flags, true)) {
      console.log('search result found');
    } else {
      if (!isAfterLanguageChange) this.getMessageByConst('NO_CONTENTS_FOUND');
    }
  }

  getMessageByConst(constant) {
    if (!this.isVisible) {
      return
    }

    this.translate.get(constant).subscribe(
      (value: any) => {
        this.showMessage(value);
      }
    );
  }
  showNetworkWarning() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 3000);
  }
  buttonClick(isNetAvailable) {
    this.showNetworkWarning();
  }
  checkNetworkStatus(showRefresh = false) {
    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
      if (showRefresh) {
        this.getCourseTabData();
      }
    }
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  getContentDetails(content) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    // this.tabBarElement.style.display = 'none';
    let identifier = content.contentId || content.identifier;
    this.contentService.getContentDetail({ contentId: identifier }, (data: any) => {
      data = JSON.parse(data);
      console.log('enrolled course details: ', data);
      if (data && data.result) {
        switch (data.result.isAvailableLocally) {
          case true: {
            this.showOverlay = false;
            console.log("Content locally available. Geting child content... @@@");
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
            break;
          }
          case false: {
            this.subscribeGenieEvent();
            console.log("Content locally not available. Import started... @@@");
            this.showOverlay = true;
            this.tabBarElement.style.display = 'none';
            this.importContent([identifier], false);
            break;
          }
          default: {
            console.log("Invalid choice");
            break;
          }
        }
      }
    },
      (error: any) => {
        console.log(error);
        console.log('Error while getting resumed course data....');
        this.showMessage(this.translateMessage('ERROR_CONTENT_NOT_AVAILABLE'));
      });
  }

  importContent(identifiers, isChild) {
    const option = {
      contentImportMap: this.courseUtilService.getImportContentRequestBody(identifiers, isChild),
      contentStatusArray: []
    }

    this.contentService.importContent(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: Import content =>', data);
      this.ngZone.run(() => {
        if (data.result && data.result.length) {
          _.forEach(data.result, (value, key) => {
            if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
              this.queuedIdentifiers.push(value.identifier);
            }
          });
          if (this.queuedIdentifiers.length === 0) {
            this.showOverlay = false;
            this.tabBarElement.style.display = 'flex';
            this.showMessage(this.translateMessage('ERROR_CONTENT_NOT_AVAILABLE'));
            console.log('Content not downloaded');
          }
        }
      });
    },
      (error: any) => {
        this.ngZone.run(() => {
          this.showOverlay = false;
          this.tabBarElement.style.display = 'flex';
          this.showMessage(this.translateMessage('ERROR_CONTENT_NOT_AVAILABLE'));
        });
      });
  }


  subscribeGenieEvent() {
    let count = 0;
    this.events.subscribe('genie.event', (data) => {
      this.ngZone.run(() => {
        data = JSON.parse(data);
        let res = data;
        console.log('event bus........', res);
        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadPercentage = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
        }

        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport' && this.downloadPercentage === 100) {
          this.showOverlay = false;
          this.tabBarElement.style.display = 'flex';
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
      this.contentService.cancelDownload(this.resumeContentData.contentId || this.resumeContentData.identifier, (response) => {
        this.showOverlay = false;
        this.tabBarElement.style.display = 'flex';
      }, (error) => {
        this.showOverlay = false;
        this.tabBarElement.style.display = 'flex';
      });
    });
  }

  ionViewCanLeave() {
    this.ngZone.run(() => {
      this.events.unsubscribe('genie.event');
      if (this.tabBarElement) {
        this.tabBarElement.style.display = 'flex';
      }
    })
  }
}
