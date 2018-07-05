import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrouplandingPage } from './grouplanding';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GrouplandingPage,
  ],
  imports: [
    IonicPageModule.forChild(GrouplandingPage),
    TranslateModule.forChild()
  ],
})
export class GrouplandingPageModule { }
