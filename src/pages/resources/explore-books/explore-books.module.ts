import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExploreBooksPage } from './explore-books';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "@app/component/components.module";
import {PipesModule} from "@app/pipes/pipes.module";

@NgModule({
  declarations: [
    ExploreBooksPage,
  ],
  imports: [
    IonicPageModule.forChild(ExploreBooksPage),
    TranslateModule,
    ComponentsModule,
    PipesModule,
  ],
})
export class ExploreBooksPageModule {}
