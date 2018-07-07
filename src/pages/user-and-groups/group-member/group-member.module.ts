import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupMemberPage } from './group-member';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GroupMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupMemberPage),
    TranslateModule.forChild()
  ],
})
export class GroupMemberPageModule { }
