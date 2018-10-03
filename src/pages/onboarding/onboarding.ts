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
  TelemetryService,
  PageId,
  ImpressionType,
  SharedPreferences,
  UserSource,
  Profile
} from 'sunbird';
import { UserTypeSelectionPage } from '../user-type-selection/user-type-selection';
import {
  initTabs,
  GUEST_STUDENT_TABS,
  GUEST_TEACHER_TABS,
  LOGIN_TEACHER_TABS
} from '../../app/module.service';
import {
  generateInteractTelemetry,
  Map,
  generateImpressionTelemetry
} from '../../app/telemetryutil';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import {
  ProfileConstants,
  PreferenceKey
} from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { AppVersion } from '@ionic-native/app-version';
import { CommonUtilService } from '../../service/common-util.service';

@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  @ViewChild(Navbar) navBar: Navbar;

  slides: any[];
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
    private telemetryService: TelemetryService,
    private loadingCtrl: LoadingController,
    private preferences: SharedPreferences,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private appVersion: AppVersion,
    private events: Events,
    private appGlobalService: AppGlobalService
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
      this.navCtrl.setRoot(LanguageSettingsPage);
    };
    this.telemetryService.impression(
      generateImpressionTelemetry(ImpressionType.VIEW, '',
        PageId.ONBOARDING,
        Environment.HOME, '', '', '',
        undefined,
        undefined)
    );
  }

  ionViewWillEnter() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.navCtrl.setRoot(LanguageSettingsPage);
    }, 10);
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
    loader.present();

    this.generateLoginInteractTelemetry(InteractType.TOUCH,
      InteractSubtype.LOGIN_INITIATE, '');
    that.auth.doOAuthStepOne()
      .then(token => {
        return that.auth.doOAuthStepTwo(token);
      })
      .then(() => {
        initTabs(that.container, LOGIN_TEACHER_TABS);
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

            that.profileService.setCurrentProfile(false, profile,
              (response: any) => {
                that.orgName = r.rootOrg.orgName;
                resolve(r.rootOrg.slug);
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
      generateInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.BROWSE_AS_GUEST_CLICKED,
        Environment.HOME,
        PageId.ONBOARDING,
        null,
        undefined,
        undefined));
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

          this.profileService.setCurrentProfile(true, profile, res => {
            this.events.publish(AppGlobalService.USER_INFO_UPDATED);

            if (this.appGlobalService.isOnBoardingCompleted) {
              this.navCtrl.setRoot(TabsPage, {
                loginMode: 'guest'
              });
            } else {
              this.navCtrl.push(UserTypeSelectionPage, { showScanner: false });
            }
          }, err => {
            this.navCtrl.push(UserTypeSelectionPage, { showScanner: false });
          });
        } else {
          this.navCtrl.push(UserTypeSelectionPage, { showScanner: false });
        }
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
