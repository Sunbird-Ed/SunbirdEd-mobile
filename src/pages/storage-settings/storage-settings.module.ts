import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorageSettingsPage } from './storage-settings';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from './../../component/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    StorageSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(StorageSettingsPage),
    ComponentsModule,
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class StorageSettingsPageModule { }
