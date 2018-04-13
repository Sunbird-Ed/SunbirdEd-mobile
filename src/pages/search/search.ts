import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
import { ContentService, ContentSearchCriteria } from "sunbird";
import { GenieResponse } from "../settings/datasync/genieresponse";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: './search.html'
})
export class SearchPage {

  dialCode: string;

  dialCodeResult: Array<any> = [];

  showLoader: boolean = true;

  constructor(private contentService: ContentService, private navParams: NavParams) {
    this.dialCode = this.navParams.get('dialCode');
    this.getContentForDialCode()
  }



  private getContentForDialCode() {
    if (this.dialCode == undefined || this.dialCode.length == 0) {
      return
    }

    this.showLoader = true;

    let contentSearchRequest: ContentSearchCriteria = {
      keywords: [this.dialCode],
      mode: "collection"
    }

    this.contentService.searchContent(contentSearchRequest, (responseData) => {
      let response: GenieResponse = JSON.parse(responseData);
      console.log("result " + response);
      if (response.status && response.result) {
        this.processDialCodeResult(response.result);
      }

      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
    });
  }


  private processDialCodeResult(searchResult) {
    let collectionArray: Array<any> = searchResult.collectionDataList;
    let contentArray: Array<any> = searchResult.contentDataList;

    this.dialCodeResult = [];

    collectionArray.forEach((collection) => {
      contentArray.forEach((content) => {
        if (collection.childNodes.includes(content.identifier)) {
          if (collection.content == undefined) {
            collection.content = [];
            collection.content.push(content);
          } else {
            collection.content.push(content);
          }
        }
      })
      this.dialCodeResult.push(collection);
    })
  }
}
