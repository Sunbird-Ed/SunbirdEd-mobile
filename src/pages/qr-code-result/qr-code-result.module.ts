import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrCodeResultPage } from './qr-code-result';
import { ComponentsModule } from '../../component/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    QrCodeResultPage,
  ],
  imports: [
    IonicPageModule.forChild(QrCodeResultPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    QrCodeResultPage
  ]
})
export class QrCodeResultPageModule {}
