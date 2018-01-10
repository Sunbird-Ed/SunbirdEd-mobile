import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SamplePage } from './sample';

@NgModule({
  declarations: [
    SamplePage,
  ],
  imports: [
    IonicPageModule.forChild(SamplePage),
  ],
})
export class SamplePageModule {}