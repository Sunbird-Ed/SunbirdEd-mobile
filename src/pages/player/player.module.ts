import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerPage } from './player';
import { CanvasPlayerService } from './canvas-player.service';

@NgModule({
  declarations: [
    PlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerPage),
  ],
  entryComponents: [PlayerPage],
  providers: [CanvasPlayerService]
})
export class PlayerPageModule {}
