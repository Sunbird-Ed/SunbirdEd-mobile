import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorageSettingsPage } from './storage-settings';
import { ComponentsModule } from './../../component/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    StorageSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(StorageSettingsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ],
})
export class StorageSettingsPageModule {}
