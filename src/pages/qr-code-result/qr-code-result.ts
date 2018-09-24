import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContentService, CorrelationData, ChildContentRequest } from 'sunbird';
import { ContentDetailsPage } from '../content-details/content-details';
@IonicPage()
@Component({
  selector: 'page-qr-code-result',
  templateUrl: 'qr-code-result.html',
})
export class QrCodeResultPage {

  /**
  * To hold identifier
  */
  identifier: string;

  /**
  * To hold identifier
  */
  SearchIdentifier: string;

  /**
  * Contains children content data
  */
  childrenData: Array<any>;

  /**
  * Show loader while importing content
  */
  showChildrenLoader: boolean;

  /**
   * Contains card data of previous state
   */
  content: any;

  /**
   * Contains Parent Content Details
   */
  parentContent: any;

  /**
   * Contains
   */
  isParentContentAvailable: boolean = false;


  corRelationList: Array<CorrelationData>;
  shouldGenerateEndTelemetry: boolean = false;
  source: string = "";
  results: Array<any> = [];
  defaultImg: string;
  parents : Array<any> = [];
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public contentService: ContentService,
    public zone: NgZone, ) {
      this.defaultImg = 'assets/imgs/ic_launcher.png'
  }

  /**
   * Ionic life cycle hook
   */

  ionViewWillEnter(): void {
    this.zone.run(() => {
      this.resetVariables();
      this.content = this.navParams.get('content');
      this.corRelationList = this.navParams.get('corRelation');
      this.shouldGenerateEndTelemetry = this.navParams.get('shouldGenerateEndTelemetry');
      this.source = this.navParams.get('source');
    
      //check for parent content
      this.parentContent = this.navParams.get('parentContent');
      console.log('parent content', this.parentContent);
      this.SearchIdentifier = this.content.identifier;
      console.log('search Identifier', this.SearchIdentifier);
     
      
      
      if(this.parentContent) {
        this.isParentContentAvailable = true;
        this.identifier = this.parentContent.identifier;
      } else {
        this.isParentContentAvailable = false;
        this.identifier = this.content.identifier;
      }
      
      console.log('content :: ', this.content);
      console.log('identifier :: ', this.identifier);
      this.getChildContents();
      console.log("content for results",this.results);
      // console.log("parents", this.parents);
      
     
     // console.log("the parents is", this.parents);
      
      // if (!this.didViewLoad) {
      //   this.generateRollUp();
      //   let contentType = this.content.contentData ? this.content.contentData.contentType : this.content.contentType;
      //   this.objType = contentType;
      //   this.generateStartEvent(this.content.identifier, contentType, this.content.pkgVersion);
      //   this.generateImpressionEvent(this.content.identifier, contentType, this.content.pkgVersion);
      // }
      // this.didViewLoad = true;
      // this.setContentDetails(this.identifier, true);
      // this.subscribeGenieEvent();
    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCodeResultPage');
  }

  /**
   * Reset all values
   */
  resetVariables() {
  }

  /**
   * 
   */
  getChildContents() {
    const request : ChildContentRequest = { contentId: this.identifier };
    console.log('request', request);
    this.contentService.getChildContents(request, (data: any) => {
      data = JSON.parse(data);
      console.log('data :: ', data);
      if(this.isParentContentAvailable) {
        // Find out child content node
        // Then display the list
        this.parents.splice(0, this.parents.length);
        this.parents.push(data.result);
        this.findContentNode(data.result);
        // this.showAllChild(data);
      } else {
        // Then display the list
        // this.showAllChild(data);
      }
    },
      (error: string) => {
        console.log('Error: while fetching child contents ===>>>', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      });
  }

  private showAllChild(content: any) {
    if(content.children === undefined) {
      this.results.push(content);
      return ;
    }
    content.children.forEach(child => {
      this.showAllChild(child);
    });
  }

  private findContentNode(data: any) {
    if(data !== undefined && data.identifier === this.SearchIdentifier) {
      this.showAllChild(data);
      //this.parents.reverse();
       console.log("content for results",this.results);
       console.log("parents array ",this.parents);
      return true;
    }
    if(data.children !== undefined) {
      data.children.forEach(child => {
        this.parents.push(child)
        var isFound = this.findContentNode(child);
        if(isFound === true)
          return true;
        this.parents.splice(-1,1);
      });
    }
    return false;
  }

  // [{id: "123", parentRote: "123"}, {id: "124", parentRote: "123"}]
  // temp={
  //   id:asd[i];
  //   parentRoute: parent[i].id + asd[i];
  // }

  navigateToDetailsPage(content) {
    this.navCtrl.push(ContentDetailsPage, {
      content: content,
      depth: '1',
      isChildContent: true,
      downloadAndPlay: true
    });
  }

}