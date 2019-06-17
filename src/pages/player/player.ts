import { AppGlobalService, CommonUtilService } from '@app/service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { CanvasPlayerService } from './canvas-player.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicApp } from 'ionic-angular';
import { PlayerActionHandlerDelegate, HierarchyInfo, User } from './player-action-handler-delegate';
import { ContentDetailsPage } from '../content-details/content-details';
import { StatusBar } from '@ionic-native/status-bar';
import { Events } from 'ionic-angular';
import { EventTopics } from '@app/app';
@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage implements PlayerActionHandlerDelegate {
  unregisterBackButton: any;
  config = {};
  @ViewChild('preview') previewElement: ElementRef;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private canvasPlayerService: CanvasPlayerService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private ionicApp: IonicApp,
    private appGlobalService: AppGlobalService,
    private statusBar: StatusBar,
    private events: Events,
    private alertCtrl: AlertController,
    private commonUtilService: CommonUtilService
  ) {
    this.canvasPlayerService.handleAction();

    // Binding following methods to making it available to content player which is an iframe
    (<any>window).onContentNotFound = this.onContentNotFound.bind(this);
    (<any>window).onUserSwitch = this.onUserSwitch.bind(this);
  }

  ionViewWillEnter() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.statusBar.hide();
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      if (!this.ionicApp._overlayPortal.getActive()) {
        this.showConfirm();
      }
    }, 11);

    this.config = this.navParams.get('config');
    this.config['uid'] = this.config['context'].actor.id;


    if (this.config['metadata'].mimeType === 'video/x-youtube') {
      this.previewElement.nativeElement.setAttribute('sandbox', 'allow-scripts allow-top-navigation allow-same-origin');
    }

    // This is to reload a iframe as iframes reload method not working on cross-origin.
    const src = this.previewElement.nativeElement.src;
    this.previewElement.nativeElement.src = '';
    this.previewElement.nativeElement.src = src;
    // this.previewElement.nativeElement.contentWindow['cordova'] = window['cordova'];
    this.previewElement.nativeElement.onload = () => {
      console.log('config', this.config);
      setTimeout(() => {
        this.previewElement.nativeElement.contentWindow['cordova'] = window['cordova'];
        this.previewElement.nativeElement.contentWindow['Media'] = window['Media'];
        this.previewElement.nativeElement.contentWindow['initializePreview'](this.config);
      }, 1000);
    };

    this.events.subscribe('endGenieCanvas', (res) => {
      if (res.showConfirmBox) {
        this.showConfirm();
      } else {
        this.closeIframe();
      }
    });
  }

  ionViewWillLeave() {
    this.statusBar.show();
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.unregisterBackButton();
    this.events.unsubscribe('endGenieCanvas');
  }

  /**
   * This will trigger from player/ iframe when it unable to find consecutive content
   * @param {string} identifier Content Identifier
   * @param {Array<hierarchyInfo>} hierarchyInfo Object of content hierarchy
   */
  onContentNotFound(identifier: string, hierarchyInformation: Array<HierarchyInfo>) {
    const content = {
      identifier: identifier,
      hierarchyInfo: hierarchyInformation
    };
    this.navCtrl.push(ContentDetailsPage, {
      content: content
    }).then(() => {
      // Hide player while going back
      this.navCtrl.remove(this.navCtrl.length() - 2);
    });
  }

  /**
   * This is an callback to mobile when player switches user
   * @param {user} selectedUser User id of the newly selected user by player
   */
  onUserSwitch(selectedUser: User) {
    this.appGlobalService.setSelectedUser(selectedUser);
  }

  /**
   * This will close the player page and will fire some end telemetry events from the player
   */
  closeIframe() {
    const stageId = this.previewElement.nativeElement.contentWindow['EkstepRendererAPI'].getCurrentStageId();
    try {
      this.previewElement.nativeElement.contentWindow['TelemetryService'].exit(stageId);
    } catch (err) {
      console.error('End telemetry error:', err.message);
    }
    this.events.publish(EventTopics.PLAYER_CLOSED, {
      selectedUser: this.appGlobalService.getSelectedUser()
    });
    this.navCtrl.pop();
  }

  /**
   * This will show confirmation box while leaving the player, it will fire some telemetry events from the player.
   */
  showConfirm() {
    const type = (this.previewElement.nativeElement.contentWindow['Renderer']
      && !this.previewElement.nativeElement.contentWindow['Renderer'].running) ? 'EXIT_APP' : 'EXIT_CONTENT';
    const stageId = this.previewElement.nativeElement.contentWindow['EkstepRendererAPI'].getCurrentStageId();
    this.previewElement.nativeElement.contentWindow['TelemetryService'].interact(
      'TOUCH', 'DEVICE_BACK_BTN', 'EXIT', { type: type, stageId: stageId });

    const alert = this.alertCtrl.create({
      title: this.commonUtilService.translateMessage('CONFIRM'),
      message: this.commonUtilService.translateMessage('CONTENT_PLAYER_EXIT_PERMISSION'),
      buttons: [
        {
          text: this.commonUtilService.translateMessage('CANCEL'),
          role: 'cancel',
          handler: () => {
            this.previewElement.nativeElement.contentWindow['TelemetryService'].interact(
              'TOUCH', 'ALERT_CANCEL', 'EXIT', { type: type, stageId: stageId });
          }
        },
        {
          text: this.commonUtilService.translateMessage('OKAY'),
          handler: () => {
            this.previewElement.nativeElement.contentWindow['TelemetryService'].interact(
              'END', 'ALERT_OK', 'EXIT', { type: type, stageId: stageId });
            this.previewElement.nativeElement.contentWindow['TelemetryService'].interrupt('OTHER', stageId);
            this.previewElement.nativeElement.contentWindow['EkstepRendererAPI'].dispatchEvent('renderer:telemetry:end');

            this.closeIframe();
          }
        }
      ]
    });
    alert.present();
  }
}
