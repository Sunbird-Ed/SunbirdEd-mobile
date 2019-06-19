import { ChangeDetectionStrategy, Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { ImpressionType, Environment, PageId, InteractType, InteractSubtype, } from '@app/service/telemetry-constants';
import { AppVersion } from '@ionic-native/app-version';
@IonicPage()
@Component({
  selector: 'page-storage-settings',
  templateUrl: 'storage-settings.html'
})
export class StorageSettingsPage implements OnInit, StorageSettingsInterface {
  // popovers
  private shouldTransferContentsPopup?: Popover;
  private transferringContentsPopup?: Popover;
  private cancellingTransferPopup?: Popover;
  private duplicateContentPopup?: Popover;
  private successTransferPopup?: Popover;
  // storage
  public StorageDestination = StorageDestination;
  public storageDestination?: StorageDestination;
  public spaceTakenBySunbird$: Observable<number>;

  private _storageVolumes: StorageVolume[] = [];
  // header
  private _appHeaderSubscription?: Subscription;
  private _headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [] as string[]
  };
  appName: any;

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
    private changeDetectionRef: ChangeDetectorRef,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private appVersion: AppVersion,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    @Inject('STORAGE_SERVICE') private storageService: StorageService,
    @Inject('DEVICE_INFO') private deviceInfo: DeviceInfo,
    @Inject('CONTENT_SERVICE') private contentService: ContentService,
  ) {
    this.spaceTakenBySunbird$ = this.storageService.getStorageDestinationVolumeInfo()
      .mergeMap((storageVolume) => {
        if (storageVolume.storageDestination === StorageDestination.INTERNAL_STORAGE) {
          this.contentService
            .getContentSpaceUsageSummary({ paths: [cordova.file.externalDataDirectory] });
        }

        return this.contentService
          .getContentSpaceUsageSummary({ paths: [storageVolume.info.path] });
      })
      .map((summary) => summary[0].sizeOnDevice) as any;
      this.appVersion.getAppName()
      .then((appName) => {
        this.appName = appName;
      });
  }

  ngOnInit() {
    this.initAppHeader();
    this.fetchStorageVolumes();
    this.fetchStorageDestination();
  }

  async showShouldTransferContentsPopup(): Promise<void> {
    if (this.shouldTransferContentsPopup) {
      return;
    }

    if (this.storageDestination === await this.storageService.getStorageDestination().toPromise()) {
      return;
    }

    const spaceTakenBySunbird = await this.spaceTakenBySunbird$.toPromise();

    this.shouldTransferContentsPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: (this.storageDestination === StorageDestination.INTERNAL_STORAGE) ?
        this.commonUtilService.translateMessage('TRANSFER_CONTENT_TO_PHONE') :
        this.commonUtilService.translateMessage('TRANSFER_CONTENT_TO_SDCARD'),
      sbPopoverMainTitle: (this.storageDestination === StorageDestination.INTERNAL_STORAGE) ?
        this.commonUtilService.translateMessage('SUCCESSFUL_CONTENT_TRANSFER_TO_PHONE') :
        this.commonUtilService.translateMessage('SUCCESSFUL_CONTENT_TRANSFER_TO_SDCARD'),
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

    this.shouldTransferContentsPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.TRANSFER_CONTENT_CONFIRMATION_POPUP,
      Environment.DOWNLOADS
    );

    this.shouldTransferContentsPopup.onDidDismiss(async (shouldTransfer: boolean) => {
      this.shouldTransferContentsPopup = undefined;

      if (!shouldTransfer) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.POPUP_DISMISSED,
          Environment.DOWNLOADS,
          PageId.TRANSFER_CONTENT_CONFIRMATION_POPUP, undefined, undefined, undefined
        );

        this.storageDestination = this.storageDestination === StorageDestination.INTERNAL_STORAGE ?
          StorageDestination.EXTERNAL_STORAGE :
          StorageDestination.INTERNAL_STORAGE;
        return;
      }

      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.START_CLICKED,
        Environment.DOWNLOADS,
        PageId.TRANSFER_CONTENT_CONFIRMATION_POPUP, undefined, undefined, undefined
      );

      await this.showTransferringContentsPopup(this.shouldTransferContentsPopup, this.storageDestination);
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
      this.changeDetectionRef.detectChanges();
    });
  }

  private async fetchStorageDestination() {
    this.storageDestination = await this.storageService.getStorageDestination().toPromise();
  }

  private getStorageDestinationVolume(storageDestination: StorageDestination): string {
    if (storageDestination === StorageDestination.INTERNAL_STORAGE) {
      return cordova.file.externalDataDirectory;
    }

    const storageVolumePath = this._storageVolumes
      .find((storageVolume) => storageVolume.storageDestination === storageDestination)!
      .info.path;

    // TODO change prefix
    return `${storageVolumePath}`;
  }

  private async showTransferringContentsPopup(prevPopup: Popover, storageDestination: StorageDestination): Promise<undefined> {
    if (this.transferringContentsPopup) {
      return;
    }

    this.storageService.transferContents({
      contentIds: [],
      existingContentAction: undefined,
      destinationFolder: this.getStorageDestinationVolume(this.storageDestination),
      deleteDestination: false
    }).subscribe(null, (e) => { console.error(e); }, () => { console.log('complete'); });

    const totalTransferSize = await this.spaceTakenBySunbird$.toPromise();

    const transferCompleteSubscription = this.eventsBusService
      .events(EventNamespace.STORAGE)
      .takeWhile(e => e.type !== StorageEventType.TRANSFER_COMPLETED)
      .filter(e => e.type === StorageEventType.TRANSFER_FAILED_DUPLICATE_CONTENT)
      .take(1)
      .subscribe(async () => {
        this.showDuplicateContentPopup();
      });

    const transferProgress$ = this.eventsBusService
      .events(EventNamespace.STORAGE)
      .takeWhile(e => e.type !== StorageEventType.TRANSFER_COMPLETED)
      .filter(e => e.type === StorageEventType.TRANSFER_PROGRESS)
      .map((e: StorageTransferProgress) => e.payload.progress);

    const transferProgressSubscription = transferProgress$
      .subscribe(null, null, async () => {
        if (this.transferringContentsPopup) {
          await this.transferringContentsPopup.dismiss();
        }
        this.showSuccessTransferPopup(this.transferringContentsPopup, storageDestination);
      });

    this.transferringContentsPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFERRING_FILES'),
      sbPopoverDynamicMainTitle: transferProgress$
        .startWith({
          transferredCount: 0,
          totalCount: 0
        })
        .map(({ transferredCount, totalCount }) => {
          if (transferredCount && totalCount) {
            return Math.round((transferredCount / totalCount) * 100) + '%';
          } else {
            return '0%';
          }
        }),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CANCEL'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
      metaInfo: this.commonUtilService.translateMessage('TRANSFERRING_CONTENT_TO_DESTINATION'),
      sbPopoverDynamicContent: transferProgress$
        .startWith({
          transferredCount: 0,
          totalCount: 0
        })
        .map(({ transferredCount, totalCount }) => {
          if (transferredCount && totalCount) {
            return this.fileSizePipe.transform(
              Math.round(transferredCount / totalCount) * totalTransferSize
            ) + '/'
              + this.fileSizePipe.transform(totalTransferSize);
          } else {
            return '0KB/0KB';
          }
        })
    }, {
      enableBackdropDismiss: false,
      cssClass: 'sb-popover dw-active-downloads-popover',
    });

    await this.transferringContentsPopup.present();
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.TRANSFERING_CONTENT_POPUP,
      Environment.DOWNLOADS
    );

    this.transferringContentsPopup.onDidDismiss(async (shouldCancel: boolean) => {
      this.transferringContentsPopup = undefined;

      transferCompleteSubscription.unsubscribe();
      transferProgressSubscription.unsubscribe();

      if (shouldCancel) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.CANCEL_CLICKED,
          Environment.DOWNLOADS,
          PageId.TRANSFERING_CONTENT_POPUP, undefined, undefined, undefined
        );

        this.showCancellingTransferPopup(this.transferringContentsPopup, storageDestination);
      }
    });

    return;
  }

  private async showCancellingTransferPopup(prevPopup: Popover, storageDestination): Promise<undefined> {
    if (this.cancellingTransferPopup) {
      return;
    }

    this.storageService.cancelTransfer().toPromise();

    this.eventsBusService
      .events(EventNamespace.STORAGE)
      .filter(e =>
        e.type === StorageEventType.TRANSFER_REVERT_COMPLETED ||
        e.type === StorageEventType.TRANSFER_COMPLETED
      )
      .take(1)
      .subscribe((e) => {
        if (e.type === StorageEventType.TRANSFER_REVERT_COMPLETED) {
          this.storageDestination = this.storageDestination === StorageDestination.INTERNAL_STORAGE ?
            StorageDestination.EXTERNAL_STORAGE :
            StorageDestination.INTERNAL_STORAGE;

          this.cancellingTransferPopup.dismiss();
        } else if (e.type === StorageEventType.TRANSFER_COMPLETED) {
          this.cancellingTransferPopup.dismiss();
          this.showSuccessTransferPopup(this.cancellingTransferPopup, storageDestination);
        }
      });

      this.cancellingTransferPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFER_STOPPED'),
      actionsButtons: [],
      icon: null,
      metaInfo: this.commonUtilService.translateMessage('CANCELLING_IN_PROGRESS'),
    }, {
      enableBackdropDismiss: false,
      cssClass: 'sb-popover dw-active-downloads-popover',
    });

    this.cancellingTransferPopup.present();

    this.cancellingTransferPopup.onDidDismiss(() => {
      this.cancellingTransferPopup = undefined;
    });

    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.CANCELLING_CONTENT_TRANSFER_POPUP,
      Environment.DOWNLOADS
    );
    return;
  }

  private async showDuplicateContentPopup(): Promise<undefined> {
    if (this.duplicateContentPopup) {
      return;
    }

    this.duplicateContentPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: this.commonUtilService.translateMessage('TRANSFERRING_FILES'),
      sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_ALREADY_EXISTS'),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('CONTINUE'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
    }, {
        cssClass: 'sb-popover warning dw-active-downloads-popover',
      });

    this.duplicateContentPopup.present();

    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.SHOW_DUPLICATE_CONTENT_POPUP,
      Environment.DOWNLOADS
    );

    this.duplicateContentPopup.onDidDismiss(async (canContinue: any) => {
      this.duplicateContentPopup = undefined;

      if (canContinue) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.CONTINUE_CLICKED,
          Environment.DOWNLOADS,
          PageId.SHOW_DUPLICATE_CONTENT_POPUP, undefined, undefined, undefined
        );

        return this.storageService.retryCurrentTransfer().toPromise();
      }

      if (this.transferringContentsPopup) {
        this.transferringContentsPopup.dismiss();
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

  private async showSuccessTransferPopup(prevPopup: Popover, storageDestination: StorageDestination): Promise<undefined> {
    if (this.successTransferPopup) {
      return;
    }

    const spaceTakenBySunbird = await this.spaceTakenBySunbird$.toPromise();

    this.successTransferPopup = this.popoverCtrl.create(SbPopoverComponent, {
      sbPopoverHeading: (storageDestination === StorageDestination.INTERNAL_STORAGE) ?
      this.commonUtilService.translateMessage('CONTENT_SUCCESSFULLY_TRANSFERRED_TO_PHONE') :
        this.commonUtilService.translateMessage('CONTENT_SUCCESSFULLY_TRANSFERRED_TO_SDCARD'),
      metaInfo: this.commonUtilService.translateMessage('SPACE_TAKEN_BY_APP', this.appName)
       + this.fileSizePipe.transform(spaceTakenBySunbird),
      sbPopoverContent: this.commonUtilService.translateMessage('SPACE_AVAILABLE_ON_SDCARD') +
        this.fileSizePipe.transform(this.availableExternalMemorySize),
      actionsButtons: [
        {
          btntext: this.commonUtilService.translateMessage('OKAY'),
          btnClass: 'popover-color'
        },
      ],
      icon: null,
    }, {
        cssClass: 'sb-popover dw-active-downloads-popover',
      });

    this.successTransferPopup.present();

    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      '',
      PageId.CONTENT_TRANSFER_SUCCEED_POPUP,
      Environment.DOWNLOADS
    );

    this.successTransferPopup.onDidDismiss(async (okClicked: any) => {
      this.successTransferPopup = undefined;

      if (okClicked) {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.OK_CLICKED,
          Environment.DOWNLOADS,
          PageId.SHOW_DUPLICATE_CONTENT_POPUP, undefined, undefined, undefined
        );
      }
    });
    return undefined;
  }

}
