import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrivacypolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-privacypolicy',
  templateUrl: 'privacypolicy.html',
})
export class PrivacypolicyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacypolicyPage');
  }

  ionViewDidEnter() {
    this.generateImpressionEvent();
  }

  generateImpressionEvent() {
    // let impression = new Impression();
    // impression.type = ImpressionType.VIEW;
    // impression.pageId = PageId.SETTINGS_ABOUT_US;
    // impression.env = Environment.SETTINGS;
    // this.telemetryService.impression(impression);
  }

}
