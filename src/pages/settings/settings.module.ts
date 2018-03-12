import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { AboutusPage } from './aboutus/aboutus';
import { AboutappPage } from './aboutapp/aboutapp';
import { TermsofservicePage } from './termsofservice/termsofservice';
import { PrivacypolicyPage } from './privacypolicy/privacypolicy';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingPageModule } from '../onboarding/onboarding.module';
import { LanguageSettingsPageModule } from '../language-settings/language-settings.module';

@NgModule({
	declarations: [SettingsPage, DatasyncPage, AboutusPage, AboutappPage, PrivacypolicyPage, TermsofservicePage],
	entryComponents: [DatasyncPage, AboutusPage, AboutappPage, PrivacypolicyPage, TermsofservicePage],
	imports: [
		OnboardingPageModule,
		LanguageSettingsPageModule,
		IonicPageModule.forChild(SettingsPage),
		TranslateModule.forChild()
	],
	exports: [SettingsPage]
})
export class SettingsPageModule { }
