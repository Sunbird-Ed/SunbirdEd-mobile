import { NgModule } from '@angular/core';
import { SearchPage } from './search';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPage } from './filters/filter';
import { FilterOptions } from './filters/options/options';
import { IonicImageLoader } from 'ionic-image-loader';
import { Network } from '@ionic-native/network';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../component/components.module';

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
    PipesModule,
    ComponentsModule
  ],
  entryComponents: [
    FilterPage,
    FilterOptions
  ],
  providers: [
    Network,
  ]
})
export class SearchModule {

}
