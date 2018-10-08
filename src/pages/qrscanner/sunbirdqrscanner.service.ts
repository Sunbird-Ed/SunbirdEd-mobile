import { CommonUtilService } from './../../service/common-util.service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  PopoverController,
  Popover,
  ToastController,
  Platform
} from 'ionic-angular';
import {
  QRScannerAlert,
  QRAlertCallBack
} from './qrscanner_alert';
import {
  Environment,
  Mode,
  InteractType,
  InteractSubtype,
  PageId,
  PermissionService,
  ImpressionType,
  ImpressionSubtype,
  TelemetryObject
} from 'sunbird';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { QRScannerResultHandler } from './qrscanresulthandler.service';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { App } from 'ionic-angular';

@Injectable()
export class SunbirdQRScanner {

  private readonly QR_SCANNER_TEXT = [
    'SCAN_QR_CODE',
    'SCAN_QR_INSTRUCTION',
    'UNKNOWN_QR',
    'SKIP',
    'CANCEL',
    'TRY_AGAIN',
  ];
  private mQRScannerText;
  readonly permissionList = ['android.permission.CAMERA'];
  backButtonFunc = undefined;
  source: string;
  showButton = false;

  constructor(
    private popCtrl: PopoverController,
    private translate: TranslateService,
    private permission: PermissionService,
    private toastCtrl: ToastController,
    private platform: Platform,
    private qrScannerResultHandler: QRScannerResultHandler,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private app: App,
    private commonUtil: CommonUtilService
  ) {
    const that = this;
    this.translate.get(this.QR_SCANNER_TEXT).subscribe((data) => {
      that.mQRScannerText = data;
    }, (error) => {

    });

    this.translate.onLangChange.subscribe(() => {
      that.mQRScannerText = that.translate.instant(that.QR_SCANNER_TEXT);
    });
  }


  ionViewDidLoad(): any {
    throw new Error('Method not implemented.');
  }

  public startScanner(source: string, showButton: boolean = false,
    screenTitle = this.mQRScannerText['SCAN_QR_CODE'],
    displayText = this.mQRScannerText['SCAN_QR_INSTRUCTION'],
    displayTextColor = '#0b0b0b',
    buttonText = this.mQRScannerText['SKIP']
  ) {
    this.source = source;
    this.showButton = showButton;

    /* Just need to override the back button functionality other wise  on pressing back button it will take to two pages back */
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.backButtonFunc();
    }, 10);

    this.generateStartEvent(source);

    this.permission.hasPermission(this.permissionList, (response) => {
      const result = JSON.parse(response);
      /* istanbul ignore else  */
      if (result.status) {
        const permissionResult = result.result;
        const askPermission = [];
        this.permissionList.forEach(element => {
          if (!permissionResult[element]) {
            askPermission.push(element);
          }
        });

        if (askPermission.length > 0) {
          this.permission.requestPermission(askPermission, (res) => {
            const requestResult = JSON.parse(res);
            /* istanbul ignore else  */
            if (requestResult.status) {
              let permissionGranted = true;
              const permissionRequestResult = requestResult.result;
              askPermission.forEach(element => {
                if (!permissionRequestResult[element]) {
                  permissionGranted = false;
                }
              });

              if (permissionGranted) {
                this.startQRScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, source);
              } else {
                const toast = this.toastCtrl.create({
                  message: this.commonUtil.translateMessage('PERMISSION_DENIED'),
                  duration: 3000
                });

                toast.present();
              }
            }
          }, (error) => {

          });
        } else {
          this.startQRScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, source);
        }
      }
    }, (error) => {
      console.log('Error : ' + error);
    });
  }

  public stopScanner() {
    // Unregister back button listner
    this.backButtonFunc();
    (<any>window).qrScanner.stopScanner();
  }

  private startQRScanner(screenTitle: string, displayText: string, displayTextColor: string,
    buttonText: string, showButton: boolean, source: string) {
    this.generateImpressionTelemetry(source);
    window['qrScanner'].startScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, (scannedData) => {
      if (scannedData === 'skip') {
        this.app.getActiveNavs()[0].push(ProfileSettingsPage, { stopScanner: true });
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.SKIP_CLICKED,
          Environment.ONBOARDING,
          PageId.QRCodeScanner);
        this.generateEndEvent(source, '');
      } else {
        if (scannedData === 'cancel') {
          this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.QRCodeScanCancelled,
            Environment.HOME,
            PageId.QRCodeScanner);
          this.generateEndEvent(source, '');
        } else if (this.qrScannerResultHandler.isDialCode(scannedData)) {
          this.qrScannerResultHandler.handleDialCode(source, scannedData);
        } else if (this.qrScannerResultHandler.isContentId(scannedData)) {
          this.qrScannerResultHandler.handleContentId(source, scannedData);
        } else {
          this.qrScannerResultHandler.handleInvalidQRCode(source, scannedData);
          this.showInvalidCodeAlert();
        }
        this.stopScanner();
      }
    }, () => {
      this.stopScanner();
    });
  }

  generateImpressionTelemetry(source) {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      ImpressionSubtype.QRCodeScanInitiate,
      PageId.QRCodeScanner,
      source === PageId.ONBOARDING_PROFILE_PREFERENCES ? Environment.ONBOARDING : Environment.HOME);
  }

  generateStartEvent(pageId: string) {
    if (pageId) {
      const telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = '';
      telemetryObject.type = 'qr';
      this.telemetryGeneratorService.generateStartTelemetry(
        pageId,
        telemetryObject);
    }
  }

  generateEndEvent(pageId: string, qrData: string) {
    if (pageId) {
      const telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      this.telemetryGeneratorService.generateEndTelemetry(
        'qr',
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject
      );
    }
  }

  showInvalidCodeAlert() {
    let popUp: Popover;
    const self = this;
    const callback: QRAlertCallBack = {
      tryAgain() {
        popUp.dismiss();
        self.startScanner(self.source, self.showButton);
      },
      cancel() {
        popUp.dismiss();

        if (self.showButton) {
          self.app.getActiveNavs()[0].push(ProfileSettingsPage, { stopScanner: true });
        }
      }
    };

    popUp = this.popCtrl.create(QRScannerAlert, {
      callback: callback,
      invalidContent: true,
      messageKey: 'UNKNOWN_QR',
      tryAgainKey: 'TRY_DIFF_QR'
    }, {
        cssClass: 'qr-alert-invalid'
      });

    popUp.present();
  }
}

export interface QRResultCallback {
  dialcode(scanResult: string, code: string);

  content(scanResult: string, contentId: string);
}
