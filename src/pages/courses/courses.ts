import { ViewMoreActivityPage } from './../view-more-activity/view-more-activity';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { NavController, Platform, PopoverController } from 'ionic-angular';
import { IonicPage, Slides } from 'ionic-angular';
import { CourseService, AuthService, EnrolledCoursesRequest, PageAssembleService, PageAssembleCriteria, QRScanner, FrameworkDetailsRequest, CategoryRequest, FrameworkService } from 'sunbird';
import { CourseCard } from './../../component/card/course/course-card';
import { DocumentDirection } from 'ionic-angular/platform/platform';
import { QRResultCallback, SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { SearchPage } from '../search/search';
import { CourseFilter, CourseFilterCallback } from './filters/course.filter';
import { FilterOptions, onBoardingSlidesCallback } from '../resources/onboarding-alert/onboarding-alert';

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage implements OnInit {

  /**
   * Contains enrolled course
   */
  enrolledCourse: Array<any>;

  /**
   * Contains popular and latest courses ist
   */
  popularAndLatestCourses: Array<any>;

  /**
   * Contains user id
   */
  userId: string;

  /**
   * Flag to show/hide loader
   */
  showLoader: boolean;

  /**
   * Style
   */
  currentStyle = "ltr";

  /**
   * Course service to get enrolled courses
   */
  public courseService: CourseService;

  /**
   * Auth service to get user id.
   */
  public authService: AuthService;

  /**
   * Contains reference of ionic nav controller
   */
  public navCtrl: NavController;

  /**
   * Contains reference of ionic platform
   */
  public platform: Platform;

  /**
   * Contains reference of page api service
   */
  public pageService: PageAssembleService;

  /**
   * Contains reference of page api service
   */
  public ngZone: NgZone;

  guestUser: boolean = false;


  categories: Array<any> = [];
  boardList: Array<string> = [];
  gradeList: Array<string> = [];
  subjectList: Array<string> = [];
  mediumList: Array<string> = [];


  onBoardingSlides: any[];
  @ViewChild(Slides) mSlides: Slides;
  selectedOptions: any;

  /**
   * Default method of class CoursesPage
   *
   * @param {NavController} navCtrl To navigate user from one page to another
   * @param {CourseService} courseService Service to get enrolled courses
   * @param {AuthService} authService To get logged-in user data
   * @param {Platform} platform Ionic platform
   * @param {PageAssembleService} pageService Service to get latest and popular courses
   * @param {NgZone} ngZone To bind data
   */
  constructor(navCtrl: NavController, courseService: CourseService, authService: AuthService, platform: Platform,
    pageService: PageAssembleService, ngZone: NgZone, private qrScanner: SunbirdQRScanner, private popCtrl: PopoverController,  private framework: FrameworkService) {
    this.navCtrl = navCtrl;
    this.courseService = courseService;
    this.authService = authService;
    this.platform = platform;
    this.pageService = pageService;
    this.ngZone = ngZone;

    this.getFrameworkDetails();

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
  }

  viewMoreEnrolledCourses() {
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: 'Courses In Progress',
      userId: this.userId,
      pageName: 'course.EnrolledCourses'
    })
  }

  viewAllCourses(searchQuery, headerTitle) {
    this.navCtrl.push(ViewMoreActivityPage, {
      headerTitle: headerTitle,
      pageName: 'course.PopularContent',
      requestParams: searchQuery
    })
  }
  /**
   * To get enrolled course(s) of logged-in user.
   *
   * It internally calls course handler of genie sdk
   */
  getEnrolledCourses(): void {
    console.log('making api call to get enrolled courses');
    let option = {
      userId: this.userId,
      refreshEnrolledCourses: false
    };
    this.courseService.getEnrolledCourses(option, (data: any) => {
      if (data) {
        data = JSON.parse(data);
        this.enrolledCourse = data.result.courses ? data.result.courses : [];
        console.log('enrolled courses details', data);
        this.spinner(false);
      }
    }, (error: any) => {
      console.log('error while loading enrolled courses', error);
      this.spinner(false);
    });
  }

  /**
   * To get popular course.
   *
   * It internally calls course handler of genie sdk
   */
  getPopularAndLatestCourses(): void {
    let criteria = new PageAssembleCriteria();
    criteria.name = "Course";
    this.pageService.getPageAssemble(criteria, (res: any) => {
      res = JSON.parse(res);
      this.ngZone.run(() => {
        let sections = JSON.parse(res.sections);
        let newSections = [];
        sections.forEach(element => {
          element.display = JSON.parse(element.display);
          newSections.push(element);
        });
        this.popularAndLatestCourses = newSections;
        console.log('Popular courses', this.popularAndLatestCourses);
      });
    }, (error: string) => {
      console.log('Page assmble error', error);
    });
  }

  /**
   * To start / stop spinner
   */
  spinner(flag: boolean) {
    this.ngZone.run(() => {
      this.showLoader = flag;
    });
  }

  /**
   * Get user id.
   *
   * Used to get enrolled course(s) of logged-in user
   */
  getUserId(): void {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null || session === "null") {
        console.log('session expired');
        this.guestUser = true;
      } else {
        let sessionObj = JSON.parse(session);
        this.userId = sessionObj["userToken"];
        this.guestUser = false;
        this.getEnrolledCourses();
      }
    });
  }

  /**
   * Angular life cycle hooks
   */
  ngOnInit() {
    console.log('courses component initialized...');
    this.spinner(true);
    this.getUserId();
    this.getPopularAndLatestCourses();
  }

  /**
   * Change language / direction
   */
  changeLanguage(event) {
    if (this.currentStyle === "ltr") {
      this.currentStyle = "rtl";
    } else {
      this.currentStyle = "ltr";
    }

    this.platform.setDir(this.currentStyle as DocumentDirection, true);
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
      "Course",
    ];

    this.navCtrl.push(SearchPage, { contentType: contentType})
  }

  showFilter() {
    const that = this;

    const callback: CourseFilterCallback = {
      applyFilter(filter) {
        that.ngZone.run(() => {
          let criteria = new PageAssembleCriteria();
          criteria.name = "Course";
          criteria.filters = filter;
          that.pageService.getPageAssemble(criteria, (res: any) => {
            res = JSON.parse(res);
            that.ngZone.run(() => {
              let sections = JSON.parse(res.sections);
              let newSections = [];
              sections.forEach(element => {
                element.display = JSON.parse(element.display);
                newSections.push(element);
              });
              that.popularAndLatestCourses = newSections;
              console.log('Popular courses', that.popularAndLatestCourses);
            });
          }, (error: string) => {
            console.log('Page assmble error', error);
          });
        })
      }
    }

    let filter = this.popCtrl.create(CourseFilter, {callback: callback}, {cssClass: 'course-filter'});
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
          const value = {'text': element.name, 'value': element.code, 'checked': false}
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

  openFilterOptions(selectedSlide, index) {
    const that = this;
    const callback: onBoardingSlidesCallback = {
      save() {
        console.log('getting data from popup.ts through call back resources');
        that.selectedCheckboxValue(selectedSlide, index);
      }
    }

    this.checkPrevValue(index, this.getListName(index));


    let popUp = this.popCtrl.create(FilterOptions, { facet: selectedSlide, callback: callback, index: index }, {
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

  selectedValue: Array<string> = [];
}
