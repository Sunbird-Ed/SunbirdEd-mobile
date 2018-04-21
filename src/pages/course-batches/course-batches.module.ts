import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseBatchesPage } from './course-batches';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CourseBatchesPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseBatchesPage),
    TranslateModule.forChild()
  ],
})
export class CourseBatchesPageModule {}
