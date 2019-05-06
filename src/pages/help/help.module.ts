import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpPage } from './help';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSettingsPageModule } from '../language-settings/language-settings.module';

@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpPage),
    TranslateModule.forChild(),
    LanguageSettingsPageModule
  ],
})
export class HelpPageModule {}
