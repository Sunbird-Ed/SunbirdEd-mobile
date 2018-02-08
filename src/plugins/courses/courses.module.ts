import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';
import { ContainerService } from '../../core/container/container.services';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    TranslateModule.forChild()
  ],
  exports: [
    CoursesPage
  ],
  providers: [
    ContainerService
  ]
})
export class CoursesPageModule {}
