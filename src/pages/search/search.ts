import {
  Component,
  NgZone,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  Events,
  Navbar,
  Platform
} from 'ionic-angular';
import {
  ContentService,
  ContentSearchCriteria,
  LogLevel,
  ImpressionType,
  Environment,
  InteractType,
  InteractSubtype,
  ContentDetailRequest,
  FileUtil,
  ProfileType,
  CorrelationData,
  Mode,
  TelemetryObject,
  PageId,
  TabsPage,
  PageAssembleCriteria,
  PageAssembleFilter,
  PageAssembleService,
  SharedPreferences
} from 'sunbird';
import { GenieResponse } from '../settings/datasync/genieresponse';
import { FilterPage } from './filters/filter';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { Map } from '../../app/telemetryutil';
import * as _ from 'lodash';
import {
  ContentType,
  MimeType,
  Search,
  AudienceFilter,
  PageName,
  PreferenceKey
} from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { AppGlobalService } from '../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { QrCodeResultPage } from '../qr-code-result/qr-code-result';
import { TranslateService } from '@ngx-translate/core';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: './search.html'
})
export class SearchPage {

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

  displayDialCodeResult: any;

  private corRelationList: Array<CorrelationData>;

  profile: any;

  isFirstLaunch = false;
  shouldGenerateEndTelemetry = false;
  backButtonFunc = undefined;
  isSingleContent = false;
  currentFrameworkId = '';
  selectedLanguageCode = '';

  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    private contentService: ContentService,
    private pageService: PageAssembleService,
    private navParams: NavParams,
    private navCtrl: NavController,
    private zone: NgZone,
    private event: Events,
    private fileUtil: FileUtil,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private platform: Platform,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private preference: SharedPreferences,
    private translate: TranslateService
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
    const telemetryObject: TelemetryObject = new TelemetryObject();
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
    this.events.unsubscribe('genie.event');
    if (this.backButtonFunc) {
      this.backButtonFunc();
    }
  }

  getFrameworkId() {
    this.preference.getString('current_framework_id')
      .then(value => {
        this.currentFrameworkId = value;

      })
      .catch((err: any) => {
        console.error('Err', err);
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

        if (this.isSingleContent) {
          this.isSingleContent = false;
          this.navCtrl.pop();
        }
        this.navCtrl.push(QrCodeResultPage, params);
      } else {
        this.navCtrl.push(CollectionDetailsPage, params);
      }
    } else {
      this.navCtrl.push(ContentDetailsPage, params);
    }
  }

  showFilter() {
    this.formAndFrameworkUtilService.getLibraryFilterConfig().then((data) => {
      const filterCriteriaData = this.responseData.result.filterCriteria;
      filterCriteriaData.facetFilters.forEach(element => {
        data.forEach(item => {
          if (element.name === item.code) {
            element.translatedName = this.commonUtilService.getTranslatedValue(item.translations, item.name);
            return;
          }
        });
      });
      this.navCtrl.push(FilterPage, { filterCriteria: this.responseData.result.filterCriteria });
    });
  }

  applyFilter() {
    this.showLoader = true;
    this.responseData.result.filterCriteria.mode = 'hard';

    this.contentService.searchContent(this.responseData.result.filterCriteria, true, false, false).then((responseData: any) => {

      this.zone.run(() => {
        const response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {

          if (this.isDialCodeSearch) {
            this.processDialCodeResult(response.result);
          } else {
            this.searchContentResult = response.result.contentDataList;

            if (this.searchContentResult && this.searchContentResult.length > 0) {
              this.isEmptyResult = false;
            } else {
              this.isEmptyResult = true;
            }
            const values = new Map();
            values['from'] = this.source;
            values['searchCount'] = this.responseData.length;
            values['searchCriteria'] = this.responseData.result.filterCriteria;
            this.telemetryGeneratorService.generateExtraInfoTelemetry(values, PageId.SEARCH);
          }
          this.updateFilterIcon();
        } else {
          this.isEmptyResult = true;
        }
        this.showLoader = false;
      });
    }).catch((error) => {
      console.log('Error : ' + JSON.stringify(error));
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

    this.contentService.searchContent(contentSearchRequest, false, false, false).then((responseData: any) => {

      this.zone.run(() => {
        const response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {

          this.addCorRelation(response.result.responseMessageId, 'API');
          this.searchContentResult = response.result.contentDataList;
          this.updateFilterIcon();

          this.isEmptyResult = false;


          this.generateLogEvent(response.result);
          const values = new Map();
          values['from'] = this.source;
          values['searchCount'] = this.searchContentResult.length;
          values['searchCriteria'] = response.result.request;
          this.telemetryGeneratorService.generateExtraInfoTelemetry(values, PageId.SEARCH);
        } else {
          this.isEmptyResult = true;
        }
        this.showEmptyMessage = this.searchContentResult.length === 0 ? true : false;
        this.showLoader = false;
      });
    }).catch((error) => {
      console.log('Error : ' + JSON.parse(error));
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
      this.responseData.result.filterCriteria = filterCriteria;
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
    const pagetAssemblefilter = new PageAssembleFilter();
    pagetAssemblefilter.dialcodes = this.dialCode;

    const pageAssembleCriteria = new PageAssembleCriteria();
    pageAssembleCriteria.name = PageName.DIAL_CODE;
    pageAssembleCriteria.filters = pagetAssemblefilter;

    this.pageService.getPageAssemble(pageAssembleCriteria).then((res: any) => {
      this.zone.run(() => {
        const response = JSON.parse(res);
        const sections = JSON.parse(response.sections);
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

  generateInteractEvent(identifier, contentType, pkgVersion, index) {
    const values = new Map();
    values['SearchPhrase'] = this.searchKeywords;
    values['PositionClicked'] = index;

    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = identifier;
    telemetryObject.type = contentType;
    telemetryObject.version = pkgVersion;

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
      const telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      telemetryObject.version = '';
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

    if (!this.responseData.result.filterCriteria) {
      return;
    }

    this.responseData.result.filterCriteria.facetFilters.forEach(facet => {
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

    this.contentService.getContentDetail(contentRequest)
      .then((data: any) => {
        data = JSON.parse(data);
        if (data && data.result) {
          if (data.result.isAvailableLocally) {
            this.zone.run(() => { this.showContentDetails(child); });
          } else {
            this.subscribeGenieEvent();
            this.downloadParentContent(parent);
          }
        } else {
          this.zone.run(() => { this.showContentDetails(child); });
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

    const option = {
      contentImportMap: _.extend({}, this.getImportContentRequestBody([parent.identifier], false)),
      contentStatusArray: []
    };
    // Call content service
    this.contentService.importContent(option)
      .then((data: any) => {
        this.zone.run(() => {
          data = JSON.parse(data);

          if (data.result && data.result.length && this.isDownloadStarted) {
            _.forEach(data.result, (value) => {
              if (value.status === 'ENQUEUED_FOR_DOWNLOAD') {
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
  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        const res = data;

        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
          this.loadingDisplayText = 'Loading content ' + this.downloadProgress + ' %';

          if (this.downloadProgress === 100) {
            // this.showLoading = false;
            this.loadingDisplayText = 'Loading content ';
          }
        }

        if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
          if (this.queuedIdentifiers.length && this.isDownloadStarted) {
            if (_.includes(this.queuedIdentifiers, res.data.identifier)) {
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
    });
  }

  /**
  * Function to get import content api request params
  *
  * @param {Array<string>} identifiers contains list of content identifier(s)
  * @param {boolean} isChild
  */
  getImportContentRequestBody(identifiers: Array<string>, isChild: boolean) {
    const requestParams = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        // TODO - check with Anil for destination folder path
        destinationFolder: this.fileUtil.internalStoragePath(),
        contentId: value,
        correlationData: this.corRelationList !== undefined ? this.corRelationList : []
      });
    });

    return requestParams;
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.parentContent.identifier).then(() => {
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

}
