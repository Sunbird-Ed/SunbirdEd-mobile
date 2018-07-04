import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateuserPage } from './createuser';

@NgModule({
  declarations: [
    CreateuserPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateuserPage),
  ],
})
export class CreateuserPageModule {}
