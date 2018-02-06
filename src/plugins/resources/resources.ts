import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService) {

  }

  init(container: ContainerService) {
    container.addTab({root: ResourcesPage, label: "RESOURCES", icon: "resources"});
  }

}
