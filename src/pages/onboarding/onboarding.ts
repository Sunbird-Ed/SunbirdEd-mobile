import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage, OAuthService, ContainerService, UserProfileService, AuthService, TenantInfoRequest } from 'sunbird';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { RolePage } from '../userrole/role';
import { Storage } from "@ionic/storage";
import { initGuestTabs, initUserTabs } from '../../app/module.service';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  slides: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private auth: OAuthService,
    private container: ContainerService,
    private storage: Storage,
    private zone: NgZone,
    private userProfileService: UserProfileService,
    private authService: AuthService) {

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

  singin() {
    let that = this;

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
        that.navCtrl.push(TabsPage);
      })
      .catch(error => {
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
    initGuestTabs(this.container);
    this.navCtrl.push(RolePage);
  }

  goBack() {
    this.navCtrl.pop();
  }

}