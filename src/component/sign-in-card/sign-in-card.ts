import { Component, NgZone, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AppVersion } from "@ionic-native/app-version";
import { OAuthService, ContainerService, UserProfileService, AuthService, TenantInfoRequest, TelemetryService, InteractType, InteractSubtype, Environment, PageId } from 'sunbird';
import { initUserTabs } from '../../app/module.service';
import { generateInteractEvent } from '../../app/telemetryutil';

@Component({
  selector: 'sign-in-card',
  template: `<ion-card>
                  <ion-card-header>
                    <b>{{ 'OVERLAY_LABEL_COMMON' | translate:{'%s': sunbird} }}</b>
                  </ion-card-header>
                  <ion-card-content class="sign-in-card-text">
                    {{ 'OVERLAY_INFO_TEXT_COMMON' | translate:{'%s': sunbird} }}
                    <br />
                    <br />
                    <button ion-button block (click)="singIn()" class="sign-in-btn">{{ 'SIGN_IN' | translate }}</button>
                  </ion-card-content>
            </ion-card>`,
  styles:   [ `.sign-in-btn {
                border-radius: 4px !important;
              }
              .sign-in-card-text {
                font-weight: 600 !important;
                color: map-get($colors, primary_black) !important;
              }`
            ]
})
export class SignInCardComponent {

  sunbird: string = "SUNBIRD";
  @Input() source: string = "";
  constructor(public translate: TranslateService,
    public navCtrl: NavController,
    private auth: OAuthService,
    private container: ContainerService,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
    private telemetryService: TelemetryService,
    private appVersion: AppVersion) {

      this.appVersion.getAppName()
        .then((appName: any) => {
          this.sunbird = appName
        });
  }

  singIn() {

    this.telemetryService.interact(
      generateInteractEvent(InteractType.TOUCH,
        InteractSubtype.SIGNIN_OVERLAY_CLICKED,
        Environment.HOME,
        this.source, null)
    );

    this.generateLoginInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.LOGIN_INITIATE, "");

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
        that.ngZone.run(() => {

          window.location.reload();
          // TabsPage.prototype.ionVieit wWillEnter();
        });
      })
      .catch(error => {
        loader.dismiss();
        console.log(error);
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
}
