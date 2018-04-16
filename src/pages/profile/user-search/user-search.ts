import { Component, NgZone, ViewChild, Input } from "@angular/core";
import { AuthService, UserProfileService } from "sunbird";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { Renderer } from '@angular/core';

import { ProfilePage } from "./../profile";

@Component({
  selector: "user-search",
  templateUrl: "user-search.html"
})

/* This component shows the list of user based on search*/
export class UserSearchComponent {
  @ViewChild('input') input;
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
    private zone: NgZone,
    private renderer: Renderer,
    private loadingCtrl: LoadingController,
  ) { }

  /**
   * Makes an search user API call
   * @param {object} scrollEvent - infinite Scroll Event
   */
  onInput(event, scrollEvent = undefined): void {
    let loader = this.getLoader();

    if(!this.enableInfiniteScroll) loader.present();
    if(event) this.renderer.invokeElementMethod(event.target, 'blur');
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
          loader.dismiss();
        } else {
          this.userService.searchUser(req,
            (res: any) => {
              this.zone.run(() => {
                Array.prototype.push.apply(this.userList, JSON.parse(JSON.parse(res).searchUser).content)
                this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < JSON.parse(JSON.parse(res).searchUser).count ? true : false;
                if (scrollEvent) scrollEvent.complete();
                loader.dismiss();
              });
            },
            (error: any) => {
              console.error("Error", error);
              if (scrollEvent) scrollEvent.complete();
              loader.dismiss();
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
      this.onInput(undefined, scrollEvent);
    } else {
      scrollEvent.complete();
    }
  }

  ionViewDidEnter() {
    setTimeout(()=>{
      this.input.setFocus();
    }, 100);
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }
}