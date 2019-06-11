import {Component, Inject, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AppHeaderService, CommonUtilService} from '@app/service';
import {Observable, Subscription} from 'rxjs';
import {
  ContentService,
  DeviceInfo,
  EventNamespace,
  EventsBusService,
  StorageDestination, StorageEventType,
  StorageService, StorageTransferProgress,
  StorageVolume
} from 'sunbird-sdk';
import {StorageSettingsInterface} from "@app/pages/storage-settings/storage-settings-interface";
import {SbPopoverComponent} from "@app/component";

@IonicPage()
@Component({
  selector: 'page-storage-settings',
  templateUrl: 'storage-settings.html',
})
export class StorageSettingsPage implements OnInit, StorageSettingsInterface {
  private _storageVolumes: StorageVolume[] = [];
  private _appHeaderSubscription?: Subscription;
  private _headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [] as string[]
  };

  public StorageDestination = StorageDestination;

  get isExternalMemoryAvailable(): boolean {
    return !!this._storageVolumes.find((volume) => volume.storageDestination === StorageDestination.EXTERNAL_STORAGE);
  }

  get totalExternalMemorySize(): number {
    return this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.EXTERNAL_STORAGE)!
      .info.totalSize
  }

  get totalInternalMemorySize(): number {
    return this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.INTERNAL_STORAGE)!
      .info.totalSize
  }

  get availableExternalMemorySize(): number {
    return this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.EXTERNAL_STORAGE)!
      .info.availableSize
  }

  get availableInternalMemorySize(): number {
    return this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.INTERNAL_STORAGE)!
      .info.availableSize
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private commonUtilService: CommonUtilService,
    private headerService: AppHeaderService,
    private popoverCtrl: PopoverController,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    @Inject('CONTENT_SERVICE') private contentService: ContentService) {
  }

  ngOnInit() {
    this.initAppHeader();
    this.fetchStorageVolumes();
  }

  getStorageDestination(): Observable<StorageDestination> {
    return this.storageService.getStorageDestination() as any;
  }

  async showShouldTransferContentsPopup(storageDestination: StorageDestination): Promise<void> {
    const confirm = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFER_CONTENT'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_TRANSFER_TO_SDCARD'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('MOVE'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      metaInfo: 'Total Size : 1.5GB',
    }, {
      cssClass: 'sb-popover dw-active-downloads-popover',
    });

    confirm.present();

    confirm.onDidDismiss(async (shouldTransfer: boolean) => {
      if (shouldTransfer) {
        this.storageService.transferContents({ storageDestination, contents: [] }).subscribe();
        await this.showTransferContentsPopup();
      }
    });
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

  private fetchStorageVolumes() {
    this.deviceInfo.getStorageVolumes().subscribe((v) => this._storageVolumes = v);
  }

  private async showTransferContentsPopup(): Promise<undefined> {
    const transferStatus$ = this.eventsBusService
      .events(EventNamespace.STORAGE)
      .takeWhile(e => e.type === StorageEventType.TRANSFER_COMPLETED)
      .filter(e => e.type === StorageEventType.TRANSFER_PROGRESS)
      .map((e) => (e as StorageTransferProgress).payload.progress.transferSize / (e as StorageTransferProgress).payload.progress.totalSize);

    const confirmCancel = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: 'Transferring files',
      sbPopoverDynamicMainTitle: transferStatus$,
      actionsButtons: [
        {
          btntext: 'Cancel',
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      metaInfo: 'Transferring Content to SD Card',
      sbPopoverContent: '15GB / 20 GB'
    }, {
      cssClass: 'sb-popover dw-active-downloads-popover',
    });

    await confirmCancel.present();

    // confirmCancel.onDidDismiss(async (shouldCancel: boolean) => {
    //   if (shouldCancel) {
    //     const cancel = this.popoverCtrl.create(SbPopoverComponent, {
    //       sbPopoverHeading: 'Transfer Stopped',
    //       sbPopoverMainTitle: '75%',
    //       actionsButtons: [],
    //       icon: null,
    //       metaInfo: 'Cancelling in Progress..',
    //     }, {
    //       cssClass: 'sb-popover dw-active-downloads-popover',
    //     });
    //     cancel.present();
    //   }
    // });

    return;
  }

  private async retryTransfer(): Promise<undefined> {
    return undefined;
  }
}


