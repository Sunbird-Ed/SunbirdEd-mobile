import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateGroupPage } from './create-group';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateGroupPage),
    TranslateModule.forChild()
  ],
})
export class CreateGroupPageModule { }
