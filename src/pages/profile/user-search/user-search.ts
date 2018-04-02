import { Component, NgZone, ViewChild, Input } from "@angular/core";
import { AuthService, UserProfileService } from "sunbird";
import { NavController, NavParams } from "ionic-angular";

import { ProfilePage } from "./../profile";

@Component({
  selector: "user-search",
  templateUrl: "user-search.html"
})
export class UserSearchComponent {

  searchInput: string = "";
  userList: any;
  fallBackImage: string = "./assets/imgs/ic_profile_default.png";
  inactive: string = "Inactive";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private userService: UserProfileService,
    private zone: NgZone
  ) {
    console.log("Hello UserSearchComponent Component");
  }

  onInput() {
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let sessionObj = JSON.parse(session);
        let req = {
          query: this.searchInput,
          offset: 0,
          limit: 10,
          identifiers: [],
          fields: []
        };
        if (req.query == "") {
          this.userList = [];
        } else {
          this.userService.searchUser(req,
            res => {
              this.zone.run(() => {
                this.userList = JSON.parse(JSON.parse(res).searchUser).content;
              });
            },
            error => {
              console.error("Error", error);
            }
          );
        }
      }
    });
  }

  onCancel() {
    console.log("OnCancel Triggered");
  }
  openUserProfile(id) {
    this.navCtrl.push(ProfilePage, { userId: id });
  }
}
