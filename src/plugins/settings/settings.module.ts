import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
	declarations: [SettingsPage,DatasyncPage],
	entryComponents: [DatasyncPage],
	imports: [
		IonicPageModule.forChild(SettingsPage),
		TranslateModule.forChild()
	],
	exports: [SettingsPage]
})
export class SettingsPageModule {}
