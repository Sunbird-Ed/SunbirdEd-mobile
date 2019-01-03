import { CommonUtilService } from './../../service/common-util.service';
import {
  Component,
  NgZone,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import {
  OAuthService,
  ContainerService,
  UserProfileService,
  ProfileService,
  AuthService,
  TenantInfoRequest,
  TelemetryService,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  SharedPreferences,
  ProfileType,
  UserSource,
  Profile
} from 'sunbird';
import {
  initTabs, LOGIN_TEACHER_TABS
} from '../../app/module.service';
import { generateInteractTelemetry } from '../../app/telemetryutil';
import { ProfileConstants } from '../../app/app.constant';
import { FormAndFrameworkUtilService } from '../../pages/profile/formandframeworkutil.service';

@Component({
  selector: 'sign-in-card',
  templateUrl: 'sign-in-card.html'
})

export class SignInCardComponent {

  private readonly DEFAULT_TEXT = [
    'OVERLAY_LABEL_COMMON',
    'OVERLAY_INFO_TEXT_COMMON'
  ];

  private translateDisplayText;

  appName = '';
  @Input() source = '';
  @Input() title = '';
  @Input() description = '';
  @Output() valueChange = new EventEmitter();

  constructor(
    public translate: TranslateService,
    public navCtrl: NavController,
    private auth: OAuthService,
    private container: ContainerService,
    private userProfileService: UserProfileService,
    private profileService: ProfileService,
    private authService: AuthService,
    private ngZone: NgZone,
    private telemetryService: TelemetryService,
    private appVersion: AppVersion,
    private sharedPreferences: SharedPreferences,
    private commonUtilService: CommonUtilService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService
  ) {

    this.appVersion.getAppName()
      .then((appName: any) => {
        this.appName = appName;
        this.initText();
      });
  }

  initText() {
    this.translate.get(this.DEFAULT_TEXT, { '%s': this.appName }).subscribe((value) => {
      this.translateDisplayText = value;
      if (this.title.length === 0) {
        this.title = 'OVERLAY_LABEL_COMMON';
      }

      if (this.description.length === 0) {
        this.description = 'OVERLAY_INFO_TEXT_COMMON';
      }
    });
  }

  singIn() {

    if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.valueChange.emit(true);
    } else {
      this.telemetryService.interact(
        generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.SIGNIN_OVERLAY_CLICKED,
          Environment.HOME,
          this.source, null,
          undefined,
          undefined)
      );

      this.generateLoginInteractTelemetry(InteractType.TOUCH, InteractSubtype.LOGIN_INITIATE, '');

      const that = this;
      const loader = this.commonUtilService.getLoader();
      that.auth.doOAuthStepOne(this.commonUtilService.isRTL())
        .then(token => {
          loader.present();
          return that.auth.doOAuthStepTwo(token);
        })
        .then(() => {
          initTabs(that.container, LOGIN_TEACHER_TABS);
          return that.refreshProfileData();
        })
        .then(value => {
          return that.refreshTenantData(value.slug, value.title);
        })
        .then(() => {
          loader.dismiss();
          that.ngZone.run(() => {
            that.sharedPreferences.putString('SHOW_WELCOME_TOAST', 'true');
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
    const that = this;

    return new Promise<any>((resolve, reject) => {
      that.authService.getSessionData((session) => {
        if (Boolean(session)) {
          const sessionObj = JSON.parse(session);
          const req = {
            userId: sessionObj[ProfileConstants.USER_TOKEN],
            requiredFields: ProfileConstants.REQUIRED_FIELDS,
            refreshUserProfileDetails: true
          };
          that.userProfileService.getUserProfileDetails(req, res => {
            const r = JSON.parse(res);
            that.generateLoginInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGIN_SUCCESS, r.id);

            const profile: Profile = new Profile();
            profile.uid = r.id;
            profile.handle = r.id;
            profile.profileType = ProfileType.TEACHER;
            profile.source = UserSource.SERVER;


            that.profileService.setCurrentProfile(false, profile)
              .then((currentProfile: any) => {
                that.formAndFrameworkUtilService.updateLoggedInUser(r, profile)
                  .then((value) => {
                    resolve({
                      slug: r.rootOrg.slug,
                      title: r.rootOrg.orgName
                    });
                  }).catch(() => {
                    resolve({
                      slug: r.rootOrg.slug,
                      title: r.rootOrg.orgName
                    });
                  });
              })
              .catch((err: any) => {
                reject(err);
              });

          }, error => {
            reject(error);
            console.error(error);
          });
        } else {
          reject('session is null');
        }
      });
    });
  }

  refreshTenantData(slug: string, title: string) {
    return new Promise((resolve, reject) => {
      const request = new TenantInfoRequest();
      request.refreshTenantInfo = true;
      request.slug = slug;
      this.userProfileService.getTenantInfo(
        request,
        res => {
          const r = JSON.parse(res);
          (<any>window).splashscreen.setContent(title, r.logo);
          resolve();
        },
        error => {
          resolve(); // ignore
        });
    });
  }

  generateLoginInteractTelemetry(interactType, interactSubtype, uid) {
    const valuesMap = new Map();
    valuesMap['UID'] = uid;
    this.telemetryService.interact(
      generateInteractTelemetry(interactType,
        interactSubtype,
        Environment.HOME,
        PageId.LOGIN,
        valuesMap,
        undefined,
        undefined));
  }
}
