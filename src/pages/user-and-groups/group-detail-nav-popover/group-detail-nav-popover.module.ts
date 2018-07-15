import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDetailNavPopoverPage } from './group-detail-nav-popover';

@NgModule({
  declarations: [
    GroupDetailNavPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDetailNavPopoverPage),
  ],
})
export class GroupDetailNavPopoverPageModule {}
