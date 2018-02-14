import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowserTab } from "@ionic-native/browser-tab";

import { OnboardingPage } from './onboarding';
import { SettingsPageModule } from '../settings/settings.module';

@NgModule({
  declarations: [
    OnboardingPage
  ],
  imports: [
    IonicPageModule.forChild(OnboardingPage),
  ],
  exports: [
    OnboardingPage
  ],
  providers: [
    BrowserTab
  ]
})
export class OnboardingPageModule {}
