import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CanvasPlayerService } from './canvas-player.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {
  private win: any = window;
  unregisterBackButton: any;
  config = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private canvasPlayerService: CanvasPlayerService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation  
  ) {
    this.canvasPlayerService.handleAction();
    this.screenOrientation.lock('landscape');
  }

  ionViewWillEnter() {
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.canvasPlayerService.showConfirm();
    }, 11);


    let that = this;
    this.config = this.navParams.get('config');
    
    let previewElement: HTMLIFrameElement = document.getElementById('preview') as HTMLIFrameElement;
    //previewElement.src = 'build/content-player/preview.html?date=' + new Date().toLocaleString();
    that.config['context'].hierarchyInfo = that.config['metaData'].hierarchyInfo;
    that.config['metaData'].contentData.basePath = that.config['metaData'].basePath.replace(/\/$/, "");
    that.config['metaData'].contentData.basepath = that.config['metaData'].basePath.replace(/\/$/, "");      
    that.config['metadata'] = that.config['metaData'];
    that.config['uid'] = that.config['context'].actor.id;
    delete that.config['metaData'];
    previewElement.contentWindow.location.reload();
    previewElement.onload = function () {
      
      console.log("config", that.config);
      setTimeout(() => {
        (previewElement['contentWindow'] as any).initializePreview(that.config);
      }, 100);
    }
  }

  getConfiguration() {
    var mobileConfig = this.navParams.get('config');
    // mobileConfig.config.metaData.basePath = mobileConfig.config.metaData.basePath.replace(/\/$/, "");
    // build/content-player/preview.htmlmobileConfig.config.metaData.basepath = mobileConfig.config.metaData.basePath;

    var config = {
      "context": mobileConfig.context,
      "config": mobileConfig.config, 
      "metadata": mobileConfig.metaData, 
      "data": mobileConfig.data
    }
    return config;
  }

  ionViewWillLeave() {
    this.screenOrientation.unlock();
    this.unregisterBackButton();
  }

}
