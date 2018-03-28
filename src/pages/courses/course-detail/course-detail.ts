import { CourseBatchesComponent } from './../course-batches/course-batches';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ContentService } from 'sunbird';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the CourseDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'course-detail',
  templateUrl: 'course-detail.html'
})
export class CourseDetailComponent {

  /**
   * Contains content details
   */
  contentDetail: any;

  /**
   * To hide menu
   */
  tabBarElement: any;

  /**
   * Contains children content data
   */
  childrenData: Array<any>;

  /**
   * Show loader while importing content
   */
  showChildrenLoader: boolean;

  /**
   * To hold course hierarchy 
   */
  hierarchyInfo: any;

  /**
   * Contains course structure information
   */
  courseStructure: any;

  /**
   * 
   */
  objectKeys = Object.keys;

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Contains ref of navigation controller 
   */
  public navCtrl: NavController;

  /**
   * Contains ref of navigation params
   */
  public navParams: NavParams;

  /**
   * Contains reference of zone service
   */
  public zone: NgZone;

  /**
   * 
   * @param navCtrl 
   * @param navParams 
   * @param contentService 
   */
  constructor(navCtrl: NavController, navParams: NavParams, contentService: ContentService, zone: NgZone, private http: HttpClient,
    private events: Events) {
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    console.log('Course identifier ===> ', this.navParams.get('identifier'));
  }

  /** 
   * To get content details
   */
  getContentDetails() {
    const option = {
      contentId: this.navParams.get('identifier'),
      attachFeedback: false,
      attachContentAccess: false,
      refreshContentDetails: false
    }

    this.contentService.getContentDetail(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('content details response ==>', data);
        if (data && data.result) {
          this.contentDetail = data.result.contentData ? data.result.contentData : [];
          if (data.result.isAvailableLocally === false) {
            this.importContent();
          } else {
            this.importChildrenContent();
          }
        }
      });
    },
    error => {
      console.log('error while loading content details', error);
    });
  }


  /**
   * To import content
   */
  importContent(): void {
    console.log('importing content==> ');
    this.showChildrenLoader = true;
    const option = {
      contentImportMap: {
        [0]: {
          isChildContent: false,
          destinationFolder: '/storage/emulated/0/Android/data/org.sunbird.app/files',
          contentId: this.navParams.get('identifier'),
          correlationData: []
        }
      },
      contentStatusArray: []
    }

    this.contentService.importContent(option, (data: any) => {
      console.log('datata', data);
    },
      error => {
        console.log('error while loading content details', error);
      });
  }

  /**
   * 
   */
  importChildrenContent(): void {
    console.log('import child content')
    this.showChildrenLoader = true;
    const option = {
      contentId: this.navParams.get('identifier'),
      hierarchyInfo: null,
      level: 1
    };

    this.contentService.getChildContents(option, (data: any) => {
      this.zone.run(() => {
        data = JSON.parse(data);
        console.log('children data success ==>', data)
        this.childrenData = data.result;
      });
    },
      (error: string) => {
        console.log('error while fetching children', error);
      });
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.tabBarElement.style.display = 'none';
    this.getContentDetails();
    this.courseStructure = this.navParams.get('contentTypesCount')

    this.events.subscribe('genie.event', (data) => {
      data = JSON.parse(data);
      let res = data;
      if (res.data && res.data.status === 'IMPORT_COMPLETED' && res.type === 'contentImport') {
        this.importChildrenContent();
      }
    });
  }

  ionViewWillLeave(): void {
    this.tabBarElement.style.display = 'flex';
    this.events.unsubscribe('genie.event');
  }

  navigateToBatchListPage(id: string): void {
    this.navCtrl.push(CourseBatchesComponent, { identifier: this.navParams.get('identifier') });
  }
}
