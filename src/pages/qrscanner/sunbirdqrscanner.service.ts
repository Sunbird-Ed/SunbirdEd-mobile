import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PopoverController, Popover, ToastController, Platform } from "ionic-angular";
import { QRScannerAlert, QRAlertCallBack } from "./qrscanner_alert";
import { Start, Environment, Mode, TelemetryService, InteractType, InteractSubtype, PageId, End, PermissionService } from "sunbird";
import { generateInteractEvent, Map } from "../../app/telemetryutil";
import { Network } from "@ionic-native/network";

@Injectable()
export class SunbirdQRScanner {

  private readonly QR_SCANNER_TEXT = [
    'SCAN_QR_CODE',
    'SCAN_QR_INSTRUCTION',
    'UNKNOWN_QR',
    'CANCEL',
    'TRY_AGAIN',
  ]
  private mQRScannerText;
  readonly permissionList = ["android.permission.CAMERA"];
  private backButtonFunc = undefined;
  constructor(private translate: TranslateService,
    private popCtrl: PopoverController,
    private telemetryService: TelemetryService,
    private network: Network,
    private permission: PermissionService,
    private toastCtrl: ToastController,
    private platform: Platform) {
    const that = this
    this.translate.get(this.QR_SCANNER_TEXT).subscribe((data) => {
      that.mQRScannerText = data
    }, (error) => {

    });

    this.translate.onLangChange.subscribe(() => {
      that.mQRScannerText = that.translate.instant(that.QR_SCANNER_TEXT);
    });
  }

  public startScanner(screenTitle: String = this.mQRScannerText['SCAN_QR_CODE'],
    displayText: String = this.mQRScannerText['SCAN_QR_INSTRUCTION'],
    displayTextColor: String = "#0000ff", callback: QRResultCallback, source: string) {

      this.backButtonFunc = this.platform.registerBackButtonAction(() => {
        this.backButtonFunc();
      }, 10
      );

    this.generateStartEvent(source);

    this.permission.hasPermission(this.permissionList, (response) => {
      const result = JSON.parse(response);
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
            if (requestResult.status) {
              let permissionGranted = true;
              const permissionRequestResult = requestResult.result;
              askPermission.forEach(element => {
                if (!permissionRequestResult[element]) {
                  permissionGranted = false;
                }
              })

              if (permissionGranted) {
                this.startQRScanner(screenTitle, displayText, displayTextColor, callback, source);
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
          this.startQRScanner(screenTitle, displayText, displayTextColor, callback, source);
        }
      }
    }, (error) => {
      console.log("Error : " + error);
    });


  }

  public stopScanner(successCallback: () => void = null, errorCallback: () => void = null) {
    //Unregister the button listner
    this.backButtonFunc();
    (<any>window).qrScanner.stopScanner(successCallback, errorCallback);
  }


  private showInvalidCodeAlert(qrResultCallback: QRResultCallback) {
    const that = this;
    let popUp: Popover;
    const callback: QRAlertCallBack = {
      tryAgain() {
        popUp.dismiss()
        that.startScanner(undefined, undefined, undefined, qrResultCallback, undefined);
      },
      cancel() {
        popUp.dismiss()
      }
    }
    popUp = this.popCtrl.create(QRScannerAlert, {
      callback: callback
    }, {
        cssClass: 'qr-alert'
      });

    popUp.present();
  }

  private startQRScanner(screenTitle: String, displayText: String,
    displayTextColor: String, callback: QRResultCallback, source: string) {
    (<any>window).qrScanner.startScanner(screenTitle, displayText, displayTextColor, (code) => {
      if (code === "cancel") {
        this.telemetryService.interact(
          generateInteractEvent(InteractType.OTHER,
            InteractSubtype.QRCodeScanCancelled,
            Environment.HOME,
            PageId.QRCodeScanner, null));
        this.generateEndEvent(source, "");
        return;
      }

      let results = code.split("/");

      if (results[results.length - 2] == "dial") {
        let dialCode = results[results.length - 1];
        this.generateQRScanSuccessInteractEvent(code, "SearchResult");
        this.generateEndEvent(source, code);
        callback.dialcode(code, dialCode);
      } else if ((results[results.length - 2] == "content" && results[results.length - 4] == "public")) {
        let contentId = results[results.length - 1];
        this.generateQRScanSuccessInteractEvent(code, "ContentDetail");
        this.generateEndEvent(source, code);
        callback.content(code, contentId);
      } else {
        this.generateQRScanSuccessInteractEvent(code, "UNKNOWN");
        this.generateEndEvent(source, code);
        this.showInvalidCodeAlert(callback);
      }

      this.stopScanner(null, null);
    }, () => {
      this.stopScanner(null, null);
    });
  }

  generateStartEvent(pageId: string) {
    if (pageId !== undefined) {
      let start = new Start();
      start.type = "qr";
      start.pageId = pageId;
      start.env = Environment.HOME;
      start.mode = Mode.PLAY;
      this.telemetryService.start(start);
    }

  }

  generateQRScanSuccessInteractEvent(scannedData, action) {
    let values = new Map();
    values["NetworkAvailable"] = this.network.type === 'none' ? "N" : "Y";
    values["ScannedData"] = scannedData;
    values["Action"] = action;
    this.telemetryService.interact(
      generateInteractEvent(InteractType.OTHER,
        InteractSubtype.QRCodeScanSuccess,
        Environment.HOME,
        PageId.QRCodeScanner, values));
  }


  generateEndEvent(pageId: string, qrData: string) {
    if (pageId !== undefined) {
      let end = new End();
      end.type = "qr";
      end.pageId = pageId;
      end.env = Environment.HOME;
      end.mode = Mode.PLAY;
      end.objId = qrData;
      end.objType = "qr";
      this.telemetryService.end(end);
    }
  }
}

export interface QRResultCallback {
  dialcode(scanResult: string, code: string);

  content(scanResult: string, contentId: string);
}
