import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TelemetryService } from '../../service/TelemetryService';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService) {

  }

  init(container: ContainerService) {
    console.log("Hello");

    container.addTab({root: HomePage, label: "HOME", icon:"home"});
  }


}
