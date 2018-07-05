import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MembersPage } from './members';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MembersPage,
  ],
  imports: [
    IonicPageModule.forChild(MembersPage),
    TranslateModule.forChild()
  ],
})
export class MembersPageModule { }
