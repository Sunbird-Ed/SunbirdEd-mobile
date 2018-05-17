import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersGroupsPage } from './users-groups';

@NgModule({
  declarations: [
    UsersGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersGroupsPage),
  ],
  exports: [UsersGroupsPage]
})
export class UsersGroupsPageModule {}
