import { NavParams, NavController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { ContentService } from 'sunbird';

/**
 * Generated class for the ParentDetailsComponent component.
 */
@Component({
  selector: 'parent-details',
  templateUrl: 'parent-details.html'
})
export class ParentDetailsComponent {
  /**
   * Contains content details
   */
  details: any;

  /**
   * To hide menu bar
   */
  tabBarMenuElement: any;

  /**
   * Contains child content
   */
  childrenData: any;

  /**
   * Contains current course depth
   */
  depth: string;

  /**
   * Contains course is locally available or not
   */
  isAvailableLocally: boolean;

  /**
   * Contains reference of navigation controller
   */
  navCtrl: NavController;

  /**
   * Contains reference of content service
   */
  public contentService: ContentService;

  /**
   * Contains ref of navigation params
   */
  public navParams: NavParams;

  /**
   * Contains reference of zone service
   */
  public zone: NgZone;

  /**
   * Default method of class ParentDetailsComponent
   * 
   * @param navParams 
   * @param contentService 
   * @param zone 
   * @param navCtrl 
   */
  constructor(navParams: NavParams, contentService: ContentService, zone: NgZone, navCtrl: NavController) {
    this.navParams = navParams;
    this.contentService = contentService;
    this.zone = zone;
    this.navCtrl = navCtrl;
    this.tabBarMenuElement = document.querySelector('.tabbar.show-tabbar');
  }

  /**
   * Get content details
   */
  getContentDetails(data): void {
    const option = {
      contentId: data.identifier,
      attachFeedback: false,
      attachContentAccess: false,
      refreshContentDetails: false
    }

    this.contentService.getContentDetail(option, (res: any) => {
      this.zone.run(() => {
        res = JSON.parse(res);
        console.log('Parent component content details response ==>', res);
        if (res && res.result) {
          this.details = res.result.contentData;
          this.isAvailableLocally = res.result.isAvailableLocally;
          this.details.size = this.niceBytes(+this.details.size);
          this.details.contentTypesCount = this.details.contentTypesCount ? JSON.parse(this.details.contentTypesCount) : '';
          if (res.result.isAvailableLocally === false && res.result.contentType !== 'resource') {
            this.importContent(data);
          } else if (res.result.contentType !== 'resource') {
            this.getChildContents(data);
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
  importContent(data): void {
    console.log('importing content ==> ');
    const option = {
      contentImportMap: {
        [0]: {
          isChildContent: false,
          destinationFolder: '/storage/emulated/0/Android/data/org.sunbird.app/files',
          contentId: data.identifier,
          correlationData: []
        }
      },
      contentStatusArray: []
    }

    // Call content service
    this.contentService.importContent(option, (data: any) => {
      console.log('Children component: import progress details...', data);
    },
      error => {
        console.log('error while loading content details', error);
      });
  }

  /**
   * Get child contents
   */
  getChildContents(data): void {
    console.log('import child content')
    const option = {
      contentId: data.identifier,
      hierarchyInfo: null,
      level: 1
    };

    this.contentService.getChildContents(option, (data: any) => {
      data = JSON.parse(data);
      console.log('Parent component => Import child content data success ==>', data);
      this.zone.run(() => {
        if (data.result && data.result.children && data.result.mimeType === 'application/vnd.ekstep.content-collection') {
          this.childrenData = data.result.children
        } else {
          this.childrenData = [];
        }
      });
    },
      (error: string) => {
        console.log('error while fetching child content', error);
      });
  }

  /**
   * 
   * @param {object} item  contains content details
   * @param {string} depth course depth level
   */
  navigateToChildrenDetailsPage(item, depth): void {
    this.depth = depth;
    this.navCtrl.push(ParentDetailsComponent, {
      content: item,
      depth: depth
    })
  }

  /**
   * 
   * @param {string} x 
   */
  niceBytes(x) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l)
      n = n / 1024;
    return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
  }

  ionViewWillEnter(): void {
    this.tabBarMenuElement.style.display = 'none';
    let data = this.navParams.get('content');
    this.depth = this.navParams.get('depth');
    this.childrenData = [];
    console.log('parent data details', data);
    this.getContentDetails(data);
  }

  /**
   * Download content 
   */
  downloadContent(id) {
    let data = { identifier: id };
    this.importContent(data);
    this.isAvailableLocally = true;
  }
}
