import { Component } from "@angular/core";
import { NavController, PopoverController } from "ionic-angular";
import { User } from "./model/user.interface";
import { ActionMenuComponent } from "../../actionmenu/menu.action.component";
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersComponent {
  users: any;
  list: Array<String> = ['EDIT', 'DELETE'];

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController) {
    this.users = [
      { handle: 'Swayangjit', type: 'Student', avatar: 'avatar1' }, { handle: 'Swayangjit1', type: 'Student', avatar: 'avatar2' }
    ];

  }
  showMenu(event, user: User) {
    let popover = this.popoverCtrl.create(ActionMenuComponent, {
      list: this.list
    });
    popover.present({
      ev: event
    });
  }
}
