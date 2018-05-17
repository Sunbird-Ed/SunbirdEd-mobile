import { Component } from "@angular/core";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { UsersComponent } from "./users/users.component";
import { ClassesComponent } from "./classes/classes.component";
import { ToastController } from "ionic-angular";
import { AddUserComponent } from "./users/adduser.component";
@Component({
  selector: 'page-usernclass',
  templateUrl: 'usersnclasses.html'
})
export class UsersnClassesComponent {

  page1: any = UsersComponent;
  page2: any = ClassesComponent;

  titleOne = "{{'CLASSES' | translate}}";

  showIcons: boolean = true;
  showTitles: boolean = true;
  pageTitle: string = 'Full Height';

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {

  }

  ngAfterViewInit() {
  }

  onTabSelect(tab: { index: number; id: string; }) {
  }

  goBack() {
    this.navCtrl.pop();
  }

  importUser() {
    let toast = this.toastCtrl.create({
      message: 'Import user functionality is under progress',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  shareUser() {
    let toast = this.toastCtrl.create({
      message: 'Share user functionality is under progress',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  addUser() {
   this.navCtrl.push(AddUserComponent);
  }

}