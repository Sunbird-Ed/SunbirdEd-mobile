import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { ContentService } from 'sunbird';
import { ViewMoreActivityListComponent } from '../../component/view-more-activity-list/view-more-activity-list';

/**
 * Generated class for the ViewMoreActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-more-activity',
  templateUrl: 'view-more-activity.html',
})
export class ViewMoreActivityPage {

  /**
   * Contains search query
   */
  searchQuery: any;

  /**
   * To hold search result
   */
  searchList: any;

  /**
   * Contains tab bar element ref
   */
  tabBarElement: any;

  /**
   * Offcet
   */
  offset: number = 0;

  /**
   * Contains search limit
   */
  searchLimit: number = 10

  /**
   * 
   */
  totalCount: number;

  public contentService: ContentService;

  /**
   * Default method of class SearchPage
   * 
   * @param navCtrl 
   * @param navParams 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, contentService: ContentService) {
    this.searchList = { "message": "successful", "result": { "contentData": { "appIcon": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2121989290225418241106/artifact/51fc00bbaf7f23db5a43f844b3bac7d2_1486535628609.thumb.jpeg", "artifactUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2121989290225418241106/artifact/1489127366073_do_2121989290225418241106.zip", "audience": "Learner", "contentDisposition": "inline", "contentEncoding": "gzip", "contentType": "Story", "copyright": "", "createdOn": "2017-03-10T06:24:37.947+0000", "description": "Telemetry", "downloadUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2121989290225418241106/copied-from-telemetry-test_1489127366521_do_2121989290225418241106_1.0.ecar", "gradeLevel": ["Grade 1"], "identifier": "do_2121989290225418241106", "language": ["English"], "lastPublishedOn": "2017-03-10T06:29:26.520+0000", "me_averageRating": "5.0", "me_totalDownloads": "2.0", "me_totalRatings": "1.0", "mimeType": "application/vnd.ekstep.ecml-archive", "name": "Copied From Telemetry Test", "osId": "org.ekstep.quiz.app", "owner": "", "pkgVersion": "1.0", "publisher": "", "size": "442073.0", "status": "Live", "variants": { "spine": { "ecarUrl": "https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2121989290225418241106/copied-from-telemetry-test_1489127366706_do_2121989290225418241106_1.0_spine.ecar", "size": 7607 } }, "versionKey": "1497245126216" }, "contentType": "story", "identifier": "do_2121989290225418241106", "isAvailableLocally": false, "isUpdateAvailable": false, "lastUpdatedTime": 0, "mimeType": "application/vnd.ekstep.ecml-archive", "referenceCount": 1 }, "status": true };
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.contentService = contentService;
  }

  /**
   * Get api request body
   */
  getRequestBody(): object {
    console.log('ppppppppffffffffff', this.searchQuery)
    let data = JSON.parse(this.searchQuery);
    data = data.request;
    const requestParams = {
      query: data.query,
      limit: this.searchLimit,
      contentStatusArray: data.filters.status,
      contentTypes: data.filters.contentType
    }

    return requestParams;
  }

  /**
   * Search content
   */
  search() {
    this.contentService.searchContent(this.getRequestBody(), (data: any) => {
      data = JSON.parse(data);
      if (data.result && data.result.contentDataList) {
        this.searchList = data.result.contentDataList;
      }
    }, (error: any) => {

    })
  }

  loadMore() {
    this.searchLimit = this.searchLimit + 10;
    this.search();
  }


  /**
   * Ionic default life cycle hook
   */
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  /**
   * Ionic default life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.searchQuery = this.navParams.get('requestParams');
    this.search();
    console.log('queryParams received =>>>>', this.navParams.get('requestParams'));
  }
}
