import { NgModule } from "@angular/core";
import { SearchPage } from "./search";
import { IonicPageModule } from "ionic-angular";
import { FrameworkModule } from "sunbird";
import { TranslateModule } from "@ngx-translate/core";
import { FilterPage } from "./filters/filter";
import { FilterOptions } from "./filters/options/options";
import { IonicImageLoader } from "ionic-image-loader";

@NgModule({
  declarations: [
    SearchPage,
    FilterPage,
    FilterOptions
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    IonicImageLoader,
    FrameworkModule,
  ],
  entryComponents: [
    FilterPage,
    FilterOptions
  ]
})
export class SearchModule {

}
