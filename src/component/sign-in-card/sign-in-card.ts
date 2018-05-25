import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AppVersion } from "@ionic-native/app-version";
import {
  OAuthService, ContainerService, UserProfileService, AuthService, TenantInfoRequest,
  TelemetryService, InteractType, InteractSubtype, Environment, PageId
} from 'sunbird';
import { initTabs, LOGIN_TEACHER_TABS } from '../../app/module.service';
import { generateInteractEvent } from '../../app/telemetryutil';
import { ProfileConstants } from '../../app/app.constant';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'sign-in-card',
  templateUrl: 'sign-in-card.html'
})
export class SignInCardComponent {

  private readonly DEFAULT_TEXT = [
    'OVERLAY_LABEL_COMMON',
    'OVERLAY_INFO_TEXT_COMMON'
  ]

  private translateDisplayText;

  sunbird: string = "SUNBIRD";
  isNetworkAvailable: boolean;


  @Input() source: string = "";

  @Input() title: string = "";

  @Input() descrption: string = "";

  @Output() valueChange = new EventEmitter();

  constructor(public translate: TranslateService,
    public network: Network,
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
        this.sunbird = appName;
        this.initText();
      });
    if (this.network.type === 'none') {
      this.isNetworkAvailable = false;
    } else {
      this.isNetworkAvailable = true;
    }
    this.network.onDisconnect().subscribe((data) => {
      this.isNetworkAvailable = false;
    });
    this.network.onConnect().subscribe((data) => {
      this.isNetworkAvailable = true;
    });
  }

  initText() {
    this.translate.get(this.DEFAULT_TEXT, { '%s': this.sunbird }).subscribe((value) => {
      this.translateDisplayText = value;
      if (this.title.length === 0) {
        this.title = this.translateDisplayText['OVERLAY_LABEL_COMMON'];
      }

      if (this.descrption.length === 0) {
        this.descrption = this.translateDisplayText['OVERLAY_INFO_TEXT_COMMON'];
      }
    });
  }




  singIn() {

    if (!this.isNetworkAvailable) {
      this.valueChange.emit(true);
    }
    else {
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
          initTabs(that.container, LOGIN_TEACHER_TABS);
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
            requiredFields: ProfileConstants.REQUIRED_FIELDS,
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
