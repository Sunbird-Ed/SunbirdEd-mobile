import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../component/components.module';
import { UserReportPage } from './user-report';

@NgModule({
  declarations: [
    UserReportPage,
  ],
  imports: [
    IonicPageModule.forChild(UserReportPage),
    ComponentsModule
  ],
})
export class UserReportModule {
}
