import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { OnboardingPageModule } from '../onboarding/onboarding.module';

@NgModule({
	declarations: [LanguageSettingsPage],
	imports: [
    OnboardingPageModule,
		IonicPageModule.forChild(LanguageSettingsPage),
		TranslateModule.forChild()
	],
	exports: [LanguageSettingsPage]
})
export class LanguageSettingsPageModule { }
