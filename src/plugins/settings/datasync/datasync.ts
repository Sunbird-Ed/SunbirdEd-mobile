import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TelemetryService } from '../../../core/services/telemetry/telemetry.service';

/**
 * Generated class for the DatasyncPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-datasync',
  templateUrl: 'datasync.html',
  providers: [TelemetryService]
})
export class DatasyncPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private telemetryService: TelemetryService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatasyncPage');
  }

  onSyncClick() {
    console.log('Sync called');
    this.telemetryService.sync();
  }

}
