import { Search } from './../../app/app.constant';
import {
  Component,
  NgZone,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  ContentService,
  ImpressionType,
  PageId,
  Environment,
  InteractType,
  InteractSubtype,
  SharedPreferences,
  ContentFilterCriteria,
  ProfileType,
  FrameworkService,
  CategoryRequest,
  ContentSearchCriteria,
  TelemetryObject
} from 'sunbird';
import {
  NavController,
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
  ContentCard,
  ViewMore,
  FrameworkCategory,
  CardSectionName
} from '../../app/app.constant';
import {
  PageFilterCallback
} from '../page-filter/page.filter';
import { AppGlobalService } from '../../service/app-global.service';
import Driver from 'driver.js';
import { AppVersion } from '@ionic-native/app-version';
import { updateFilterInSearchQuery } from '../../util/filter.util';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  group,
} from '@angular/animations';
import { CollectionDetailsEtbPage } from '../collection-details-etb/collection-details-etb';

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
  showWarning = false;
  localResources: Array<any>;
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
  profile: any;
  appLabel: string;
  mode = 'soft';
  isFilterApplied = false;
  pageFilterCallBack: PageFilterCallback;
  getGroupByPageReq: ContentSearchCriteria = {};

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
  refresh: boolean;
  constructor(
    public navCtrl: NavController,
    private ngZone: NgZone,
    private contentService: ContentService,
    private qrScanner: SunbirdQRScanner,
    private events: Events,
    private preference: SharedPreferences,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private commonUtilService: CommonUtilService,
    private frameworkService: FrameworkService,
    private translate: TranslateService,
    private network: Network
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
    this.defaultImg = 'assets/imgs/ic_launcher.png';
    this.generateNetworkType();
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
      this.ngZone.run(() => {
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
    this.events.unsubscribe('genie.event');
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
    this.setSavedContent();
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
  getPopularContent(isAfterLanguageChange = false, contentSearchCriteria?: ContentSearchCriteria) {
    // if (this.isOnBoardingCardCompleted || !this.guestUser) {
    this.storyAndWorksheets = [];
    this.searchApiLoader = true;
    // this.noInternetConnection = false;
    const that = this;

    if (!contentSearchCriteria) {
      const criteria = new ContentSearchCriteria();
      criteria.mode = 'hard';

      contentSearchCriteria = criteria;
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
    this.getGroupByPage(isAfterLanguageChange);
  }

  getGroupByPage(isAfterLanguageChange = false) {
    this.storyAndWorksheets = [];
    if (!this.refresh) {
      this.searchApiLoader = true;
    } else {
      this.searchApiLoader = false;
    }
    const reqvalues = new Map();
    reqvalues['pageReq'] = this.getGroupByPageReq;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
        InteractSubtype.RESOURCE_PAGE_REQUEST,
        Environment.HOME,
        this.source, undefined,
        reqvalues);
    this.contentService.getGroupByPage(this.getGroupByPageReq, this.guestUser)
      .then((response: any) => {
        this.ngZone.run(() => {
          // TODO Temporary code - should be fixed at backend
          const sections = JSON.parse(response.sections);
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

          this.storyAndWorksheets = newSections;
          const sectionInfo = {};
          for (let i = 0; i < this.storyAndWorksheets.length; i++) {
             const sectionName = this.storyAndWorksheets[i].name,
                  count = this.storyAndWorksheets[i].contents.length;
                  sectionInfo[sectionName] = count;
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
          // this.noInternetConnection = false;
          this.generateExtraInfoTelemetry(newSections.length);
          this.checkEmptySearchResult(isAfterLanguageChange);
        });
      })
      .catch(error => {
        console.log('error while getting popular resources...', error);
        this.ngZone.run(() => {
          this.refresh = false;
          this.searchApiLoader = false;
          if (error === 'CONNECTION_ERROR') {
          } else if (error === 'SERVER_ERROR' || error === 'SERVER_AUTH_ERROR') {
            if (!isAfterLanguageChange) { this.commonUtilService.showToast('ERROR_FETCHING_DATA'); }
          } else if (this.storyAndWorksheets.length === 0 && this.commonUtilService.networkInfo.isNetworkAvailable) {
            this.commonUtilService.showToast(
              this.commonUtilService.translateMessage('EMPTY_LIBRARY_TEXTBOOK_FILTER',
              `${this.getGroupByPageReq.grade} (${this.getGroupByPageReq.medium} ${this.commonUtilService.translateMessage('MEDIUM')})`));
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
    this.getCategoryData();

    this.getCurrentUser();

    if (!this.pageLoadedSuccess) {
      this.getPopularContent();
    }
    this.subscribeGenieEvents();
  }

  subscribeGenieEvents() {
    this.events.subscribe('genie.event', (data) => {
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
    this.refresh = true;
    this.storyAndWorksheets = [];

    this.getCategoryData();
    this.getCurrentUser();
    if (refresher) {
      refresher.complete();
      this.telemetryGeneratorService.generatePullToRefreshTelemetry(PageId.LIBRARY, Environment.HOME);
      this.getGroupByPage();
    } else {
          this.getPopularContent();
         }

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

  getCategoryData() {
    console.log('this.appGlobalService.getCurrentUser()', this.appGlobalService.getCurrentUser());
    const syllabus: Array<string> = this.appGlobalService.getCurrentUser().syllabus;
    const frameworkId = (syllabus && syllabus.length > 0) ? syllabus[0] : undefined;
    const categories: Array<string> = FrameworkCategory.DEFAULT_FRAMEWORK_CATEGORIES;
    this.getMediumData(frameworkId, categories);
    this.getGradeLevelData(frameworkId, categories);
  }

  getMediumData(frameworkId, categories): any {
    const req: CategoryRequest = {
      currentCategory: FrameworkCategory.MEDIUM,
      frameworkId: frameworkId,
      selectedLanguage: this.translate.currentLang,
      categories: categories
    };
    this.frameworkService.getCategoryData(req)
      .then(res => {
        const category = JSON.parse(res);
        this.categoryMediums = category.terms;
        this.arrangeMediumsByUserData(this.categoryMediums.map(a => ({ ...a })));
      })
      .catch(err => {
        console.log('Something went wrong!');
      });
  }


  findWithAttr(array, attr, value) {
    for (let i = 0; i < array.length; i += 1) {
      console.log(array[i][attr]);
      if (array[i][attr].toLowerCase() === value.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

  arrangeMediumsByUserData(categoryMediumsParam) {
    console.log('categoryMediums ========', categoryMediumsParam);
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
    const req: CategoryRequest = {
      currentCategory: FrameworkCategory.GRADE_LEVEL,
      frameworkId: frameworkId,
      selectedLanguage: this.translate.currentLang,
      categories: categories
    };
    this.frameworkService.getCategoryData(req)
      .then(res => {
        const category = JSON.parse(res);
        this.categoryGradeLevels = category.terms;
        for (let i = 0, len = this.categoryGradeLevels.length; i < len; i++) {
          if (this.getGroupByPageReq.grade[0] === this.categoryGradeLevels[i].name) {
            this.classClick(i);
          }
        }
      })
      .catch(err => {
        console.log('Something went wrong!');
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

  classClick(index) {
    this.getGroupByPageReq.grade = [this.categoryGradeLevels[index].name];
    // [grade.name];
    if ((this.currentGrade) && (this.currentGrade.name !== this.categoryGradeLevels[index].name)) {
      this.getGroupByPage();
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
    document.getElementById('gradeScroll').scrollTo({ top: 0, left: index * 60, behavior: 'smooth' });
  }
  mediumClick(mediumName: string) {
    this.getGroupByPageReq.medium = [mediumName];
    if (this.currentMedium !== mediumName) {
      this.getGroupByPage();
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
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.type = item.contentType;

    telemetryObject.id = identifier;

    const values = new Map();
    values['sectionName'] = sectionName;
    values['positionClicked'] = index;
    console.log('telemetryObject ', telemetryObject);
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      'home',
      'library',
      telemetryObject,
      values);

    this.navCtrl.push(CollectionDetailsEtbPage, {
      content: item
    });
  }
}
