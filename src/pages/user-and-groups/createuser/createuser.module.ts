import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateuserPage } from './createuser';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateuserPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateuserPage),
    TranslateModule.forChild()
  ],
})
export class CreateuserPageModule { }
