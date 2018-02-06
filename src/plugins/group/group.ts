import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';


@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html'
})
export class GroupPage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService) {

  }

  init(container: ContainerService) {
    container.addTab({root: GroupPage, label: "GROUPS", icon:"groups"});
  }

}
