import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Popover, PopoverController } from 'ionic-angular';
import { AppHeaderService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { Observable, Subscription } from 'rxjs';
import {
  ContentService,
  DeviceInfo,
  EventNamespace,
  EventsBusService,
  StorageDestination,
  StorageEventType,
  StorageService,
  StorageTransferProgress,
  StorageVolume
} from 'sunbird-sdk';
import { StorageSettingsInterface } from "@app/pages/storage-settings/storage-settings-interface";
import { SbPopoverComponent } from "@app/component";
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { ImpressionType, Environment, PageId, InteractType, InteractSubtype } from '@app/service/telemetry-constants';

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
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
    private telemetryGeneratorService: TelemetryGeneratorService,
  ) {
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
    console.log('StorageDestination', storageDestination);

    const transferContentPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: StorageDestination.INTERNAL_STORAGE ? this.commonUtilService.translateMessage('TRANSFER_CONTENT_TO_SDCARD') :
        this.commonUtilService.translateMessage('TRANSFER_CONTENT_TO_PHONE'),
      sbPopoverMainTitle: StorageDestination.INTERNAL_STORAGE ?
        this.commonUtilService.translateMessage('SUCCESSFUL_CONTENT_TRANSFER_TO_SDCARD') :
        this.commonUtilService.translateMessage('SUCCESSFUL_CONTENT_TRANSFER_TO_PHONE'),
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

    transferContentPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.TRANSFER_CONTENT_CONFIRMATION_POPUP,
      Environment.DOWNLOADS
    );

    transferContentPopup.onDidDismiss(async (shouldTransfer: boolean) => {
      if (shouldTransfer) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.START_CLICKED,
          Environment.DOWNLOADS,
          PageId.TRANSFER_CONTENT_CONFIRMATION_POPUP, undefined, undefined, undefined
        );

        this.storageService.transferContents({
          storageDestination,
          contents: [{ identifier: 0 }, { identifier: 1 }, { identifier: 3 }] as any
        }).finally(() => { this.showSuccessTransferPopup(); })
          .subscribe();
        await this.showTransferContentsPopup(transferContentPopup);
      } else {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.POPUP_DISMISSED,
          Environment.DOWNLOADS,
          PageId.TRANSFER_CONTENT_CONFIRMATION_POPUP, undefined, undefined, undefined
        );
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

  private async showTransferContentsPopup(prevPopup: Popover): Promise<undefined> {
    let transferringContentPopup: Popover;
    const totalTransferSize = await this.spaceTakenBySunbird$.toPromise();

    const eventBusSubscription = this.eventsBusService
      .events(EventNamespace.STORAGE)
      .takeWhile(e => e.type !== StorageEventType.TRANSFER_COMPLETED)
      .filter(e => e.type === StorageEventType.TRANSFER_FAILED || e.type === StorageEventType.TRANSFER_FAILED_DUPLICATE_CONTENT)
      .do((e) => {
        switch (e.type) {
          case StorageEventType.TRANSFER_FAILED:
            this.showRetryTransferPopup(transferringContentPopup);
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
      .scan((acc: number, e: StorageTransferProgress) => acc += e.payload.progress.transferSize, 0);

    transferredSize$
      .finally(() => transferringContentPopup.dismiss())
      .subscribe();

    transferringContentPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFERRING_FILES'),
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
      metaInfo: this.commonUtilService.translateMessage('TRANSFERRING_CONTENT_TO_DESTINATION'),
      sbPopoverDynamicContent: transferredSize$
        .startWith(0)
        .map((transferredSize) => {
          return this.fileSizePipe.transform(transferredSize) + '/'
            + this.fileSizePipe.transform(totalTransferSize);
        })
    }, {
        cssClass: 'sb-popover dw-active-downloads-popover',
      });

    await transferringContentPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.TRANSFERING_CONTENT_POPUP,
      Environment.DOWNLOADS
    );

    transferringContentPopup.onDidDismiss(async (shouldCancel: boolean) => {
      eventBusSubscription.unsubscribe();

      if (shouldCancel) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.CANCEL_CLICKED,
          Environment.DOWNLOADS,
          PageId.TRANSFERING_CONTENT_POPUP, undefined, undefined, undefined
        );
        return this.storageService.cancelTransfer().toPromise();
      }
    });

    return;
  }

  private async showRetryTransferPopup(prevPopup: Popover): Promise<undefined> {
    const retryTransferPopup = this.popoverCtrl.create(SbGenericPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFERRING_FILES'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('UNABLE_TO_MOVE_CONTENT') + ' {content_folder_name}',
      actionsButtons: [
        {
          btntext: 'Undo',
          btnClass: 'sb-btn sb-btn-sm sb-btn-outline-info'
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
    retryTransferPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.RETRY_CONTENT_TRANSFER_POPUP,
      Environment.DOWNLOADS
    );

    retryTransferPopup.onDidDismiss(async (canCancel: any) => {
      if (canCancel) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.UNDO_CLICKED,
          Environment.DOWNLOADS,
          PageId.RETRY_CONTENT_TRANSFER_POPUP, undefined, undefined, undefined
        );
        prevPopup.dismiss();
        return this.storageService.cancelTransfer().toPromise();
      }
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.RETRY_CLICKED,
        Environment.DOWNLOADS,
        PageId.RETRY_CONTENT_TRANSFER_POPUP, undefined, undefined, undefined
      );
      return this.storageService.retryCurrentTransfer().toPromise();
    });

    return undefined;
  }
  private async showDuplicateContentPopup(): Promise<undefined> {
    const duplicateContentPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFERRING_FILES'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_ALREADY_EXISTS'),
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

    duplicateContentPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.SHOW_DUPLICATE_CONTENT_POPUP,
      Environment.DOWNLOADS
    );

    duplicateContentPopup.onDidDismiss(async (canContinue: any) => {
      if (canContinue) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.CONTINUE_CLICKED,
          Environment.DOWNLOADS,
          PageId.SHOW_DUPLICATE_CONTENT_POPUP, undefined, undefined, undefined
        );
        return this.storageService.retryCurrentTransfer().toPromise();
      }
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.POPUP_DISMISSED,
        Environment.DOWNLOADS,
        PageId.SHOW_DUPLICATE_CONTENT_POPUP, undefined, undefined, undefined
      );
    });

    return undefined;
  }

  private async showSuccessTransferPopup(): Promise<undefined> {
    const spaceTakenBySunbird = await this.spaceTakenBySunbird$.toPromise();
    const successTransferPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('CONTENT_SUCCESSFULLY_TRANSFERRED_TO') + 'SD Card',
      // sbPopoverMainTitle: 'Space used by Diksha Content : 15 GB',
      metaInfo: this.commonUtilService.translateMessage('SPACE_USED_BY_DIKSHA') + spaceTakenBySunbird,
      sbPopoverContent: this.commonUtilService.translateMessage('SPACE_AVAILABLE_ON_SDCARD') +
        this.fileSizePipe.transform(this.availableExternalMemorySize),
      actionsButtons: [
        {
          btntext: 'OK',
          btnClass: 'popover-color'
        },
      ],
      icon: null,
    }, {
        cssClass: 'sb-popover dw-active-downloads-popover',
      });
    successTransferPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.CONTENT_TRANSFER_SUCCEED_POPUP,
      Environment.DOWNLOADS
    );

    successTransferPopup.onDidDismiss(async (canCancel: any) => {
      if (canCancel) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.OK_CLICKED,
          Environment.DOWNLOADS,
          PageId.SHOW_DUPLICATE_CONTENT_POPUP, undefined, undefined, undefined
        );
        successTransferPopup.dismiss();
      }
    });
    return undefined;
  }

}
