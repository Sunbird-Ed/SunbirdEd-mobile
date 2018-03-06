import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContainerService, BasePlugin } from 'sunbird';

@Component({
  selector: 'page-resources',
  templateUrl: 'resources.html'
})
export class ResourcesPage implements BasePlugin {

  constructor(public navCtrl: NavController) {

  }

  init(container: ContainerService) {
    container.addTab({root: ResourcesPage, label: "RESOURCES", icon: "resources", index: 2});
  }

}
