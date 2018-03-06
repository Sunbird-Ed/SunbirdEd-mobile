import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { BasePlugin, ContainerService } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html'
})
export class GroupPage implements BasePlugin {

  constructor(public navCtrl: NavController) {

  }

  init(container: ContainerService) {
    container.addTab({root: GroupPage, label: "GROUPS", icon:"groups", index: 3});
  }

}
