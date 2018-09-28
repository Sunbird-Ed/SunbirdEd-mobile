import { Component, NgZone, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, Navbar } from 'ionic-angular';
import { ContentService, CorrelationData, ChildContentRequest } from 'sunbird';
import { ContentDetailsPage } from '../content-details/content-details';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { ContentType, MimeType } from '../../app/app.constant';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { TranslateService } from '@ngx-translate/core';
import {
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  ImpressionType,
  SharedPreferences,
  UserSource,
  Profile
} from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

@IonicPage()
@Component({
  selector: 'page-qr-code-result',
  templateUrl: 'qr-code-result.html'
})
export class QrCodeResultPage {
  unregisterBackButton: any;
  /**
   * To hold identifier
   */
  identifier: string;

  /**
   * To hold identifier
   */
  searchIdentifier: string;

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
  source: string = '';
  results: Array<any> = [];
  defaultImg: string;
  parents: Array<any> = [];
  @ViewChild(Navbar) navBar: Navbar;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contentService: ContentService,
    public zone: NgZone,
    public translate: TranslateService,
    public platform: Platform,
    private telemetryGeneratorService: TelemetryGeneratorService
  ) {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillEnter(): void {
    this.content = this.navParams.get('content');
    this.corRelationList = this.navParams.get('corRelation');
    this.shouldGenerateEndTelemetry = this.navParams.get(
      'shouldGenerateEndTelemetry'
    );
    this.source = this.navParams.get('source');

    //check for parent content
    this.parentContent = this.navParams.get('parentContent');
    this.searchIdentifier = this.content.identifier;

    if (this.parentContent) {
      this.isParentContentAvailable = true;
      this.identifier = this.parentContent.identifier;
    } else {
      this.isParentContentAvailable = false;
      this.identifier = this.content.identifier;
    }

    this.getChildContents();

    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        'DEVICE_BACK',
        Environment.HOME,
        'QR_SCAN_DIAL_CODE_RESULTS');
      this.navCtrl.pop();
      this.unregisterBackButton();
    }, 11);
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(ImpressionType.VIEW, '',
      'QR_SCAN_DIAL_CODE_RESULTS', '', '',
      Environment.HOME);

    this.navBar.backButtonClick = (e: UIEvent) => {
      this.handleNavBackButton();
    };
  }

  handleNavBackButton() {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      'NAV_BACK',
      Environment.HOME,
      'QR_SCAN_DIAL_CODE_RESULTS');
  }

  /**
   *
   */
  getChildContents() {
    const request: ChildContentRequest = { contentId: this.identifier };
    this.contentService.getChildContents(
      request,
      (data: any) => {
        data = JSON.parse(data);
        this.parents.splice(0, this.parents.length);
        this.parents.push(data.result);
        this.findContentNode(data.result);
      },
      (error: string) => {
        console.log('Error: while fetching child contents ===>>>', error);
        this.zone.run(() => {
          this.showChildrenLoader = false;
        });
      }
    );
  }

  private showAllChild(content: any) {
    if (content.children === undefined) {
      this.results.push(content);
      return;
    }
    content.children.forEach(child => {
      this.showAllChild(child);
    });
  }

  private findContentNode(data: any) {
    if (data !== undefined && data.identifier === this.searchIdentifier) {
      this.showAllChild(data);
      return true;
    }
    if (data.children !== undefined) {
      data.children.forEach(child => {
        this.parents.push(child);
        var isFound = this.findContentNode(child);
        if (isFound === true) {
          return true;
        }
        this.parents.splice(-1, 1);
      });
    }
    return false;
  }

  navigateToDetailsPage(content) {
    if (content.contentData.contentType === ContentType.COURSE) {
      this.navCtrl.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      this.navCtrl.push(CollectionDetailsPage, {
        content: content
      });
    } else {
      this.navCtrl.push(ContentDetailsPage, {
        content: content,
        depth: '1',
        isChildContent: true,
        downloadAndPlay: true
      });
    }
  }
}
