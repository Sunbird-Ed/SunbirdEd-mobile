import { BatchConstants, ContentFilterConfig } from './../../app/app.constant';
import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Events, IonicPage, Navbar, NavController, NavParams, Platform, PopoverController, Loading, TextInput } from 'ionic-angular';
import { Content as ContentView } from 'ionic-angular';
import {
  CachedItemRequestSourceFrom, Content, ContentDetailRequest, ContentEventType, ContentImport, ContentImportRequest,
  ContentImportResponse, ContentImportStatus, ContentSearchCriteria, ContentSearchResult, ContentService,
  CorrelationData, DownloadEventType, DownloadProgress, EventsBusEvent, EventsBusService, PageAssembleCriteria,
  PageAssembleFilter, PageAssembleService, PageName, ProfileType, SearchType, SharedPreferences, TelemetryObject,
  NetworkError, CourseService, CourseBatchesRequest, CourseEnrollmentType, CourseBatchStatus, Course, Batch,
  FetchEnrolledCourseRequest, Profile, ProfileService, Framework,
  FrameworkCategoryCodesGroup,
  FrameworkDetailsRequest,
  FrameworkService,
  FrameworkUtilService,
  GetSuggestedFrameworksRequest, SearchEntry, SearchHistoryService
} from 'sunbird-sdk';
import { FilterPage } from './filters/filter';
import { CollectionDetailsEtbPage } from '../collection-details-etb/collection-details-etb';
import { ContentDetailsPage } from '../content-details/content-details';
import { Map } from '../../app/telemetryutil';
import * as _ from 'lodash';
import { AudienceFilter, ContentType, MimeType, Search, ContentCard } from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { AppGlobalService } from '../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { QrCodeResultPage } from '../qr-code-result/qr-code-result';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import {
  Environment, ImpressionType, InteractSubtype, InteractType, LogLevel, Mode, PageId
} from '../../service/telemetry-constants';
import { TabsPage } from '@app/pages/tabs/tabs';
import { AppHeaderService } from '@app/service';
import { EnrollmentDetailsPage } from '../enrolled-course-details/enrollment-details/enrollment-details';
import { SearchHistoryNamespaces } from '@app/config/search-history-namespaces';
import { AppVersion } from '@ionic-native/app-version';
import { featureIdMap } from '@app/feature-id-map';

declare const cordova;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: './search.html'
})
export class SearchPage implements OnInit, OnDestroy {

  public searchHistory$: Observable<SearchEntry[]>;

  appName: string;
  showLoading: boolean;
  downloadProgress: any;
  @ViewChild('searchInput') searchBar;

  contentType: Array<string> = [];

  source: string;

  dialCode: string;

  dialCodeResult: Array<any> = [];

  dialCodeContentResult: Array<any> = [];

  searchContentResult: Array<any> = [];

  showLoader = false;

  filterIcon;

  searchKeywords = '';

  responseData: any;

  isDialCodeSearch = false;

  showEmptyMessage: boolean;

  defaultAppIcon: string;

  isEmptyResult = false;

  queuedIdentifiers = [];

  isDownloadStarted = false;

  currentCount = 0;

  parentContent: any = undefined;

  contentData: any;

  childContent: any = undefined;

  loadingDisplayText = 'Loading content';

  audienceFilter = [];

  eventSubscription?: Subscription;

  displayDialCodeResult: any;
  profile: Profile;
  isFirstLaunch = false;
  shouldGenerateEndTelemetry = false;
  backButtonFunc = undefined;
  isSingleContent = false;
  currentFrameworkId = '';
  selectedLanguageCode = '';
  @ViewChild(Navbar) navBar: Navbar;
  private corRelationList: Array<CorrelationData>;
  layoutName = 'search';
  enrolledCourses: any;
  guestUser: any;
  batches: any;
  loader?: Loading;
  userId: any;
  identifier: string;
  categories: Array<any> = [];
  boardList: Array<any> = [];
  mediumList: Array<any> = [];
  gradeList: Array<any> = [];
  isProfileUpdated: boolean;
  @ViewChild('contentView') contentView: ContentView;
  constructor(
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('PAGE_ASSEMBLE_SERVICE') private pageService: PageAssembleService,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('FRAMEWORK_SERVICE') private frameworkService: FrameworkService,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService,
    @Inject('COURSE_SERVICE') private courseService: CourseService,
    @Inject('SEARCH_HISTORY_SERVICE') private searchHistoryService: SearchHistoryService,
    private appVersion: AppVersion,
    private changeDetectionRef: ChangeDetectorRef,
    private navParams: NavParams,
    private navCtrl: NavController,
    private zone: NgZone,
    private event: Events,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private platform: Platform,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private translate: TranslateService,
    private headerService: AppHeaderService,
    private popoverCtrl: PopoverController,
  ) {

    this.checkUserSession();

    this.isFirstLaunch = true;

    this.init();

    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
    this.getFrameworkId();
    this.selectedLanguageCode = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.getAppName();
  }

  ionViewWillEnter() {
    this.headerService.hideHeader();
    this.handleDeviceBackButton();
  }

  ionViewDidEnter() {
    if (!this.dialCode && this.isFirstLaunch) {
      setTimeout(() => {
        this.isFirstLaunch = false;
        this.searchBar.setFocus();
      }, 100);
    }

    this.checkUserSession();
  }

  ionViewDidLoad() {
    this.searchHistory$ = this.searchBar && (this.searchBar as TextInput).ionChange
      .map((e) => e.value)
      .share()
      .startWith('')
      .debounceTime(500)
      .switchMap((v) => {
        if (v) {
          return this.searchHistoryService.getEntries({
            like: v,
            limit: 5,
            namespace: this.source === PageId.LIBRARY ? SearchHistoryNamespaces.LIBRARY : SearchHistoryNamespaces.COURSE
          });
        }

        return this.searchHistoryService.getEntries({
          limit: 10,
          namespace: this.source === PageId.LIBRARY ? SearchHistoryNamespaces.LIBRARY : SearchHistoryNamespaces.COURSE
        });
      })
      .do((v) => {
        setTimeout(() => {
          this.changeDetectionRef.detectChanges();
        });
      }) as any;

    this.navBar.backButtonClick = () => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(ImpressionType.SEARCH,
        Environment.HOME, true, undefined, this.corRelationList);
      this.navigateToPreviousPage();
    };
  }

  onSearchHistoryTap(searchEntry: SearchEntry) {
    this.searchKeywords = searchEntry.query;
    this.handleSearch();

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SEARCH_HISTORY_CLICKED,
      Environment.HOME,
      PageId.SEARCH,
      undefined,
      {
        'selectedSearchHistory': searchEntry.query
      },
      undefined,
      featureIdMap.searchHistory.SEARCH_HISTORY_QUERY_FROM_HISTORY
    );
  }

  ionViewWillLeave() {
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  private async getAppName() {
    return this.appVersion.getAppName()
      .then((appName: any) => {
        this.appName = appName;
      });
  }

  getFrameworkId() {
    this.preferences.getString('current_framework_id').toPromise()
      .then(value => {
        this.currentFrameworkId = value;

      })
      .catch(() => {
      });
  }

  navigateToPreviousPage() {
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.dialCode);
    }

    if (this.appGlobalService.isGuestUser) {
      if ((this.source === PageId.PERMISSION || this.source === PageId.ONBOARDING_PROFILE_PREFERENCES)
        && this.appGlobalService.isOnBoardingCompleted) {
        if (this.appGlobalService.isProfileSettingsCompleted || !this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
          this.navCtrl.setRoot(TabsPage, {
            loginMode: 'guest'
          });
        } else {
          this.navCtrl.setRoot('ProfileSettingsPage', { isCreateNavigationStack: false, hideBackButton: true });
        }
      } else {
        this.popCurrentPage();
      }
    } else {
      this.popCurrentPage();
    }
  }

  popCurrentPage() {
    this.navCtrl.pop();
    this.backButtonFunc();
  }

  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.navigateToPreviousPage();
      this.telemetryGeneratorService.generateBackClickedTelemetry(ImpressionType.SEARCH,
        Environment.HOME, false, undefined, this.corRelationList);
      this.backButtonFunc();
    }, 10);
  }


  openCollection(collection) {
    const identifier = collection.identifier;
    let telemetryObject: TelemetryObject;
    const objectType = this.telemetryGeneratorService.isCollection(collection.mimeType) ? collection.contentType : ContentType.RESOURCE;
    telemetryObject = new TelemetryObject(identifier, objectType, undefined);
    const values = new Map();
    values['root'] = true;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      !this.appGlobalService.isOnBoardingCompleted ? Environment.ONBOARDING : Environment.HOME,
      PageId.DIAL_SEARCH,
      telemetryObject,
      values,
      undefined,
      this.corRelationList);
    this.showContentDetails(collection, true);
  }

  openContent(collection, content, index) {
    this.parentContent = collection;
    this.generateInteractEvent(content.identifier, content.contentType, content.pkgVersion, index);
    if (collection !== undefined) {
      this.parentContent = collection;
      this.childContent = content;
      this.checkParent(collection, content);
    } else {
      this.checkRetiredOpenBatch(content);
    }
  }

  private async showContentDetails(content, isRootContent: boolean = false) {

    let params;
    if (this.shouldGenerateEndTelemetry) {
      params = {
        content: content,
        corRelation: this.corRelationList,
        source: this.source,
        shouldGenerateEndTelemetry: this.shouldGenerateEndTelemetry,
        parentContent: this.parentContent,
        isSingleContent: this.isSingleContent,
        onboarding: this.appGlobalService.isOnBoardingCompleted,
        isProfileUpdated: this.isProfileUpdated
      };
    } else {
      params = {
        content: content,
        corRelation: this.corRelationList,
        parentContent: this.parentContent,
        isSingleContent: this.isSingleContent,
        onboarding: this.appGlobalService.isOnBoardingCompleted,
        isProfileUpdated: this.isProfileUpdated
      };
    }
    if (this.loader) {
      this.loader.dismiss();
    }
    if (this.isDialCodeSearch && !this.appGlobalService.isOnBoardingCompleted && (this.parentContent || content)) {
      this.appGlobalService.setOnBoardingCompleted();
    }

    if (content.contentType === ContentType.COURSE) {
      this.enrolledCourses = await this.getEnrolledCourses(false, false);
      if (this.enrolledCourses && this.enrolledCourses.length) {
        for (let i = 0; i < this.enrolledCourses.length; i++) {
          if (content.identifier === this.enrolledCourses[i].courseId) {
            params['content'] = this.enrolledCourses[i];
          }
        }
      }
      this.navCtrl.push(EnrolledCourseDetailsPage, params);
      if (this.isSingleContent) {
        this.isSingleContent = false;
        const view = this.navCtrl.getActive();
        this.navCtrl.removeView(view);
      }
    } else if (content.mimeType === MimeType.COLLECTION) {
      if (this.isDialCodeSearch && !isRootContent) {
        params.isCreateNavigationStack = true;
        this.navCtrl.push(QrCodeResultPage, params);
        if (this.isSingleContent) {
          this.isSingleContent = false;
          const view = this.navCtrl.getActive();
          this.navCtrl.removeView(view);
        }

      } else {
        // this.navCtrl.push(CollectionDetailsPage, params);
        this.navCtrl.push(CollectionDetailsEtbPage, params);
      }
    } else {
      this.navCtrl.push(ContentDetailsPage, params);
    }
  }

  setGrade(reset, grades) {
    if (reset) {
      this.profile.grade = [];
      this.profile.gradeValue = {};
    }
    _.each(grades, (grade) => {
      if (grade && this.profile.grade.indexOf(grade) === -1) {
        if (this.profile.grade && this.profile.grade.length) {
          this.profile.grade.push(grade);
        } else {
          this.profile.grade = [grade];
        }
      }
    });
  }

  setMedium(reset, mediums) {
    if (reset) {
      this.profile.medium = [];
    }
    _.each(mediums, (medium) => {
      if (medium && this.profile.medium.indexOf(medium) === -1) {
        if (this.profile.medium && this.profile.medium.length) {
          this.profile.medium.push(medium);
        } else {
          this.profile.medium = [medium];
        }
      }
    });
  }

  findCode(categoryList: Array<any>, data, categoryType) {
    if (_.find(categoryList, (category) => category.name === data[categoryType])) {
      return _.find(categoryList, (category) => category.name === data[categoryType]).code;
    } else {
      return undefined;
    }
  }

  setCurrentProfile(index, data) {
    if (!this.profile.medium || !this.profile.medium.length) {
      this.profile.medium = [];
    }
    switch (index) {
      case 0:
        this.profile.syllabus = [data.framework];
        this.profile.board = [data.board];
        this.setMedium(true, data.medium);
        // this.profile.subject = [data.subject];
        this.profile.subject = [];
        this.setGrade(true, data.gradeLevel);
        break;
      case 1:
        this.profile.board = [data.board];
        this.setMedium(true, data.medium);
        // this.profile.subject = [data.subject];
        this.profile.subject = [];
        this.setGrade(true, data.gradeLevel);
        break;
      case 2:
        this.setMedium(false, data.medium);
        break;
      case 3:
        this.setGrade(false, data.gradeLevel);
        break;
    }
    this.editProfile();
  }


  checkProfileData(data, profile) {
    if (data && data.framework) {

      const getSuggestedFrameworksRequest: GetSuggestedFrameworksRequest = {
        language: this.translate.currentLang,
        requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
      };
      // Auto update the profile if that board/framework is listed in custodian framework list.
      this.frameworkUtilService.getActiveChannelSuggestedFrameworkList(getSuggestedFrameworksRequest).toPromise()
        .then((res: Framework[]) => {
          this.isProfileUpdated = false;
          res.forEach(element => {
            // checking whether content data framework Id exists/valid in syllabus list
            if (data.framework === element.identifier || data.board.indexOf(element.name) !== -1) {
              data.framework = element.identifier;
              this.isProfileUpdated = true;
              const frameworkDetailsRequest: FrameworkDetailsRequest = {
                frameworkId: element.identifier,
                requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
              };
              this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
                .then((framework: Framework) => {
                  this.categories = framework.categories;
                  this.boardList = _.find(this.categories, (category) => category.code === 'board').terms;
                  this.mediumList = _.find(this.categories, (category) => category.code === 'medium').terms;
                  this.gradeList = _.find(this.categories, (category) => category.code === 'gradeLevel').terms;
                  //                  this.subjectList = _.find(this.categories, (category) => category.code === 'subject').terms;
                  if (data.board) {
                    data.board = this.findCode(this.boardList, data, 'board');
                  }
                  if (data.medium) {
                    if (typeof data.medium === 'string') {
                      data.medium = [this.findCode(this.mediumList, data, 'medium')];
                    } else {
                      data.medium = _.map(data.medium, (dataMedium) => {
                        return _.find(this.mediumList, (medium) => medium.name === dataMedium).code;
                      });
                    }
                  }
                  if (data.gradeLevel && data.gradeLevel.length) {
                    data.gradeLevel = _.map(data.gradeLevel, (dataGrade) => {
                      return _.find(this.gradeList, (grade) => grade.name === dataGrade).code;
                    });
                  }
                  if (profile && profile.syllabus && profile.syllabus[0] && data.framework === profile.syllabus[0]) {
                    if (data.board) {
                      if (profile.board && !(profile.board.length > 1) && data.board === profile.board[0]) {
                        if (data.medium) {
                          let existingMedium = false;
                          for (let i = 0; i < data.medium.length; i++) {
                            const mediumExists = _.find(profile.medium, (medium) => {
                              return medium === data.medium[i];
                            });
                            if (!mediumExists) {
                              break;
                            }
                            existingMedium = true;
                          }
                          if (!existingMedium) {
                            this.setCurrentProfile(2, data);
                          }
                          if (data.gradeLevel && data.gradeLevel.length) {
                            let existingGrade = false;
                            for (let i = 0; i < data.gradeLevel.length; i++) {
                              const gradeExists = _.find(profile.grade, (grade) => {
                                return grade === data.gradeLevel[i];
                              });
                              if (!gradeExists) {
                                break;
                              }
                              existingGrade = true;
                            }
                            if (!existingGrade) {
                              this.setCurrentProfile(3, data);
                            }
                          }
                        }
                      } else {
                        this.setCurrentProfile(1, data);
                      }
                    }
                  } else {
                    this.setCurrentProfile(0, data);
                  }
                }).catch((err) => {
                  if (err instanceof NetworkError) {
                    this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
                  }
                });

              return;
            }
          });
        })
        .catch((err) => {
          if (err instanceof NetworkError) {
            this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
          }
        });
    }
  }

  editProfile() {
    const req: Profile = {
      board: this.profile.board,
      grade: this.profile.grade,
      medium: this.profile.medium,
      subject: this.profile.subject,
      uid: this.profile.uid,
      handle: this.profile.handle,
      profileType: this.profile.profileType,
      source: this.profile.source,
      createdAt: this.profile.createdAt,
      syllabus: this.profile.syllabus
    };
    if (this.profile.grade && this.profile.grade.length > 0) {
      this.profile.grade.forEach(gradeCode => {
        for (let i = 0; i < this.gradeList.length; i++) {
          if (this.gradeList[i].code === gradeCode) {
            req.gradeValue = this.profile.gradeValue;
            req.gradeValue[this.gradeList[i].code] = this.gradeList[i].name;
            break;
          }
        }
      });
    }

    this.profileService.updateProfile(req).toPromise()
      .then((res: any) => {
        if (res.syllabus && res.syllabus.length && res.board && res.board.length
          && res.grade && res.grade.length && res.medium && res.medium.length) {
          this.events.publish(AppGlobalService.USER_INFO_UPDATED);
          this.events.publish('refresh:profile');
        }
        this.appGlobalService.guestUserProfile = res;
        this.telemetryGeneratorService.generateProfilePopulatedTelemetry(PageId.DIAL_CODE_SCAN_RESULT,
          req, 'auto');
      })
      .catch(() => {
      });
  }

  showFilter() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.FILTER_BUTTON_CLICKED,
      Environment.HOME,
      this.source, undefined);
    this.formAndFrameworkUtilService.getLibraryFilterConfig().then((data) => {
      const filterCriteriaData = this.responseData.filterCriteria;
      filterCriteriaData.facetFilters.forEach(element => {
        data.forEach(item => {
          if (element.name === item.code) {
            element.translatedName = this.commonUtilService.getTranslatedValue(item.translations, item.name);
            return;
          }
        });
      });
      this.navCtrl.push(FilterPage, { filterCriteria: this.responseData.filterCriteria });
    });
  }

  applyFilter() {
    this.showLoader = true;
    this.responseData.filterCriteria.mode = 'hard';
    this.responseData.filterCriteria.searchType = SearchType.FILTER;
    this.telemetryGeneratorService.generateStartSheenAnimationTelemetry();
    this.contentService.searchContent(this.responseData.filterCriteria).toPromise()
      .then((responseData: ContentSearchResult) => {

        this.zone.run(() => {
          this.responseData = responseData;
          if (responseData) {

            if (this.isDialCodeSearch) {
              this.processDialCodeResult(responseData.contentDataList);
            } else {
              this.searchContentResult = responseData.contentDataList;

              this.isEmptyResult = !(this.searchContentResult && this.searchContentResult.length > 0);
              const values = new Map();
              values['from'] = this.source;
              values['searchCount'] = this.responseData.length;
              values['searchCriteria'] = this.responseData.filterCriteria;
              this.telemetryGeneratorService.generateExtraInfoTelemetry(values, PageId.SEARCH);
            }
            this.updateFilterIcon();
          } else {
            this.isEmptyResult = true;
          }
          this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
          this.showLoader = false;
        });
      }).catch(() => {
        this.zone.run(() => {
          this.showLoader = false;
        });
      });
  }

  handleCancel() {
    this.searchKeywords = '';
    this.searchBar.setFocus();
    this.searchContentResult = undefined;
    this.filterIcon = false;
    this.isEmptyResult = false;
  }

  handleSearch() {
    this.scrollToTop();
    if (this.searchKeywords.length < 3) {
      return;
    }

    this.addSearchHistoryEntry();

    this.showLoader = true;
    if (this.showLoader) {
      this.telemetryGeneratorService.generateStartSheenAnimationTelemetry();
    }

    (<any>window).cordova.plugins.Keyboard.close();

    const contentSearchRequest: ContentSearchCriteria = {
      searchType: SearchType.SEARCH,
      query: this.searchKeywords,
      contentTypes: this.contentType,
      facets: Search.FACETS,
      audience: this.audienceFilter,
      mode: 'soft',
      framework: this.currentFrameworkId,
      languageCode: this.selectedLanguageCode
    };

    this.isDialCodeSearch = false;

    this.dialCodeContentResult = undefined;
    this.dialCodeResult = undefined;
    this.corRelationList = [];

    // if (this.profile) {

    //   if (this.profile.board && this.profile.board.length) {
    //     contentSearchRequest.board = this.applyProfileFilter(this.profile.board, contentSearchRequest.board, 'board');
    //   }

    //   if (this.profile.medium && this.profile.medium.length) {
    //     contentSearchRequest.medium = this.applyProfileFilter(this.profile.medium, contentSearchRequest.medium, 'medium');
    //   }

    //   if (this.profile.grade && this.profile.grade.length) {
    //     contentSearchRequest.grade = this.applyProfileFilter(this.profile.grade, contentSearchRequest.grade, 'gradeLevel');
    //   }

    // }

    this.contentService.searchContent(contentSearchRequest).toPromise()
      .then((response: ContentSearchResult) => {

        this.zone.run(() => {
          this.responseData = response;
          if (response) {

            this.addCorRelation(response.responseMessageId, 'API');
            this.searchContentResult = response.contentDataList;
            this.isEmptyResult = !this.searchContentResult || this.searchContentResult.length === 0;

            this.updateFilterIcon();

            this.generateLogEvent(response);
            const values = new Map();
            values['from'] = this.source;
            values['searchCount'] = this.searchContentResult.length;
            values['searchCriteria'] = response.request;
            this.telemetryGeneratorService.generateExtraInfoTelemetry(values, PageId.SEARCH);
          } else {
            this.isEmptyResult = true;
          }
          this.showEmptyMessage = this.searchContentResult.length === 0;
          this.showLoader = false;
          if (!this.showLoader) {
            this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
          }
        });
      }).catch(() => {
        this.zone.run(() => {
          this.showLoader = false;
          if (!this.showLoader) {
            this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
          }
          if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
            this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
          }
        });
      });
  }

  private addSearchHistoryEntry() {
    this.searchHistoryService
      .addEntry({
        query: this.searchKeywords,
        namespace: this.source === PageId.LIBRARY ? SearchHistoryNamespaces.LIBRARY : SearchHistoryNamespaces.COURSE
      })
      .toPromise();
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

  private async checkRetiredOpenBatch(content: any, layoutName?: string) {
    this.loader = this.commonUtilService.getLoader();
    this.loader.present();
    this.loader.onDidDismiss(() => { this.loader = undefined; });
    let retiredBatches: Array<any> = [];
    let anyOpenBatch: Boolean = false;
    await this.getEnrolledCourses(false, true);
    this.enrolledCourses = this.enrolledCourses || [];
    if (layoutName !== ContentCard.LAYOUT_INPROGRESS) {
      retiredBatches = this.enrolledCourses.filter((element) => {
        if (element.contentId === content.identifier && element.batch.status === 1 && element.cProgress !== 100) {
          anyOpenBatch = true;
          content.batch = element.batch;
        }
        if (element.contentId === content.identifier && element.batch.status === 2 && element.cProgress !== 100) {
          return element;
        }
      });
    }
    if (anyOpenBatch || !retiredBatches.length) {
      // open the batch directly
      this.showContentDetails(content, true);
    } else if (retiredBatches.length) {
      this.navigateToBatchListPopup(content, layoutName, retiredBatches);
    }
  }

  // TODO: SDK changes by Swayangjit
  navigateToBatchListPopup(content: any, layoutName?: string, retiredBatched?: any): void {
    const courseBatchesRequest: CourseBatchesRequest = {
      filters: {
        courseId: layoutName === ContentCard.LAYOUT_INPROGRESS ? content.contentId : content.identifier,
        enrollmentType: CourseEnrollmentType.OPEN,
        status: [CourseBatchStatus.NOT_STARTED, CourseBatchStatus.IN_PROGRESS]
      },
      fields: BatchConstants.REQUIRED_FIELDS
    };
    const reqvalues = new Map();
    reqvalues['enrollReq'] = courseBatchesRequest;

    if (this.commonUtilService.networkInfo.isNetworkAvailable) {
      if (!this.guestUser) {
        this.courseService.getCourseBatches(courseBatchesRequest).toPromise()
          .then((data: Batch[]) => {
            this.zone.run(() => {
              this.batches = data;
              if (this.batches.length) {
                this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
                  'ongoing-batch-popup',
                  Environment.HOME,
                  PageId.SEARCH, undefined,
                  reqvalues);
                const popover = this.popoverCtrl.create(EnrollmentDetailsPage,
                  {
                    upcommingBatches: this.batches,
                    retiredBatched: retiredBatched,
                    courseId: content.identifier
                  },
                  { cssClass: 'enrollement-popover' }
                );
                this.loader.dismiss();
                popover.present();
                popover.onDidDismiss(enrolled => {
                  if (enrolled) {
                    this.getEnrolledCourses();
                  }
                });
              } else {
                this.loader.dismiss();
                this.showContentDetails(content, true);
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
      if (this.loader) {
        this.loader.dismiss();
      }
      this.commonUtilService.showToast('ERROR_NO_INTERNET_MESSAGE');
    }
  }

  init() {
    this.dialCode = this.navParams.get('dialCode');
    this.contentType = this.navParams.get('contentType');
    this.corRelationList = this.navParams.get('corRelation');
    this.source = this.navParams.get('source');
    this.enrolledCourses = this.navParams.get('enrolledCourses');
    this.guestUser = this.navParams.get('guestUser');
    this.userId = this.navParams.get('userId') ? this.navParams.get('userId') : this.appGlobalService.getUserId();
    this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
    this.generateImpressionEvent();
    const values = new Map();
    values['from'] = this.source;
    this.telemetryGeneratorService.generateExtraInfoTelemetry(values, PageId.SEARCH);
    if (this.dialCode !== undefined && this.dialCode.length > 0) {
      this.getContentForDialCode();
    }

    this.event.subscribe('search.applyFilter', (filterCriteria) => {
      this.responseData.filterCriteria = filterCriteria;
      this.applyFilter();
    });
  }

  async getContentForDialCode() {
    if (this.dialCode === undefined || this.dialCode.length === 0) {
      return;
    }

    this.isDialCodeSearch = true;

    this.showLoader = true;
    this.telemetryGeneratorService.generateStartSheenAnimationTelemetry();

    const contentTypes = await this.formAndFrameworkUtilService.getSupportedContentFilterConfig(
      ContentFilterConfig.NAME_DIALCODE);
    this.contentType = contentTypes;

    // Page API START
    const pageAssemblefilter: PageAssembleFilter = {};
    pageAssemblefilter.dialcodes = this.dialCode;
    pageAssemblefilter.contentType = this.contentType;

    const pageAssembleCriteria: PageAssembleCriteria = {
      name: PageName.DIAL_CODE,
      filters: pageAssemblefilter,
      source: 'app',
      from: CachedItemRequestSourceFrom.SERVER
    };
    // pageAssembleCriteria.hardRefresh = true;

    this.pageService.getPageAssemble(pageAssembleCriteria).toPromise()
      .then((res: any) => {
        this.zone.run(() => {
          const sections = res.sections;
          if (sections && sections.length) {
            this.addCorRelation(sections[0].resmsgId, 'API');
            this.processDialCodeResult(sections);
            // this.updateFilterIcon();  // TO DO
          }
          this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
          this.showLoader = false;
        });
      }).catch(error => {
        this.zone.run(() => {
          this.showLoader = false;
          if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
            this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
          } else {
            this.commonUtilService.showToast('SOMETHING_WENT_WRONG');
            this.navCtrl.pop();
          }
        });
      });
    // Page API END
  }

  generateInteractEvent(identifier, contentType, pkgVersion, index) {
    const values = new Map();
    values['SearchPhrase'] = this.searchKeywords;
    values['PositionClicked'] = index;
    values['source'] = this.source;
    if (this.isDialCodeSearch) {
      values['root'] = false;
    }
    const telemetryObject = new TelemetryObject(identifier, contentType, pkgVersion);

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      !this.appGlobalService.isOnBoardingCompleted ? Environment.ONBOARDING : Environment.HOME,
      this.isDialCodeSearch ? PageId.DIAL_SEARCH : this.source,
      telemetryObject,
      values,
      undefined,
      this.corRelationList);
  }

  generateQRSessionEndEvent(pageId: string, qrData: string) {
    if (pageId !== undefined) {
      const telemetryObject = new TelemetryObject(qrData, 'qr', '');
      this.telemetryGeneratorService.generateEndTelemetry(
        'qr',
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject,
        undefined,
        this.corRelationList);
    }
  }

  processDialCodeResult(dialResult) {
    console.log('dialresult', dialResult);
    const displayDialCodeResult = [];
    dialResult.forEach(searchResult => {
      const collectionArray: Array<any> = searchResult.collections;
      const contentArray: Array<any> = searchResult.contents;
      const addedContent = new Array<any>();
      const dialCodeResultObj = {
        isCourse: false,
        dialCodeResult: [],
        dialCodeContentResult: []
      };
      const dialCodeCourseResultObj = {
        isCourse: true,
        dialCodeResult: [],
        dialCodeContentResult: []
      };

      // Handle localization
      if (searchResult.display) {
        dialCodeResultObj['name'] = this.commonUtilService.getTranslatedValue(searchResult.display, searchResult.name);
      } else {
        dialCodeResultObj['name'] = searchResult.name;
      }

      if (collectionArray && collectionArray.length > 0) {
        collectionArray.forEach((collection) => {
          contentArray.forEach((content) => {
            if (collection.childNodes.includes(content.identifier)) {
              if (collection.content === undefined) {
                collection.content = [];
              }
              collection.content.push(content);
              addedContent.push(content.identifier);
            }
          });
          dialCodeResultObj.dialCodeResult.push(collection);
        });
        // displayDialCodeResult[searchResult.name] = dialCodeResult;
        displayDialCodeResult.push(dialCodeResultObj);
      }

      let isAllContentMappedToCollection = false;
      if (contentArray) {
        isAllContentMappedToCollection = contentArray.length === addedContent.length;
      }

      if (!isAllContentMappedToCollection && contentArray && contentArray.length > 1) {
        const dialCodeContentResult = [];
        const dialCodeContentCourseResult = []; // content type course
        contentArray.forEach((content) => {
          if (content.contentType === ContentType.COURSE) {
            dialCodeContentCourseResult.push(content);
          } else if (addedContent.indexOf(content.identifier) < 0) {
            dialCodeContentResult.push(content);
          }
        });

        if (dialCodeContentResult.length) {
          dialCodeResultObj.dialCodeContentResult = dialCodeContentResult;
          if (displayDialCodeResult && !(displayDialCodeResult.length > 0)) {
            displayDialCodeResult.push(dialCodeResultObj);
          } else {
            displayDialCodeResult[0].dialCodeContentResult = dialCodeContentResult;
          }
        }
        // Course
        if (dialCodeContentCourseResult.length) {
          dialCodeCourseResultObj.dialCodeContentResult = dialCodeContentCourseResult;
          displayDialCodeResult.push(dialCodeCourseResultObj);
        }
      }

      let isParentCheckStarted = false;
      if (dialCodeResultObj.dialCodeResult.length === 1 && dialCodeResultObj.dialCodeResult[0].content.length === 1
        && isAllContentMappedToCollection) {
        this.parentContent = dialCodeResultObj.dialCodeResult[0];
        this.childContent = dialCodeResultObj.dialCodeResult[0].content[0];
        this.checkParent(dialCodeResultObj.dialCodeResult[0], dialCodeResultObj.dialCodeResult[0].content[0]);
        isParentCheckStarted = true;
      }
      this.generateQRScanSuccessInteractEvent((contentArray ? contentArray.length : 0), this.dialCode);

      if (contentArray && contentArray.length === 1 && !isParentCheckStarted) {
        this.isSingleContent = true;
        this.openContent(contentArray[0], contentArray[0], 0);
        // return;
      }
    });

    this.displayDialCodeResult = displayDialCodeResult;
    if (this.displayDialCodeResult.length === 0 && !this.isSingleContent) {
      this.navCtrl.pop();
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.dialCode);
      }
      this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW,
        '',
        PageId.DIAL_NOT_LINKED,
        Environment.HOME);
      this.commonUtilService.showContentComingSoonAlert(this.source);
    }
  }

  processDialCodeResultPrev(searchResult) {
    const collectionArray: Array<any> = searchResult.collectionDataList;
    const contentArray: Array<any> = searchResult.contentDataList;
    // const collectionArray: Array<any> = searchResult.collections;
    // const contentArray: Array<any> = searchResult.contents;

    this.dialCodeResult = [];
    const addedContent = new Array<any>();

    if (collectionArray && collectionArray.length > 0) {
      collectionArray.forEach((collection) => {
        contentArray.forEach((content) => {
          if (collection.childNodes.includes(content.identifier)) {
            if (collection.content === undefined) {
              collection.content = [];
            }
            collection.content.push(content);
            addedContent.push(content.identifier);
          }
        });
        this.dialCodeResult.push(collection);
      });
    }
    this.dialCodeContentResult = [];

    let isParentCheckStarted = false;

    const isAllContentMappedToCollection = contentArray.length === addedContent.length;

    if (this.dialCodeResult.length === 1 && this.dialCodeResult[0].content.length === 1 && isAllContentMappedToCollection) {
      this.parentContent = this.dialCodeResult[0];
      this.childContent = this.dialCodeResult[0].content[0];
      this.checkParent(this.dialCodeResult[0], this.dialCodeResult[0].content[0]);
      isParentCheckStarted = true;
    }
    this.generateQRScanSuccessInteractEvent(this.dialCodeResult, this.dialCode);
    if (contentArray && contentArray.length > 1) {
      contentArray.forEach((content) => {
        if (addedContent.indexOf(content.identifier) < 0) {
          this.dialCodeContentResult.push(content);
        }
      });
    }

    if (contentArray && contentArray.length === 1 && !isParentCheckStarted) {
      // this.navCtrl.pop();
      // this.showContentDetails(contentArray[0], true);
      this.isSingleContent = true;
      this.openContent(contentArray[0], contentArray[0], 0);
      return;
    }

    if (this.dialCodeResult.length === 0 && this.dialCodeContentResult.length === 0) {
      this.navCtrl.pop();
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.dialCode);
      }
      this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW,
        '',
        PageId.DIAL_NOT_LINKED,
        Environment.HOME);
      this.commonUtilService.showContentComingSoonAlert(this.source);
    } else {
      this.isEmptyResult = false;
    }
  }

  generateQRScanSuccessInteractEvent(dialCodeResultCount, dialCode) {
    const values = new Map();
    values['networkAvailable'] = this.commonUtilService.networkInfo.isNetworkAvailable ? 'Y' : 'N';
    values['scannedData'] = dialCode;
    values['count'] = dialCodeResultCount;

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.OTHER,
      InteractSubtype.DIAL_SEARCH_RESULT_FOUND,
      this.source ? this.source : Environment.HOME,
      PageId.SEARCH,
      undefined,
      values
    );
  }

  updateFilterIcon() {
    let isFilterApplied = false;

    if (!this.responseData.filterCriteria) {
      return;
    }

    this.responseData.filterCriteria.facetFilters.forEach(facet => {
      if (facet.values && facet.values.length > 0) {
        facet.values.forEach(value => {
          if (value.apply) {
            isFilterApplied = true;
          }
        });
      }
    });

    if (isFilterApplied) {
      this.filterIcon = './assets/imgs/ic_action_filter_applied.png';
    } else {
      this.filterIcon = './assets/imgs/ic_action_filter.png';
    }

    if (this.isEmptyResult) {
      this.filterIcon = undefined;
    }
  }

  checkParent(parent, child) {
    const identifier = parent.identifier;
    const contentRequest: ContentDetailRequest = {
      contentId: identifier
    };

    this.contentService.getContentDetails(contentRequest).toPromise()
      .then((data: Content) => {
        if (data) {
          if (data.isAvailableLocally) {
            this.zone.run(() => {
              this.showContentDetails(child);
            });
          } else {
            this.subscribeSdkEvent();
            this.downloadParentContent(parent);
            this.profile = this.appGlobalService.getCurrentUser();
            this.checkProfileData(data.contentData, this.profile);
          }
        } else {
          this.zone.run(() => {
            this.showContentDetails(child);
          });
        }
      }).catch((err) => {
        if (err instanceof NetworkError) {
          this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
        }
      });
  }

  downloadParentContent(parent) {
    this.zone.run(() => {
      this.downloadProgress = 0;
      this.showLoading = true;
      this.isDownloadStarted = true;
    });

    const option: ContentImportRequest = {
      contentImportArray: this.getImportContentRequestBody([parent.identifier], false),
      contentStatusArray: [],
      fields: ['appIcon', 'name', 'subject', 'size', 'gradeLevel']
    };
    // Call content service
    this.contentService.importContent(option).toPromise()
      .then((data: ContentImportResponse[]) => {
        this.zone.run(() => {

          if (data && data.length && this.isDownloadStarted) {
            _.forEach(data, (value) => {
              if (value.status === ContentImportStatus.ENQUEUED_FOR_DOWNLOAD) {
                this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
                  InteractSubtype.LOADING_SPINE,
                  this.source === PageId.USER_TYPE_SELECTION ? Environment.ONBOARDING : Environment.HOME,
                  PageId.DIAL_SEARCH,
                  undefined,
                  undefined,
                  undefined,
                  this.corRelationList
                );
                this.queuedIdentifiers.push(value.identifier);
              }
            });
          }

          if (this.queuedIdentifiers.length === 0) {
            this.showLoading = false;
            this.isDownloadStarted = false;
            if (this.commonUtilService.networkInfo.isNetworkAvailable) {
              this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
            } else {
              this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
            }
          }
        });
      })
      .catch((err) => {
        if (err instanceof NetworkError) {
          this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
          this.showLoading = false;
          this.isDownloadStarted = false;
        }
      });
  }

  /**
   * Subscribe Sunbird-SDK event to get content download progress
   */
  subscribeSdkEvent() {
    this.eventSubscription = this.eventsBusService.events().subscribe((event: EventsBusEvent) => {
      this.zone.run(() => {
        if (event.type === DownloadEventType.PROGRESS && event.payload.progress) {
          const downloadEvent = event as DownloadProgress;
          this.downloadProgress = downloadEvent.payload.progress === -1 ? 0 : downloadEvent.payload.progress;
          this.loadingDisplayText = 'Loading content ' + this.downloadProgress + ' %';

          if (this.downloadProgress === 100) {
            // this.showLoading = false;
            this.loadingDisplayText = 'Loading content ';
          }
        }
        if (event.type === ContentEventType.IMPORT_PROGRESS) {
          this.loadingDisplayText = this.commonUtilService.translateMessage('EXTRACTING_CONTENT') + ' ' +
            Math.floor((event.payload.currentCount / event.payload.totalCount) * 100) +
            '% (' + event.payload.currentCount + ' / ' + event.payload.totalCount + ')';
            if (event.payload.currentCount === event.payload.totalCount) {
              let timer = 30;
              const interval = setInterval(() => {
                this.loadingDisplayText = `Getting things ready in ${timer--}  seconds`;
                if (timer === 0) {
                  this.loadingDisplayText = 'Getting things ready';
                  clearInterval(interval);
                }
              }, 1000);
            }
        }
        // if (event.payload && event.payload.status === 'IMPORT_COMPLETED' && event.type === 'contentImport') {
        if (event.payload && event.type === ContentEventType.IMPORT_COMPLETED) {
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, event.payload.contentId)) {
              this.currentCount++;
            }
            if (this.queuedIdentifiers.length === this.currentCount) {
              this.showLoading = false;
              this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
                InteractSubtype.LOADING_SPINE_COMPLETED,
                this.source === PageId.USER_TYPE_SELECTION ? Environment.ONBOARDING : Environment.HOME,
                PageId.DIAL_SEARCH,
                undefined,
                undefined,
                undefined,
                this.corRelationList
              );
              this.showContentDetails(this.childContent);
              this.events.publish('savedResources:update', {
                update: true
              });
            }
          } else {
            this.events.publish('savedResources:update', {
              update: true
            });
          }
        }

      });
    }) as any;
  }

  /**
   * Function to get import content api request params
   *
   * @param {Array<string>} identifiers contains list of content identifier(s)
   * @param {boolean} isChild
   */
  getImportContentRequestBody(identifiers: Array<string>, isChild: boolean): Array<ContentImport> {
    const requestParams = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        // TODO - check with Anil for destination folder path
        destinationFolder: cordova.file.externalDataDirectory,
        contentId: value,
        correlationData: this.corRelationList !== undefined ? this.corRelationList : []
      });
    });

    return requestParams;
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.parentContent.identifier).toPromise().then(() => {
      this.zone.run(() => {
        this.showLoading = false;
      });
    }).catch(() => {
      this.zone.run(() => {
        this.showLoading = false;
      });
    });
  }

  checkUserSession() {
    const isGuestUser = !this.appGlobalService.isUserLoggedIn();

    if (isGuestUser) {
      const userType = this.appGlobalService.getGuestUserType();
      if (userType === ProfileType.STUDENT) {
        this.audienceFilter = AudienceFilter.GUEST_STUDENT;
      } else if (userType === ProfileType.TEACHER) {
        this.audienceFilter = AudienceFilter.GUEST_TEACHER;
      }

      this.profile = this.appGlobalService.getCurrentUser();
    } else {
      this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
      this.profile = undefined;
    }
  }

  private addCorRelation(id: string, type: string) {
    if (this.corRelationList === undefined || this.corRelationList === null) {
      this.corRelationList = new Array<CorrelationData>();
    }
    const corRelation: CorrelationData = new CorrelationData();
    corRelation.id = id;
    corRelation.type = type;
    this.corRelationList.push(corRelation);
  }

  private generateImpressionEvent() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.SEARCH, '',
      this.source ? this.source : PageId.HOME,
      Environment.HOME, '', '', '',
      undefined,
      this.corRelationList);
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
        this.source,
        Environment.HOME,
        ImpressionType.SEARCH,
        params);
    }
  }

  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  private getEnrolledCourses(refreshEnrolledCourses: boolean = true, returnRefreshedCourses: boolean = false): Promise<any> {
    this.showLoader = true;
    const option: FetchEnrolledCourseRequest = {
      userId: this.userId,
      returnFreshCourses: returnRefreshedCourses
    };
    return this.courseService.getEnrolledCourses(option).toPromise()
      .then((enrolledCourses) => {
        if (enrolledCourses) {
          this.zone.run(() => {
            this.enrolledCourses = enrolledCourses ? enrolledCourses : [];
            if (this.enrolledCourses.length > 0) {
              const courseList: Array<Course> = [];
              for (const course of this.enrolledCourses) {
                courseList.push(course);
              }

              this.appGlobalService.setEnrolledCourseList(courseList);
            }
            this.showLoader = false;
          });
          return enrolledCourses;
        }
      }, (err) => {
        this.showLoader = false;
        return [];
      });
  }

  scrollToTop() {
    this.contentView.scrollToTop();
  }
}
