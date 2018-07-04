import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupMemberPage } from './group-member';

@NgModule({
  declarations: [
    GroupMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupMemberPage),
  ],
})
export class GroupMemberPageModule {}
