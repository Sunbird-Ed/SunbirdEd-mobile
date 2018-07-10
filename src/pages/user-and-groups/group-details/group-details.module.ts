import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDetailsPage } from './group-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GroupDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDetailsPage),
    TranslateModule.forChild()
  ],
})
export class GroupDetailsPageModule { }
