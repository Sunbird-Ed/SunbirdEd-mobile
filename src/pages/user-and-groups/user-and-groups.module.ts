import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAndGroupsPage } from './user-and-groups';
import { GrouplandingPage } from './grouplanding/grouplanding';
import { CreateGroupPage  } from './create-group/create-group';
import { MembersPage } from './members/members';
import { GroupMemberPage } from './group-member/group-member';



@NgModule({
  declarations: [
    UserAndGroupsPage,
    GrouplandingPage,
    CreateGroupPage,
    MembersPage,
    GroupMemberPage

  ],
  entryComponents:[
    GrouplandingPage,
    CreateGroupPage,
    MembersPage,
    GroupMemberPage
  ],
  imports: [
    IonicPageModule.forChild(UserAndGroupsPage),
  ],
})
export class UserAndGroupsPageModule {}
