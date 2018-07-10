import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupMembersPage } from './group-members';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GroupMembersPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupMembersPage),
    TranslateModule.forChild()
  ],
})
export class GroupMembersPageModule { }
