import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TelemetryService, Impression } from '../../core/services/telemetry.service';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin, ContainerService } from '../../core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService,
    private telemetryService: TelemetryService) {

  }

  init(container: ContainerService) {

    container.addTab({root: HomePage, label: "HOME", icon:"home"});
  }

  ionViewDidLoad() {
    let impression = new Impression();
    impression.type = "view";
    impression.pageId = "ionic_sunbird";
    this.telemetryService.impression(impression);
  }

  onSyncClick() {
    this.telemetryService.sync();
  }


}
