import { PlayerPageModule } from './../player/player.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContentDetailsPage } from './content-details';
import { IonicImageLoader } from 'ionic-image-loader';
import { Ionic2RatingModule } from 'ionic2-rating';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ContentActionsComponent } from './../../component/content-actions/content-actions';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ComponentsModule } from '../../component/components.module';
import { FileSizePipe } from '@app/pipes/file-size/file-size';
import { ContentShareHandler } from '@app/service/content/content-share-handler';
import { ProfileSwitchHandler } from '@app/service/user-groups/profile-switch-handler';

@NgModule({
  declarations: [
    ContentDetailsPage,
    ContentActionsComponent
  ],
  entryComponents: [
    ContentActionsComponent
  ],
  imports: [
    IonicPageModule.forChild(ContentDetailsPage),
    TranslateModule.forChild(),
    IonicImageLoader,
    DirectivesModule,
    Ionic2RatingModule,
    PipesModule,
    ComponentsModule,
    PlayerPageModule
  ],
  providers: [
    SocialSharing,
    FileSizePipe,
    ContentShareHandler,
    ProfileSwitchHandler
  ],
  exports: [
    ContentDetailsPage
  ]
})
export class ContentDetailsPageModule { }
