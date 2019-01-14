import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import {
  Component,
  NgZone,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  PageAssembleService,
  PageAssembleCriteria,
  ContentService,
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype,
  SharedPreferences,
  ContentFilterCriteria,
  ProfileType,
  PageAssembleFilter,
  FrameworkService
} from 'sunbird';
import {
  NavController,
  PopoverController,
  Events
} from 'ionic-angular';
import * as _ from 'lodash';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { Map } from '../../app/telemetryutil';
import {
  ContentType,
  AudienceFilter,
  PreferenceKey,
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
import { AppVersion } from '@ionic-native/app-version';
import { updateFilterInSearchQuery } from '../../util/filter.util';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage implements OnInit, AfterViewInit {

  pageLoadedSuccess = false;
  storyAndWorksheets: Array<any>;
  selectedValue: Array<string> = [];
  guestUser = false;
  showSignInCard = false;
  showWarning = false;
  localResources: Array<any>;
  recentlyViewedResources: Array<any>;
  userId: string;
  showLoader = false;

  /**
	 * Flag to show latest and popular course loader
	 */
  pageApiLoader = true;
  isOnBoardingCardCompleted = false;
  public source = PageId.LIBRARY;
  resourceFilter: any;
  appliedFilter: any;
  filterIcon = './assets/imgs/ic_action_filter.png';
  selectedLanguage = 'en';
  audienceFilter = [];
  profile: any;
  appLabel: string;
  mode = 'soft';
  isFilterApplied = false;
  pageFilterCallBack: PageFilterCallback;

  layoutPopular = ContentCard.LAYOUT_POPULAR;
  layoutSavedContent = ContentCard.LAYOUT_SAVED_CONTENT;
  savedResourcesSection = 'Saved Resources';
  recentViewedSection = 'Recently Viewed';

  constructor(
    public navCtrl: NavController,
    private pageService: PageAssembleService,
    private ngZone: NgZone,
    private contentService: ContentService,
    private qrScanner: SunbirdQRScanner,
    private popCtrl: PopoverController,
    private events: Events,
    private preference: SharedPreferences,
    private zone: NgZone,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private framework: FrameworkService
  ) {
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

  subscribeUtilityEvents() {
    this.events.subscribe('savedResources:update', (res) => {
      if (res && res.update) {
        this.setSavedContent();
        this.loadRecentlyViewedContent();
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
      this.swipeDownToRefresh();
    });

    // Event for optional and forceful upgrade
    this.events.subscribe('force_optional_upgrade', (upgrade) => {
      if (upgrade) {
        this.appGlobalService.openPopover(upgrade);
      }
    });

    this.events.subscribe('tab.change', (data) => {
      this.zone.run(() => {
        if (data === 'LIBRARY') {
          if (this.appliedFilter) {
            this.filterIcon = './assets/imgs/ic_action_filter.png';
            this.resourceFilter = undefined;
            this.appliedFilter = undefined;
            this.isFilterApplied = false;
            this.getPopularContent();
          }
        }
      });
    });

  }

  /**
	 * Angular life cycle hooks
	 */
  ngOnInit() {
    this.setSavedContent();
    this.loadRecentlyViewedContent();
  }

  ngAfterViewInit() {
    this.events.subscribe('onboarding-card:completed', (param) => {
      this.isOnBoardingCardCompleted = param.isOnBoardingCardCompleted;
    });
  }

  ionViewWillLeave(): void {
    this.events.unsubscribe('genie.event');
  }

  /**
	 * It will fetch the guest user profile details
	 */
  getCurrentUser(): void {
    const profileType = this.appGlobalService.getGuestUserType();
    this.showSignInCard = false;
    if (profileType === ProfileType.TEACHER) {
      this.showSignInCard = this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER;
      this.audienceFilter = AudienceFilter.GUEST_TEACHER;
    } else if (profileType === ProfileType.STUDENT) {
      this.showSignInCard = this.appGlobalService.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT;
      this.audienceFilter = AudienceFilter.GUEST_STUDENT;
    }
    this.setSavedContent();
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
	 * Navigate to search page
	 *
	 * @param {string} queryParams search query params
	 */
  navigateToViewMoreContentsPageWithParams(queryParams, headerTitle): void {
    const values = new Map();
    values['SectionName'] = headerTitle;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.VIEWALL_CLICKED,
      Environment.HOME,
      this.source,
      undefined,
      values);

    queryParams = updateFilterInSearchQuery(queryParams, this.appliedFilter, this.profile, this.mode,
      this.isFilterApplied, this.appGlobalService);

    this.navCtrl.push(ViewMoreActivityPage, {
      requestParams: queryParams,
      headerTitle: headerTitle
    });
  }

  /**
	 * Get saved content
	 */
  setSavedContent() {
    // this.localResources = [];
    console.log('in setSavedContent');
    // if(this.isOnBoardingCardCompleted || !this.guestUser){
    // console.log('in setSavedContent isOnBoardingCardCompleted');
    this.showLoader = true;
    const requestParams: ContentFilterCriteria = {
      uid: this.profile ? this.profile.uid : undefined,
      contentTypes: ContentType.FOR_LIBRARY_TAB,
      audience: this.audienceFilter
    };
    this.contentService.getAllLocalContents(requestParams)
      .then(data => {
        _.forEach(data, (value) => {
          value.contentData.lastUpdatedOn = value.lastUpdatedTime;
          if (Boolean(value.isAvailableLocally) && value.basePath && value.contentData.appIcon) {
            value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
          } else if (!Boolean(value.isAvailableLocally)) {
            value.contentData.appIcon = value.contentData.appIcon;
          }
        });
        this.ngZone.run(() => {
          this.localResources = data;
          this.showLoader = false;
        });
      })
      .catch(() => {
        this.ngZone.run(() => {
          this.showLoader = false;
        });
      });
    // }
  }

  /**
	 * Load/get recently viewed content
	 */
  loadRecentlyViewedContent() {
    this.showLoader = true;
    const requestParams: ContentFilterCriteria = {
      uid: this.profile ? this.profile.uid : undefined,
      contentTypes: ContentType.FOR_RECENTLY_VIEWED,
      audience: this.audienceFilter,
      recentlyViewed: true,
      limit: 20
    };
    this.contentService.getAllLocalContents(requestParams)
      .then(data => {
        _.forEach(data, (value) => {
          value.contentData.lastUpdatedOn = value.lastUpdatedTime;
          if (Boolean(value.isAvailableLocally) && value.basePath && value.contentData.appIcon) {
            value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
          } else if (!Boolean(value.isAvailableLocally)) {
            value.contentData.appIcon = value.contentData.appIcon;
          }
        });
        this.ngZone.run(() => {
          this.recentlyViewedResources = data;
          this.showLoader = false;
        });
      })
      .catch(() => {
        this.ngZone.run(() => {
          this.showLoader = false;
        });
      });
  }

  /**
	 * Get popular content
	 */
  getPopularContent(isAfterLanguageChange = false, pageAssembleCriteria?: PageAssembleCriteria) {
    // if (this.isOnBoardingCardCompleted || !this.guestUser) {
    this.pageApiLoader = true;
    // this.noInternetConnection = false;
    const that = this;

    if (!pageAssembleCriteria) {
      const criteria = new PageAssembleCriteria();
      criteria.name = PageName.RESOURCE;
      criteria.mode = 'soft';

      if (that.appliedFilter) {
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
    console.log('pageAssembleCriteria', pageAssembleCriteria);
    this.pageService.getPageAssemble(pageAssembleCriteria)
      .then((res: any) => {
        that.ngZone.run(() => {
          const response = JSON.parse(res);
          // TODO Temporary code - should be fixed at backend
          const sections = JSON.parse(response.sections);
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
          // END OF TEMPORARY CODE
          that.storyAndWorksheets = newSections;
          this.pageLoadedSuccess = true;
          this.pageApiLoader = false;
          // this.noInternetConnection = false;
          this.generateExtraInfoTelemetry(newSections.length);
          this.checkEmptySearchResult(isAfterLanguageChange);
        });
      })
      .catch(error => {
        console.log('error while getting popular resources...', error);
        that.ngZone.run(() => {
          this.pageApiLoader = false;
          if (error === 'CONNECTION_ERROR') {
          } else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
            if (!isAfterLanguageChange) { this.commonUtilService.showToast('ERROR_FETCHING_DATA'); }
          }
        });
      });
  }

  generateExtraInfoTelemetry(sectionsCount) {
    const values = new Map();
    values['savedItemVisible'] = (this.localResources && this.localResources.length) ? 'Y' : 'N';
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
    this.generateImpressionEvent();
    this.appGlobalService.generateConfigInteractEvent(PageId.LIBRARY, this.isOnBoardingCardCompleted);
  }

  ionViewDidEnter() {
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
                description: '<img src="assets/imgs/ic_scanqrdemo.png" /><p>' + this.commonUtilService
                  .translateMessage('ONBOARD_SCAN_QR_CODE_DESC', this.appLabel) + '</p>',
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
          this.telemetryGeneratorService.generatePageViewTelemetry(PageId.ONBOARDING_QR_SHOWCASE, Environment.ONBOARDING, PageId.LIBRARY);
          this.preference.putString('show_app_walkthrough_screen', 'false');
        }
      });
  }

  ionViewWillEnter() {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
    if (this.guestUser) {
      this.getCurrentUser();
    } else {
      this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
      this.profile = this.appGlobalService.getCurrentUser();
    }

    if (!this.pageLoadedSuccess) {
      this.getPopularContent();
    }
    this.subscribeGenieEvents();
  }

  subscribeGenieEvents() {
    this.events.subscribe('genie.event', (data) => {
      console.log('subscribeGenieEvents -->', data);
      const res = JSON.parse(data);
      if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
        this.setSavedContent();
        this.loadRecentlyViewedContent();
      }
    });
  }

  /**
	 *
	 * @param refresher
	 */
  swipeDownToRefresh(refresher?) {
    if (refresher) {
      refresher.complete();
      this.telemetryGeneratorService.generatePullToRefreshTelemetry(PageId.LIBRARY, Environment.HOME);
    }

    this.storyAndWorksheets = [];
    this.setSavedContent();
    this.loadRecentlyViewedContent();
    this.guestUser = !this.appGlobalService.isUserLoggedIn();

    if (this.guestUser) {
      this.getCurrentUser();
    } else {
      this.profile = this.appGlobalService.getCurrentUser();
      this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
    }

    this.getPopularContent(false);
  }


  generateImpressionEvent() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.LIBRARY,
      Environment.HOME);
  }

  scanQRCode() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.QRCodeScanClicked,
      Environment.HOME,
      PageId.LIBRARY);
    this.qrScanner.startScanner(PageId.LIBRARY);
  }


  search() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.SEARCH_BUTTON_CLICKED,
      Environment.HOME,
      PageId.LIBRARY);
    this.navCtrl.push(SearchPage, { contentType: ContentType.FOR_LIBRARY_TAB, source: PageId.LIBRARY });
  }


  showFilter() {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.FILTER_BUTTON_CLICKED,
      Environment.HOME,
      PageId.LIBRARY, undefined);

    const that = this;
    this.pageFilterCallBack = {
      applyFilter(filter, appliedFilter) {
        const criteria = new PageAssembleCriteria();
        criteria.name = PageName.RESOURCE;
        criteria.filters = filter;
        criteria.mode = 'hard';
        that.resourceFilter = appliedFilter;
        that.appliedFilter = filter;

        let filterApplied = false;
        that.isFilterApplied = false;

        const values = new Map();
        values['filters'] = filter;
        that.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.APPLY_FILTER_CLICKED,
          Environment.HOME,
          PageId.LIBRARY_PAGE_FILTER,
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

        that.getPopularContent(false, criteria);
      }
    };

    const filterOptions = {
      callback: this.pageFilterCallBack,
      pageId: PageId.LIBRARY
    };

    // Already apllied filter
    if (this.resourceFilter) {
      filterOptions['filter'] = this.resourceFilter;
      this.showFilterPage(filterOptions);
    } else {
      this.formAndFrameworkUtilService.getLibraryFilterConfig().then((data) => {
        filterOptions['filter'] = data;
        this.showFilterPage(filterOptions);
      });
    }
  }

  showFilterPage(filterOptions) {
    this.popCtrl.create(PageFilter, filterOptions, { cssClass: 'resource-filter' }).present();
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
      if (!isAfterLanguageChange) { this.commonUtilService.showToast('NO_CONTENTS_FOUND'); }
    }
  }

  showOfflineNetworkWarning() {
    this.showWarning = true;
    setTimeout(() => {
      this.showWarning = false;
    }, 3000);
  }
  checkNetworkStatus(showRefresh = false) {
    if (this.commonUtilService.networkInfo.isNetworkAvailable && showRefresh) {
      this.swipeDownToRefresh();
    }
  }

  showDisabled(resource) {
    return !resource.isAvailableLocally && !this.commonUtilService.networkInfo.isNetworkAvailable;
  }
}
