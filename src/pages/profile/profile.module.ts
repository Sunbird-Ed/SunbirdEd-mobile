import { NgModule } from '@angular/core';
import { DatePipe } from "@angular/common";
import { IonicPageModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { TranslateModule } from '@ngx-translate/core';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { ProfilePage } from './profile';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { FormExperience } from './experience/form.experience';
import { UsersnClassesComponent } from './usersnclasses/usersnclass.component';
import { UsersComponent } from './usersnclasses/users/users.component';
import { ClassesComponent } from './usersnclasses/classes/classes.component';
import { OverflowMenuComponent } from './overflowmenu/menu.overflow.component';
import { ContainerService, CameraService } from 'sunbird';
import { SettingsPageModule } from '../settings/settings.module';
import { ActionMenuComponent } from './actionmenu/menu.action.component';
import { AddUserComponent } from './usersnclasses/users/adduser.component';
import { PBHorizontal } from '../../component/pbhorizontal/pb-horizontal';


@NgModule({
  declarations: [
    ProfilePage,
    FormEducation,
    FormAddress,
    FormExperience,
    OverflowMenuComponent,
    UsersnClassesComponent,
    UsersComponent,
    ClassesComponent,
    ActionMenuComponent,
    AddUserComponent,
    PBHorizontal
  ],
  entryComponents: [ProfilePage, FormEducation, FormAddress, FormExperience,
    OverflowMenuComponent,
    UsersnClassesComponent,
    UsersComponent,
    ClassesComponent,
    ActionMenuComponent,
    AddUserComponent],

  imports: [
    IonicPageModule.forChild(ProfilePage),
    SuperTabsModule.forRoot(),
    SettingsPageModule, 
    TranslateModule.forChild()
  ],
  exports: [
    ProfilePage,
    FormAddress,
    FormEducation,
    UsersnClassesComponent,
    UsersComponent,
    ClassesComponent
  ],
  providers: [
    ContainerService,
    Camera,
    CameraService,
    DatePipe
  ]
})
export class ProfilePageModule { }
