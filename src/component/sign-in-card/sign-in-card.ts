import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, LoadingController } from 'ionic-angular';

import { TabsPage, OAuthService, ContainerService, UserProfileService, AuthService, TenantInfoRequest } from 'sunbird';
import { initGuestTabs, initUserTabs } from '../../app/module.service';

@Component({
  selector: 'sign-in-card',
  template: `<ion-card>
                  <ion-card-header>
                    {{'GET_UNLIMITED_ACCESS' | translate}}
                  </ion-card-header>
                  <ion-card-content>
                    {{'SIGNIN_TO_UNBLOCK_ALL_THE_BENFITS' | translate}}
                    <br />
                    <br />
                    <button ion-button full (click)="singIn()">{{ 'SIGN_IN' | translate }}</button>
                  </ion-card-content>
                </ion-card>`
})
export class SignInCardComponent {

  text: string;

  constructor(public translate: TranslateService,
    public navCtrl: NavController,
    private auth: OAuthService,
    private container: ContainerService,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private loadingCtrl: LoadingController) {
    console.log('Hello SignInCardComponent Component');
    this.text = 'Hello World';
  }

  singIn() {
    let that = this;
    let loader = this.getLoader();
    loader.present();

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
        that.navCtrl.setRoot(TabsPage);
      })
      .catch(error => {
        loader.dismiss();
        console.log(error);
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

  getLoader(): any {
    return this.loadingCtrl.create({
      spinner: "crescent"
    });
  }
}
