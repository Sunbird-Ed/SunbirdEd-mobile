import { NgModule } from "@angular/core";
import { SearchPage } from "./search";
import { IonicPageModule } from "ionic-angular";
import { FrameworkModule } from "sunbird";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    SearchPage
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    FrameworkModule,
  ]
})
export class SearchModule {

}
