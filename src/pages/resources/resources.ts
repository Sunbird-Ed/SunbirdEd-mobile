import { ActiveDownloadsPage } from '@app/pages/active-downloads/active-downloads';
import { Search, ContentFilterConfig } from './../../app/app.constant';
import { AfterViewInit, Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { Events, NavController, ToastController, MenuController, Tabs } from 'ionic-angular';
import { Content as ContentView } from 'ionic-angular';
import * as _ from 'lodash';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { Map } from '../../app/telemetryutil';
import {
  AudienceFilter, CardSectionName, ContentCard, ContentType, PreferenceKey, ViewMore
} from '../../app/app.constant';
import { PageFilterCallback } from '../page-filter/page.filter';
import { AppGlobalService } from '../../service/app-global.service';
import { AppVersion } from '@ionic-native/app-version';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { CollectionDetailsEtbPage } from '../collection-details-etb/collection-details-etb';
import {
  CategoryTerm, ContentEventType, ContentRequest, ContentSearchCriteria, ContentService, EventsBusEvent,
  EventsBusService, FrameworkCategoryCode, FrameworkCategoryCodesGroup, FrameworkUtilService,
  GetFrameworkCategoryTermsRequest, Profile, ProfileService, ProfileType, SearchType, SharedPreferences,
  TelemetryObject
} from 'sunbird-sdk';
import { Environment, InteractSubtype, InteractType, PageId, ImpressionType, ImpressionSubtype } from '../../service/telemetry-constants';
import { PlayerPage } from '../player/player';
import { Subscription } from 'rxjs';
import { ProfileConstants } from '../../app';
import { AppHeaderService } from '@app/service';
import { NotificationsPage } from '../notifications/notifications';
import { TextbookViewMorePage } from '../textbook-view-more/textbook-view-more';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import { ExploreBooksPage } from '../resources/explore-books/explore-books';

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html',
  animations: [
    trigger('appear', [
      state('true', style({
        left: '{{left_indent}}',
      }), { params: { left_indent: 0 } }), // default parameters values required

      transition('* => classAnimate', [
        style({ width: 5, opacity: 0 }),
        group([
          animate('0.3s 0.2s ease', style({
            transform: 'translateX(0) scale(1.2)', width: '*',
          })),
          animate('0.2s ease', style({
            opacity: 1
          }))
        ])
      ]),
    ]),
    trigger('ScrollHorizontal', [
      state('true', style({
        left: '{{left_indent}}',
        transform: 'translateX(-100px)',
      }), { params: { left_indent: 0 } }), // default parameters values required

      transition('* => classAnimate', [
        // style({ width: 5, transform: 'translateX(-100px)', opacity: 0 }),
        group([
          animate('0.3s 0.5s ease', style({
            transform: 'translateX(-100px)'
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),
    ])
  ]
})
export class ResourcesPage implements OnInit, AfterViewInit {
  pageLoadedSuccess = false;
  storyAndWorksheets: Array<any>;
  selectedValue: Array<string> = [];
  guestUser = false;
  showSignInCard = false;
  recentlyViewedResources: Array<any>;
  userId: string;
  showLoader = false;

  /**
   * Flag to show latest and popular course loader
   */
  searchApiLoader = true;
  isOnBoardingCardCompleted = false;
  public source = PageId.LIBRARY;
  resourceFilter: any;
  appliedFilter: any;
  filterIcon = './assets/imgs/ic_action_filter.png';
  selectedLanguage = 'en';
  audienceFilter = [];
  profile: Profile;
  appLabel: string;
  mode = 'soft';
  isFilterApplied = false;
  pageFilterCallBack: PageFilterCallback;
  getGroupByPageReq: ContentSearchCriteria = {
    searchType: SearchType.SEARCH
  };

  layoutName = 'textbook';
  layoutPopular = ContentCard.LAYOUT_POPULAR;
  layoutSavedContent = ContentCard.LAYOUT_SAVED_CONTENT;
  savedResourcesSection = CardSectionName.SECTION_SAVED_RESOURCES;
  recentViewedSection = CardSectionName.SECTION_RECENT_RESOURCES;
  categoryGradeLevels: any;
  categoryMediums: any;
  current_index: any;
  currentGrade: any;
  currentMedium: string;
  defaultImg: string;
  isUpgradePopoverShown = false;

  refresh: boolean;
  private eventSubscription: Subscription;

  toast: any;
  networkSubscription: Subscription;
  headerObservable: any;
  scrollEventRemover: any;
  subjects: any;
  @ViewChild('contentView') contentView: ContentView;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    public navCtrl: NavController,
    private ngZone: NgZone,
    private qrScanner: SunbirdQRScanner,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private translate: TranslateService,
    private network: Network,
    private tabs: Tabs,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    public toastController: ToastController,
    public menuCtrl: MenuController,
    private headerService: AppHeaderService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService
  ) {
    this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise()
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
    this.defaultImg = 'assets/imgs/ic_launcher.png';
    this.generateNetworkType();

  }

  subscribeUtilityEvents() {
    this.profileService.getActiveSessionProfile({ requiredFields: ProfileConstants.REQUIRED_FIELDS }).subscribe((profile: Profile) => {
      this.profile = profile;
    });
    this.events.subscribe('savedResources:update', (res) => {
      if (res && res.update) {
        this.loadRecentlyViewedContent(true);
      }
    });
    this.events.subscribe('event:showScanner', (data) => {
      if (data.pageName === PageId.LIBRARY) {
        this.qrScanner.startScanner(PageId.LIBRARY, false);
      }
    });
    this.events.subscribe('onAfterLanguageChange:update', (res) => {
      if (res && res.selectedLanguage) {
        this.selectedLanguage = res.selectedLanguage;
        this.getPopularContent(true);
      }
    });

    this.events.subscribe(AppGlobalService.PROFILE_OBJ_CHANGED, () => {
      this.swipeDownToRefresh(false, true);
    });

    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', async (upgrade) => {
      if (upgrade && !this.isUpgradePopoverShown) {
        await this.appGlobalService.openPopover(upgrade);
        this.isUpgradePopoverShown = true;
      }
    });

    this.events.subscribe('tab.change', (data: string) => {
      this.scrollToTop();
      // this.ngZone.run(() => {
      if (data.trim().toUpperCase() === 'LIBRARY') {
        if (this.appliedFilter) {
          this.filterIcon = './assets/imgs/ic_action_filter.png';
          this.resourceFilter = undefined;
          this.appliedFilter = undefined;
          this.isFilterApplied = false;
          this.getPopularContent();
        }
      } else if (data === '') {
        this.qrScanner.startScanner(this.appGlobalService.getPageIdForTelemetry());
      }
      // });
    });
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    this.getCurrentUser();
  }

  generateNetworkType() {
    const values = new Map();
    values['network-type'] = this.network.type;
    this.telemetryGeneratorService.generateExtraInfoTelemetry(
      values,
      PageId.LIBRARY
    );
  }

  ngAfterViewInit() {
    this.events.subscribe('onboarding-card:completed', (param) => {
      this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
    });
  }

  ionViewWillLeave(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.events.unsubscribe('update_header');
    this.events.unsubscribe('onboarding-card:completed');
    if (this.headerObservable) {
      this.headerObservable.unsubscribe();
    }
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
      if (this.toast) {
        this.toast.dismiss();
        this.toast = undefined;
      }
    }
  }

  /**
   * It will fetch the guest user profile details
   */
  getCurrentUser(): void {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
    const profileType = this.appGlobalService.getGuestUserType();
    this.showSignInCard = false;

    if (this.guestUser) {
      if (profileType === ProfileType.TEACHER) {
        this.showSignInCard = this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER;
        this.audienceFilter = AudienceFilter.GUEST_TEACHER;
      } else if (profileType === ProfileType.STUDENT) {
        this.showSignInCard = this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT;
        this.audienceFilter = AudienceFilter.GUEST_STUDENT;
      }
    } else {
      this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
    }

    this.profile = this.appGlobalService.getCurrentUser();
    this.loadRecentlyViewedContent();
  }

  navigateToViewMoreContentsPage(section: string) {
    const values = new Map();
    let headerTitle;
    let pageName;
    let showDownloadOnlyToggleBtn;
    const uid = this.profile ? this.profile.uid : undefined;
    if (section === this.savedResourcesSection) {
      values['SectionName'] = this.savedResourcesSection;
      headerTitle = 'SAVED_RESOURCES';
      pageName = ViewMore.PAGE_RESOURCE_SAVED;
    } else if (section === this.recentViewedSection) {
      values['SectionName'] = this.recentViewedSection;
      headerTitle = 'RECENTLY_VIEWED';
      pageName = ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED;
      showDownloadOnlyToggleBtn = true;
    }
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEWALL_CLICKED,
      Environment.HOME,
      this.source, undefined,
      values);
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: headerTitle,
      pageName: pageName,
      showDownloadOnlyToggle: showDownloadOnlyToggleBtn,
      uid: uid,
      audience: this.audienceFilter,
    });
  }

  /**
	 * Load/get recently viewed content
	 */
  async loadRecentlyViewedContent(hideLoaderFlag?: boolean) {
    this.recentlyViewedResources = [];
    if (!hideLoaderFlag) {
      this.showLoader = true;
      if (this.showLoader) {
        this.telemetryGeneratorService.generateStartSheenAnimationTelemetry();
      }
    }
    const requestParams: ContentRequest = {
      uid: this.profile ? this.profile.uid : undefined,
      contentTypes: [],
      audience: this.audienceFilter,
      recentlyViewed: true,
      limit: 20
    };

    this.contentService.getContents(requestParams).toPromise()
      .then(data => {
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
        });
        this.ngZone.run(() => {
          this.recentlyViewedResources = data;
          if (!hideLoaderFlag) {
            this.showLoader = false;
            if (!this.showLoader) {
             this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
            }
          }
        });
      })
      .catch(() => {
        this.ngZone.run(() => {
          if (!hideLoaderFlag) {
            this.showLoader = false;
            if (!this.showLoader) {
              this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
            }
          }
        });
      });
  }

  /**
   * Get popular content
   */
  getPopularContent(isAfterLanguageChange = false, contentSearchCriteria?: ContentSearchCriteria, avoidRefreshList = false) {
    // if (this.isOnBoardingCardCompleted || !this.guestUser) {
    this.storyAndWorksheets = [];
    this.searchApiLoader = true;
    // this.noInternetConnection = false;
    const that = this;
    if (this.searchApiLoader) {
      this.telemetryGeneratorService.generateStartSheenAnimationTelemetry();
    }

    if (!contentSearchCriteria) {
      contentSearchCriteria = {
        mode: 'hard'
      };
    }

    this.mode = contentSearchCriteria.mode;

    if (this.profile && !this.isFilterApplied) {

      if (this.profile.board && this.profile.board.length) {
        contentSearchCriteria.board = this.applyProfileFilter(this.profile.board, contentSearchCriteria.board, 'board');
      }

      if (this.profile.medium && this.profile.medium.length) {
        contentSearchCriteria.medium = this.applyProfileFilter(this.profile.medium, contentSearchCriteria.medium, 'medium');
      }

      if (this.profile.grade && this.profile.grade.length) {
        contentSearchCriteria.grade = this.applyProfileFilter(this.profile.grade,
          contentSearchCriteria.grade, 'gradeLevel');
      }

    }
    // swipe down to refresh should not over write current selected options
    if (contentSearchCriteria.grade) {
      this.getGroupByPageReq.grade = [contentSearchCriteria.grade[0]];
    }
    if (contentSearchCriteria.medium) {
      this.getGroupByPageReq.medium = [contentSearchCriteria.medium[0]];
    }
    if (contentSearchCriteria.board) {
      this.getGroupByPageReq.board = [contentSearchCriteria.board[0]];
    }
    this.getGroupByPageReq.mode = 'hard';
    this.getGroupByPageReq.facets = Search.FACETS_ETB;
    this.getGroupByPageReq.contentTypes = [ContentType.TEXTBOOK];
    this.getGroupByPage(isAfterLanguageChange, avoidRefreshList);
  }

  getGroupByPage(isAfterLanguageChange = false, avoidRefreshList = false) {
    const selectedBoardMediumGrade = this.getGroupByPageReq.board[0] + ', ' +
      this.getGroupByPageReq.medium[0] + ' Medium, ' +
      this.getGroupByPageReq.grade[0];
    this.appGlobalService.setSelectedBoardMediumGrade(selectedBoardMediumGrade);
    this.storyAndWorksheets = [];
    if (!this.refresh) {
      this.searchApiLoader = true;
    } else {
      this.searchApiLoader = false;
    }
    this.telemetryGeneratorService.generateStartSheenAnimationTelemetry();
    const reqvalues = new Map();
    reqvalues['pageReq'] = this.getGroupByPageReq;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
      InteractSubtype.RESOURCE_PAGE_REQUEST,
      Environment.HOME,
      this.source, undefined,
      reqvalues);
    this.contentService.searchContentGroupedByPageSection(this.getGroupByPageReq).toPromise()
      .then((response: any) => {
        this.ngZone.run(() => {
          // TODO Temporary code - should be fixed at backend
          const sections = response.sections;
          const newSections = [];
          sections.forEach(element => {
            // element.display = JSON.parse(element.display);
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
          // END OF TEMPORARY CODE
          if (this.profile.subject && this.profile.subject.length) {
            this.storyAndWorksheets = this.orderBySubject([...newSections]);
          } else {
            this.storyAndWorksheets = newSections;
          }
          const sectionInfo = {};
          for (let i = 0; i < this.storyAndWorksheets.length; i++) {
            const sectionName = this.storyAndWorksheets[i].name,
              count = this.storyAndWorksheets[i].contents.length;

            for (let k = 0, len = this.storyAndWorksheets[i].contents.length; k < len; k++) {
              const content = this.storyAndWorksheets[i].contents[k];
              if (content.appIcon) {
                if (content.appIcon.includes('http:') || content.appIcon.includes('https:')) {
                  if (this.commonUtilService.networkInfo.isNetworkAvailable) {
                    content.appIcon = content.appIcon;
                  } else {
                    content.appIcon = this.defaultImg;
                  }
                } else if (content.basePath) {
                  content.appIcon = content.basePath + '/' + content.appIcon;
                }
              }
            }

            // check if locally available
            this.markLocallyAvailableTextBook();
            sectionInfo[sectionName] = count;
            sectionInfo['board'] = this.getGroupByPageReq.board[0];
            sectionInfo['medium'] = this.getGroupByPageReq.medium[0];
            sectionInfo['grade'] = this.getGroupByPageReq.grade[0];
          }

          const resvalues = new Map();
          resvalues['pageRes'] = sectionInfo;
          this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
            InteractSubtype.RESOURCE_PAGE_LOADED,
            Environment.HOME,
            this.source, undefined,
            resvalues);
          this.pageLoadedSuccess = true;
          this.refresh = false;
          this.searchApiLoader = false;
          if (!this.refresh || !this.searchApiLoader) {
           this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
          }
          // this.noInternetConnection = false;
          this.generateExtraInfoTelemetry(newSections.length);
          // this.checkEmptySearchResult(isAfterLanguageChange);
          if (this.storyAndWorksheets.length === 0 && this.commonUtilService.networkInfo.isNetworkAvailable) {
            if (this.tabs.getSelected().tabTitle === 'LIBRARY‌' && !avoidRefreshList) {
            }
          }
        });
      })
      .catch(error => {
        console.log('error while getting popular resources...', error);
        this.ngZone.run(() => {
          this.refresh = false;
          this.searchApiLoader = false;
          if (!this.refresh || !this.searchApiLoader) {
            this.telemetryGeneratorService.generateEndSheenAnimationTelemetry();
          }
          if (error === 'CONNECTION_ERROR') {
          } else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
            if (!isAfterLanguageChange) {
              this.commonUtilService.showToast('ERROR_FETCHING_DATA');
            }
          } else if (this.storyAndWorksheets.length === 0 && this.commonUtilService.networkInfo.isNetworkAvailable  && !avoidRefreshList) {
          }
          const errvalues = new Map();
          errvalues['isNetworkAvailable'] = this.commonUtilService.networkInfo.isNetworkAvailable ? 'Y' : 'N';
          this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
            InteractSubtype.RESOURCE_PAGE_ERROR,
            Environment.HOME,
            this.source, undefined,
            errvalues);
        });
      });
  }

  orderBySubject(searchResults: any[]) {
    let selectedSubject: string[];
    const filteredSubject: string[] = [];
    selectedSubject = this.applyProfileFilter(this.profile.subject, selectedSubject, 'subject');
    for (let i = 0; i < selectedSubject.length; i++) {
      const index = searchResults.findIndex((el) => {
        return el.name.toLowerCase().trim() === selectedSubject[i].toLowerCase().trim();
      });
      if (index !== -1) {
        filteredSubject.push(searchResults.splice(index, 1)[0]);
      }
    }
    filteredSubject.push(...searchResults);
    return filteredSubject;
  }
  markLocallyAvailableTextBook() {
    if (!this.recentlyViewedResources || !this.storyAndWorksheets) {
      return;
    }
    for (let i = 0; i < this.recentlyViewedResources.length; i++) {
      for (let j = 0; j < this.storyAndWorksheets.length; j++) {
        for (let k = 0; k < this.storyAndWorksheets[j].contents.length; k++) {
          if (this.recentlyViewedResources[i].isAvailableLocally &&
            this.recentlyViewedResources[i].identifier === this.storyAndWorksheets[j].contents[k].identifier) {
            this.storyAndWorksheets[j].contents[k].isAvailableLocally = true;
          }
        }
      }
    }
  }
  generateExtraInfoTelemetry(sectionsCount) {
    const values = new Map();
    values['pageSectionCount'] = sectionsCount;
    values['networkAvailable'] = this.commonUtilService.networkInfo.isNetworkAvailable ? 'Y' : 'N';
    this.telemetryGeneratorService.generateExtraInfoTelemetry(
      values,
      PageId.LIBRARY
    );
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

  ionViewDidLoad() {
    this.appGlobalService.generateConfigInteractEvent(PageId.LIBRARY, this.isOnBoardingCardCompleted);
  }

  ionViewDidEnter() {
    this.preferences.getBoolean('coach_mark_seen').toPromise()
      .then((value) => {
        if (!value) {
          this.events.publish('coach_mark_seen', { showWalkthroughBackDrop: true, appName: this.appLabel });
          this.telemetryGeneratorService.generateImpressionTelemetry(
            ImpressionType.VIEW,
            ImpressionSubtype.QR_SCAN_WALKTHROUGH,
            PageId.LIBRARY,
            Environment.ONBOARDING
          );
        }
      });
    this.preferences.putBoolean('coach_mark_seen', true).toPromise().then();
  }

  ionViewWillEnter() {
    this.events.subscribe('update_header', (data) => {
      this.headerService.showHeaderWithHomeButton(['search', 'download', 'notification']);
    });
    this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this.headerService.showHeaderWithHomeButton(['search', 'download', 'notification']);

    this.getCategoryData();

    this.getCurrentUser();

    if (!this.pageLoadedSuccess) {
      this.getPopularContent();
    }
    this.subscribeSdkEvent();
    this.networkSubscription = this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
      if (available) {
        if (this.toast) {
          this.toast.dismiss();
          this.toast = undefined;
        }
      } else {
        this.presentToastForOffline('NO_INTERNET_TITLE');
      }
    });
  }

  // Offline Toast
  presentToastForOffline(msg: string) {
    this.toast = this.toastController.create({
      duration: 3000,
      message: this.commonUtilService.translateMessage(msg),
      showCloseButton: true,
      position: 'top',
      closeButtonText: '',
      cssClass: 'toastHeader'
    });
    this.toast.present();
    this.toast.onDidDismiss(() => {
      this.toast = undefined;
    });
  }

  subscribeSdkEvent() {
    this.eventSubscription = this.eventsBusService.events().subscribe((event: EventsBusEvent) => {
      if (event.payload && event.type === ContentEventType.IMPORT_COMPLETED) {
        this.loadRecentlyViewedContent();
      }
    }) as any;
  }

  /**
   *
   * @param refresher
   */
  swipeDownToRefresh(refresher?, avoidRefreshList?) {
    this.refresh = true;
    this.storyAndWorksheets = [];

    this.getCategoryData();
    this.getCurrentUser();
    if (refresher) {
      refresher.complete();
      this.telemetryGeneratorService.generatePullToRefreshTelemetry(PageId.LIBRARY, Environment.HOME);
      this.getGroupByPage();
    } else {
      this.getPopularContent(false, null, avoidRefreshList);
    }
  }

  scanQRCode() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.QRCodeScanClicked,
      Environment.HOME,
      PageId.LIBRARY);
    this.qrScanner.startScanner(PageId.LIBRARY);
  }

  async search() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.SEARCH_BUTTON_CLICKED,
      Environment.HOME,
      PageId.LIBRARY);
    const contentTypes = await this.formAndFrameworkUtilService.getSupportedContentFilterConfig(
      ContentFilterConfig.NAME_LIBRARY);
    this.navCtrl.push(SearchPage, { contentType: contentTypes, source: PageId.LIBRARY });
  }

  getCategoryData() {
    const syllabus: Array<string> = this.appGlobalService.getCurrentUser().syllabus;
    const frameworkId = (syllabus && syllabus.length > 0) ? syllabus[0] : undefined;
    const categories: Array<FrameworkCategoryCode> = FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES;
    this.getMediumData(frameworkId, categories);
    this.getGradeLevelData(frameworkId, categories);
    this.getSubjectData(frameworkId, categories);
  }

  getSubjectData(frameworkId, categories): any {
    const req: GetFrameworkCategoryTermsRequest = {
      currentCategoryCode: FrameworkCategoryCode.SUBJECT,
      language: this.translate.currentLang,
      requiredCategories: categories,
      frameworkId: frameworkId
    };
    this.frameworkUtilService.getFrameworkCategoryTerms(req).toPromise()
      .then((res: CategoryTerm[]) => {
        this.subjects = res;
      })
      .catch(() => {});
  }

  getMediumData(frameworkId, categories): any {
    const req: GetFrameworkCategoryTermsRequest = {
      currentCategoryCode: FrameworkCategoryCode.MEDIUM,
      language: this.translate.currentLang,
      requiredCategories: categories,
      frameworkId: frameworkId
    };
    this.frameworkUtilService.getFrameworkCategoryTerms(req).toPromise()
      .then((res: CategoryTerm[]) => {
        this.categoryMediums = res;
        this.arrangeMediumsByUserData(this.categoryMediums.map(a => ({ ...a })));
      })
      .catch(() => {
      });
  }


  findWithAttr(array, attr, value) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][attr].toLowerCase() === value.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

  arrangeMediumsByUserData(categoryMediumsParam) {
    if (this.appGlobalService.getCurrentUser() &&
      this.appGlobalService.getCurrentUser().medium &&
      this.appGlobalService.getCurrentUser().medium.length) {
      const mediumIndex = this.findWithAttr(categoryMediumsParam, 'name', this.appGlobalService.getCurrentUser().medium[0]);

      for (let i = mediumIndex; i > 0; i--) {
        categoryMediumsParam[i] = categoryMediumsParam[i - 1];
        if (i === 1) {
          categoryMediumsParam[0] = this.categoryMediums[mediumIndex];
        }
      }
      this.categoryMediums = categoryMediumsParam;

      for (let i = 0, len = this.categoryMediums.length; i < len; i++) {
        if (this.getGroupByPageReq.medium[0].toLowerCase().trim() === this.categoryMediums[i].name.toLowerCase().trim()) {
          this.mediumClick(this.categoryMediums[i].name);
        }
      }
    }
  }

  getGradeLevelData(frameworkId, categories): any {
    const req: GetFrameworkCategoryTermsRequest = {
      currentCategoryCode: FrameworkCategoryCode.GRADE_LEVEL,
      language: this.translate.currentLang,
      requiredCategories: categories,
      frameworkId: frameworkId
    };
    this.frameworkUtilService.getFrameworkCategoryTerms(req).toPromise()
      .then((res: CategoryTerm[]) => {
        this.categoryGradeLevels = res;
        for (let i = 0, len = this.categoryGradeLevels.length; i < len; i++) {
          if (this.getGroupByPageReq.grade[0] === this.categoryGradeLevels[i].name) {
            this.classClick(i);
          }
        }
      })
      .catch(err => {
      });
  }

  checkEmptySearchResult(isAfterLanguageChange = false) {
    const flags = [];
    _.forEach(this.storyAndWorksheets, (value, key) => {
      if (value.contents && value.contents.length) {
        flags[key] = true;
      }
    });

    if (flags.length && _.includes(flags, true)) {
    } else {
      if (!isAfterLanguageChange) {
        if (this.tabs.getSelected().tabTitle === 'LIBRARY‌') {
          this.commonUtilService.showToast('NO_CONTENTS_FOUND');
        }
      }
    }
  }

  showOfflineNetworkWarning() {
    this.presentToastForOffline('NO_INTERNET_TITLE');
  }

  checkNetworkStatus(showRefresh = false) {
    if (this.commonUtilService.networkInfo.isNetworkAvailable && showRefresh) {
      this.swipeDownToRefresh();
    }
  }


  showDisabled(resource) {
    return !resource.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable;
  }

  generateClassInteractTelemetry(currentClass: string, previousClass: string) {
    const values = new Map();
    values['currentSelected'] = currentClass;
    values['previousSelected'] = previousClass;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CLASS_CLICKED,
      Environment.HOME,
      PageId.LIBRARY,
      undefined,
      values);
  }

  generateMediumInteractTelemetry(currentMedium: string, previousMedium: string) {
    const values = new Map();
    values['currentSelected'] = currentMedium;
    values['previousSelected'] = previousMedium;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.MEDIUM_CLICKED,
      Environment.HOME,
      PageId.LIBRARY,
      undefined,
      values);
  }

  classClick(index, isClassClicked?: boolean) {
    if (isClassClicked) {
      this.generateClassInteractTelemetry(this.categoryGradeLevels[index].name, this.getGroupByPageReq.grade[0]);
    }
    this.getGroupByPageReq.grade = [this.categoryGradeLevels[index].name];
    // [grade.name];
    if ((this.currentGrade) && (this.currentGrade.name !== this.categoryGradeLevels[index].name) && isClassClicked) {
      this.getGroupByPage(false, !isClassClicked);
    }
    for (let i = 0, len = this.categoryGradeLevels.length; i < len; i++) {
      if (i === index) {
        this.currentGrade = this.categoryGradeLevels[i];
        this.current_index = this.categoryGradeLevels[i];
        this.categoryGradeLevels[i].selected = 'classAnimate';
      } else {
        this.categoryGradeLevels[i].selected = '';
      }
    }
    let el: HTMLElement | null = document.getElementById('class' + index);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
    } else {
      setTimeout(() => {
        el = document.getElementById('class' + index);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
        }
      }, 1000);
    }
  }

  mediumClick(mediumName: string, isMediumClicked?: boolean) {
    if (isMediumClicked) {
      this.generateMediumInteractTelemetry(mediumName, this.getGroupByPageReq.medium[0]);
    }
    this.getGroupByPageReq.medium = [mediumName];
    if (this.currentMedium !== mediumName && isMediumClicked) {
      this.getGroupByPage(false, !isMediumClicked);
    }

    for (let i = 0, len = this.categoryMediums.length; i < len; i++) {
      if (this.categoryMediums[i].name === mediumName) {
        this.currentMedium = this.categoryMediums[i].name;
        this.categoryMediums[i].selected = true;
      } else {
        this.categoryMediums[i].selected = false;
      }
    }
  }

  navigateToDetailPage(item, index, sectionName) {
    const identifier = item.contentId || item.identifier;
    let telemetryObject: TelemetryObject;
    telemetryObject = new TelemetryObject(identifier, item.contentType, undefined);
    const values = new Map();
    values['sectionName'] = item.subject;
    values['positionClicked'] = index;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      'home',
      'library',
      telemetryObject,
      values);
    if (this.commonUtilService.networkInfo.isNetworkAvailable || item.isAvailableLocally) {
      this.navCtrl.push(CollectionDetailsEtbPage, {
        content: item
      });
    } else {
      this.presentToastForOffline('OFFLINE_WARNING_ETBUI_1');
    }
  }

  navigateToTextbookPage(items, subject) {
    const identifier = items.contentId || items.identifier;
    let telemetryObject: TelemetryObject;
    telemetryObject = new TelemetryObject(identifier, items.contentType, undefined);
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEW_MORE_CLICKED,
      Environment.HOME,
      PageId.LIBRARY,
      telemetryObject);
    if (this.commonUtilService.networkInfo.isNetworkAvailable || items.isAvailableLocally) {
      this.navCtrl.push(TextbookViewMorePage, {
        content: items,
        subjectName: subject
      });
    } else {
      this.presentToastForOffline('OFFLINE_WARNING_ETBUI_1');
    }
  }

  launchContent() {
    this.navCtrl.push(PlayerPage);
  }

  handleHeaderEvents($event) {
    console.log('inside handleHeaderEvents', $event);
    switch ($event.name) {
      case 'search': this.search();
        break;
      case 'download': this.redirectToActivedownloads();
        break;
      case 'notification': this.redirectToNotifications();
        break;
      default: console.warn('Use Proper Event name');
    }
  }

  redirectToActivedownloads() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.ACTIVE_DOWNLOADS_CLICKED,
      Environment.HOME,
      PageId.LIBRARY);
    this.navCtrl.push(ActiveDownloadsPage);
  }

  redirectToNotifications() {
    const valuesMap = new Map();
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.NOTIFICATION_CLICKED,
      Environment.HOME,
      PageId.LIBRARY,
      undefined,
      valuesMap);
    this.navCtrl.push(NotificationsPage);
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  logScrollEnd(event) {
    // Added Telemetry on reaching Vertical Scroll End
    if (event && event.scrollElement.scrollHeight <= event.scrollElement.scrollTop + event.scrollElement.offsetHeight) {
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.SCROLL,
        InteractSubtype.BOOK_LIST_END_REACHED,
        Environment.HOME,
        this.source, undefined,
      );
    }
  }
  onScroll(event) {
    // Added Telemetry on reaching Horizontal Scroll End
    if (event && event.target.scrollWidth <= event.target.scrollLeft + event.target.offsetWidth) {
      this.telemetryGeneratorService.generateInteractTelemetry(InteractType.SCROLL,
        InteractSubtype.RECENTLY_VIEWED_END_REACHED,
        Environment.HOME,
        this.source, undefined,
      );
    }
  }

  scrollToTop() {

    this.contentView.scrollToTop();
    // this.contentView._scrollContent.nativeElement.scrollToTop();

  }
  exploreOtherContents() {
    this.navCtrl.push(ExploreBooksPage, {
      subjects: this.subjects,
      categoryGradeLevels: this.categoryGradeLevels,
      storyAndWorksheets: this.storyAndWorksheets,
      contentType: ContentType.FOR_LIBRARY_TAB,
      selectedGrade: this.getGroupByPageReq.grade,
      selectedMedium: this.getGroupByPageReq.medium
    });
    const values = new Map();
    values['board'] = this.profile.board[0];
    values['class'] = this.currentGrade.name;
    values['medium'] = this.currentMedium;

    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SEE_MORE_CONTENT_CLICKED,
      Environment.LIBRARY,
      PageId.LIBRARY,
      undefined,
      values);
  }
}
