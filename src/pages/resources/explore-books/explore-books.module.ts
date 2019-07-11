import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExploreBooksPage } from './explore-books';
import {TranslateModule} from "@ngx-translate/core";
import {ComponentsModule} from "@app/component/components.module";

@NgModule({
  declarations: [
    ExploreBooksPage,
  ],
  imports: [
    IonicPageModule.forChild(ExploreBooksPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class ExploreBooksPageModule {}
