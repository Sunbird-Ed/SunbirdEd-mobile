import { Component, NgZone, Input, ViewChild } from "@angular/core";
import { IonicPage, NavParams, NavController, Events, ToastController } from "ionic-angular";
import { ContentService, ContentSearchCriteria, Log, LogLevel, TelemetryService, Impression, ImpressionType, Environment, Interact, InteractType, InteractSubtype } from "sunbird";
import { GenieResponse } from "../settings/datasync/genieresponse";
import { FilterPage } from "./filters/filter";
import { CourseDetailPage } from "../course-detail/course-detail";
import { CollectionDetailsPage } from "../collection-details/collection-details";
import { ContentDetailsPage } from "../content-details/content-details";
import { Network } from "@ionic-native/network";
import { TranslateService } from '@ngx-translate/core';


class CMap {
  [key: string]: any
}
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: './search.html'
})


export class SearchPage {


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

  constructor(private contentService: ContentService,
    private telemetryService: TelemetryService,
    private navParams: NavParams,
    private navCtrl: NavController,
    private zone: NgZone,
    private event: Events,
    private network: Network,
    private toastCtrl: ToastController,
    private translate: TranslateService) {
    this.init();

    console.log("Network Type : " + this.network.type);
    this.defaultAppIcon = 'assets/imgs/ic_launcher.png';
  }

  ionViewDidEnter() {
    if (!this.dialCode && this.searchContentResult.length == 0) {
      setTimeout(() => {
        this.searchBar.setFocus();
      }, 100);
    }
  }


  openCollection(collection) {
    // TODO: Add mimeType check
    // this.navCtrl.push(CourseDetailPage, {'content': collection})
    this.showContentDetails(collection);
  }


  openContent(collection, content, index) {
    this.generateInteractEvent(content.identifier, content.contentType, content.pkgVersion, index);
    if (collection !== undefined) {
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      // this.navCtrl.push(CourseDetailPage, {'content': content});
      this.showContentDetails(content);
    }
  }




  showContentDetails(content) {
    if (content.contentType === 'Course') {
      console.log('Calling course details page');
      this.navCtrl.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
      console.log('Calling collection details page');
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      console.log('Calling content details page');
      this.navCtrl.push(ContentDetailsPage, {
        content: content
      })
    }
  }

  showFilter() {
    this.navCtrl.push(FilterPage, { filterCriteria: this.responseData.result.filterCriteria });
  }

  applyFilter() {
    this.showLoader = true;
    this.contentService.searchContent(this.responseData.result.filterCriteria, true, (responseData) => {

      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {

          if (this.isDialCodeSearch) {
            this.processDialCodeResult(response.result);
          } else {
            this.searchContentResult = response.result.contentDataList;
            this.isEmptyResult = false;
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

  searchOnChange(event) {
    console.log("Search keyword " + this.searchKeywords);
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
      facets: ["language", "grade", "domain", "contentType", "subject", "medium"]
    }

    this.isDialCodeSearch = false;

    this.contentService.searchContent(contentSearchRequest, false, (responseData) => {

      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {
          this.searchContentResult = response.result.contentDataList;
          this.updateFilterIcon();

          this.isEmptyResult = false;

          this.generateImpressionEvent();
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
          this.showMessage('ERROR_OFFLINE_MODE');
        }
      })
    });
  }


  private init() {
    this.dialCode = this.navParams.get('dialCode');
    this.contentType = this.navParams.get('contentType');
    this.source = this.navParams.get('source');

    if (this.dialCode !== undefined && this.dialCode.length > 0) {
      this.getContentForDialCode()
    }

    this.event.subscribe('search.applyFilter', (filterCriteria) => {
      this.responseData.result.filterCriteria = filterCriteria;
      this.applyFilter();
    });
  }



  private getContentForDialCode() {
    if (this.dialCode == undefined || this.dialCode.length == 0) {
      return
    }

    this.isDialCodeSearch = true;

    this.showLoader = true;
    this.contentType = [
      "TextBook",
      "TextBookUnit",
    ]

    let isOfflineSearch = false;

    if (this.network.type === 'none') {
      isOfflineSearch = true;
      this.showMessage('ERROR_OFFLINE_MODE');
    }

    let contentSearchRequest: ContentSearchCriteria = {
      dialCodes: [this.dialCode],
      mode: "collection",
      facets: ["language", "grade", "domain", "contentType", "subject", "medium"],
      contentTypes: this.contentType,
      offlineSearch: isOfflineSearch
    }

    this.contentService.searchContent(contentSearchRequest, false, (responseData) => {
      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        this.responseData = response;
        if (response.status && response.result) {
          this.processDialCodeResult(response.result);
          this.updateFilterIcon();
        }

        this.showLoader = false;
      })
    }, (error) => {
      this.zone.run(() => {
        this.showLoader = false;
      });
    });
  }
  private generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.SEARCH;
    impression.pageId = this.source;
    impression.env = Environment.HOME;
    this.telemetryService.impression(impression);
  }

  private generateLogEvent(searchResult) {
    let log = new Log();
    log.level = LogLevel.INFO;
    if (searchResult != null) {
      let contentArray: Array<any> = searchResult.contentDataList;
      let params = new Array<any>();
      let paramsMap: Map<string, any> = new Map();
      paramsMap.set("SearchResults", contentArray.length);
      paramsMap.set("SearchCriteria", searchResult.request);
      params.push(paramsMap);
      log.params = params;
      this.telemetryService.log(log);
    }

  }

  generateInteractEvent(identifier, contentType, pkgVersion, index) {
    let interact = new Interact();
    interact.type = InteractType.TOUCH;
    interact.subType = InteractSubtype.CONTENT_CLICKED;
    interact.pageId = this.source;
    interact.env = Environment.HOME;
    let valuesMap = new CMap();

    valuesMap["SearchPhrase"] = this.searchKeywords;
    valuesMap["PositionClicked"] = index;
    interact.valueMap = valuesMap;
    interact.id = this.source;
    interact.objId = identifier;
    interact.objType = contentType;
    interact.objType = pkgVersion;
    this.telemetryService.interact(interact);
  }



  private processDialCodeResult(searchResult) {
    let collectionArray: Array<any> = searchResult.collectionDataList;
    let contentArray: Array<any> = searchResult.contentDataList;

    this.dialCodeResult = [];
    let addedContent = new Array<any>();

    if (contentArray && contentArray.length == 1) {
      this.showContentDetails(contentArray[0]);
      return;
    }

    if (collectionArray && collectionArray.length > 0) {
      collectionArray.forEach((collection) => {
        contentArray.forEach((content) => {
          if (collection.childNodes.includes(content.identifier)) {
            if (collection.content == undefined) {
              collection.content = [];
              collection.content.push(content);
            } else {
              collection.content.push(content);
            }

            addedContent.push(content.identifier);
          }
        })
        this.dialCodeResult.push(collection);
      })
    }

    this.dialCodeContentResult = [];

    if (contentArray && contentArray.length > 1) {
      contentArray.forEach((content) => {
        if (addedContent.indexOf(content.identifier) < 0) {
          this.dialCodeContentResult.push(content);
        }
      })
    }


    if (this.dialCodeResult.length == 0 && this.dialCodeContentResult.length == 0) {
      this.isEmptyResult = true;
    } else {
      this.isEmptyResult = false;
    }
  }

  private updateFilterIcon() {
    let isFilterApplied = false;

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

  private getReadableFileSize(bytes) {
    if (bytes < 1024) return (bytes / 1).toFixed(0) + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(0) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  }

  showMessage(constant) {
    if (constant) {
      this.translate.get(constant).subscribe(
        (value: any) => {
          let toast = this.toastCtrl.create({
            message: value,
            duration: 2000,
            position: 'bottom'
          });
          toast.onDidDismiss(() => {
          });

          toast.present();
        }
      );
    }
  }
}
