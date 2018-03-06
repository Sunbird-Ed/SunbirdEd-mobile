import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GuestProfilePage } from '../guest-profile/guest-profile';
import { GuestEditProfilePage } from './guest-edit.profile';
// import { OnboardingPageModule } from '../onboarding/onboarding.module';

@NgModule({
	declarations: [GuestEditProfilePage],
	imports: [
    // OnboardingPageModule,
		IonicPageModule.forChild(GuestEditProfilePage),
		TranslateModule.forChild()
	],
	exports: [GuestEditProfilePage]
})
export class GuestEditProfileModule { }
