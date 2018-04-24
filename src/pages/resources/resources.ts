import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, PopoverController, Events } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService, FrameworkService, CategoryRequest, Impression, ImpressionType, PageId, Environment, TelemetryService, ProfileService } from "sunbird";
import * as _ from 'lodash';
import { Slides } from 'ionic-angular';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { ResourceFilter, ResourceFilterCallback } from './filters/resource.filter';



@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage {

  pageLoadedSuccess = false;

  storyAndWorksheets: Array<any>;
  selectedValue: Array<string> = [];


  guestUser: boolean = false;

  /**
   * Contains local resources
   */
  localResources: Array<any>;

  userId: string;
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

  isOnBoardingCardCompleted: boolean = false;
  onBoardingProgress: number = 0;

  constructor(public navCtrl: NavController, private pageService: PageAssembleService, private ngZone: NgZone, private popupCtrl: PopoverController,
    contentService: ContentService, authService: AuthService, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController, private telemetryService: TelemetryService, private events: Events, private profileService: ProfileService) {
    this.contentService = contentService;
    this.authService = authService;

    this.events.subscribe('onboarding-card:completed', (isOnBoardingCardCompleted) => {
      this.isOnBoardingCardCompleted = isOnBoardingCardCompleted;
    });

    this.events.subscribe('onboarding-card:increaseProgress', (progress) => {
      console.log("Progress", progress.cardProgress);
      this.onBoardingProgress = progress.cardProgress;
    });
  }

  /**
 * It will fetch the guest user profile details
 */
  getCurrentUser(): void {
    this.profileService.getCurrentUser(
      (res: any) => {
        let profile = JSON.parse(res);
        if (profile.board.length && profile.grade.length && profile.medium.length && profile.subject.length) {
          this.isOnBoardingCardCompleted = true;
          this.events.publish('onboarding-card:completed', { isOnBoardingCardCompleted: this.isOnBoardingCardCompleted });
        }
      },
      (err: any) => {
        this.isOnBoardingCardCompleted = false;
      });
  }

  viewAllSavedResources() {
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: 'Saved Resources',
      pageName: 'resource.SavedResources'
    });
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
            // if (value.contentData.appIcon.startsWith("http")) {
            //   value.contentLogo = value.contentData.appIcon;
            // } else {
            //   value.contentLogo = "file://" + value.basePath + "/" + value.contentData.appIcon;
            // }
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
        this.pageLoadedSuccess = true;
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
  searchAllContent(queryParams, headerTitle): void {
    console.log('Search query...', queryParams);
    this.navCtrl.push(ViewMoreActivityPage, {
      requestParams: queryParams,
      headerTitle: headerTitle
    });
  }

  /**
   * Ionic life cycle hooks
   */
  ionViewDidLoad() {
    console.log('Resources component initialized...==>>');
    this.getPopularContent();
  }

  ionViewDidEnter() {
    this.generateImpressionEvent();
  }

  ionViewWillEnter() {
    if (!this.pageLoadedSuccess) {
      this.getPopularContent();
    }
    this.setSavedContent();
    this.authService.getSessionData((res: string) => {
      if (res === undefined || res === "null") {
        this.guestUser = true;
        this.getCurrentUser();
      } else {
        this.guestUser = false;
      }
    });
  }

  generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.VIEW;
    impression.pageId = PageId.COURSES;
    impression.env = Environment.HOME;
    this.telemetryService.impression(impression);
  }

  scanQRCode() {
    const that = this;
    const callback: QRResultCallback = {
      dialcode(scanResult, dialCode) {
        that.navCtrl.push(SearchPage, { dialCode: dialCode });
      },
      content(scanResult, contentId) {
        // that.navCtrl.push(SearchPage);
      }
    }

    this.qrScanner.startScanner(undefined, undefined, undefined, callback);
  }

  search() {
    const contentType: Array<string> = [
      "Story",
      "Worksheet",
      "Game",
      "Collection",
      "TextBook",
      "LessonPlan",
      "Resource",
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType });
  }

  showFilter() {
    const that = this;
    const callback: ResourceFilterCallback = {
      applyFilter(filter) {
        let criteria = new PageAssembleCriteria();
        criteria.name = "Resource";
        criteria.filters = filter;
        that.pageService.getPageAssemble(criteria, res => {
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
            that.pageLoadedSuccess = true;
          });
        }, error => {
          console.log('error while getting popular resources...', error);
        });
      }
    }

    let filter = this.popCtrl.create(ResourceFilter, { callback: callback }, { cssClass: 'resource-filter' })
    filter.present();
  }
}
