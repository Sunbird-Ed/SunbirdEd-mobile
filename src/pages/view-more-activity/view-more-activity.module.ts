import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewMoreActivityPage } from './view-more-activity';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../component/components.module";

@NgModule({
  declarations: [
    ViewMoreActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewMoreActivityPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ViewMoreActivityPage
  ]
})
export class ViewMoreActivityPageModule {}
