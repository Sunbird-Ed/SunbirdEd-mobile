import {Component, Inject, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {Events, IonicPage, Navbar, NavController, NavParams, Platform} from 'ionic-angular';
import {CorrelationData, TabsPage} from 'sunbird';
import {
  Content,
  ContentDetailRequest,
  ContentEventType,
  ContentImport,
  ContentImportRequest,
  ContentImportResponse,
  ContentImportStatus,
  ContentSearchCriteria,
  ContentSearchResult,
  ContentService,
  DownloadEventType,
  DownloadProgress,
  EventsBusEvent,
  EventsBusService,
  PageAssembleCriteria,
  PageAssembleFilter,
  PageAssembleService,
  PageName,
  ProfileType,
  SearchType,
  SharedPreferences,
  TelemetryObject
} from 'sunbird-sdk';
import {FilterPage} from './filters/filter';
import {CollectionDetailsEtbPage} from '../collection-details-etb/collection-details-etb';
import {ContentDetailsPage} from '../content-details/content-details';
import {Map} from '../../app/telemetryutil';
import * as _ from 'lodash';
import {AudienceFilter, ContentType, MimeType, Search} from '../../app/app.constant';
import {EnrolledCourseDetailsPage} from '../enrolled-course-details/enrolled-course-details';
import {AppGlobalService} from '../../service/app-global.service';
import {FormAndFrameworkUtilService} from '../profile/formandframeworkutil.service';
import {CommonUtilService} from '../../service/common-util.service';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {QrCodeResultPage} from '../qr-code-result/qr-code-result';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  LogLevel,
  Mode,
  PageId
} from '../../service/telemetry-constants';

declare const cordova;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: './search.html'
})
export class SearchPage implements  OnDestroy {

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

  childContent: any = undefined;

  loadingDisplayText = 'Loading content';

  audienceFilter = [];

  eventSubscription?: Subscription;

  displayDialCodeResult: any;
  profile: any;
  isFirstLaunch = false;
  shouldGenerateEndTelemetry = false;
  backButtonFunc = undefined;
  isSingleContent = false;
  currentFrameworkId = '';
  selectedLanguageCode = '';
  @ViewChild(Navbar) navBar: Navbar;
  private corRelationList: Array<CorrelationData>;

  constructor(
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
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
    @Inject('PAGE_ASSEMBLE_SERVICE') private pageService: PageAssembleService,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences
  ) {

    this.checkUserSession();

    this.isFirstLaunch = true;

    this.init();

    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
    this.getFrameworkId();
    this.selectedLanguageCode = this.translate.currentLang;
  }

  ionViewWillEnter() {
    this.handleDeviceBackButton();
    // const telemetryObject = new TelemetryObject();
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
    this.navBar.backButtonClick = () => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(ImpressionType.SEARCH,
        Environment.HOME, true, undefined, this.corRelationList);
      this.navigateToPreviousPage();
    };
  }

  ionViewWillLeave() {
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }
    if  (this.eventSubscription)  {
      this.eventSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    if  (this.eventSubscription)  {
      this.eventSubscription.unsubscribe();
    }
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
      if (this.source === PageId.USER_TYPE_SELECTION && this.appGlobalService.isOnBoardingCompleted) {
        if (this.appGlobalService.isProfileSettingsCompleted || !this.appGlobalService.DISPLAY_ONBOARDING_CATEGORY_PAGE) {
          this.navCtrl.setRoot(TabsPage, {
            loginMode: 'guest'
          });
        } else {
          this.navCtrl.setRoot('ProfileSettingsPage', {isCreateNavigationStack: false, hideBackButton: true});
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
    // TODO: Add mimeType check
    // this.navCtrl.push(EnrolledCourseDetailsPage, {'content': collection})
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
      this.showContentDetails(content, true);
    }
  }

  showContentDetails(content, isRootContent: boolean = false) {

    let params;
    if (this.shouldGenerateEndTelemetry) {
      params = {
        content: content,
        corRelation: this.corRelationList,
        source: this.source,
        shouldGenerateEndTelemetry: this.shouldGenerateEndTelemetry,
        parentContent: this.parentContent,
        isSingleContent: this.isSingleContent,
        onboarding: this.appGlobalService.isOnBoardingCompleted
      };
    } else {
      params = {
        content: content,
        corRelation: this.corRelationList,
        parentContent: this.parentContent,
        isSingleContent: this.isSingleContent,
        onboarding: this.appGlobalService.isOnBoardingCompleted
      };
    }

    if (this.isDialCodeSearch && !this.appGlobalService.isOnBoardingCompleted && (this.parentContent || content)) {
      this.appGlobalService.setOnBoardingCompleted();
    }

    if (content.contentType === ContentType.COURSE) {
      this.navCtrl.push(EnrolledCourseDetailsPage, params);
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

  showFilter() {
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
      this.navCtrl.push(FilterPage, {filterCriteria: this.responseData.filterCriteria});
    });
  }

  applyFilter() {
    this.showLoader = true;
    this.responseData.filterCriteria.mode = 'hard';
    this.responseData.filterCriteria.searchType = SearchType.FILTER;

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
          this.showLoader = false;
        });
      }).catch(() => {
      this.zone.run(() => {
        this.showLoader = false;
      });
    });
  }

  handleSearch() {
    if (this.searchKeywords.length < 3) {
      return;
    }

    this.showLoader = true;

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

    if (this.profile) {

      if (this.profile.board && this.profile.board.length) {
        contentSearchRequest.board = this.applyProfileFilter(this.profile.board, contentSearchRequest.board, 'board');
      }

      if (this.profile.medium && this.profile.medium.length) {
        contentSearchRequest.medium = this.applyProfileFilter(this.profile.medium, contentSearchRequest.medium, 'medium');
      }

      if (this.profile.grade && this.profile.grade.length) {
        contentSearchRequest.grade = this.applyProfileFilter(this.profile.grade, contentSearchRequest.grade, 'gradeLevel');
      }

    }

    this.contentService.searchContent(contentSearchRequest).toPromise()
      .then((response: ContentSearchResult) => {

        this.zone.run(() => {
          this.responseData = response;
          if (response) {

            this.addCorRelation(response.responseMessageId, 'API');
            this.searchContentResult = response.contentDataList;
            this.updateFilterIcon();

            this.isEmptyResult = false;


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
        });
      }).catch(() => {
      this.zone.run(() => {
        this.showLoader = false;
        if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
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

  init() {
    this.dialCode = this.navParams.get('dialCode');
    this.contentType = this.navParams.get('contentType');
    this.corRelationList = this.navParams.get('corRelation');
    this.source = this.navParams.get('source');
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

  getContentForDialCode() {
    if (this.dialCode === undefined || this.dialCode.length === 0) {
      return;
    }

    this.isDialCodeSearch = true;

    this.showLoader = true;
    this.contentType = ContentType.FOR_DIAL_CODE_SEARCH;

    let isOfflineSearch = false;

    if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
      isOfflineSearch = true;
    }

    // Page API START
    const pagetAssemblefilter: PageAssembleFilter = {};
    pagetAssemblefilter.dialcodes = this.dialCode;

    const pageAssembleCriteria: PageAssembleCriteria = {
      name: PageName.DIAL_CODE,
      filters: pagetAssemblefilter,
      source: 'app'
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
          this.showLoader = false;
        });
      }).catch(error => {
      this.zone.run(() => {
        this.showLoader = false;
        if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
        }
      });
    });
    // Page API END
  }

  generateInteractEvent(identifier, contentType, pkgVersion, index) {
    const values = new Map();
    values['SearchPhrase'] = this.searchKeywords;
    values['PositionClicked'] = index;

    const telemetryObject = new TelemetryObject(identifier, contentType, pkgVersion);

    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.CONTENT_CLICKED,
      Environment.HOME,
      this.source,
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
        dialCodeResult: [],
        dialCodeContentResult: []
      };
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
          dialCodeResultObj['name'] = searchResult.name;
        });
        // displayDialCodeResult[searchResult.name] = dialCodeResult;
        displayDialCodeResult.push(dialCodeResultObj);
      }
      const dialCodeContentResult = [];
      let isAllContentMappedToCollection = false;
      if (contentArray) {
        isAllContentMappedToCollection = contentArray.length === addedContent.length;
      }
      if (contentArray && contentArray.length > 1) {
        contentArray.forEach((content) => {
          if (addedContent.indexOf(content.identifier) < 0) {
            dialCodeContentResult.push(content);
          }
        });
      }
      dialCodeResultObj.dialCodeContentResult = dialCodeContentResult;
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
    console.log('this.displayDialCodeResult', this.displayDialCodeResult);
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
      Environment.HOME,
      PageId.SEARCH,
      undefined,
      values
    );
  }

  updateFilterIcon() {
    let isFilterApplied = false;

    if (this.isEmptyResult) {
      this.filterIcon = undefined;
    }

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
          }
        } else {
          this.zone.run(() => {
            this.showContentDetails(child);
          });
        }
      }, () => {
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
      contentStatusArray: []
    };
    // Call content service
    this.contentService.importContent(option).toPromise()
      .then((data: ContentImportResponse[]) => {
        this.zone.run(() => {

          if (data && data.length && this.isDownloadStarted) {
            _.forEach(data, (value) => {
              if (value.status === ContentImportStatus.ENQUEUED_FOR_DOWNLOAD) {
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
      .catch(() => {
      });
  }

  /**
   * Subscribe genie event to get content download progress
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

        // if (event.payload && event.payload.status === 'IMPORT_COMPLETED' && event.type === 'contentImport') {
          if (event.payload && event.type === ContentEventType.IMPORT_COMPLETED) {
            if (this.queuedIdentifiers.length && this.isDownloadStarted) {
              if (_.includes(this.queuedIdentifiers, event.payload.contentId)) {
                this.currentCount++;
              }
              if (this.queuedIdentifiers.length === this.currentCount) {
                this.showLoading = false;
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

      // TODO : revisit for refactoring
      this.profile = undefined;
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
      this.source,
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

}
