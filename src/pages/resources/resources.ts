import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService } from "sunbird";
import * as _ from 'lodash';
import { Slides } from 'ionic-angular';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { FilterOptions, onBoardingSlidesCallback } from './onboarding-alert/onboarding-alert';



@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage implements OnInit {

  storyAndWorksheets: Array<any>;
  selectedValue: Array<string> = [];


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

  constructor(public navCtrl: NavController, private popupCtrl: PopoverController, private pageService: PageAssembleService, private ngZone: NgZone,
    contentService: ContentService, authService: AuthService) {

    this.contentService = contentService;
    this.authService = authService;

    this.selectedOptions = [];

    this.onBoardingSlides = [
      {
        'title': 'Which board does your school follow?',
        'desc': 'SELECT BOARD',
        'options': [
          { text: 'Board1', value: 'board1', checked: true },
          { text: 'Board2', value: 'board2', checked: false },
          { text: 'Board3', value: 'board3', checked: false },
          { text: 'Board4', value: 'board4', checked: false },
          { text: 'Board5', value: 'board5', checked: false },
          { text: 'Board6', value: 'board6', checked: false },
          { text: 'Board7', value: 'board7', checked: false }
        ]
      },
      {
        'title': 'Which class do you belong to?',
        'desc': 'SELECT CLASS',
        'options': [
          { text: 'Class1', value: 'Class1', checked: false },
          { text: 'Class2', value: 'Class2', checked: false },
          { text: 'Class3', value: 'Class3', checked: false },
          { text: 'Class4', value: 'Class4', checked: false },
          { text: 'Class5', value: 'Class5', checked: false },
          { text: 'Class6', value: 'Class6', checked: false },
          { text: 'Class7', value: 'Class7', checked: false }
        ]
      },
      {
        'title': 'Which subjects are you looking for?',
        'desc': 'SELECT SUBJECT',
        'options': [
          { text: 'Subject1', value: 'Subject1', checked: false },
          { text: 'Subject2', value: 'Subject2', checked: false },
          { text: 'Subject3', value: 'Subject3', checked: false },
          { text: 'Subject4', value: 'Subject4', checked: false },
          { text: 'Subject5', value: 'Subject5', checked: false },
          { text: 'Subject6', value: 'Subject6', checked: false },
          { text: 'Subject7', value: 'Subject7', checked: false }
        ]
      },
      {
        'title': 'What medium/language does your school teach in?',
        'desc': 'SELECT MEDIUM/LANG',
        'options': [
          { text: 'Lang1', value: 'Lang1', checked: true },
          { text: 'Lang2', value: 'Lang2', checked: false },
          { text: 'Lang3', value: 'Lang3', checked: false },
          { text: 'Lang4', value: 'Lang4', checked: false },
          { text: 'Lang5', value: 'Lang5', checked: false },
          { text: 'Lang6', value: 'Lang6', checked: false },
          { text: 'Lang7', value: 'Lang7', checked: false }
        ]
      }
    ]
  }

  openFilterOptions(selectedSlide, index) {
    const that = this;
    const callback: onBoardingSlidesCallback = {
      save() {
        console.log('getting data from popup.ts through call back resources');
        that.selectedCheckboxValue(selectedSlide, index);
      }
    }
    let popUp = this.popupCtrl.create(FilterOptions, { facet: selectedSlide, callback: callback, index: index },{
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




