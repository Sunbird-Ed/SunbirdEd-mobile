import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { AboutUsPage } from './about-us/about-us';
import { AboutAppPage } from './about-app/about-app';
import { ReportPage } from './reports/reports'
import { ReportListPage } from './reports/report-list/report-list'
import { GroupReportListPage } from './reports/group-report-list/group-report-list'
import { ReportAlert } from './reports/report-alert/report-alert'
import { TermsofservicePage } from './termsofservice/termsofservice';
import { PrivacypolicyPage } from './privacypolicy/privacypolicy';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingPageModule } from '../onboarding/onboarding.module';
import { LanguageSettingsPageModule } from '../language-settings/language-settings.module';

@NgModule({
	declarations: [SettingsPage,ReportPage, ReportAlert, ReportListPage,GroupReportListPage, DatasyncPage, AboutUsPage, AboutAppPage, PrivacypolicyPage, TermsofservicePage],
	entryComponents: [DatasyncPage, ReportPage,ReportListPage, AboutUsPage, ReportAlert, AboutAppPage, PrivacypolicyPage,GroupReportListPage, TermsofservicePage],
	imports: [
		OnboardingPageModule,
		LanguageSettingsPageModule,
		IonicPageModule.forChild(SettingsPage),
		TranslateModule.forChild()
	],
	exports: [SettingsPage]
})
export class SettingsPageModule { }
