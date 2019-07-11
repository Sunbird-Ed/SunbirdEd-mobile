import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Map} from "@app/app";
import {Environment, InteractSubtype, InteractType, PageId} from "@app/service/telemetry-constants";
import {ContentSearchCriteria, ContentService, SearchType} from "sunbird-sdk/dist";
import {AppHeaderService, CommonUtilService} from "@app/service";
import { animate, group, state, style, transition, trigger } from '@angular/animations';


/**
 * Generated class for the ExploreBooksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explore-books',
  templateUrl: 'explore-books.html',
  animations: [
    trigger('appear', [
      state('true', style({
        left: '{{left_indent}}',
      }), { params: { left_indent: 0 } }), // default parameters values required

      transition('* => classAnimate', [
        style({ width: 5, opacity: 0 }),
        group([
          animate('0.3s 0.2s ease', style({
            transform: 'translateX(0) scale(1.2)', width: '*',
          })),
          animate('0.2s ease', style({
            opacity: 1
          }))
        ])
      ]),
    ]),
    trigger('ScrollHorizontal', [
      state('true', style({
        left: '{{left_indent}}',
        transform: 'translateX(-100px)',
      }), { params: { left_indent: 0 } }), // default parameters values required

      transition('* => classAnimate', [
        // style({ width: 5, transform: 'translateX(-100px)', opacity: 0 }),
        group([
          animate('0.3s 0.5s ease', style({
            transform: 'translateX(-100px)'
          })),
          animate('0.3s ease', style({
            opacity: 1
          }))
        ])
      ]),
    ])
  ]

})
export class ExploreBooksPage {

  categoryGradeLevels: any;
  subjects: any;
  mimeTypes = [
    { name: 'ALL', selected: true, value: ['all'], iconNormal: '', iconActive: ''},
    { name: 'TEXTBOOK', value:[], iconNormal:'./assets/imgs/book.svg', iconActive:'./assets/imgs/book-active.svg'},
    { name: 'VIDEOS', value: ['video/mp4', 'video/x-youtube', 'video/webm'], iconNormal: './assets/imgs/Play.svg', iconActive:'./assets/imgs/Play-active.svg'},
    { name: 'DOCS', value: ['application/pdf', 'application/epub'], iconNormal: './assets/imgs/Doc.svg',iconActive:'./assets/imgs/Doc-active.svg'},
    { name: 'INTERACTION',
      value: ['application/vnd.ekstep.ecml-archive', 'application/vnd.ekstep.h5p-archive', 'application/vnd.ekstep.html-archive'],
      iconNormal: './assets/imgs/Touch.svg', iconActive: './assets/imgs/Touch-active.svg'
    }
  ];
  activeMimeTypeFilter = ['all'];
  currentFilter: string = 'ALL';
  getGroupByPageReq: ContentSearchCriteria = {
    searchType: SearchType.SEARCH
  };
  current_index: any;
  currentGrade: any;
  currentMedium: string;
  layoutName = 'textbook';
  storyAndWorksheets: Array<any>;
  headerObservable: any;
  unregisterBackButton: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private commonUtilService: CommonUtilService,
    private headerService: AppHeaderService
  ) {
    this.handleBackButton();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExploreBooksPage');
    this.categoryGradeLevels = this.navParams.get('categoryGradeLevels');
    this.storyAndWorksheets = this.navParams.get('storyAndWorksheets');
    this.subjects = this.navParams.get('subjects');
    this.subjects.unshift({name: 'All', selected: true});
    console.log(this.subjects);
  }

  ionViewWillEnter () {
    this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this.headerService.showHeaderWithBackButton();
  }

  async onFilterMimeTypeChange(val, idx, currentFilter?) {
    const values = new Map();
    values['filter'] = currentFilter;
    this.activeMimeTypeFilter = val;
    this.currentFilter = this.commonUtilService.translateMessage(currentFilter);
    this.mimeTypes.forEach((type) => {
      type.selected = false;
    });
    this.mimeTypes[idx].selected = true;
    // this.filteredItemsQueryList.changes
    //   .do((v) => {
    //     this.changeDetectionRef.detectChanges();
    //     values['contentLength'] = v.length;
    //   })
    //   .subscribe();
    // this.telemetryGeneratorService.generateInteractTelemetry(
    //   InteractType.TOUCH,
    //   InteractSubtype.FILTER_CLICKED,
    //   Environment.HOME,
    //   PageId.COLLECTION_DETAIL,
    //   undefined,
    //   values);
  }

  // classClick(index, isClassClicked?: boolean) {
  //   if (isClassClicked) {
  //     // this.generateClassInteractTelemetry(this.categoryGradeLevels[index].name, this.getGroupByPageReq.grade[0]);
  //   }
  //   this.getGroupByPageReq.grade = [this.categoryGradeLevels[index].name];
  //   // [grade.name];
  //   if ((this.currentGrade) && (this.currentGrade.name !== this.categoryGradeLevels[index].name) && isClassClicked) {
  //     this.getGroupByPage(false, !isClassClicked);
  //   }
  //   for (let i = 0, len = this.categoryGradeLevels.length; i < len; i++) {
  //     if (i === index) {
  //       this.currentGrade = this.categoryGradeLevels[i];
  //       this.current_index = this.categoryGradeLevels[i];
  //       this.categoryGradeLevels[i].selected = 'classAnimate';
  //     } else {
  //       this.categoryGradeLevels[i].selected = '';
  //     }
  //   }
  //   let el: HTMLElement | null = document.getElementById('class' + index);
  //   if (el) {
  //     el.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
  //   } else {
  //     setTimeout(() => {
  //       el = document.getElementById('class' + index);
  //       el.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
  //     }, 1000);
  //   }
  // }
  //
  // mediumClick(mediumName: string, isMediumClicked?: boolean) {
  //   if (isMediumClicked) {
  //     // this.generateMediumInteractTelemetry(mediumName, this.getGroupByPageReq.medium[0]);
  //   }
  //   this.getGroupByPageReq.medium = [mediumName];
  //   if (this.currentMedium !== mediumName && isMediumClicked) {
  //     this.getGroupByPage(false, !isMediumClicked);
  //   }
  //
  //   for (let i = 0, len = this.subjects.length; i < len; i++) {
  //     if (this.subjects[i].name === mediumName) {
  //       this.currentMedium = this.subjects[i].name;
  //       this.subjects[i].selected = true;
  //     } else {
  //       this.subjects[i].selected = false;
  //     }
  //   }
  // }

  handleBackButton() {

  }

  handleHeaderEvents($event) {
    switch ($event.name) {
      case 'back':
        // this.telemetryGeneratorService.generateBackClickedTelemetry(
        // PageId.ONBOARDING_PROFILE_PREFERENCES, Environment.ONBOARDING, true);
        // this.dismissPopup();
        this.navCtrl.pop();
        break;
    }
  }
}
