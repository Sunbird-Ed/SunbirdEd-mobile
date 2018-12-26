import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TermsAndConditionsPage} from './terms-and-conditions';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    TermsAndConditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsAndConditionsPage),
    TranslateModule.forChild(),
  ],
  entryComponents: [
    TermsAndConditionsPage,
  ]
})
export class TermsAndConditionsPageModule {
}
