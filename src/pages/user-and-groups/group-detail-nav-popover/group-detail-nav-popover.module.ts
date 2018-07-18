import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDetailNavPopoverPage } from './group-detail-nav-popover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GroupDetailNavPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDetailNavPopoverPage),
    TranslateModule.forChild()
  ],
})
export class GroupDetailNavPopoverPageModule {}
