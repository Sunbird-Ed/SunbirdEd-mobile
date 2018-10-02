import { CommonUtilService } from './../../service/common-util.service';
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  PopoverController,
  Popover,
  ToastController,
  Platform
} from "ionic-angular";
import {
  QRScannerAlert,
  QRAlertCallBack
} from "./qrscanner_alert";
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
} from "sunbird";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { QRScannerResultHandler } from "./qrscanresulthandler.service";
import { UserOnboardingPreferencesPage } from "../user-onboarding-preferences/user-onboarding-preferences";
import { App } from "ionic-angular";

@Injectable()
export class SunbirdQRScanner {

  private readonly QR_SCANNER_TEXT = [
    'SCAN_QR_CODE',
    'SCAN_QR_INSTRUCTION',
    'UNKNOWN_QR',
    'SKIP',
    'CANCEL',
    'TRY_AGAIN',
  ]
  private mQRScannerText;
  readonly permissionList = ["android.permission.CAMERA"];
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
    const that = this
    this.translate.get(this.QR_SCANNER_TEXT).subscribe((data) => {
      that.mQRScannerText = data
    }, (error) => {

    });

    this.translate.onLangChange.subscribe(() => {
      that.mQRScannerText = that.translate.instant(that.QR_SCANNER_TEXT);
    });
  }

  public startScanner(source: string, showButton: boolean = false,
    screenTitle: String = this.mQRScannerText['SCAN_QR_CODE'],
    displayText: String = this.mQRScannerText['SCAN_QR_INSTRUCTION'],
    displayTextColor: String = "#0b0b0b",
    buttonText: String = this.mQRScannerText['SKIP']
  ) {
    this.source = source;
    this.showButton = showButton;
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.backButtonFunc();
    }, 10);

    this.generateStartEvent(source);

    this.permission.hasPermission(this.permissionList, (response) => {
      const result = JSON.parse(response);
      /* istanbul ignore else  */
      if (result.status) {
        const permissionResult = result.result;
        let askPermission = [];
        this.permissionList.forEach(element => {
          if (!permissionResult[element]) {
            askPermission.push(element);
          }
        })

        if (askPermission.length > 0) {
          this.permission.requestPermission(askPermission, (response) => {
            const requestResult = JSON.parse(response);
            /* istanbul ignore else  */
            if (requestResult.status) {
              let permissionGranted = true;
              const permissionRequestResult = requestResult.result;
              askPermission.forEach(element => {
                if (!permissionRequestResult[element]) {
                  permissionGranted = false;
                }
              })

              if (permissionGranted) {
                this.startQRScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, source);
              } else {
                const toast = this.toastCtrl.create({
                  message: this.commonUtil.translateMessage('PERMISSION_DENIED'),
                  duration: 3000
                })

                toast.present();
              }
            }
          }, (error) => {

          })
        } else {
          this.startQRScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, source);
        }
      }
    }, (error) => {
      console.log("Error : " + error);
    });
  }

  public stopScanner() {
    //Unregister back button listner
    this.backButtonFunc();
    (<any>window).qrScanner.stopScanner();
  }

  private startQRScanner(screenTitle: String, displayText: String, displayTextColor: String,
    buttonText: String, showButton: boolean, source: string) {
    this.generateImpressionTelemetry(source)
    window['qrScanner'].startScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, (scannedData) => {
      if (scannedData === "skip") {
        this.app.getActiveNavs()[0].push(UserOnboardingPreferencesPage, { stopScanner: true });
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.SKIP_CLICKED,
          Environment.ONBOARDING,
          PageId.QRCodeScanner);
        this.generateEndEvent(source, '');
      } else {
        if (scannedData === "cancel") {
          this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.OTHER,
            InteractSubtype.QRCodeScanCancelled,
            Environment.HOME,
            PageId.QRCodeScanner);
          this.generateEndEvent(source, "");
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
      source === PageId.ONBOARDING_PROFILE_PREFERENCES ? Environment.ONBOARDING : Environment.HOME)
  }

  generateStartEvent(pageId: string) {
    if (pageId) {
      let telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = "";
      telemetryObject.type = "qr";
      this.telemetryGeneratorService.generateStartTelemetry(
        pageId,
        telemetryObject);
    }
  }

  generateEndEvent(pageId: string, qrData: string) {
    if (pageId) {
      let telemetryObject: TelemetryObject = new TelemetryObject();
      telemetryObject.id = qrData;
      telemetryObject.type = 'qr';
      this.telemetryGeneratorService.generateEndTelemetry(
        "qr",
        Mode.PLAY,
        pageId,
        Environment.HOME,
        telemetryObject
      );
    }
  }

  showInvalidCodeAlert() {
    let popUp: Popover;
    let self = this;
    const callback: QRAlertCallBack = {
      tryAgain() {
        popUp.dismiss()
        self.startScanner(self.source, self.showButton);
      },
      cancel() {
        popUp.dismiss();

        if(self.showButton) {
          self.app.getActiveNavs()[0].push(UserOnboardingPreferencesPage, { stopScanner: true });
        }
      }
    }

    popUp = this.popCtrl.create(QRScannerAlert, {
      callback: callback,
      invalidContent: true,
      messageKey: "UNKNOWN_QR",
      tryAgainKey: "TRY_DIFF_QR"
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
