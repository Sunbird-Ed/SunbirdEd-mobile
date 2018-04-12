import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseBatchesPage } from './course-batches';

@NgModule({
  declarations: [
    CourseBatchesPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseBatchesPage),
  ],
})
export class CourseBatchesPageModule {}
