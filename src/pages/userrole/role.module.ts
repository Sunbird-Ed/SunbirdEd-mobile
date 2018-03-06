import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RolePage } from './role';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RolePage
  ],
  imports: [
    IonicPageModule.forChild(RolePage),
    TranslateModule.forChild()
  ],
  exports: [
    RolePage
  ],
})
export class RolePageModule {}
