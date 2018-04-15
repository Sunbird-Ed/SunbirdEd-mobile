import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
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
   * Total search count
   */
  totalCount: number;

  /**
   * Load more flag
   */
  isLoadMore: boolean = false;

  /**
   * Contains reference of NgZone
   */
  ngZone: NgZone;

  /**
   * Contains reference of NavController
   */
  navCtrl: NavController;

  /**
   * Contains reference of NavParams
   */
  navParams: NavParams;

  /**
   * Contains reference of ContentService
   */
  public contentService: ContentService;

  /**
   * Default method of class SearchPage
   * 
   * @param navCtrl 
   * @param navParams 
   * @param contentService 
   * @param ngZone 
   */
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, ngZone: NgZone) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.contentService = contentService;
    this.ngZone = ngZone;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
  }

  /**
   * Function to build api request
   */
  getRequestBody(): object {
    let data = JSON.parse(this.searchQuery);
    data = data.request;
    const requestParams = {
      query: data.query,
      limit: this.searchLimit,
      contentStatusArray: data.filters.status,
      contentTypes: ['Collection']
    }

    return requestParams;
  }

  /**
   * Search content
   */
  search() {
    this.contentService.searchContent(this.getRequestBody(), (data: any) => {
      data = JSON.parse(data);
      console.log('search limit...', data);
      this.ngZone.run(() => {
        if (data.result && data.result.contentDataList) {
          if (this.isLoadMore) {
            this.searchList.push(data.result.contentDataList);
          } else {
            this.searchList = data.result.contentDataList;
          }
        }
      })
    }, (error: any) => {
      console.log('Error: while fetchig view more content')
    })
  }

  /**
   * Load more result
   */
  loadMore() {
    // TODO: Issue in SDK - SDK is not accepting offset value.
    this.searchLimit = this.searchLimit + 10;
    this.search();
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

  /**
   * Ionic life cycle hook
   */
  ionViewCanLeave() {
    this.tabBarElement.style.display = 'flex';
  }
}
