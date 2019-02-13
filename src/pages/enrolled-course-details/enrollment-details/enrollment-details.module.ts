import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnrollmentDetailsPage } from './enrollment-details';
import { ComponentsModule } from '@app/component/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EnrollmentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EnrollmentDetailsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  entryComponents: [
    EnrollmentDetailsPage
]
})
export class EnrollmentDetailsPageModule {}
