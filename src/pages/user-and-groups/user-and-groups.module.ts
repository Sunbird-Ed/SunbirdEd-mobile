import { CreateuserPage } from './createuser/createuser';
import { UsersPage } from './users/users';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAndGroupsPage } from './user-and-groups';
import { GrouplandingPage } from './grouplanding/grouplanding';
import { CreateGroupPage  } from './create-group/create-group';
import { MembersPage } from './members/members';
import { GroupMemberPage } from './group-member/group-member';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    UserAndGroupsPage,
    GrouplandingPage,
    CreateGroupPage,
    MembersPage,
    GroupMemberPage,
    UsersPage,
    CreateuserPage

  ],
  entryComponents:[
    GrouplandingPage,
    CreateGroupPage,
    MembersPage,
    GroupMemberPage,
    UsersPage,
    CreateuserPage
  ],
  imports: [
    IonicPageModule.forChild(UserAndGroupsPage),
    TranslateModule.forChild()
  ],
})
export class UserAndGroupsPageModule {}
