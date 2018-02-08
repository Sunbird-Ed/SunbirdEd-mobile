import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';
import { CameraService } from '../../core/services/camera.service';
import { ContainerService } from '../../core/container/container.services';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { FormExperience } from './experience/form.experience';


@NgModule({
  declarations: [
    ProfilePage,
    FormEducation,
    FormAddress,
    FormExperience
  ],
  entryComponents: [FormEducation, FormAddress, FormExperience],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage,
    FormAddress,
    FormEducation
  ],
  providers: [
    ContainerService,
    CameraService
  ]
})
export class ProfilePageModule { }
