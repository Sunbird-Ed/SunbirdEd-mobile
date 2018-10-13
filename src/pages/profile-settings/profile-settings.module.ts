import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSettingsPage } from './profile-settings';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSettingsPage),
    TranslateModule.forChild()
  ],
})
export class ProfileSettingsPageModule {}
