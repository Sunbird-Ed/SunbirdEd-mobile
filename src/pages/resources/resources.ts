import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageAssembleService, PageAssembleCriteria, ContentService, AuthService } from "sunbird";
import * as _ from 'lodash';
import { Slides } from 'ionic-angular';

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
  onBoardingSlides: any[];
  @ViewChild(Slides) mSlides: Slides;
  selectedOptions: any;

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
