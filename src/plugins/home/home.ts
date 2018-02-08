import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TelemetryService } from '../../service/TelemetryService';
import { BasePlugin, ContainerService } from '../../core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [TelemetryService]

})
export class HomePage implements BasePlugin {

  constructor(public navCtrl: NavController) {
  }

  init(container: ContainerService) {

    container.addTab({root: HomePage, label: "HOME", icon:"home"});
  }


}
