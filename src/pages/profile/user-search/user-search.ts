import { Component, NgZone, ViewChild } from "@angular/core";
import { AuthService, UserProfileService, Impression, ImpressionType, PageId, Environment, Visit, TelemetryService } from "sunbird";
import { NavController, NavParams, LoadingController, ToastController } from "ionic-angular";
import { Renderer } from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from "@ngx-translate/core";

import { ProfilePage } from "./../profile";
import { generateImpressionTelemetry } from "../../../app/telemetryutil";

/* Interface for the Toast Object */
export interface toastOptions {
  message: string,
  duration: number,
  position: string
};

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

  visibleItems: Array<Visit> = [];
  visits: Array<any> = [];
  isContentLoaded: boolean = false;

  options: toastOptions = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private userService: UserProfileService,
    private telemetryService: TelemetryService,
    private zone: NgZone,
    private renderer: Renderer,
    private loadingCtrl: LoadingController,
    public translate: TranslateService,
    public toastCtrl: ToastController
  ) { }

  ionViewWillEnter() {
    //this.userList = [];
    //this.visibleItems = [];
  }
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

                if (this.searchInput !== this.prevSearchInput) this.userList = [];
                Array.prototype.push.apply(this.userList, result.content);
                this.enableInfiniteScroll = (this.apiOffset + this.apiLimit) < result.count ? true : false;

                if (scrollEvent) scrollEvent.complete();
                this.showEmptyMessage = result.content.length ? false : true;
                this.prevSearchInput = this.searchInput;
                loader.dismiss();
              });
            },
            (error: any) => {
              console.error("Error", error);
              if (scrollEvent) scrollEvent.complete();
              this.getToast(this.translateMessage('SOMETHING_WENT_WRONG')).present();
              loader.dismiss();
            }
          );
        }
      }
    });
  }

  contentLoad() {
    if (this.userList.length <= this.apiLimit) {
      this.getVisibleElementRange();
    }
  }
  /**
   * fires on scroll end.
   * @param {object} event
   */
  onScrollEnd(event: any): void {
    console.log("end of scroll");
    this.getVisibleElementRange();
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

  ionViewDidLoad() {
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.SEARCH, "",
      PageId.PROFILE,
      Environment.USER, "", "", "",
      undefined, undefined
    ));
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 100);
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

  getVisibleElementRange() {
    this.userList.forEach((element, index) => {
      console.log(`Index ${index}: `, this.isElementInViewport(document.getElementById(<string>index)));
      if (document.getElementById(<string>index)) {
        this.generateVisitObject(element, index);
      }
    });
    console.log("VisibleItemArray=", this.visibleItems);
  }

  isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  generateVisitObject(element, index) {
    let visitItem = new Visit();
    visitItem.objid = element.id;
    visitItem.index = index;
    visitItem.objtype = "user";
    this.visibleItems.push(visitItem);
  }

  ionViewWillLeave() {
    this.visibleItems = _.uniq(this.visibleItems);
    console.log("Visible Items", this.visibleItems);

  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  /**
   * It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }
}