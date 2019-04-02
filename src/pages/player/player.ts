import { AppGlobalService } from '@app/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CanvasPlayerService } from './canvas-player.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicApp } from 'ionic-angular';
import { playerActionHandlerDelegate, hierarchyInfo, user } from './player-action-handler-delegate';
import { ContentDetailsPage } from '../content-details/content-details';
import { StatusBar } from '@ionic-native/status-bar';
@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage implements playerActionHandlerDelegate {
  unregisterBackButton: any;
  config = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private canvasPlayerService: CanvasPlayerService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private ionicApp: IonicApp,
    private appGlobalService: AppGlobalService,
    private statusBar: StatusBar
  ) {
    this.canvasPlayerService.handleAction();
  }

  ionViewWillEnter() {
    this.statusBar.hide();
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      if (!this.ionicApp._overlayPortal.getActive())
        this.canvasPlayerService.showConfirm();
    }, 11);

    this.config = this.navParams.get('config');

    let previewElement: HTMLIFrameElement = document.getElementById('preview') as HTMLIFrameElement;
    this.config['uid'] = this.config['context'].actor.id;
    // This is to reload a iframe as reload method not working on cross-origin.
    const src = previewElement.src;
    previewElement.src = '';
    previewElement.src = src;

    previewElement.onload = () => {

      console.log("config", this.config);
      setTimeout(() => {
        previewElement.contentWindow['playerActionHandlerDelegate'] = this;
        previewElement.contentWindow['initializePreview'](this.config);
      }, 1000);
    }
  }

  ionViewDidEnter() {
    this.screenOrientation.lock('landscape');
  }

  ionViewWillLeave() {
    this.statusBar.show();
    this.screenOrientation.unlock();
    this.unregisterBackButton();
  }

  onContentNotFound(identifier: string, hierarchyInfo: Array<hierarchyInfo>) {
    const content = {
      identifier: identifier,
      hierarchyInfo: hierarchyInfo
    };
    this.navCtrl.push(ContentDetailsPage, {
      content: content
    }).then(() => {
      this.navCtrl.remove(this.navCtrl.length() - 2);
    });
  }

  onUserSwitch(selectedUser) {
    this.appGlobalService.setSelectedUser(selectedUser);
  }
}
