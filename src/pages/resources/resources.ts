import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService, FrameworkService, CategoryRequest, FrameworkDetailsRequest, Impression, ImpressionType, PageId, Environment, TelemetryService } from "sunbird";
import * as _ from 'lodash';
import { Slides } from 'ionic-angular';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { ResourceFilter, ResourceFilterCallback } from './filters/resource.filter';
import { FilterOptions, onBoardingSlidesCallback } from './onboarding-alert/onboarding-alert';


@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage implements OnInit {

  pageLoadedSuccess = false;

  storyAndWorksheets: Array<any>;
  selectedValue: Array<string> = [];


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
   * Flag to show latest and popular course loader
   */
  pageApiLoader: boolean = true;

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Auth service to get user id.
   */
  public authService: AuthService;


  categories: Array<any> = [];
  boardList: Array<string> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];

  constructor(public navCtrl: NavController, private pageService: PageAssembleService, private ngZone: NgZone, private popupCtrl: PopoverController,
    contentService: ContentService, authService: AuthService, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController, private framework: FrameworkService, private telemetryService: TelemetryService) {
    this.contentService = contentService;
    this.authService = authService;

    this.getFrameworkDetails();

    this.selectedOptions = [];

    this.onBoardingSlides = [
      {
        'id': 'boardList',
        'title': 'Which board does your school follow?',
        'desc': 'SELECT BOARD',
        'options': [
          // { text: 'Board1', value: 'board1', checked: true },
          // { text: 'Board2', value: 'board2', checked: false },
          // { text: 'Board3', value: 'board3', checked: false },
          // { text: 'Board4', value: 'board4', checked: false },
          // { text: 'Board5', value: 'board5', checked: false },
          // { text: 'Board6', value: 'board6', checked: false },
          // { text: 'Board7', value: 'board7', checked: false }
        ]
      },
      {
        'id': 'gradeList',
        'title': 'Which class do you belong to?',
        'desc': 'SELECT CLASS',
        'options': [
          // { text: 'Class1', value: 'Class1', checked: false },
          // { text: 'Class2', value: 'Class2', checked: false },
          // { text: 'Class3', value: 'Class3', checked: false },
          // { text: 'Class4', value: 'Class4', checked: false },
          // { text: 'Class5', value: 'Class5', checked: false },
          // { text: 'Class6', value: 'Class6', checked: false },
          // { text: 'Class7', value: 'Class7', checked: false }
        ]
      },
      {
        'id': 'subjectList',
        'title': 'Which subjects are you looking for?',
        'desc': 'SELECT SUBJECT',
        'options': [
          // { text: 'Subject1', value: 'Subject1', checked: false },
          // { text: 'Subject2', value: 'Subject2', checked: false },
          // { text: 'Subject3', value: 'Subject3', checked: false },
          // { text: 'Subject4', value: 'Subject4', checked: false },
          // { text: 'Subject5', value: 'Subject5', checked: false },
          // { text: 'Subject6', value: 'Subject6', checked: false },
          // { text: 'Subject7', value: 'Subject7', checked: false }
        ]
      },
      {
        'id': 'mediumList',
        'title': 'What medium/language does your school teach in?',
        'desc': 'SELECT MEDIUM/LANG',
        'options': [
          // { text: 'Lang1', value: 'Lang1', checked: true },
          // { text: 'Lang2', value: 'Lang2', checked: false },
          // { text: 'Lang3', value: 'Lang3', checked: false },
          // { text: 'Lang4', value: 'Lang4', checked: false },
          // { text: 'Lang5', value: 'Lang5', checked: false },
          // { text: 'Lang6', value: 'Lang6', checked: false },
          // { text: 'Lang7', value: 'Lang7', checked: false }
        ]
      }
    ]


    this.onBoardingSlides[0].options = this.boardList;
    this.onBoardingSlides[1].options = this.gradeList;
    this.onBoardingSlides[2].options = this.subjectList;
    this.onBoardingSlides[3].options = this.mediumList;
  }

  openFilterOptions(selectedSlide, index) {
    const that = this;
    const callback: onBoardingSlidesCallback = {
      save() {
        console.log('getting data from popup.ts through call back resources');
        that.selectedCheckboxValue(selectedSlide, index);
      }
    }

    this.checkPrevValue(index, this.getListName(index));


    let popUp = this.popupCtrl.create(FilterOptions, { facet: selectedSlide, callback: callback, index: index }, {
      cssClass: 'onboarding-alert'
    });

    popUp.present();
  }

  selectedCheckboxValue(selectedSlide, index) {
    var optionsCSV = '';
    selectedSlide.options.forEach(function (options) {
      if (options.checked) {
        //   var optionsCSV = options.value;
        if (optionsCSV) {
          optionsCSV += ','
        }
        optionsCSV += options.value;
      }
    })
    this.selectedValue[index] = optionsCSV;
  }

  onSlideDrag() {
    let currentIndex = this.mSlides.getActiveIndex();
    console.log('Current index is', currentIndex);
    console.log(this.selectedOptions.length);
    console.log(this.selectedOptions[currentIndex]);
    //let lockSwipeToNext = !(this.pets.length && this.pets[currentIndex] && this.pets[currentIndex].length);
    this.mSlides.lockSwipeToNext(!(this.selectedValue.length && this.selectedValue[currentIndex]
      && this.selectedValue[currentIndex].length));
  }

  handleOnBoardingOptionSelected(index: number) {
    console.log("index: " + index + ", selectedOptions " + this.selectedOptions[index]);
    // slides.
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
      contentTypes: ['Story', 'Worksheet', 'Collection', 'Game', 'TextBook', 'Resource', 'LessonPlan']
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
    this.pageApiLoader = true;
    let that = this;
    let criteria = new PageAssembleCriteria();
    criteria.name = "Resource";
    this.pageService.getPageAssemble(criteria, res => {
      that.ngZone.run(() => {
        let response = JSON.parse(res);
        console.log('Popular content, response');
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
        // this.pageApiLoader = false;
      });
    }, error => {
      console.log('error while getting popular resources...', error);
      this.pageApiLoader = false;
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
    // this.getPopularContent();
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
      } else {
        this.guestUser = false;
      }
    });
  }

  /**
   * 
   * @param refresher
   */
  swipeDownToRefresh(refresher?) {
    refresher.complete();
    this.localResources = [];
    this.storyAndWorksheets = [];
    this.setSavedContent();
    this.getPopularContent();
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('courses component initialized...');
    // this.getCourseTabData();
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



  // This for Guest-Profile Onboarding Cards

  getFrameworkDetails(): void {
    let req: FrameworkDetailsRequest = {
      defaultFrameworkDetails: true
    };

    this.framework.getFrameworkDetails(req,
      (res: any) => {
        this.categories = JSON.parse(JSON.parse(res).result.framework).categories;
        console.log("Framework details Response: ", JSON.parse(JSON.parse(res).result.framework).categories);
      },
      (err: any) => {
        console.log("Framework details Response: ", JSON.parse(err));
      });
  }


  /**
  * This will internally call framework API
  * @param {string} currentCategory - request Parameter passing to the framework API
  * @param {string} list - Local variable name to hold the list data
  */
  getCategoryData(req: CategoryRequest, list): void {

    this.framework.getCategoryData(req,
      (res: any) => {
        // { text: 'Lang1', value: 'Lang1', checked: true }
        const resposneArray = JSON.parse(res);
        this[list] = [];

        resposneArray.forEach(element => {
          const value = { 'text': element.name, 'value': element.code, 'checked': false }
          this[list].push(value)
        });

        // this[list] = resposneArray;
        this.getListArray(list);
        console.log(list + " Category Response: " + this[list]);
      },
      (err: any) => {
        console.log("Subject Category Response: ", err);
      });
  }

  checkPrevValue(index = 0, currentField, prevSelectedValue = '', ) {
    console.log('coming here');
    if (index != 0) {
      let request: CategoryRequest = {
        currentCategory: this.categories[index].code,
        prevCategory: this.categories[index - 1].code,
        selectedCode: [prevSelectedValue]
      }
      this.getCategoryData(request, currentField);
    } else {
      let request: CategoryRequest = {
        currentCategory: this.categories[index].code
      }
      this.getCategoryData(request, currentField);
    }
  }

  getListName(index: number): string {
    if (index == 0) {
      return 'boardList';
    } else if (index == 1) {
      return 'gradeList';
    } else if (index == 2) {
      return 'subjectList';
    } else if (index == 3) {
      return 'mediumList';
    } else {
      return 'boardList';
    }
  }

  getListArray(name) {
    if (name == 'boardList') {
      this.onBoardingSlides[0].options = this.boardList;
    } else if (name == 'gradeList') {
      this.onBoardingSlides[1].options = this.gradeList;
    } else if (name == 'subjectList') {
      this.onBoardingSlides[2].options = this.subjectList;
    } else if (name == 'mediumList') {
      this.onBoardingSlides[3].options = this.mediumList;
    }
  }
}




