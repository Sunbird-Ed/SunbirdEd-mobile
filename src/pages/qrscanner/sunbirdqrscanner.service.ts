import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AlertController, PopoverController, Popover } from "ionic-angular";
import { QRScannerAlert, QRAlertCallBack } from "./qrscanner_alert";
import { Start, Environment, Mode, TelemetryService, InteractType, InteractSubtype, PageId, End } from "sunbird";
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

  constructor(private translate: TranslateService,
    private popCtrl: PopoverController,
    private telemetryService: TelemetryService,
    private network: Network) {
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
    this.generateStartEvent(source);
    (<any>window).qrScanner.startScanner(screenTitle, displayText, displayTextColor, (code) => {
      if (code === "cancel") {
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

  public stopScanner(successCallback: () => void = null, errorCallback: () => void = null) {
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
