import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/component/components.module';

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class NotificationsPageModule {}
