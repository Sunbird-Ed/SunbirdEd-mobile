import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
@NgModule({
	declarations: [SettingsPage,DatasyncPage],
	entryComponents: [DatasyncPage],
	imports: [
		IonicPageModule.forChild(SettingsPage)
	],
	exports: [SettingsPage]
})
export class SettingsPageModule {}
