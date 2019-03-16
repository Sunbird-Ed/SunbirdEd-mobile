import {Inject, Injectable} from '@angular/core';
import {ContainerService, TabsPage} from 'sunbird';
import {GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs, PreferenceKey} from '@app/app';
import {AppGlobalService, CommonUtilService, TelemetryGeneratorService} from '@app/service';
import {OnboardingPage} from '@app/pages/onboarding/onboarding';
import {App, Events} from 'ionic-angular';
import {
  AuthService,
  ProfileService,
  ProfileType,
  SharedPreferences
} from 'sunbird-sdk';
import {Observable} from 'rxjs';
import {
  Environment,
  InteractSubtype,
  InteractType,
  PageId
} from '../../service/telemetry-constants';

@Injectable()
export class LogoutHandlerService {
  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private commonUtilService: CommonUtilService,
    private events: Events,
    private appGlobalService: AppGlobalService,
    private app: App,
    private containerService: ContainerService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences
  ) {
  }

  public onLogout() {
    if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
      this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
    } else {
      this.generateLogoutInteractTelemetry(InteractType.TOUCH,
        InteractSubtype.LOGOUT_INITIATE, '');

      this.authService.getSession()
        .mergeMap(() => {
          return Observable.fromPromise(this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN').toPromise())
            .do((guest_user_id: string) => {
              if (!guest_user_id) {
                this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise().then();
              }
            })
            .mergeMap((guest_user_id: string) => {
              return this.profileService.setActiveSessionForProfile(guest_user_id).toPromise()
                .then(() => {
                  this.events.publish(AppGlobalService.USER_INFO_UPDATED);
                  this.navigateToAptPage();
                }).catch((e) => {
                  console.log(e);
                });
            });
        })
        .mergeMap(() =>
          Observable.defer(() => Observable.of((<any>window).splashscreen.clearPrefs()))
        )
        .mergeMap(() =>
          this.authService.resignSession()
        )
        .subscribe();
    }
  }

  private navigateToAptPage() {
    if (this.appGlobalService.DISPLAY_ONBOARDING_PAGE) {
      this.app.getRootNav().setRoot(OnboardingPage);
    } else {
      this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE).toPromise()
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
    this.telemetryGeneratorService.generateInteractTelemetry(interactType,
        interactSubtype,
        Environment.HOME,
        PageId.LOGOUT,
        undefined,
        valuesMap,
        undefined,
        undefined
    );
  }
}
