import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResourcesPage } from './resources';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../component/components.module';
import { PlayerPageModule } from '../player/player.module';

@NgModule({
  declarations: [
    ResourcesPage
  ],
  imports: [
    IonicPageModule.forChild(ResourcesPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PlayerPageModule
  ],
  exports: [
    ResourcesPage
  ],
  entryComponents: [],
  providers: []
})
export class ResourcesPageModule { }
