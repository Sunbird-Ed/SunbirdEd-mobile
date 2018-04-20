import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService } from "sunbird";
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

  guestUser: boolean = false;

  /**
   * Contains local resources
   */
  localResources: Array<any>;

  userId: string;
  onBoardingSlides: any[];
  @ViewChild(Slides) mSlides: Slides;
  selectedOptions: any;
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
    contentService: ContentService, authService: AuthService, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController) {
    this.contentService = contentService;
    this.authService = authService;

    this.selectedOptions = [];

    this.onBoardingSlides = [
      {
        'title': 'Which board does your school follow?',
        'desc': 'SELECT BOARD',
        'options': [
          { text: 'Board1', value: 'board1' },
          { text: 'Board2', value: 'board2' },
          { text: 'Board3', value: 'board3' },
          { text: 'Board4', value: 'board4' }
        ]
      },
      {
        'title': 'Which class do you belong to?',
        'desc': 'SELECT CLASS',
        'options': [
          { text: 'Board1', value: 'board1' },
          { text: 'Board2', value: 'board2' },
          { text: 'Board3', value: 'board3' },
          { text: 'Board4', value: 'board4' }
        ]
      },
      {
        'title': 'Which subjects are you looking for?',
        'desc': 'SELECT SUBJECT',
        'options': [
          { text: 'Board1', value: 'board1' },
          { text: 'Board2', value: 'board2' },
          { text: 'Board3', value: 'board3' },
          { text: 'Board4', value: 'board4' }
        ]
      },
      {
        'title': 'What medium/language does your school teach in?',
        'desc': 'SELECT MEDIUM/LANG',
        'options': [
          { text: 'Board1', value: 'board1' },
          { text: 'Board2', value: 'board2' },
          { text: 'Board3', value: 'board3' },
          { text: 'Board4', value: 'board4' }
        ]
      }
    ]
  }

  onSlideDrag() {
    let currentIndex = this.mSlides.getActiveIndex();
    console.log('Current index is', currentIndex);
    console.log(this.selectedOptions.length);
    console.log(this.selectedOptions[currentIndex]);
    // let lockSwipeToNext = !(this.pets.length && this.pets[currentIndex] && this.pets[currentIndex].length);
    this.mSlides.lockSwipeToNext(!(this.selectedOptions.length && this.selectedOptions[currentIndex]
      && this.selectedOptions[currentIndex].length));
  }

  handleOnBoardingOptionSelected(index: number) {
    console.log("index: " + index + ", selectedOptions " + this.selectedOptions[index]);
    // slides.
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
  searchAllContent(queryParams): void {
    console.log('Search query...', queryParams);
    this.navCtrl.push(ViewMoreActivityPage, {
      requestParams: queryParams
    });
  }

  /**
   * Ionic life cycle hooks
   */
  ionViewDidLoad() {
    console.log('Resources component initialized...==>>');
    this.getPopularContent();
  }

  ionViewWillEnter() {
    if (!this.pageLoadedSuccess) {
      this.getPopularContent();
    }
    this.setSavedContent();
    this.authService.getSessionData((res: string) => {
      if (res === undefined || res === "null") {
        this.guestUser = true;
      } else {
        this.guestUser = false;
      }
    });
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

    this.navCtrl.push(SearchPage, { contentType: contentType })
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


    let filter = this.popCtrl.create(ResourceFilter, {callback: callback}, {cssClass: 'resource-filter'})
    filter.present();
  }
}
