import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSettingPage } from './language-setting/language-setting';

@NgModule({
	declarations: [SettingsPage, LanguageSettingPage, DatasyncPage],
	entryComponents: [LanguageSettingPage, DatasyncPage],
	imports: [
		IonicPageModule.forChild(SettingsPage),
		TranslateModule.forChild()
	],
	exports: [SettingsPage]
})
export class SettingsPageModule { }
