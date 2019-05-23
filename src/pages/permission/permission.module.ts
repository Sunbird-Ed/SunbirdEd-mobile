import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PermissionPage } from './permission';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PermissionPage,
  ],
  imports: [
    IonicPageModule.forChild(PermissionPage),
    TranslateModule.forChild()
  ],
})
export class PermissionPageModule {}
