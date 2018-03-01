import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GuestProfilePage } from '../guest-profile/guest-profile';
// import { OnboardingPageModule } from '../onboarding/onboarding.module';

@NgModule({
	declarations: [GuestProfilePage],
	imports: [
    // OnboardingPageModule,
		IonicPageModule.forChild(GuestProfilePage),
		TranslateModule.forChild()
	],
	exports: [GuestProfilePage]
})
export class GuestProfilePageModule { }
