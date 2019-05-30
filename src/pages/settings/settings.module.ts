import { NgModule } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { AboutUsPage } from './about-us/about-us';
import { AboutAppPage } from './about-app/about-app';
import { TermsofservicePage } from './termsofservice/termsofservice';
import { PrivacypolicyPage } from './privacypolicy/privacypolicy';
import { TranslateModule } from '@ngx-translate/core';
import { OnboardingPageModule } from '../onboarding/onboarding.module';
import { LanguageSettingsPageModule } from '../language-settings/language-settings.module';
import { PermissionPageModule } from '../permission/permission.module';

@NgModule({
 declarations: [
    SettingsPage,
    DatasyncPage,
    AboutUsPage,
    AboutAppPage,
    PrivacypolicyPage,
    TermsofservicePage
  ],
  entryComponents: [
    DatasyncPage,
    AboutUsPage,
    AboutAppPage,
    PrivacypolicyPage,
    TermsofservicePage
  ],
  imports: [
    OnboardingPageModule,
    LanguageSettingsPageModule,
    IonicPageModule.forChild(SettingsPage),
    TranslateModule.forChild(),
    PermissionPageModule
  ],
  exports: [SettingsPage]
})
export class SettingsPageModule { }
