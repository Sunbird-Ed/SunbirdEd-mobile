import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../component/components.module";

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule {}
