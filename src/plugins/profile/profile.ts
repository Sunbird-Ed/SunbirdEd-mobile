import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements BasePlugin {

  constructor(public navCtrl: NavController,
    private container: ContainerService) {

  }

  init(container: ContainerService) {
    container.addTab({root: ProfilePage, label: "PROFILE", icon: "profile"});
  }

}
