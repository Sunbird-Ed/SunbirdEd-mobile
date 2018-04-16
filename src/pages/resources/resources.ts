import { Component, NgZone, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService } from "sunbird";
import * as _ from 'lodash';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage implements OnInit {

  storyAndWorksheets: Array<any>;

  /**
   * Contains local resources
   */
  localResources: Array<any>;

  /**
   * Loader
   */
  showLoader: boolean = false;

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Auth service to get user id.
   */
  public authService: AuthService;

  constructor(public navCtrl: NavController, private pageService: PageAssembleService, private ngZone: NgZone,
    contentService: ContentService, authService: AuthService) {
    this.contentService = contentService;
    this.authService = authService;
  }

  /**
   * Get saved content
   */
  setSavedContent() {
    this.showLoader = true;
    const requestParams = {
      contentTypes: ['Story', 'Worksheet', 'Collection', 'Game', 'TextBook', 'Course', 'Resource', 'LessonPlan']
    };
    this.contentService.getAllLocalContents(requestParams, (data: any) => {
      data = JSON.parse(data);
      console.log('Success: saved resources', data);
      this.ngZone.run(() => {
        if (data.result) {
          //TODO Temporary code - should be fixed at backend
          _.forEach(data.result, (value, key) => {
            value.contentData.lastUpdatedOn = value.lastUpdatedTime;
          });
          this.localResources = data.result;
        }
        this.showLoader = false;
      });
    }, error => {
      console.log('error while getting saved contents', error);
      this.showLoader = false;
    });

  }

  /**
   * Get popular content
   */
  getPopularContent() {
    let that = this;
    let criteria = new PageAssembleCriteria();
    criteria.name = "Resource";
    this.pageService.getPageAssemble(criteria, res => {
      that.ngZone.run(() => {
        let response = JSON.parse(res);
        console.log('Saved resources', response);
        //TODO Temporary code - should be fixed at backend
        let a = JSON.parse(response.sections);
        console.log('page service ==>>>>', a);

        let newSections = [];
        a.forEach(element => {
          element.display = JSON.parse(element.display);
          newSections.push(element);
        });
        //END OF TEMPORARY CODE
        that.storyAndWorksheets = newSections;
        console.log('storyAndWorksheets', that.storyAndWorksheets);
      });
    }, error => {
      console.log('error while getting popular resources...', error);
    });
  }

  /**
   * Navigate to search page
   * 
   * @param {string} queryParams search query params
   */
  searchAllContent(queryParams): void {
    console.log('Search query...', queryParams);
    this.navCtrl.push(ViewMoreActivityPage, {
      requestParams: queryParams
    });
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('Resources component initialized...==>>');
    this.getPopularContent();
    this.setSavedContent();
  }
}
