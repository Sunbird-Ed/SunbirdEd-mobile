import { Component, NgZone, ViewChild } from "@angular/core";
import { AuthService, UserProfileService, Impression, ImpressionType, PageId, Environment, TelemetryService } from "sunbird";
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
  prevSearchInput: string = "";
  userList: any = [];
  fallBackImage: string = "./assets/imgs/ic_profile_default.png";

  enableInfiniteScroll: boolean = false;
  showEmptyMessage: boolean = false;

  /* Default Limits for the API */
  apiOffset: number = 0;
  apiLimit: number = 10;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private userService: UserProfileService,
    private telemetryService: TelemetryService,
    private zone: NgZone,
    private renderer: Renderer,
    private loadingCtrl: LoadingController,
  ) { }

  /**
   * Makes an search user API call
   * @param {object} scrollEvent - infinite Scroll Event
   */
  onInput(event = undefined, scrollEvent = undefined): void {
    let loader = this.getLoader();

    if (!this.enableInfiniteScroll || !scrollEvent) loader.present();
    if (event) this.renderer.invokeElementMethod(event.target, 'blur');
    this.authService.getSessionData(session => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let req = {
          query: this.searchInput,
          offset: this.apiOffset,
          limit: this.apiLimit,
          identifiers: [],
          fields: []
        };
        if (req.query == "") {
          this.userList = [];
          this.showEmptyMessage = false;
          loader.dismiss();
        } else {
          this.userService.searchUser(req,
            (res: any) => {
              this.zone.run(() => {
                let result = JSON.parse(JSON.parse(res).searchUser);

                if(this.searchInput !== this.prevSearchInput) this.userList = [];
                Array.prototype.push.apply(this.userList, result.content)
                this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < result.count ? true : false;

                if (scrollEvent) scrollEvent.complete();
                this.showEmptyMessage  = result.content.length ? false : true;
                this.prevSearchInput = this.searchInput;
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

  /**
   * fires on scroll end.
   * @param {object} event
   */
  onScrollEnd(event: any): void {
    console.log("end of scroll");
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
    this.generateImpressionEvent();
    setTimeout(() => {
      this.input.setFocus();
    }, 100);
  }

  generateImpressionEvent() {
    let impression = new Impression();
    impression.type = ImpressionType.SEARCH;
    impression.pageId = PageId.PROFILE;
    impression.env = Environment.USER;
    this.telemetryService.impression(impression);
  }


  getLoader(): any {
    return this.loadingCtrl.create({
      duration: 30000,
      spinner: "crescent"
    });
  }

  checkClear() {
    if (this.searchInput === '') this.onInput();
  }
}