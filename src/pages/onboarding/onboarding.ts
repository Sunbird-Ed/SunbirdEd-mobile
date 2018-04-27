import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { TabsPage, OAuthService, ContainerService, UserProfileService, AuthService, TenantInfoRequest, Interact, InteractType, InteractSubtype, Environment, TelemetryService, PageId, ImpressionType } from 'sunbird';
import { UserTypeSelectionPage } from '../user-type-selection/user-type-selection';

import { initGuestTabs, initUserTabs } from '../../app/module.service';
import { generateInteractEvent, Map, generateImpressionEvent } from '../../app/telemetryutil';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  slides: any[];
  sunbird: string = "SUNBIRD";

  constructor(public navCtrl: NavController,
    private auth: OAuthService,
    private container: ContainerService,
    private zone: NgZone,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private telemetryService: TelemetryService,
    private loadingCtrl: LoadingController
  ) {

    this.slides = [
      {
        'title': 'ONBOARD_SLIDE_TITLE_1',
        'imageUri': 'assets/imgs/ic_onboard_1.png',
        'desc': 'ONBOARD_SLIDE_DESC_1'
      },
      {
        'title': 'ONBOARD_SLIDE_TITLE_2',
        'imageUri': 'assets/imgs/ic_onboard_2.png',
        'desc': 'ONBOARD_SLIDE_DESC_2'
      },
      {
        'title': 'ONBOARD_SLIDE_TITLE_3',
        'imageUri': 'assets/imgs/ic_onboard_3.png',
        'desc': 'ONBOARD_SLIDE_DESC_3'
      },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  ionViewDidEnter() {
    this.telemetryService.impression(
      generateImpressionEvent(ImpressionType.VIEW,
        PageId.ONBOARDING,
        Environment.HOME, "", "", "")
    );
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      spinner: "crescent"
    });
  }

  singIn() {
    let that = this;
    let loader = this.getLoader();
    loader.present();

    let valuesMap = new Map();
    valuesMap["UID"] = "";
    this.telemetryService.interact(
      generateInteractEvent(InteractType.TOUCH,
        InteractSubtype.LOGIN_INITIATE,
        Environment.HOME,
        PageId.LOGIN,
        valuesMap));
    that.auth.doOAuthStepOne()
      .then(token => {
        return that.auth.doOAuthStepTwo(token);
      })
      .then(() => {
        this.telemetryService.interact(
          generateInteractEvent(InteractType.OTHER,
            InteractSubtype.LOGIN_SUCCESS,
            Environment.HOME,
            PageId.LOGIN,
            valuesMap));
        initUserTabs(that.container);
        return that.refreshProfileData();
      })
      .then(slug => {
        return that.refreshTenantData(slug);
      })
      .then(() => {
        loader.dismiss();
        that.navCtrl.push(TabsPage);
      })
      .catch(error => {
        loader.dismiss();
        console.log(error);
      });

  }

  refreshTenantData(slug: string) {
    return new Promise((resolve, reject) => {
      let request = new TenantInfoRequest();
      request.refreshTenantInfo = true;
      request.slug = slug;
      this.userProfileService.getTenantInfo(
        request,
        res => {
          let r = JSON.parse(res);
          (<any>window).splashscreen.setContent(r.titleName, r.logo);
          resolve();
        },
        error => {
          resolve();//ignore
        })
    });
  }

  refreshProfileData() {
    return new Promise<string>((resolve, reject) => {
      this.authService.getSessionData((session) => {
        if (session === undefined || session == null) {
          reject("session is null");
        } else {
          let sessionObj = JSON.parse(session);
          let req = {
            userId: sessionObj["userToken"],
            requiredFields: ["completeness", "missingFields", "lastLoginTime", "topics"],
            refreshUserProfileDetails: true
          };
          this.userProfileService.getUserProfileDetails(req, res => {
            let r = JSON.parse(res);
            resolve(r.response.rootOrg.slug);
          }, error => {
            reject(error);
            console.error(error);
          });
        }
      });
    });
  }

  browseAsGuest() {
    this.generateInteractEvent();
    initGuestTabs(this.container);
    this.navCtrl.push(UserTypeSelectionPage);
  }

  generateInteractEvent() {
    let interact = new Interact();
    interact.type = InteractType.TOUCH;
    interact.subType = InteractSubtype.BROWSE_AS_GUEST_CLICKED;
    interact.pageId = "";
    interact.env = Environment.HOME;
    this.telemetryService.interact(interact);
  }

  /*   goBack() {
      this.navCtrl.pop();
    } */

}