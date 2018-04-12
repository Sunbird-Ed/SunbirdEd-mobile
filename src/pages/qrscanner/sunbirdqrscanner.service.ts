import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AlertController, PopoverController, Popover } from "ionic-angular";
import { QRScannerAlert, QRAlertCallBack } from "./qrscanner_alert";


@Injectable()
export class SunbirdQRScanner {

  private readonly QR_SCANNER_TEXT = [
    'QR_SCREEN.SCAN_QR_CODE',
    'QR_SCREEN.SCAN_QR_INSTRUCTION',
    'QR_SCREEN.UNKNOWN_QR',
    'QR_SCREEN.CANCEL',
    'QR_SCREEN.TRY_AGAIN',
  ]

  private mQRScannerText;

  constructor(private translate: TranslateService, private popCtrl: PopoverController) {
    const that = this
    this.translate.get(this.QR_SCANNER_TEXT).subscribe((data) => {
      that.mQRScannerText = data
    }, (error) => {

    });

    this.translate.onLangChange.subscribe(() => {
      that.mQRScannerText = that.translate.instant(that.QR_SCANNER_TEXT);
    });
  }

  public startScanner(screenTitle: String = this.mQRScannerText['QR_SCREEN.SCAN_QR_CODE'],
    displayText: String = this.mQRScannerText['QR_SCREEN.SCAN_QR_INSTRUCTION'],
    displayTextColor: String = "#0000ff", callback: QRResultCallback) {
    (<any>window).qrScanner.startScanner(screenTitle, displayText, displayTextColor, (code) => {
      let results = code.split("/");

      if (results[results.length - 2] == "dial") {
        let dialCode = results[results.length - 1];
        callback.dialcode(code, dialCode);
      } else if ((results[results.length - 2] == "content" && results[results.length - 4] == "public")) {
        let contentId = results[results.length - 1];
        callback.content(code, contentId);
      } else {
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
        that.startScanner(undefined, undefined, undefined, qrResultCallback);
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
}

export interface QRResultCallback {
  dialcode(scanResult: string, code: string);

  content(scanResult: string, contentId: string);
}
