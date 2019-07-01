import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextbookViewMorePage } from './textbook-view-more';
import { ComponentsModule } from '../../component/components.module';

@NgModule({
  declarations: [
    TextbookViewMorePage
  ],
  imports: [
    IonicPageModule.forChild(TextbookViewMorePage),
    ComponentsModule
  ],
})
export class TextbookViewMorePageModule {}
