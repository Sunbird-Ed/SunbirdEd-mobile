import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService } from "sunbird";
import * as _ from 'lodash';

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage {

  storyAndWorksheets: Array<any>;

  /**
   * Contains local resources
   */
  localResources: Array<any>;

  userId: string;
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

  ionViewWillEnter() {
    this.doRefresh();
    this.setSavedContent();
  }

  setSavedContent() {
    const requestParams = {
      contentTypes: ['Story', 'Worksheet', 'Collection', 'Game', 'TextBook', 'Course', 'Resource', 'LessonPlan']
    };
    this.contentService.getAllLocalContents(requestParams, (data: any) => {
      data = JSON.parse(data);
      console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAA', data);
      this.ngZone.run(() => {
         // = data.result ? data.result : [];
        if (data.result) {
          _.forEach(data.result, (value, key) => {
            value.contentData.lastUpdatedOn = value.lastUpdatedTime;
          });
          this.localResources = data.result;
        }

        console.log('Inside library page ===>', this.localResources);
      });
    }, error => {
      console.log('error while getting saved contents', error);
    });

  }

  doRefresh() {
    let that = this;
    let criteria = new PageAssembleCriteria();
    criteria.name = "Resource";
    this.pageService.getPageAssemble(criteria, res => {
      that.ngZone.run(() => {
        let response = JSON.parse(res);

        //TODO Temporary code - should be fixed at backend
        let a = JSON.parse(response.sections);
        let newSections = [];
        a.forEach(element => {
          element.display = JSON.parse(element.display);
          newSections.push(element);
        });
        //END OF TEMPORARY CODE

        that.storyAndWorksheets = newSections;
      });
    }, error => {

    });
  }
}
