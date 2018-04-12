import { NgModule } from "@angular/core";
import { FrameworkModule } from "sunbird";
import { TranslateModule } from "@ngx-translate/core";
import { SunbirdQRScanner } from "./sunbirdqrscanner.service";
import { QRScannerAlert } from "./qrscanner_alert";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [
    QRScannerAlert
  ],
  imports: [
    FrameworkModule,
    IonicPageModule.forChild(QRScannerAlert),
    TranslateModule.forChild()
  ],
  providers: [
    SunbirdQRScanner
  ]
})
export class QRScannerModule {

}
