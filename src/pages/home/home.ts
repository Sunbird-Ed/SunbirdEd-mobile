import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TelemetryService } from '../../service/TelemetryService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage {

  constructor(public navCtrl: NavController, private telemetry: TelemetryService) {

  }

  ionViewDidEnter() {
    this.telemetry.saveImpression("view", "SUNBIRD_IONIC_HOME");
  }

  onSyncClick() {
    this.telemetry.sync();
  }

}
