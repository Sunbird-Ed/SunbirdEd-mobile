import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { TabsPage, OAuthService, ContainerService, UserProfileService, ProfileService, ProfileType, AuthService, TenantInfoRequest,  InteractType, InteractSubtype, Environment, TelemetryService, PageId, ImpressionType, SharedPreferences } from 'sunbird';
import { UserTypeSelectionPage } from '../user-type-selection/user-type-selection';

import { initGuestTabs, initUserTabs, STUDENT_TABS, TEACHER_TABS } from '../../app/module.service';
import { generateInteractEvent, Map, generateImpressionEvent } from '../../app/telemetryutil';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  slides: any[];
  sunbird: string = "SUNBIRD";
  orgName: string;

  constructor(public navCtrl: NavController,
    private auth: OAuthService,
    private container: ContainerService,
    private userProfileService: UserProfileService,
    private profileService: ProfileService,
    private authService: AuthService,
    private telemetryService: TelemetryService,
    private loadingCtrl: LoadingController,
    private preferences: SharedPreferences
  ) {

    this.slides = [
      {
        'title': 'ONBOARD_SLIDE_TITLE_2',
        'imageUri': 'assets/imgs/ic_onboard_2.png',
        'desc': 'ONBOARD_SLIDE_DESC_2'
      },
      {
        'title': 'ONBOARD_SLIDE_TITLE_1',
        'imageUri': 'assets/imgs/ic_onboard_1.png',
        'desc': 'ONBOARD_SLIDE_DESC_1'
      }
      /*{
        'title': 'ONBOARD_SLIDE_TITLE_3',
        'imageUri': 'assets/imgs/ic_onboard_3.png',
        'desc': 'ONBOARD_SLIDE_DESC_3'
      }*/
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

    this.generateLoginInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.LOGIN_INITIATE, "");
    that.auth.doOAuthStepOne()
      .then(token => {
        return that.auth.doOAuthStepTwo(token);
      })
      .then(() => {

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
    let that = this;
    return new Promise((resolve, reject) => {
      let request = new TenantInfoRequest();
      request.refreshTenantInfo = true;
      request.slug = slug;
      this.userProfileService.getTenantInfo(
        request,
        res => {
          let r = JSON.parse(res);
          (<any>window).splashscreen.setContent(that.orgName, r.logo);
          resolve();
        },
        error => {
          resolve();//ignore
        })
    });
  }

  refreshProfileData() {
    let that = this;
    return new Promise<string>((resolve, reject) => {
      that.authService.getSessionData((session) => {
        if (session === undefined || session == null) {
          reject("session is null");
        } else {
          let sessionObj = JSON.parse(session);
          let req = {
            userId: sessionObj["userToken"],
            requiredFields: ["completeness", "missingFields", "lastLoginTime", "topics"],
            refreshUserProfileDetails: true
          };
          that.userProfileService.getUserProfileDetails(req, res => {
            let r = JSON.parse(res);
            that.generateLoginInteractTelemetry(InteractType.OTHER,
              InteractSubtype.LOGIN_SUCCESS, r.response.userId);
            let profileRequest = {
              uid: r.response.userId, //req
              handle: r.response.userId, //TODO check with nikhil
              avatar: "avatar", //req
              language: "en", //req
              age: -1,
              day: -1,
              month: -1,
              standard: -1,
              profileType: ProfileType.TEACHER
            };
            that.profileService.setCurrentProfile(false, profileRequest,
              (res: any) => {
                that.orgName = r.response.rootOrg.orgName;
                resolve(r.response.rootOrg.slug);
              },
              (err: any) => {
                reject(err);
              });
          }, error => {
            reject(error);
            console.error(error);
          });
        }
      });
    });
  }

  browseAsGuest() {
    this.telemetryService.interact(
      generateInteractEvent(InteractType.TOUCH,
        InteractSubtype.BROWSE_AS_GUEST_CLICKED,
        Environment.HOME,
        PageId.ONBOARDING,
        null));
      this.preferences.getString('selected_user_type', (val) => {
        if (val == "student") {
          initGuestTabs(this.container, STUDENT_TABS);
        } else if (val == "teacher") {
          initGuestTabs(this.container, TEACHER_TABS);
        }
      });
    this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN', (val) => {
      if (val != "") {
        let profileRequest = {
          uid: val,
          handle: "Guest1", //req
          avatar: "avatar", //req
          language: "en", //req
          age: -1,
          day: -1,
          month: -1,
          standard: -1,
          profileType: ProfileType.TEACHER
        };
        this.profileService.setCurrentProfile(true, profileRequest, res => {
          this.navCtrl.push(TabsPage, {
            loginMode: 'guest'
          });
        }, err => {
          this.navCtrl.push(UserTypeSelectionPage);
        });
      } else {
        this.navCtrl.push(UserTypeSelectionPage);
      }
    });
  }



  generateLoginInteractTelemetry(interactType, interactSubtype, uid) {
    let valuesMap = new Map();
    valuesMap["UID"] = uid;
    this.telemetryService.interact(
      generateInteractEvent(interactType,
        interactSubtype,
        Environment.HOME,
        PageId.LOGIN,
        valuesMap));
  }

  /*   goBack() {
      this.navCtrl.pop();
    } */

}