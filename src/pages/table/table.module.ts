import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TablePage } from './table';
import { ComponentsModule } from '../../component/components.module';

@NgModule({
  declarations: [
    TablePage,
  ],
  imports: [
    IonicPageModule.forChild(TablePage),
    ComponentsModule
  ],
})
export class TablePageModule {
}
