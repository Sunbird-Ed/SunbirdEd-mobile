import { NgModule } from "@angular/core";
import { SearchPage } from "./search";
import { IonicPageModule } from "ionic-angular";
import { FrameworkModule } from "sunbird";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPage } from "./filters/filter";

@NgModule({
  declarations: [
    SearchPage,
    FilterPage
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    FrameworkModule,
  ],
  entryComponents: [
    FilterPage
  ]
})
export class SearchModule {

}
