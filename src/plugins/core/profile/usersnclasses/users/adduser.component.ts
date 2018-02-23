import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

@Component({
    selector: 'page-add-user',
    templateUrl: 'adduser.html'
  })
export class AddUserComponent{
  constructor(public navCtrl: NavController) {
  }
  goBack() {
    this.navCtrl.pop();
  }
}