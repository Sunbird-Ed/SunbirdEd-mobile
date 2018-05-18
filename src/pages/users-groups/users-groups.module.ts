import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersGroupsPage } from './users-groups';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UsersGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersGroupsPage),
    TranslateModule.forChild(),
  ],
  exports: [UsersGroupsPage]
})
export class UsersGroupsPageModule {}
