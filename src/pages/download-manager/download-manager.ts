import { AppGlobalService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { AppStorageInfo, DownloadManagerPageInterface } from './download-manager.interface';
import { AudienceFilter, ContentType } from './../../app/app.constant';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { Events, IonicPage, Loading, NavController, NavParams, Popover, PopoverController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {
  Content,
  ContentDeleteRequest,
  ContentDeleteResponse,
  ContentDeleteStatus,
  ContentRequest,
  ContentService,
  ContentSortCriteria,
  ContentSpaceUsageSummaryRequest,
  ContentSpaceUsageSummaryResponse,
  DeviceInfo,
  Profile,
  ProfileType,
  SortOrder
} from 'sunbird-sdk';
import { SbPopoverComponent } from '@app/component';
import { AppHeaderService } from '@app/service';
import { ActiveDownloadsPage } from '../active-downloads/active-downloads';
import { PageId, InteractType, Environment, InteractSubtype } from '@app/service/telemetry-constants';

/**
 * Generated class for the DownloadManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download-manager',
  templateUrl: 'download-manager.html',
})
export class DownloadManagerPage implements DownloadManagerPageInterface, OnInit {
  headerObservable: any;

  storageInfo: AppStorageInfo;
  downloadedContents: Content[] = [];
  profile: Profile;
  audienceFilter = [];
  guestUser = false;
  defaultImg: string;
  loader?: Loading;
  deleteAllConfirm: Popover;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,
    private ngZone: NgZone,
    private popoverCtrl: PopoverController,
    private commonUtilService: CommonUtilService,
    private viewCtrl: ViewController,
    private headerServie: AppHeaderService, private events: Events,
    private appGlobalService: AppGlobalService,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    private telemetryGeneratorService: TelemetryGeneratorService,
  ) {
  }

  ngOnInit() {
    this.defaultImg = 'assets/imgs/ic_launcher.png';
    this.getCurrentUser();
    this.getDownloadedContents(true);
    this.subscribeEvents();
  }

  ionViewWillEnter() {
    this.events.subscribe('update_header', () => {
      this.headerServie.showHeaderWithHomeButton(['download']);
    });
    this.headerObservable = this.headerServie.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });

    this.headerServie.showHeaderWithHomeButton(['download']);
    this.getAppStorageInfo();
  }

  async getAppStorageInfo() {

    const req: ContentSpaceUsageSummaryRequest = { paths: [cordova.file.externalDataDirectory] };
    this.contentService.getContentSpaceUsageSummary(req).toPromise()
      .then((res: ContentSpaceUsageSummaryResponse[]) => {
        this.deviceInfo.getAvailableInternalMemorySize().toPromise()
          .then((size) => {
            this.storageInfo = {
              usedSpace: res[0].sizeOnDevice,
              availableSpace: parseInt(size, 10)
            };
            console.log('this.storageInfo', this.storageInfo);
          });
      });

  }

  getCurrentUser(): void {
    this.guestUser = !this.appGlobalService.isUserLoggedIn();
    const profileType = this.appGlobalService.getGuestUserType();

    if (this.guestUser) {
      if (profileType === ProfileType.TEACHER) {
        this.audienceFilter = AudienceFilter.GUEST_TEACHER;
      } else if (profileType === ProfileType.STUDENT) {
        this.audienceFilter = AudienceFilter.GUEST_STUDENT;
      }
    } else {
      this.audienceFilter = AudienceFilter.LOGGED_IN_USER;
    }

    this.profile = this.appGlobalService.getCurrentUser();
  }

  async getDownloadedContents(shouldGenerateTelemetry, sortCriteria?) {
    this.loader = this.commonUtilService.getLoader();
    this.loader.present();
    this.loader.onDidDismiss(() => {
      this.loader = undefined;
    });
    const defaultSortCriteria: ContentSortCriteria[] = [{
      sortAttribute: 'sizeOnDevice',
      sortOrder: SortOrder.DESC
    }];
    const requestParams: ContentRequest = {
      uid: this.profile ? this.profile.uid : undefined,
      contentTypes: ContentType.FOR_LIBRARY_TAB,
      audience: this.audienceFilter,
      sortCriteria: sortCriteria || defaultSortCriteria
    };
    if (shouldGenerateTelemetry) {
      await this.getAppStorageInfo();
    }
    console.log('requestParams', requestParams);
    await this.contentService.getContents(requestParams).toPromise()
      .then(data => {
        if (shouldGenerateTelemetry) {
          this.generateInteractTelemetry(data.length, this.storageInfo.usedSpace, this.storageInfo.availableSpace);
        }
        data.forEach((value) => {
          value.contentData['lastUpdatedOn'] = value.lastUpdatedTime;
          if (value.contentData.appIcon) {
            if (value.contentData.appIcon.includes('http:') || value.contentData.appIcon.includes('https:')) {
              if (this.commonUtilService.networkInfo.isNetworkAvailable) {
                value.contentData.appIcon = value.contentData.appIcon;
              } else {
                value.contentData.appIcon = this.defaultImg;
              }
            } else if (value.basePath) {
              value.contentData.appIcon = value.basePath + '/' + value.contentData.appIcon;
            }
          }

        });
        this.ngZone.run(() => {
          console.log('downloadedContents', data);
          this.downloadedContents = data;
          this.loader.dismiss();
        });
      })
      .catch(() => {
        this.ngZone.run(() => {
          this.loader.dismiss();
        });
      });
  }

  private generateInteractTelemetry(contentCount: number, usedSpace: number, availableSpace: number) {
    const valuesMap = {};
    valuesMap['contentsCount'] = contentCount;
    valuesMap['spaceTakenByApp'] = this.telemetryGeneratorService.transform(usedSpace, 2);
    valuesMap['freeSpace'] = this.telemetryGeneratorService.transform(availableSpace, 2);
    this.telemetryGeneratorService.generateExtraInfoTelemetry(valuesMap, PageId.DOWNLOADS);
  }

  deleteContents(contentsList) {
    const contentDeleteRequest: ContentDeleteRequest = {
      contentDeleteList: contentsList
    };
    if (contentsList.length > 1) {
      this.deleteAllContents(contentDeleteRequest);
    } else {
      this.loader = this.commonUtilService.getLoader();
      this.loader.present();
      this.loader.onDidDismiss(() => {
        this.loader = undefined;
      });
      // const telemetryObject = new TelemetryObject(this.content.identifier, this.content.contentType, this.content.pkgVersion);

      // this.telemetryGeneratorService.generateInteractTelemetry(
      //   InteractType.TOUCH,
      //   InteractSubtype.DELETE_CLICKED,
      //   Environment.HOME,
      //   this.pageName,
      //   telemetryObject,
      //   undefined,
      //   this.objRollup,
      //   this.corRelationList);


      console.log('contentDeleteRequest', contentDeleteRequest);
      this.contentService.deleteContent(contentDeleteRequest).toPromise()
        .then((data: ContentDeleteResponse[]) => {
          console.log('deleteContentresp', data);
          this.loader.dismiss();
          // this.getDownloadedContents();
          if (data && data[0].status === ContentDeleteStatus.NOT_FOUND) {
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('CONTENT_DELETE_FAILED'));
          } else {
            this.events.publish('savedResources:update', {
              update: true
            });
            this.commonUtilService.showToast(this.commonUtilService.translateMessage('MSG_RESOURCE_DELETED'));
          }
        }).catch((error: any) => {
          this.loader.dismiss();
          console.log('delete response err: ', error);
          this.commonUtilService.showToast(this.commonUtilService.translateMessage('CONTENT_DELETE_FAILED'));
        });
    }
  }

  deleteAllContents(contentDeleteRequest: ContentDeleteRequest) {
    console.log('in cancel deleteall contents', contentDeleteRequest);
    this.deleteAllConfirm = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('DELETE_PROGRESS'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL_LOWER_CASE'),
          btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info cancel-delete'
        },
      ],
      icon: null,
      sbPopoverMainTitle: '0/' + contentDeleteRequest.contentDeleteList.length,
      metaInfo: this.commonUtilService.translateMessage('FILES_DELETED'),
      // sbPopoverContent: this.commonUtilService.translateMessage('FILES_DELETED')
    }, {
        cssClass: 'sb-popover danger sb-popover-cancel-delete',
      });
    this.deleteAllConfirm.present({
      ev: event
    });
    this.deleteAllConfirm.onDidDismiss((cancel: any) => {
      console.log('onDidDismiss cancel', cancel);
      if (cancel) {
        this.contentService.clearContentDeleteQueue().toPromise();
        // this.viewCtrl.dismiss();
      }
    });
    this.contentService.enqueueContentDelete(contentDeleteRequest).toPromise();
    this.contentService.getContentDeleteQueue().skip(1).takeWhile((list) => !!list.length)
      .finally(() => {
        this.events.publish('deletedContentList:changed', {
          deletedContentsInfo: {
            totalCount: contentDeleteRequest.contentDeleteList.length,
            deletedCount: contentDeleteRequest.contentDeleteList.length
          }
        });

        this.deleteAllConfirm.dismiss();

        this.getAppStorageInfo();

        this.events.publish('savedResources:update', {
          update: true
        });
      })
      .subscribe((list) => {
        console.log('deleteList', list);
        this.events.publish('deletedContentList:changed', {
          deletedContentsInfo: {
            totalCount: contentDeleteRequest.contentDeleteList.length,
            deletedCount: contentDeleteRequest.contentDeleteList.length - list.length
          }
        });
      });
  }


  onSortCriteriaChange(sortAttribute): void {
    console.log('parent onSortCriteriaChange', sortAttribute);
    let sortAttr: string;
    if (sortAttribute.content === 'Content size') {
      sortAttr = 'sizeOnDevice';
    } else if (sortAttribute.content === 'Last viewed') {
      sortAttr = 'lastUsedOn';
    }
    const valuesMap = {};
    valuesMap['selectedOption'] = sortAttr;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.SORT_OPTION_SELECTED,
      Environment.DOWNLOADS,
      PageId.DOWNLOADS);
    const sortCriteria: ContentSortCriteria[] = [{
      sortOrder: SortOrder.DESC,
      sortAttribute: sortAttr
    }];
    this.getDownloadedContents(sortCriteria);
  }

  ionViewWillLeave(): void {
    this.events.unsubscribe('update_header');
    this.headerObservable.unsubscribe();
    // this.events.unsubscribe('savedResources:update');
  }

  subscribeEvents() {
    this.events.subscribe('savedResources:update', (res) => {
      if (res && res.update) {
        this.getDownloadedContents(false);
      }
    });
  }

  handleHeaderEvents($event) {
    console.log('inside handleHeaderEvents', $event);
    switch ($event.name) {
      case 'download':
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.ACTIVE_DOWNLOADS_CLICKED,
          Environment.DOWNLOADS,
          PageId.DOWNLOADS);
        this.download();
        break;
    }
  }

  download() {
    this.navCtrl.push(ActiveDownloadsPage);
  }

}
