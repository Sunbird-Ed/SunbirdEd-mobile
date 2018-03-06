import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { ContainerService } from 'sunbird';

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html'
})
export class CoursesPage {

  hello: string = "HELLO";

  constructor(public navCtrl: NavController) {

  }

}
