import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPage } from './popover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPage),
    TranslateModule.forChild()
  ],
})
export class PopoverPageModule {}
