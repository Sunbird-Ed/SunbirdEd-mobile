import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AppHeaderService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { Observable, Subscription } from 'rxjs';
import { SbPopoverComponent } from '@app/component';
import { SbGenericPopoverComponent } from 'component/popups/sb-generic-popup/sb-generic-popover';

/**
 * Generated class for the StorageSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-storage-settings',
  templateUrl: 'storage-settings.html',
})
export class StorageSettingsPage implements OnInit {
  private storageValue;
  private storageType = 'phone';
  private _appHeaderSubscription?: Subscription;
  private _downloadProgressSubscription?: Subscription;
  private _networkSubscription?: Subscription;
  private _headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [] as string[]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams ,  private commonUtilService: CommonUtilService,
     private headerService: AppHeaderService, private popoverCtrl: PopoverController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorageSettingsPage');
  }
  ngOnInit() {
    this.initAppHeader();
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
  getStorageType(value: string) {
    this.storageValue = value;
    console.log('Storage Type', this.storageValue);
    if (this.storageValue === 'sdcard') {
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
   //   const loader = this.commonUtilService.getLoader();
   confirm.onDidDismiss(async (canDelete: any) => {
    if (canDelete) {
      const confirmCancel = this.popoverCtrl.create(SbPopoverComponent, {
        sbPopoverHeading: 'Transferring files',
        sbPopoverMainTitle: '75%',
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

        confirmCancel.present();
        confirmCancel.onDidDismiss(async (canCancel: any) => {
          if (canCancel) {
            const cancel = this.popoverCtrl.create(SbPopoverComponent, {
              sbPopoverHeading: 'Transfer Stopped',
              sbPopoverMainTitle: '75%',
              actionsButtons: [
              ],
              icon: null,
              metaInfo: 'Cancelling in Progress..',
            }, {
                cssClass: 'sb-popover dw-active-downloads-popover',
              });
              cancel.present();
          }
        });

    }
  });
    } else if (this.storageValue === 'phone') {
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
            const confirmCont = this.popoverCtrl.create(SbPopoverComponent, {
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
          }
        });
    }
  }

}


