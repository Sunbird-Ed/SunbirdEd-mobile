import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Config } from 'ionic-angular';
import { customConfig } from './config';
import { CanvasPlayerService } from './canvas-player.service';
import { AlertController } from 'ionic-angular';


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
    private platform: Platform
  ) {
    this.canvasPlayerService.handleAction();
    // this.canvasPlayerService.xmlToJSon('../assets/sample.xml');
  }

  ionViewWillEnter() {
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.canvasPlayerService.showConfirm();
    }, 11);
  }


  ionViewDidLoad() {
    let that = this;
    this.config = this.navParams.get('config');
    let previewElement: HTMLIFrameElement = document.getElementById('preview') as HTMLIFrameElement;
    previewElement.src = 'build/content-player/preview.html?date=' + new Date().toLocaleString();
    previewElement.onload = function () {
      that.config['context'].hierarchyInfo = that.config['metaData'].hierarchyInfo;
      that.config['metaData'].contentData.basePath = that.config['metaData'].basePath.replace(/\/$/, "");
      that.config['metaData'].contentData.basepath = that.config['metaData'].basePath.replace(/\/$/, "");      
      that.config['metadata'] = that.config['metaData'];
      // that.config['metadata'].contentData = {};
      // that.config['metadata'].hierarchyInfo = that.config['metaData'].hierarchyInfo;
      // that.config['metadata'].rollup = that.config['metaData'].rollup;
      // that.config['metadata'].isAvailableLocally = that.config['metaData'].isAvailableLocally;
      delete that.config['metaData'];
      console.log("config", that.config);
      setTimeout(() => {
        (previewElement['contentWindow'] as any).initializePreview(that.config);
      }, 200);
    }
  }

  getConfiguration() {
    this.config = this.navParams.get('config');
    var config = {
      "context": {}, 
      "config": {}, 
      "metadata": {}, 
      "data": {}
    }
    return config;
  }

  ionViewWillLeave() {
    this.unregisterBackButton();
  }

}
