import {FormAndFrameworkUtilService} from './../profile/formandframeworkutil.service';
import {Component, Inject, ViewChild} from '@angular/core';
import {Events, LoadingController, Navbar, NavController, Platform} from 'ionic-angular';
import {AppVersion} from '@ionic-native/app-version';


import {UserTypeSelectionPage} from '@app/pages/user-type-selection';
import {
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_TABS,
  initTabs,
  LOGIN_TEACHER_TABS,
  Map,
  PreferenceKey,
  ProfileConstants
} from '@app/app';
import {LanguageSettingsPage} from '@app/pages/language-settings/language-settings';
import {AppGlobalService, CommonUtilService, TelemetryGeneratorService, AppHeaderService} from '@app/service';
import {
  ApiService,
  AuthService,
  OAuthSession,
  OAuthSessionProvider,
  Profile,
  ProfileService,
  ProfileSource,
  ProfileType,
  SdkConfig,
  ServerProfileDetailsRequest,
  SharedPreferences
} from 'sunbird-sdk';
import {CategoriesEditPage} from '@app/pages/categories-edit/categories-edit';
import {
  Environment,
  ImpressionType,
  InteractSubtype,
  InteractType,
  PageId
} from '../../service/telemetry-constants';
import { ContainerService } from '@app/service/container.services';
import { TabsPage } from '../tabs/tabs';

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
  headerObservable: any;
  backButtonFunc: any = undefined;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    @Inject('API_SERVICE') private apiService: ApiService,
    @Inject('SDK_CONFIG') private sdkConfig: SdkConfig,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    public navCtrl: NavController,
    private container: ContainerService,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private appVersion: AppVersion,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private headerService: AppHeaderService
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
    /*this.navBar.backButtonClick = (e: UIEvent) => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.ONBOARDING, Environment.HOME, true);
      this.navCtrl.setRoot(LanguageSettingsPage);
    };*/
    
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.ONBOARDING,
      Environment.HOME);
  }

  ionViewWillEnter() {
    this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.ONBOARDING, Environment.HOME, false);
      this.backButtonFunc();
      this.navCtrl.setRoot(LanguageSettingsPage);
    }, 10);

    this.appDir = this.commonUtilService.getAppDirection();
  }

  ionViewWillLeave() {
    this.headerObservable.unsubscribe();
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
    this.authService.setSession(new OAuthSessionProvider(this.sdkConfig.apiConfig, this.apiService))
      .toPromise()
      .then(() => {
        // initTabs(that.container, LOGIN_TEACHER_TABS);
        return that.refreshProfileData();
      })
      .then(() => {
        this.events.publish(AppGlobalService.USER_INFO_UPDATED);
        return that.refreshTenantData();
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

  refreshTenantData() {
    const that = this;
    return new Promise((resolve, reject) => {
      this.profileService.getTenantInfo().toPromise()
      .then((res) => {
          this.preferences.putString(PreferenceKey.APP_LOGO, res.logo).toPromise().then();
          this.preferences.putString(PreferenceKey.APP_NAME, that.orgName).toPromise().then();
          (<any>window).splashscreen.setContent(that.orgName, res.logo);
          resolve();
        }).catch(() => {
        resolve(); // ignore
      });
    });
  }

  refreshProfileData() {
    const that = this;
    return new Promise<string>((resolve, reject) => {
      that.authService.getSession().toPromise().then((session: OAuthSession) => {
        if (session === undefined || session == null) {
          reject('session is null');
        } else {
          const req: ServerProfileDetailsRequest = {
            userId: session.userToken,
            requiredFields: ProfileConstants.REQUIRED_FIELDS,
          };
          that.profileService.getServerProfilesDetails(req).toPromise()
            .then((success) => {
              setTimeout(() => {
                this.commonUtilService.showToast(this.commonUtilService.translateMessage('WELCOME_BACK', success.firstName));
              }, 800);
              that.generateLoginInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGIN_SUCCESS, success.id);

              const profile: Profile = {
                uid: success.id,
                handle: success.id,
                profileType: ProfileType.TEACHER,
                source: ProfileSource.SERVER,
                serverProfile: success
              };

              this.profileService.createProfile(profile, ProfileSource.SERVER)
                .toPromise()
                .then(() => {
                  that.profileService.setActiveSessionForProfile(profile.uid).toPromise()
                    .then(() => {
                      this.formAndFrameworkUtilService.updateLoggedInUser(success, profile)
                        .then((value) => {
                          that.orgName = success.rootOrg.orgName;
                          if (value['status']) {
                            initTabs(that.container, LOGIN_TEACHER_TABS);
                            resolve(success.rootOrg.slug);
                          } else {
                            that.navCtrl.setRoot(CategoriesEditPage, {
                              showOnlyMandatoryFields: true,
                              profile: value['profile']
                            });
                            reject();
                          }
                          // that.orgName = r.rootOrg.orgName;
                          // resolve(r.rootOrg.slug);
                        }).catch(() => {
                        that.orgName = success.rootOrg.orgName;
                        resolve(success.rootOrg.slug);
                      });
                    }).catch((e) => {
                    reject(e);
                  });
                });
            }).catch((e) => {
            reject(e);
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
    this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE).toPromise()
      .then(val => {
        if (val === ProfileType.STUDENT) {
          initTabs(this.container, GUEST_STUDENT_TABS);
        } else if (val === ProfileType.TEACHER) {
          initTabs(this.container, GUEST_TEACHER_TABS);
        }
      });
    this.preferences.getString(PreferenceKey.GUEST_USER_ID_BEFORE_LOGIN).toPromise()
      .then(val => {
        if (val !== '') {
          const profile: Profile = {
            uid: val,
            handle: 'Guest1',
            profileType: ProfileType.TEACHER,
            source: ProfileSource.LOCAL
          };
          this.profileService.setActiveSessionForProfile(profile.uid).toPromise()
            .then(() => {
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
  handleHeaderEvents($event) {
    switch ($event.name) {
      case 'back': this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.ONBOARDING, Environment.HOME, true);
                    this.navCtrl.setRoot(LanguageSettingsPage);
                    break;
    }
  }

}
