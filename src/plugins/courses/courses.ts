import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage implements BasePlugin {

  constructor(public navCtrl: NavController) {

  }

  init(container: ContainerService) {

    container.addTab({root: CoursesPage, icon: "courses", label:"COURSES"});
  }

}
