import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserOnboardingPreferencesPage } from './user-onboarding-preferences';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserOnboardingPreferencesPage,
  ],
  imports: [
    IonicPageModule.forChild(UserOnboardingPreferencesPage),
    TranslateModule.forChild()
  ],
})
export class UserOnboardingPreferencesPageModule {}
