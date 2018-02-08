import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
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
  entryComponents: [ProfilePage, FormEducation, FormAddress, FormExperience],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage,
    FormAddress,
    FormEducation
  ]
})
export class ProfilePageModule { }
