import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesEditPage } from './categories-edit';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CategoriesEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesEditPage),
    TranslateModule.forChild(),
  ],
})
export class CategoriesEditPageModule {}
