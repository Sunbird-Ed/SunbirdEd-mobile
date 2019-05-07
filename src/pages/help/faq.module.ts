import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqPage } from './faq';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSettingsPageModule } from '../language-settings/language-settings.module';

@NgModule({
  declarations: [
    FaqPage,
  ],
  imports: [
    IonicPageModule.forChild(FaqPage),
    TranslateModule.forChild(),
    LanguageSettingsPageModule
  ],
})
export class FaqPageModule {}
