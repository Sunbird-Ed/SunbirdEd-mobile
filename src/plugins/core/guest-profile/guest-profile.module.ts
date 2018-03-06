import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GuestProfilePage } from '../guest-profile/guest-profile';
import { GuestEditProfileModule } from '../guest-edit.profile/guest-edit-profile.module';

@NgModule({
	declarations: [GuestProfilePage],
	imports: [
		GuestEditProfileModule,
		IonicPageModule.forChild(GuestProfilePage),
		TranslateModule.forChild()
	],
	exports: [GuestProfilePage]
})
export class GuestProfilePageModule { }
