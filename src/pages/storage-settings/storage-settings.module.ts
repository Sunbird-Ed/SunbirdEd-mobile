import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorageSettingsPage } from './storage-settings';
import { ComponentsModule } from './../../component/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    StorageSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(StorageSettingsPage),
    ComponentsModule,
    PipesModule
  ],
})
export class StorageSettingsPageModule {}
