import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';
import { ContainerService } from '../../core/container/container.services';
import { Camera } from '@ionic-native/camera';


@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage
  ],
  providers: [
    ContainerService,
    Camera
  ]
})
export class ProfilePageModule {}
