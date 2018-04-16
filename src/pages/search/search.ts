import { Component, NgZone } from "@angular/core";
import { IonicPage, NavParams, NavController } from "ionic-angular";
import { ContentService, ContentSearchCriteria } from "sunbird";
import { GenieResponse } from "../settings/datasync/genieresponse";
import { FilterPage } from "./filters/filter";
import { CourseDetailPage } from "../course-detail/course-detail";
import { CollectionDetailsPage } from "../collection-details/collection-details";
import { ContentDetailsPage } from "../content-details/content-details";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: './search.html'
})
export class SearchPage {

  contentType: Array<string> = [];

  dialCode: string;

  dialCodeResult: Array<any> = [];

  dialCodeContentResult: Array<any> = [];

  searchContentResult: Array<any> = [];

  showLoader: boolean = false;

  filterIcon;

  searchKeywords: string = ""

  constructor(private contentService: ContentService, private navParams: NavParams, private navCtrl: NavController, private zone: NgZone) {
    this.init();
  }


  openCollection(collection) {
    // TODO: Add mimeType check
    // this.navCtrl.push(CourseDetailPage, {'content': collection})
    this.showContentDetails(collection);
  }


  openContent(collection, content) {
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
    this.navCtrl.push(FilterPage);
  }

  searchOnChange(event) {
    console.log("Search keyword " + this.searchKeywords);
  }

  handleSearch() {
    if (this.searchKeywords.length < 3) {
      return;
    }

    (<any> window).cordova.plugins.Keyboard.close()

    let contentSearchRequest: ContentSearchCriteria = {
      query: this.searchKeywords,
      contentTypes: this.contentType,
      facets: ["language", "grade", "domain", "contentType", "subject", "medium"]
    }

    this.contentService.searchContent(contentSearchRequest, (responseData) => {

      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        if (response.status && response.result) {
          this.searchContentResult = response.result.contentDataList;
          this.filterIcon = "./assets/imgs/ic_action_filter.png";
        }
      });
    }, (error) => {
      console.log("Error : " + JSON.stringify(error));
    });
  }


  private init() {
    this.dialCode = this.navParams.get('dialCode');
    this.contentType = this.navParams.get('contentType');

    if (this.dialCode !== undefined && this.dialCode.length > 0) {
      this.getContentForDialCode()
    }
  }



  private getContentForDialCode() {
    if (this.dialCode == undefined || this.dialCode.length == 0) {
      return
    }

    this.showLoader = true;

    let contentSearchRequest: ContentSearchCriteria = {
      dialCodes: [this.dialCode],
      mode: "collection"
    }

    this.contentService.searchContent(contentSearchRequest, (responseData) => {
      this.zone.run(() => {
        let response: GenieResponse = JSON.parse(responseData);
        if (response.status && response.result) {
          this.processDialCodeResult(response.result);
        }

        this.showLoader = false;
      })
    }, (error) => {
      this.zone.run(() => {
        this.showLoader = false;
      });
    });
  }


  private processDialCodeResult(searchResult) {
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

    if (contentArray && contentArray.length == 1) {
      return;
    }
  }

  private getReadableFileSize(bytes) {
    if (bytes < 1024) return (bytes / 1).toFixed(0) + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(0) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
  }
}
