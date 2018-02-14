import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { User } from "./model/user.interface";
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersComponent {
  users: any;
  constructor(public navCtrl: NavController) {

    this.users = [
      { handle: 'Swayangjit', type: 'Student', avatar: 'avatar1' }, { handle: 'Swayangjit1', type: 'Student', avatar: 'avatar2' }
    ];

  }
  showMenu(user: User) {
    console.log(""+user.handle);
  }
}
