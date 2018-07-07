import { CreateuserPage } from './createuser/createuser';
import { UsersPage } from './users/users';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAndGroupsPage } from './user-and-groups';
import { GrouplandingPage } from './grouplanding/grouplanding';
import { CreateGroupPage } from './create-group/create-group';
import { MembersPage } from './members/members';
import { GroupMemberPage } from './group-member/group-member';
import { TranslateModule } from '@ngx-translate/core';
import { CreateGroupPageModule } from './create-group/create-group.module';
import { CreateuserPageModule } from './createuser/createuser.module';
import { GroupMemberPageModule } from './group-member/group-member.module';
import { GrouplandingPageModule } from './grouplanding/grouplanding.module';
import { MembersPageModule } from './members/members.module';
import { UsersPageModule } from './users/users.module';

@NgModule({
  declarations: [
    UserAndGroupsPage
  ],
  entryComponents: [
    CreateGroupPage,
    CreateuserPage,
    GroupMemberPage,
    GrouplandingPage,
    MembersPage,
    UsersPage
  ],
  imports: [
    IonicPageModule.forChild(UserAndGroupsPage),
    TranslateModule.forChild(),
    CreateGroupPageModule,
    CreateuserPageModule,
    GroupMemberPageModule,
    GrouplandingPageModule,
    MembersPageModule,
    UsersPageModule
  ],
})
export class UserAndGroupsPageModule { }
