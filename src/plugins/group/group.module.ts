import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupPage } from './group';


@NgModule({
  declarations: [
    GroupPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupPage),
  ],
  exports: [
    GroupPage
  ]
})
export class GroupPageModule {}
