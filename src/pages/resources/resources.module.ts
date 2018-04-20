import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourcesPage } from './resources';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../component/components.module";
import { FilterOptions }  from "./onboarding-alert/onboarding-alert";

@NgModule({
  declarations: [
    ResourcesPage,FilterOptions
  ],
  imports: [
    IonicPageModule.forChild(ResourcesPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ResourcesPage
  ],
  entryComponents: [FilterOptions]
})
export class ResourcesPageModule {}
