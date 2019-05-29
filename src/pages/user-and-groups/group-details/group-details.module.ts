import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDetailsPage } from './group-details';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/component/components.module';

@NgModule({
  declarations: [
    GroupDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDetailsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class GroupDetailsPageModule { }
