import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddOrRemoveGroupUserPage } from './add-or-remove-group-user';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddOrRemoveGroupUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AddOrRemoveGroupUserPage),
    TranslateModule.forChild()
  ],
})
export class AddOrRemoveGroupUserPageModule {}
