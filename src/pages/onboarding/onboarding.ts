import { FormAndFrameworkUtilService } from './../profile/formandframeworkutil.service';
import {
  Component,
  ViewChild
} from '@angular/core';
import {
  NavController,
  LoadingController,
  Navbar,
  Platform,
  Events
} from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import {
  TabsPage,
  OAuthService,
  ContainerService,
  UserProfileService,
  ProfileService,
  ProfileType,
  AuthService,
  TenantInfoRequest,
  InteractType,
  InteractSubtype,
  Environment,
  PageId,
  ImpressionType,
  SharedPreferences,
  UserSource,
  Profile
} from 'sunbird';

import { UserTypeSelectionPage } from '@app/pages/user-type-selection';
import {
  initTabs,
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_TABS,
  LOGIN_TEACHER_TABS,
  Map,
  ProfileConstants,
  PreferenceKey
} from '@app/app';
import { LanguageSettingsPage } from '@app/pages/language-settings/language-settings';
import { AppGlobalService, TelemetryGeneratorService, CommonUtilService } from '@app/service';
import { CategoriesEditPage } from '../categories-edit/categories-edit';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  @ViewChild(Navbar) navBar: Navbar;

  slides: any[];
  appDir: string;
  appName = '';
  orgName: string;
  backButtonFunc: any = undefined;

  constructor(
    public navCtrl: NavController,
    private auth: OAuthService,
    private container: ContainerService,
    private userProfileService: UserProfileService,
    private profileService: ProfileService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private preferences: SharedPreferences,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private appVersion: AppVersion,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService
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
    ];
  }

  ionViewDidLoad() {
    this.appVersion.getAppName()
      .then((appName: any) => {
        this.appName = appName;
      });
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.ONBOARDING, Environment.HOME, true);
      this.navCtrl.setRoot(LanguageSettingsPage);
    };
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.ONBOARDING,
      Environment.HOME);
  }

  ionViewWillEnter() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.ONBOARDING, Environment.HOME, false);
      this.backButtonFunc();
      this.navCtrl.setRoot(LanguageSettingsPage);
    }, 10);

    this.appDir = this.commonUtilService.getAppDirection();
  }

  ionViewWillLeave() {
    this.backButtonFunc();
  }

  getLoader(): any {
    return this.loadingCtrl.create({
      spinner: 'crescent'
    });
  }

  signIn() {
    const that = this;
    const loader = this.getLoader();

    this.generateLoginInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.LOGIN_INITIATE, '');
    that.auth.doOAuthStepOne()
      .then(token => {
        loader.present();
        return that.auth.doOAuthStepTwo(token);
      })
      .then(() => {
        // initTabs(that.container, LOGIN_TEACHER_TABS);
        return that.refreshProfileData();
      })
      .then(slug => {
        this.events.publish(AppGlobalService.USER_INFO_UPDATED);
        return that.refreshTenantData(slug);
      })
      .then(() => {
        loader.dismiss();
        that.navCtrl.setRoot(TabsPage);
      })
      .catch(error => {
        loader.dismiss();
        if (error) {
          this.commonUtilService.showToast(this.commonUtilService.translateMessage('ERROR_WHILE_LOGIN'));
        }
        console.log(error);
      });
  }

  refreshTenantData(slug: string) {
    const that = this;
    return new Promise((resolve, reject) => {
      const request = new TenantInfoRequest();
      request.refreshTenantInfo = true;
      request.slug = slug;
      this.userProfileService.getTenantInfo(
        request,
        res => {
          const r = JSON.parse(res);
          (<any>window).splashscreen.setContent(that.orgName, r.logo);
          resolve();
        },
        error => {
          resolve(); // ignore
        });
    });
  }

  refreshProfileData() {
    const that = this;
    return new Promise<string>((resolve, reject) => {
      that.authService.getSessionData((session) => {
        if (session === undefined || session == null) {
          reject('session is null');
        } else {
          const sessionObj = JSON.parse(session);
          const req = {
            userId: sessionObj[ProfileConstants.USER_TOKEN],
            requiredFields: ProfileConstants.REQUIRED_FIELDS,
            refreshUserProfileDetails: true
          };
          that.userProfileService.getUserProfileDetails(req, res => {
            const r = JSON.parse(res);
            setTimeout(() => {
              this.commonUtilService.showToast(this.commonUtilService.translateMessage('WELCOME_BACK', r.firstName));
            }, 800);

            that.generateLoginInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGIN_SUCCESS, r.userId);

            const profile: Profile = new Profile();
            profile.uid = r.id;
            profile.handle = r.id;
            profile.profileType = ProfileType.TEACHER;
            profile.source = UserSource.SERVER;


            that.profileService.setCurrentProfile(false, profile)
              .then((response: any) => {
                this.formAndFrameworkUtilService.updateLoggedInUser(r, profile)
                  .then((value) => {
                    that.orgName = r.rootOrg.orgName;
                    if (value['status']) {
                      initTabs(that.container, LOGIN_TEACHER_TABS);
                      resolve(r.rootOrg.slug);
                    } else {
                      that.navCtrl.setRoot(CategoriesEditPage, { showOnlyMandatoryFields: true, profile: value['profile'] });
                      reject();
                    }
                    // that.orgName = r.rootOrg.orgName;
                    // resolve(r.rootOrg.slug);
                  }).catch(() => {
                    that.orgName = r.rootOrg.orgName;
                    resolve(r.rootOrg.slug);
                  });
              })
              .catch((err: any) => {
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
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.BROWSE_AS_GUEST_CLICKED,
      Environment.HOME,
      PageId.ONBOARDING);
    this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE)
      .then(val => {
        if (val === ProfileType.STUDENT) {
          initTabs(this.container, GUEST_STUDENT_TABS);
        } else if (val === ProfileType.TEACHER) {
          initTabs(this.container, GUEST_TEACHER_TABS);
        }
      });
    this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN')
      .then(val => {
        if (val !== '') {
          const profile: Profile = new Profile();
          profile.uid = val;
          profile.handle = 'Guest1';
          profile.profileType = ProfileType.TEACHER;
          profile.source = UserSource.LOCAL;

          this.profileService.setCurrentProfile(true, profile).then(res => {
            this.events.publish(AppGlobalService.USER_INFO_UPDATED);

            if (this.appGlobalService.isProfileSettingsCompleted) {
              this.navCtrl.setRoot(TabsPage, {
                loginMode: 'guest'
              });
            } else {
              this.navCtrl.push(UserTypeSelectionPage);
            }
          }).catch(err => {
            this.navCtrl.push(UserTypeSelectionPage);
          });
        } else {
          this.navCtrl.push(UserTypeSelectionPage);
        }
      });
  }

  generateLoginInteractTelemetry(interactType, interactSubtype, uid) {
    const valuesMap = new Map();
    valuesMap['UID'] = uid;
    this.telemetryGeneratorService.generateInteractTelemetry(
      interactType,
      interactSubtype,
      Environment.HOME,
      PageId.LOGIN,
      undefined,
      valuesMap);
  }

}
