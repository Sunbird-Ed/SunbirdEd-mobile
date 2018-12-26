import {Injectable} from '@angular/core';
import {
  ContainerService,
  Environment,
  InteractSubtype,
  InteractType,
  OAuthService,
  PageId,
  Profile,
  ProfileService,
  ProfileType,
  SharedPreferences,
  TabsPage,
  TelemetryService,
  UserSource
} from 'sunbird';
import {generateInteractTelemetry, GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs, PreferenceKey} from '@app/app';
import {AppGlobalService, CommonUtilService} from '@app/service';
import {OnboardingPage} from '@app/pages/onboarding/onboarding';
import {App, Events} from 'ionic-angular';

@Injectable()
export class LogoutHandlerService {
  constructor(
    private commonUtilService: CommonUtilService,
    private oAuthService: OAuthService,
    private sharedPreferences: SharedPreferences,
    private events: Events,
    private profileService: ProfileService,
    private appGlobalService: AppGlobalService,
    private app: App,
    private containerService: ContainerService,
    private telemetryService: TelemetryService
  ) {
  }

  public onLogout() {
    if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
    } else {
      this.generateLogoutInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.LOGOUT_INITIATE, '');
      this.oAuthService.doLogOut();
      (<any>window).splashscreen.clearPrefs();
      const profile: Profile = new Profile();
      this.sharedPreferences.getString('GUEST_USER_ID_BEFORE_LOGIN')
        .then(val => {
          if (val !== '') {
            profile.uid = val;
          } else {
            this.sharedPreferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
          }

          profile.handle = 'Guest1';
          profile.profileType = ProfileType.TEACHER;
          profile.source = UserSource.LOCAL;

          this.events.publish(AppGlobalService.USER_INFO_UPDATED);
          this.profileService.setCurrentProfile(true, profile).then(() => {
            this.navigateToAptPage();
          }).catch(() => {
            this.navigateToAptPage();
          });
        });
    }
  }

  private navigateToAptPage() {
    if (this.appGlobalService.DISPLAY_ONBOARDING_PAGE) {
      this.app.getRootNav().setRoot(OnboardingPage);
    } else {
      this.sharedPreferences.getString(PreferenceKey.SELECTED_USER_TYPE)
        .then(val => {
          this.appGlobalService.getGuestUserInfo();
          if (val === ProfileType.STUDENT) {
            initTabs(this.containerService, GUEST_STUDENT_TABS);
          } else if (val === ProfileType.TEACHER) {
            initTabs(this.containerService, GUEST_TEACHER_TABS);
          }
        });
      this.app.getRootNav().setRoot(TabsPage, {
        loginMode: 'guest'
      });
    }
    this.generateLogoutInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGOUT_SUCCESS, '');
  }

  private generateLogoutInteractTelemetry(interactType: InteractType, interactSubtype: InteractSubtype, uid: string) {
    const valuesMap = new Map();
    valuesMap.set('UID', uid);
    this.telemetryService.interact(
      generateInteractTelemetry(interactType,
        interactSubtype,
        Environment.HOME,
        PageId.LOGOUT,
        valuesMap,
        undefined,
        undefined
      )
    );
  }
}
