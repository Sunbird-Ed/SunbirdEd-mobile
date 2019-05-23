import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PermissionPage } from './permission';

@NgModule({
  declarations: [
    PermissionPage,
  ],
  imports: [
    IonicPageModule.forChild(PermissionPage),
  ],
})
export class PermissionPageModule {}
