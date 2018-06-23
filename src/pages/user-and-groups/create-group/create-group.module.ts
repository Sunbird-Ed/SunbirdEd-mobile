import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateGroupPage } from './create-group';

@NgModule({
  declarations: [
    CreateGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateGroupPage),
  ],
})
export class CreateGroupPageModule {}
