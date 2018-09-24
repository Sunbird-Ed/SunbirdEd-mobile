import { Component, NgZone, ViewChild } from "@angular/core";
import { IonicPage, NavParams, NavController, Events, Popover, Navbar, Platform } from "ionic-angular";
import {
  ContentService, ContentSearchCriteria,
  LogLevel, ImpressionType, Environment,
  InteractType, InteractSubtype,
  ContentDetailRequest, FileUtil, ProfileType, CorrelationData, Mode, TelemetryObject
} from "sunbird";
import { GenieResponse } from "../settings/datasync/genieresponse";
import { FilterPage } from "./filters/filter";
import { CollectionDetailsPage } from "../collection-details/collection-details";
import { ContentDetailsPage } from "../content-details/content-details";
import { Network } from "@ionic-native/network";
import { Map } from "../../app/telemetryutil";
import * as _ from 'lodash';
import { ContentType, MimeType, Search, AudienceFilter } from '../../app/app.constant';
import { EnrolledCourseDetailsPage } from "../enrolled-course-details/enrolled-course-details";
import { AppGlobalService } from "../../service/app-global.service";
import { PopoverController } from "ionic-angular";
import { QRAlertCallBack, QRScannerAlert } from "../qrscanner/qrscanner_alert";
import { FormAndFrameworkUtilService } from "../profile/formandframeworkutil.service";
import { CommonUtilService } from "../../service/common-util.service";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { QrCodeResultPage } from "../qr-code-result/qr-code-result";

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

  showLoader: boolean = false;

  filterIcon;

  searchKeywords: string = ""

  responseData: any;

  isDialCodeSearch = false;

  showEmptyMessage: boolean;

  defaultAppIcon: string;

  isEmptyResult: boolean = false;

  queuedIdentifiers = [];

  isDownloadStarted: boolean = false;

  currentCount: number = 0;

  parentContent: any = undefined;

  childContent: any = undefined;

  loadingDisplayText: string = "Loading content";

  audienceFilter = [];

  private corRelationList: Array<CorrelationData>;

  profile: any;

  isFirstLaunch: boolean = false;
  shouldGenerateEndTelemetry: boolean = false;
  backButtonFunc = undefined;

  @ViewChild(Navbar) navBar: Navbar;
  constructor(
    private contentService: ContentService,
    private navParams: NavParams,
    private navCtrl: NavController,
    private zone: NgZone,
    private event: Events,
    private network: Network,
    private fileUtil: FileUtil,
    private events: Events,
    private appGlobal: AppGlobalService,
    private popUp: PopoverController,
    private platform: Platform,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {

    this.checkUserSession();

    this.isFirstLaunch = true;

    this.init();

    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
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
    this.navBar.backButtonClick = () => {
      this.handleNavBackButton();
    }
  }

  handleNavBackButton() {
    if (this.shouldGenerateEndTelemetry) {
      this.generateQRSessionEndEvent(this.source, this.dialCode);
    }
    this.navCtrl.pop();
    this.backButtonFunc();
  }


  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.dialCode);
      }
      this.backButtonFunc();
    }, 10)
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
      // this.navCtrl.push(EnrolledCourseDetailsPage, {'content': content});
      this.showContentDetails(content);
    }
  }


  ionViewWillLeave(): void {
    this.events.unsubscribe('genie.event');
  }

  showContentDetails(content, isRootContent: boolean = false) {

    let params;
    if (this.shouldGenerateEndTelemetry) {
      params = {
        content: content,
        corRelation: this.corRelationList,
        source: this.source,
        shouldGenerateEndTelemetry: this.shouldGenerateEndTelemetry,
        parentContent: this.parentContent
      };
    } else {
      params = {
        content: content,
        corRelation: this.corRelationList,
        parentContent: this.parentContent
      };
    }

    if (content.contentType === ContentType.COURSE) {
      this.navCtrl.push(EnrolledCourseDetailsPage, params)
    } else if (content.mimeType === MimeType.COLLECTION) {
      if (this.isDialCodeSearch && !isRootContent) {
        this.navCtrl.push(QrCodeResultPage, params);
      } else {
        this.navCtrl.push(CollectionDetailsPage, params);
      }
    } else {
      this.navCtrl.push(ContentDetailsPage, params)
    }
  }

  showFilter() {
    this.formAndFrameworkUtilService.getLibraryFilterConfig().then((data) => {
      let filterCriteriaData = this.responseData.result.filterCriteria;
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
    this.responseData.result.filterCriteria.mode = "hard";

    this.contentService.searchContent(this.responseData.result.filterCriteria, true, false, false, (responseData) => {

      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
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

          }
          this.updateFilterIcon();
        } else {
          this.isEmptyResult = true;
        }
        this.showLoader = false;
      });
    }, (error) => {
      console.log("Error : " + JSON.stringify(error));
      this.zone.run(() => {
        this.showLoader = false;
      })
    });
  }

  searchOnChange() {
  }

  handleSearch() {
    if (this.searchKeywords.length < 3) {
      return;
    }

    this.showLoader = true;

    (<any>window).cordova.plugins.Keyboard.close()

    let contentSearchRequest: ContentSearchCriteria = {
      query: this.searchKeywords,
      contentTypes: this.contentType,
      facets: Search.FACETS,
      audience: this.audienceFilter,
      mode: "soft"
    }

    this.isDialCodeSearch = false;

    this.dialCodeContentResult = undefined;
    this.dialCodeResult = undefined;

    if (this.profile) {

      if (this.profile.board && this.profile.board.length) {
        contentSearchRequest.board = this.applyProfileFilter(this.profile.board, contentSearchRequest.board, "board");
      }

      if (this.profile.medium && this.profile.medium.length) {
        contentSearchRequest.medium = this.applyProfileFilter(this.profile.medium, contentSearchRequest.medium, "medium");
      }

      if (this.profile.grade && this.profile.grade.length) {
        contentSearchRequest.grade = this.applyProfileFilter(this.profile.grade, contentSearchRequest.grade, "gradeLevel");
      }

    }

    this.contentService.searchContent(contentSearchRequest, false, false, false, (responseData) => {

      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {
          this.addCorRelation(response.result.responseMessageId, "API");
          this.searchContentResult = response.result.contentDataList;
          this.updateFilterIcon();

          this.isEmptyResult = false;


          this.generateLogEvent(response.result);
        } else {
          this.isEmptyResult = true;
        }
        this.showEmptyMessage = this.searchContentResult.length === 0 ? true : false;
        this.showLoader = false;
      });
    }, (error) => {
      console.log("Error : " + JSON.parse(error));
      this.zone.run(() => {
        this.showLoader = false;
        if (this.network.type === 'none') {
          this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
        }
      })
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

   init() {
    this.dialCode = this.navParams.get('dialCode');
    this.contentType = this.navParams.get('contentType');
    this.source = this.navParams.get('source');
    this.corRelationList = this.navParams.get('corRelation');
    this.source = this.navParams.get('source');
    this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
    this.generateImpressionEvent();
    if (this.dialCode !== undefined && this.dialCode.length > 0) {
      this.getContentForDialCode()
    }

    this.event.subscribe('search.applyFilter', (filterCriteria) => {
      this.responseData.result.filterCriteria = filterCriteria;
      this.applyFilter();
    });
  }

  getContentForDialCode() {
    if (this.dialCode == undefined || this.dialCode.length == 0) {
      return
    }

    this.isDialCodeSearch = true;

    this.showLoader = true;
    this.contentType = ContentType.FOR_DIAL_CODE_SEARCH;

    let isOfflineSearch = false;

    if (this.network.type === 'none') {
      isOfflineSearch = true;
    }

    let contentSearchRequest: ContentSearchCriteria = {
      dialCodes: [this.dialCode],
      mode: "collection",
      facets: Search.FACETS,
      contentTypes: this.contentType,
      offlineSearch: isOfflineSearch
    }

    this.contentService.searchContent(contentSearchRequest, false, true, !this.appGlobal.isUserLoggedIn(), (responseData) => {
      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {
          this.addCorRelation(response.result.responseMessageId, "API");
          this.processDialCodeResult(response.result);
          this.updateFilterIcon();
        }

        this.showLoader = false;
      })
    }, () => {
      this.zone.run(() => {
        this.showLoader = false;
        if (this.network.type === 'none') {
          this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
        }
      });
    });
  }

  private addCorRelation(id: string, type: string) {
    if (this.corRelationList === undefined || this.corRelationList === null) {
      this.corRelationList = new Array<CorrelationData>();
    }
    let corRelation: CorrelationData = new CorrelationData();
    corRelation.id = id;
    corRelation.type = type;
    this.corRelationList.push(corRelation);
  }
  private generateImpressionEvent() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.SEARCH, "",
      this.source,
      Environment.HOME, "", "", "",
      undefined,
      this.corRelationList);
  }

  private generateLogEvent(searchResult) {
    if (searchResult != null) {
      let contentArray: Array<any> = searchResult.contentDataList;
      let params = new Array<any>();
      let paramsMap = new Map();
      paramsMap["SearchResults"] = contentArray.length;
      paramsMap["SearchCriteria"] = searchResult.request;
      params.push(paramsMap);
      this.telemetryGeneratorService.generateLogEvent(LogLevel.INFO,
        this.source,
        Environment.HOME,
        ImpressionType.SEARCH,
        params);
    }
  }

  generateInteractEvent(identifier, contentType, pkgVersion, index) {
    let values = new Map();
    values["SearchPhrase"] = this.searchKeywords;
    values["PositionClicked"] = index;

    let telemetryObject: TelemetryObject = new TelemetryObject();
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
      let telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      telemetryObject.version = "";
      this.telemetryGeneratorService.generateEndTelemetry(
        "qr",
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject,
        undefined,
        this.corRelationList);
    }
  }

  processDialCodeResult(searchResult) {
    let collectionArray: Array<any> = searchResult.collectionDataList;
    let contentArray: Array<any> = searchResult.contentDataList;

    this.dialCodeResult = [];
    let addedContent = new Array<any>();

    if (collectionArray && collectionArray.length > 0) {
      collectionArray.forEach((collection) => {
        contentArray.forEach((content) => {
          if (collection.childNodes.includes(content.identifier)) {
            if (collection.content == undefined) {
              collection.content = [];
            }
            collection.content.push(content);
            addedContent.push(content.identifier);
          }
        })
        this.dialCodeResult.push(collection);
      })
    }

    this.dialCodeContentResult = [];

    let isParentCheckStarted = false;

    let isAllContentMappedToCollection = contentArray.length == addedContent.length;

    if (this.dialCodeResult.length == 1 && this.dialCodeResult[0].content.length == 1 && isAllContentMappedToCollection) {
      this.parentContent = this.dialCodeResult[0];
      this.childContent = this.dialCodeResult[0].content[0];
      this.checkParent(this.dialCodeResult[0], this.dialCodeResult[0].content[0]);
      isParentCheckStarted = true;
    }

    if (contentArray && contentArray.length > 1) {
      contentArray.forEach((content) => {
        if (addedContent.indexOf(content.identifier) < 0) {
          this.dialCodeContentResult.push(content);
        }
      })
    }

    if (contentArray && contentArray.length == 1 && !isParentCheckStarted) {
      this.navCtrl.pop();
      this.showContentDetails(contentArray[0]);
      return;
    }

    if (this.dialCodeResult.length == 0 && this.dialCodeContentResult.length == 0) {
      this.navCtrl.pop();
      if (this.shouldGenerateEndTelemetry) {
        this.generateQRSessionEndEvent(this.source, this.dialCode);
      }
      this.showContentComingSoonAlert();
    } else {
      this.isEmptyResult = false;
    }
  }

  showContentComingSoonAlert() {
    let popOver: Popover;
    const callback: QRAlertCallBack = {
      tryAgain() {
        popOver.dismiss()
      },
      cancel() {
        popOver.dismiss()
      }
    }
    popOver = this.popUp.create(QRScannerAlert, {
      callback: callback,
      icon: "./assets/imgs/ic_coming_soon.png",
      messageKey: "CONTENT_COMING_SOON",
      cancelKey: "hide",
      tryAgainKey: "DONE",
    }, {
        cssClass: 'qr-alert'
      });

    setTimeout(() => {
      popOver.present();
    }, 300)

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
        })
      }
    });

    if (isFilterApplied) {
      this.filterIcon = "./assets/imgs/ic_action_filter_applied.png";
    } else {
      this.filterIcon = "./assets/imgs/ic_action_filter.png"
    }
  }

  checkParent(parent, child) {
    let identifier = parent.identifier
    let contentRequest: ContentDetailRequest = {
      contentId: identifier
    }

    this.contentService.getContentDetail(contentRequest, (data: any) => {
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
    }
    // Call content service
    this.contentService.importContent(option, (data: any) => {
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
          if (this.network.type != 'none') {
            this.commonUtilService.showToast('ERROR_CONTENT_NOT_AVAILABLE');
          } else {
            this.commonUtilService.showToast('ERROR_OFFLINE_MODE');
          }
        }
      });
    }, () => {
    });
  }

  /**
 * Subscribe genie event to get content download progress
 */
  subscribeGenieEvent() {
    this.events.subscribe('genie.event', (data) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        let res = data;

        if (res.type === 'downloadProgress' && res.data.downloadProgress) {
          this.downloadProgress = res.data.downloadProgress === -1 ? 0 : res.data.downloadProgress;
          this.loadingDisplayText = "Loading content " + this.downloadProgress + " %";

          if (this.downloadProgress === 100) {
            // this.showLoading = false;
            this.loadingDisplayText = "Loading content "
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
    let requestParams = [];
    _.forEach(identifiers, (value) => {
      requestParams.push({
        isChildContent: isChild,
        // TODO - check with Anil for destination folder path
        destinationFolder: this.fileUtil.internalStoragePath(),
        contentId: value,
        correlationData: this.corRelationList !== undefined ? this.corRelationList : []
      })
    });

    return requestParams;
  }

  cancelDownload() {
    this.contentService.cancelDownload(this.parentContent.identifier, () => {
      this.zone.run(() => {
        this.showLoading = false;
      });
    }, () => {
      this.zone.run(() => {
        this.showLoading = false;
      });
    });
  }

  checkUserSession() {

    let isGuestUser = !this.appGlobal.isUserLoggedIn();

    if (isGuestUser) {
      let userType = this.appGlobal.getGuestUserType();
      if (userType == ProfileType.STUDENT) {
        this.audienceFilter = AudienceFilter.GUEST_STUDENT;
      } else if (userType == ProfileType.TEACHER) {
        this.audienceFilter = AudienceFilter.GUEST_TEACHER;
      }

      this.profile = this.appGlobal.getCurrentUser();
    } else {
      this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
      this.profile = undefined;
    }
  }

}
