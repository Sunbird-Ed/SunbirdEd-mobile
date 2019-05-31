import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserTypeSelectionPage } from './user-type-selection';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionPageModule } from '../permission/permission.module';
@NgModule({
  declarations: [
    UserTypeSelectionPage
  ],
  imports: [
    IonicPageModule.forChild(UserTypeSelectionPage),
    TranslateModule.forChild(),
    PermissionPageModule
  ],
  exports: [
    UserTypeSelectionPage
  ],
})
export class UserTypeSelectionPageModule {}
