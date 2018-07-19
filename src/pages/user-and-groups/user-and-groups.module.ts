import { PopoverPageModule } from './popover/popover.module';
import { PopoverPage } from './popover/popover';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAndGroupsPage } from './user-and-groups';
import { CreateGroupPage } from './create-group/create-group';
import { GroupMembersPage } from './group-members/group-members';
import { GroupDetailsPage } from './group-details/group-details';
import { TranslateModule } from '@ngx-translate/core';
import { CreateGroupPageModule } from './create-group/create-group.module';
import { GroupMembersPageModule } from './group-members/group-members.module';
import { GroupDetailsPageModule } from './group-details/group-details.module';
import { GroupDetailNavPopoverPage } from './group-detail-nav-popover/group-detail-nav-popover';
import { GroupDetailNavPopoverPageModule } from './group-detail-nav-popover/group-detail-nav-popover.module';
import { AddOrRemoveGroupUserPage } from './add-or-remove-group-user/add-or-remove-group-user';
import { AddOrRemoveGroupUserPageModule } from './add-or-remove-group-user/add-or-remove-group-user.module';

@NgModule({
  declarations: [
    UserAndGroupsPage
  ],
  entryComponents: [
    CreateGroupPage,
    GroupMembersPage,
    GroupDetailsPage,
    PopoverPage,
    GroupDetailNavPopoverPage,
    AddOrRemoveGroupUserPage
  ],
  imports: [
    IonicPageModule.forChild(UserAndGroupsPage),
    TranslateModule.forChild(),
    CreateGroupPageModule,
    GroupMembersPageModule,
    GroupDetailsPageModule,
    PopoverPageModule,
    GroupDetailNavPopoverPageModule,
    AddOrRemoveGroupUserPageModule
  ],
})
export class UserAndGroupsPageModule { }
