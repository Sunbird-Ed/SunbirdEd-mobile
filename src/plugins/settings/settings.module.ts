import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
	declarations: [SettingsPage],
	imports: [
		IonicPageModule.forChild(SettingsPage)
	],
	exports: [SettingsPage]
})
export class SettingsPageModule {}
