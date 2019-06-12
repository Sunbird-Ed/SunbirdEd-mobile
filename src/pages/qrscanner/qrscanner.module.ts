import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SunbirdQRScanner } from './sunbirdqrscanner.service';
import { QRScannerAlert } from './qrscanner_alert';
import { IonicPageModule } from 'ionic-angular';
import { PermissionPageModule } from '../permission/permission.module';

@NgModule({
  declarations: [
    QRScannerAlert
  ],
  imports: [
    IonicPageModule.forChild(QRScannerAlert),
    TranslateModule.forChild(),
    PermissionPageModule
  ],
  providers: [
    SunbirdQRScanner
  ]
})
export class QRScannerModule {

}
