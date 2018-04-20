import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourcesPage } from './resources';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../../component/components.module";
import { ResourceFilter } from './filters/resource.filter';
import { ResourceFilterOptions } from './filters/options/filter.options';
import { FilterOptions }  from "./onboarding-alert/onboarding-alert";

@NgModule({
  declarations: [
    ResourcesPage,
    ResourceFilter,
    ResourceFilterOptions,
    FilterOptions
  ],
  imports: [
    IonicPageModule.forChild(ResourcesPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ResourcesPage
  ],
  entryComponents: [
    ResourceFilter,
    ResourceFilterOptions,
    FilterOptions
  ]
})
export class ResourcesPageModule {}
