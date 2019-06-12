import {Component, Inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController, Popover} from 'ionic-angular';
import {AppHeaderService, CommonUtilService} from '@app/service';
import {Observable, Subscription, BehaviorSubject} from 'rxjs';
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
import {FileSizePipe} from '../../pipes/file-size/file-size';
import {SbGenericPopoverComponent} from '../../component/popups/sb-generic-popup/sb-generic-popover';

@IonicPage()
@Component({
  selector: 'page-storage-settings',
  templateUrl: 'storage-settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public storageDestination$: Observable<StorageDestination>;
  public spaceTakenBySunbird$: Observable<number>;

  get isExternalMemoryAvailable(): boolean {
    return !!this._storageVolumes.find((volume) => volume.storageDestination === StorageDestination.EXTERNAL_STORAGE);
  }

  get totalExternalMemorySize(): string {
    return this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.EXTERNAL_STORAGE)!
      .info.totalSize
  }

  get totalInternalMemorySize(): string {
    const internalVolume = this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.INTERNAL_STORAGE);
    return internalVolume ? internalVolume.info.totalSize : '0 Kb';
  }

  get availableExternalMemorySize(): number {
    return this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.EXTERNAL_STORAGE)!
      .info.availableSize
  }

  get availableInternalMemorySize(): number {
    const internalVolume = this._storageVolumes
      .find((volume) => volume.storageDestination === StorageDestination.INTERNAL_STORAGE);
    return internalVolume ? internalVolume.info.availableSize : 0;
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private commonUtilService: CommonUtilService,
    private headerService: AppHeaderService,
    private popoverCtrl: PopoverController,
    private fileSizePipe: FileSizePipe,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    @Inject('CONTENT_SERVICE') private contentService: ContentService) {
    this.storageDestination$ = this.storageService.getStorageDestination() as any;
    this.spaceTakenBySunbird$ = this.contentService
      .getContentSpaceUsageSummary({ paths: [cordova.file.externalDataDirectory] })
      .map((summary) => summary[0].sizeOnDevice) as any;
  }

  ngOnInit() {
    this.initAppHeader();
    this.fetchStorageVolumes();
  }

  async showShouldTransferContentsPopup(storageDestination: StorageDestination): Promise<void> {
    const spaceTakenBySunbird = await this.spaceTakenBySunbird$.toPromise();

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
      metaInfo: this.commonUtilService.translateMessage('TOTAL_SIZE') + this.fileSizePipe.transform(spaceTakenBySunbird),
    }, {
        cssClass: 'sb-popover dw-active-downloads-popover',
      });

    confirm.present();

    confirm.onDidDismiss(async (shouldTransfer: boolean) => {
      if (shouldTransfer) {
        this.storageService.transferContents({ storageDestination, contents: [{ identifier: 0 }, { identifier: 1 }, { identifier: 3 }] as any }).subscribe();
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
    this.deviceInfo.getStorageVolumes().subscribe((v) => {
      this._storageVolumes = v;
      console.log(this._storageVolumes);
      // this.changeDetectionRef.detectChanges();
    });
  }

  private async showTransferContentsPopup(): Promise<undefined> {
    let confirmCancel: Popover;
    const totalTransferSize = await this.spaceTakenBySunbird$.toPromise();

    this.eventsBusService
      .events(EventNamespace.STORAGE)
      .takeWhile(e => e.type !== StorageEventType.TRANSFER_COMPLETED)
      .filter(e => e.type === StorageEventType.TRANSFER_FAILED || e.type === StorageEventType.TRANSFER_FAILED_DUPLICATE_CONTENT)
      .do((e) => {
        switch (e.type) {
          case StorageEventType.TRANSFER_FAILED:
            this.showRetryTransferPopup(confirmCancel);
            break;
          case StorageEventType.TRANSFER_FAILED_DUPLICATE_CONTENT:
            this.showDuplicateContentPopup();
            break;
        }
      })
      .subscribe();

    const transferredSize$ = this.eventsBusService
      .events(EventNamespace.STORAGE)
      .takeWhile(e => e.type !== StorageEventType.TRANSFER_COMPLETED)
      .filter(e => e.type === StorageEventType.TRANSFER_PROGRESS)
      .scan((acc: number, e: StorageTransferProgress) => acc += e.payload.progress.transferSize, 0)
      .finally(() => {console.log('in Finally');
      confirmCancel.dismiss();
    });

    confirmCancel = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: 'Transferring files',
      sbPopoverDynamicMainTitle: transferredSize$
        .startWith(0)
        .map((transferredSize) => {
          return Math.round((transferredSize / totalTransferSize) * 100) + '%';
        }),
      actionsButtons: [
        {
          btntext: 'Cancel',
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      metaInfo: 'Transferring Content to SD Card',
      sbPopoverDynamicContent: transferredSize$
        .startWith(0)
        .map((transferredSize) => {
          return this.fileSizePipe.transform(transferredSize) + '/'
            + this.fileSizePipe.transform(totalTransferSize);
        })
    }, {
        cssClass: 'sb-popover dw-active-downloads-popover',
      });

    await confirmCancel.present();
    confirmCancel.onDidDismiss(async (shouldCancel: boolean) => {
      if (shouldCancel) {
        return this.storageService.cancelTransfer().toPromise();
      }
    });

    return;
  }

  private async showRetryTransferPopup(previousPopover): Promise<undefined> {
    const confirmCont = this.popoverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: 'Transferring files',
      sbPopoverMainTitle: 'Unable to move the content in the destination folder: {content_folder_name}',
      actionsButtons: [
        {
          btntext: 'undo',
          // btnClass: 'popover-color warning'
        },
        {
          btntext: 'Retry',
          btnClass: 'popover-color'
        }
      ],
      icon: null,
    }, {
        cssClass: 'sb-popover warning dw-active-downloads-popover',
      });
    confirmCont.present();

    confirmCont.onDidDismiss(async (canCancel: any) => {
      if (canCancel) {
       return this.storageService.cancelTransfer().toPromise();
      }
      previousPopover.present();
      return this.storageService.retryCurrentTransfer().toPromise();
    });

    return undefined;
  }
  private async showDuplicateContentPopup(): Promise<undefined> {
    const confirmContinue = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: 'Transferring files',
      sbPopoverMainTitle: 'Content exists in the Destination folder. Move to the destination folder anyway?',
      actionsButtons: [
        {
          btntext: 'Continue',
          btnClass: 'popover-color'
        },
      ],
      icon: null,
    }, {
        cssClass: 'sb-popover warning dw-active-downloads-popover',
      });

    confirmContinue.present();
    confirmContinue.onDidDismiss(async (canCancel: any) => {
      if (canCancel) {

      }
    });

    return undefined;
  }
}
