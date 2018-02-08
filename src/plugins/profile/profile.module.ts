import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';


@NgModule({
  declarations: [
    ProfilePage,
    FormEducation,
    FormAddress
  ],
  entryComponents: [ProfilePage, FormEducation, FormAddress],
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
