import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChildContentDetailsPage } from './child-content-details';
import { TranslateModule } from '@ngx-translate/core';
import { GenieSDKServiceProvider } from 'sunbird';
import { FrameworkModule } from "sunbird";
import { IonicImageLoader } from "ionic-image-loader";
import { Ionic2RatingModule } from "ionic2-rating";
import { ComponentsModule } from './../../component/components.module';
import { DirectivesModule } from './../../directives/directives.module';

@NgModule({
  declarations: [
    ChildContentDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChildContentDetailsPage),
    TranslateModule.forChild(),
    ComponentsModule,
    FrameworkModule,
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule
  ],
  providers: [GenieSDKServiceProvider],
  exports: [
    ChildContentDetailsPage
  ]
})
export class ChildContentDetailsPageModule {}
