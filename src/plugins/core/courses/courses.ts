import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { BasePlugin, ContainerService } from '../../../framework';

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage implements BasePlugin {

  hello: string = "HELLO";

  constructor(public navCtrl: NavController) {

  }

  init(container: ContainerService) {

    container.addTab({root: CoursesPage, icon: "courses", label:"COURSES", index: 1});
  }

}
