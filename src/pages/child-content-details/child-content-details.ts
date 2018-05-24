import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { ContentService, FileUtil } from 'sunbird';
import { CourseDetailPage } from '../course-detail/course-detail';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { MimeType, ContentType } from '../../app/app.constant';

/**
 * Generated class for the ChildContentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-child-content-details',
  templateUrl: 'child-content-details.html',
})
export class ChildContentDetailsPage {
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
   * Default method of class ParentDetailsComponent
   * 
   * @param navParams 
   * @param contentService 
   * @param zone 
   * @param navCtrl 
   */
  constructor(private navParams: NavParams,
    private contentService: ContentService,
    private zone: NgZone,
    private navCtrl: NavController,
    private fileUtil: FileUtil) {

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
          destinationFolder: this.fileUtil.internalStoragePath(),
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
        if (data.result && data.result.children && data.result.mimeType === MimeType.COLLECTION) {
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
  navigateToChildrenDetailsPage(content, depth): void {
    this.depth = depth;
    /*this.navCtrl.push(ChildContentDetailsPage, {
      content: item,
      depth: depth
    })*/

    this.zone.run(() => {
      if (content.contentType === ContentType.COURSE) {
        console.warn('Inside CourseDetailPage >>>');
        this.navCtrl.push(CourseDetailPage, {
          content: content,
          depth: depth
        })
      } else if (content.mimeType === MimeType.COLLECTION) {
        console.warn('Inside CollectionDetailsPage >>>');
        this.navCtrl.push(CollectionDetailsPage, {
          content: content,
          depth: depth
        })
      } else {
        console.warn('Inside ContentDetailsPage >>>');
        this.navCtrl.push(ContentDetailsPage, {
          content: content,
          depth: depth
        })
      }
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
