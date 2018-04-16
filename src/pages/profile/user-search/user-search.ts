import { Component, NgZone, ViewChild, Input } from "@angular/core";
import { AuthService, UserProfileService } from "sunbird";
import { NavController, NavParams } from "ionic-angular";

import { ProfilePage } from "./../profile";

@Component({
  selector: "user-search",
  templateUrl: "user-search.html"
})

/* This component shows the list of user based on search*/
export class UserSearchComponent {

  searchInput: string = "";
  userList: any = [];
  fallBackImage: string = "./assets/imgs/ic_profile_default.png";
  inactive: string = "Inactive";

  enableInfiniteScroll: boolean = false;

  /* Default Limits for the API */
  apiOffset: number = 0;
  apiLimit: number = 10;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private userService: UserProfileService,
    private zone: NgZone
  ) { }

  /**
   * Makes an search user API call
   * @param {object} scrollEvent - infinite Scroll Event
   */
  onInput(scrollEvent = undefined): void {
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
            (res: any) => {
              this.zone.run(() => {
                Array.prototype.push.apply(this.userList, JSON.parse(JSON.parse(res).searchUser).content)
                this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < JSON.parse(JSON.parse(res).searchUser).count ? true : false;
                if (scrollEvent) scrollEvent.complete();
              });
            },
            (error: any) => {
              console.error("Error", error);
              if (scrollEvent) scrollEvent.complete();
            }
          );
        }
      }
    });
  }

  onCancel(): void {
    console.log("OnCancel Triggered");
  }

  /**
   * Navigates to the User Profile
   * @param {string} id User ID
   */
  openUserProfile(id): void {
    this.navCtrl.push(ProfilePage, { userId: id });
  }

  /**
   * Makes an infinite scroll call.
   * @param {object} scrollEvent - Infinite scroll event
   */
  doInfiniteScroll(scrollEvent): void {
    if (this.enableInfiniteScroll) {
      this.apiOffset += this.apiLimit;
      this.onInput(scrollEvent);
    } else {
      scrollEvent.complete();
    }
  }
}