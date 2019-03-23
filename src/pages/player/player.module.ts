import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerPage } from './player';
import { CanvasPlayerService } from './canvas-player.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    PlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerPage),
  ],
  entryComponents: [PlayerPage],
  providers: [CanvasPlayerService, ScreenOrientation as any]
})
export class PlayerPageModule {}
