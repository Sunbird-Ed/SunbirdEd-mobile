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

  constructor(
    private popCtrl: PopoverController,
    private translate: TranslateService,
    private permission: PermissionService,
    private toastCtrl: ToastController,
    private platform: Platform,
    private qrScannerResultHandler: QRScannerResultHandler,
    private telemetryGeneratorService: TelemetryGeneratorService
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
    /* istanbul ignore else  */
    displayTextColor: String = "#0b0b0b",
    /* istanbul ignore else  */
    buttonText: String = this.mQRScannerText['SKIP']
  ) {

    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.backButtonFunc();
    }, 10
    );

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
                console.log("Permission Denied");
                const toast = this.toastCtrl.create({
                  message: "Permission Denied",
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

  public stopScanner(successCallback: () => void = null, errorCallback: () => void = null) {
    //Unregister back button listner
    this.backButtonFunc();
    (<any>window).qrScanner.stopScanner(successCallback, errorCallback);
  }

  private startQRScanner(screenTitle: String, displayText: String, displayTextColor: String,
    buttonText: String, showButton: boolean, source: string) {
    window['qrScanner'].startScanner(screenTitle, displayText, displayTextColor, buttonText, showButton, (scannedData) => {
      if (scannedData === "cancel") {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.QRCodeScanCancelled,
          Environment.HOME,
          PageId.QRCodeScanner);
        this.generateEndEvent(source, "");
        return;
      }
      if (this.qrScannerResultHandler.isDialCode(scannedData)) {
        this.qrScannerResultHandler.handleDialCode(source, scannedData);
      } else if (this.qrScannerResultHandler.isContentId(scannedData)) {
        this.qrScannerResultHandler.handleContentId(source, scannedData);
      } else {
        this.qrScannerResultHandler.handleInvalidQRCode(source, scannedData);
        this.showInvalidCodeAlert();
      }
      this.stopScanner(null, null);
    }, () => {
      this.stopScanner(null, null);
    });
  }

  ionViewDidLoad() {
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      ImpressionSubtype.QRCodeScanInitiate,
      PageId.QRCodeScanner,
      Environment.HOME)
  }

  generateStartEvent(pageId: string) {
    /* istanbul ignore else  */
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
    /* istanbul ignore else  */
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
        self.startScanner(this.source, this.showButton);
      },
      cancel() {
        popUp.dismiss()
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
