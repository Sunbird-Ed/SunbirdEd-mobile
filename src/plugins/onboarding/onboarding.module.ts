import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingPage } from './onboarding';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';
import { SliderPage } from './slider/slider';


@NgModule({
  declarations: [
    OnboardingPage,
    SliderPage
  ],
  entryComponents: [SliderPage],
  imports: [
    IonicPageModule.forChild(OnboardingPage),
  ],
  exports: [
    OnboardingPage,
    SliderPage
  ]
})
export class OnboardingPageModule {}
