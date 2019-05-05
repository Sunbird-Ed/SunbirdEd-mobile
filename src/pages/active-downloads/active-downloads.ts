import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {IonicPage, NavController, PopoverController, ViewController} from 'ionic-angular';
import {ActiveDownloadsInterface} from './active-downloads.interface';
import {Observable, Subscription} from 'rxjs';
import {
  ContentDownloadRequest,
  DownloadEventType,
  DownloadProgress,
  DownloadRequest,
  DownloadService,
  EventNamespace,
  EventsBusService
} from 'sunbird-sdk';
import {SbPopoverComponent} from '@app/component';
import {AppHeaderService, CommonUtilService} from '@app/service';

@IonicPage()
@Component({
  selector: 'page-active-downloads',
  templateUrl: 'active-downloads.html',
})
export class ActiveDownloadsPage implements OnInit, OnDestroy, ActiveDownloadsInterface {

  downloadProgressMap: { [key: string]: number };
  activeDownloadRequests$: Observable<ContentDownloadRequest[]>;
  defaultImg = 'assets/imgs/ic_launcher.png';

  private _appHeaderSubscription?: Subscription;
  private _downloadProgressSubscription?: Subscription;
  private _headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [] as string[]
  };

  constructor(
    private popoverCtrl: PopoverController,
    private viewCtrl: ViewController,
    private changeDetectionRef: ChangeDetectorRef,
    private headerService: AppHeaderService,
    private navCtrl: NavController,
    private commonUtilService: CommonUtilService,
    @Inject('DOWNLOAD_SERVICE') private downloadService: DownloadService,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
  ) {
    this.downloadProgressMap = {};
    // @ts-ignore
    this.activeDownloadRequests$ = this.downloadService.getActiveDownloadRequests();
  }

  ngOnInit() {
    this.initDownloadProgress();
    this.initAppHeader();
  }

  ngOnDestroy() {
    if (this._downloadProgressSubscription) {
      this._downloadProgressSubscription.unsubscribe();
    }
    if (this._appHeaderSubscription) {
      this._appHeaderSubscription.unsubscribe();
    }
  }

  cancelAllDownloads(): void {
    this.showCancelPopUp();
  }

  cancelDownload(downloadRequest: DownloadRequest): void {
    this.showCancelPopUp(downloadRequest);
  }

  getContentDownloadProgress(contentId: string): number {
    return this.downloadProgressMap[contentId] && (this.downloadProgressMap[contentId] > -1) ? this.downloadProgressMap[contentId] : 0;
  }

  private initDownloadProgress(): void {
    // @ts-ignore
    this._downloadProgressSubscription = this.eventsBusService.events(EventNamespace.DOWNLOADS)
      .filter((event) => event.type === DownloadEventType.PROGRESS)
      .do((event) => {
        const downloadEvent = event as DownloadProgress;
        this.downloadProgressMap[downloadEvent.payload.identifier] = downloadEvent.payload.progress;
        this.changeDetectionRef.detectChanges();
      }).subscribe();
  }

  private initAppHeader() {
    this._appHeaderSubscription = this.headerService.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this._headerConfig = this.headerService.getDefaultPageConfig();
    this._headerConfig.actionButtons = [];
    this._headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this._headerConfig);
  }

  private handleHeaderEvents(event: { name: string }) {
    switch (event.name) {
      case 'back':
        this.navCtrl.pop();
        break;
    }
  }

  private showCancelPopUp(downloadRequest?: DownloadRequest): void {
    const popupMessage = downloadRequest ? 'CANCEL_DOWNLOAD_MESSAGE' : 'CANCEL_ALL_DOWNLOAD_MESSAGE';
    const confirm = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('CANCEL_DOWNLOAD_TITLE'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage(popupMessage),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL_DOWNLOAD'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      // metaInfo: this.content.contentData.name,
    }, {
      cssClass: 'sb-popover danger',
    });

    confirm.present({
      ev: event
    });

    confirm.onDidDismiss(async (canDelete: any) => {
      if (canDelete) {
        downloadRequest ? await this.downloadService.cancel(downloadRequest).toPromise() : await this.downloadService.cancelAll().toPromise();
      }
    });
  }

  // headerObservable: any;
  // networkSubscription: any;
  // toast: any;
  // headerConfig = {
  //   showHeader: true,
  //   showBurgerMenu: false,
  //   actionButtons: []
  // };

  // constructor(private navCtrl: NavController, private navParams: NavParams,
  //    private headerServie: AppHeaderService, private events: Events, private popoverCtrl: PopoverController,
  //    private commonUtilService: CommonUtilService, private viewCtrl: ViewController, private toastController: ToastController) {
  // }

  // ngOnInit() {
  //   // this.downloadService.getActiveDownloadRequest();
  // }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ActiveDownloadsPage');
  // }
  // ionViewWillEnter() {
  //   this.headerObservable = this.headerServie.headerEventEmitted$.subscribe(eventName => {
  //     this.handleHeaderEvents(eventName);
  //   });

  //   this.headerConfig = this.headerServie.getDefaultPageConfig();
  //   this.headerConfig.actionButtons = [];
  //   this.headerConfig.showBurgerMenu = false;
  //   this.headerServie.updatePageConfig(this.headerConfig);
  //   this.networkSubscription =  this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
  //     if  (available) {
  //       this.presentToastForOffline();
  //     } else {
  //       this.presentToastForOffline();
  //     }
  //   });
  // }

  // ionViewWillLeave() {
  //   if (this.networkSubscription) {
  //     this.networkSubscription.unsubscribe();
  //     if (this.toast) {
  //       this.toast.dismiss();
  //       this.toast = undefined;
  //     }
  //   }
  // }

  // handleHeaderEvents($event) {
  //   switch ($event.name) {
  //     case 'back':
  //     // this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.COLLECTION_DETAIL, Environment.HOME,
  //     //   true, this.cardData.identifier, this.corRelationList);
  //     this.navCtrl.pop();
  //                   break;
  //   }
  // }
  // cancelActiveDownload() {
  //   // this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
  //   //   InteractSubtype.KEBAB_MENU_CLICKED,
  //   //   Environment.HOME,
  //   //   PageId.CONTENT_DETAIL,
  //   //   undefined,
  //   //   undefined,
  //   //   this.objRollup,
  //   //   this.corRelationList);
  //   const confirm = this.popoverCtrl.create(SbPopoverComponent, {
  //     sbPopoverHeading: 'Cancel Download?',
  //     // sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_DELETE'),
  //     actionsButtons: [
  //       {
  //         btntext: 'Cancel Download',
  //         btnClass: 'popover-color'
  //       },
  //     ],
  //     icon: null,
  //     // metaInfo: this.content.contentData.name,
  //     sbPopoverMainTitle: 'Cancelling Download will remove the content from the Active Downloads',
  //   }, {
  //       cssClass: 'sb-popover danger',
  //     });
  //   confirm.present({
  //     ev: event
  //   });
  //   confirm.onDidDismiss((canDelete: any) => {
  //     if (canDelete) {
  //       this.deleteContent();
  //       this.viewCtrl.dismiss();
  //     }
  //   });
  // }

  // cancelAllActiveDownloads() {
  //   const confirm = this.popoverCtrl.create(SbPopoverComponent, {
  //     sbPopoverHeading: 'Cancel Downloads?',
  //     // sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_DELETE'),
  //     actionsButtons: [
  //       {
  //         btntext: 'Cancel Downloads',
  //         btnClass: 'popover-color'
  //       },
  //     ],
  //     icon: null,
  //     // metaInfo: this.content.contentData.name,
  //     sbPopoverMainTitle: 'Cancelling Download will remove the content from the Active Downloads',
  //   }, {
  //       cssClass: 'sb-popover danger',
  //     });
  //   confirm.present({
  //     ev: event
  //   });
  //   confirm.onDidDismiss((canDelete: any) => {
  //     if (canDelete) {
  //       this.deleteContent();
  //       this.viewCtrl.dismiss();
  //     }
  //   });
  // }

  // async presentToastForOffline() {
  //     this.toast =  await this.toastController.create({
  //   //  duration: 2000,
  //     message: this.commonUtilService.translateMessage('No Internet Connectivity') + ', Downloads' +
  //     +' will be resumed once the internet is back.',
  //     showCloseButton: true,
  //     position: 'top',
  //     closeButtonText: '',
  //     cssClass: 'toastAfterHeader'
  //   });
  //   this.toast.present();
  //   // .toast.onDidDismiss(() => {
  //   //   this.toast = undefined;
  //   // });
  // }


  // deleteContent() {

  // }
}
