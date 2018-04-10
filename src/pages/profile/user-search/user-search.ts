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
  userList: any = [];
  fallBackImage: string = "./assets/imgs/ic_profile_default.png";
  inactive: string = "Inactive";

  enableInfiniteScroll: boolean = false;
  apiOffset: number = 0;
  apiLimit: number = 10;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private userService: UserProfileService,
    private zone: NgZone
  ) {
    console.log("Hello UserSearchComponent Component");
  }

  onInput(scrollEvent = undefined) {
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let sessionObj = JSON.parse(session);
        let req = {
          query: this.searchInput,
          offset: this.apiOffset,
          limit: this.apiLimit,
          identifiers: [],
          fields: []
        };
        if (req.query == "") {
          this.userList = [];
        } else {
          this.userService.searchUser(req,
            res => {
              this.zone.run(() => {
                Array.prototype.push.apply(this.userList,JSON.parse(JSON.parse(res).searchUser).content)
                this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < JSON.parse(JSON.parse(res).searchUser).count ? true : false;
                if(scrollEvent) scrollEvent.complete();
              });
            },
            error => {
              console.error("Error", error);
              if(scrollEvent) scrollEvent.complete();
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

  doInfiniteScroll(scrollEvent) {
    if(this.enableInfiniteScroll) {
      this.apiOffset += this.apiLimit;
      this.onInput(scrollEvent);
    } else {
      scrollEvent.complete();
    }
  }
}
