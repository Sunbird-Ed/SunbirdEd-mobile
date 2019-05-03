import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpPage } from './help';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpPage),
    TranslateModule.forChild()
  ],
})
export class HelpPageModule {}
