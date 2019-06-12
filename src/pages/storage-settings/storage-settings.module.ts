import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorageSettingsPage } from './storage-settings';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from './../../component/components.module';

@NgModule({
  declarations: [
    StorageSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(StorageSettingsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class StorageSettingsPageModule { }
