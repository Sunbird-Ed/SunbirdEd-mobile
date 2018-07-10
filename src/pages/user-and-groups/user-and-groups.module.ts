import { PopoverPageModule } from './popover/popover.module';
import { PopoverPage } from './popover/popover';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAndGroupsPage } from './user-and-groups';
import { CreateGroupPage } from './create-group/create-group';
import { MembersPage } from './members/members';
import { GroupMemberPage } from './group-member/group-member';
import { TranslateModule } from '@ngx-translate/core';
import { CreateGroupPageModule } from './create-group/create-group.module';
import { GroupMemberPageModule } from './group-member/group-member.module';
import { MembersPageModule } from './members/members.module';

@NgModule({
  declarations: [
    UserAndGroupsPage
  ],
  entryComponents: [
    CreateGroupPage,
    GroupMemberPage,
    MembersPage,
    PopoverPage
  ],
  imports: [
    IonicPageModule.forChild(UserAndGroupsPage),
    TranslateModule.forChild(),
    CreateGroupPageModule,
    GroupMemberPageModule,
    MembersPageModule,
    PopoverPageModule
  ],
})
export class UserAndGroupsPageModule { }
