import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersPage } from './users';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UsersPage,

  ],
  imports: [
    IonicPageModule.forChild(UsersPage),
    TranslateModule.forChild()
  ],
})
export class UsersPageModule { }
