import { Component } from '@angular/core';
// import { NavController, Events } from 'ionic-angular';
// import { ReportsPage } from '../../pages/reports';
// import { LanguageSettingsPage } from '../../pages/language-settings/language-settings';
// import { SettingsPage } from '../../pages/settings';
// import { UserAndGroupsPage } from '../../pages/user-and-groups/user-and-groups';
// import { PreferenceKey } from '../../app/app.constant';
// import {
//   OAuthService,
//   SharedPreferences,
//   ProfileType,
//   Profile,
//   UserSource,
//   // TabsPage,
//   // ContainerService,
//   InteractType,
//   InteractSubtype,
//   PageId,
//   Environment,
//   TelemetryService,
//   ProfileService
// } from 'sunbird';
// import { TelemetryGeneratorService, AppGlobalService, CommonUtilService  } from '@app/service';
// import { generateInteractTelemetry } from '../../app/telemetryutil';

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {
  profile: any = {};

  constructor(
    // public navCtrl: NavController,
    // private preferences: SharedPreferences,
    // private oauth: OAuthService,
    // private telemetryGeneratorService: TelemetryGeneratorService,
    // private telemetryService: TelemetryService,
    // private profileService: ProfileService,
    // private events: Events,
    // private commonUtilService: CommonUtilService
    ) {

  }

  // menuItemAction(i) {
  //   switch (i) {
  //     case 'USERS_AND_GROUPS':
  //       this.telemetryGeneratorService.generateInteractTelemetry(
  //         InteractType.TOUCH,
  //         InteractSubtype.USER_GROUP_CLICKED,
  //         Environment.USER,
  //         PageId.PROFILE
  //       );
  //       // this.app.getActiveNav().push(UserAndGroupsPage, { profile: this.profile });
  //       this.goToUserAndGroups();
  //       break;

  //     case 'REPORTS':
  //       this.telemetryGeneratorService.generateInteractTelemetry(
  //         InteractType.TOUCH,
  //         InteractSubtype.REPORTS_CLICKED,
  //         Environment.USER,
  //         PageId.PROFILE
  //       );
  //       // this.app.getActiveNav().push(ReportsPage, { profile: this.profile });
  //       this.goToReports();
  //       break;

  //     case 'SETTINGS': {
  //       this.telemetryGeneratorService.generateInteractTelemetry(
  //         InteractType.TOUCH,
  //         InteractSubtype.SETTINGS_CLICKED,
  //         Environment.USER,
  //         PageId.PROFILE,
  //         null,
  //         undefined,
  //         undefined
  //       );
  //       // this.app.getActiveNav().push(SettingsPage);
  //       this.goToLanguageSettings();
  //       break;
  //     }
  //     case 'LOGOUT':
  //       if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
  //         this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
  //       } else {
  //         this.generateLogoutInteractTelemetry(InteractType.TOUCH,
  //           InteractSubtype.LOGOUT_INITIATE, '');
  //         this.oauth.doLogOut();
  //         (<any>window).splashscreen.clearPrefs();
  //         const profile: Profile = new Profile();
  //         this.preferences.getString('GUEST_USER_ID_BEFORE_LOGIN')
  //           .then(val => {
  //             if (val !== '') {
  //               profile.uid = val;
  //             } else {
  //               this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
  //             }

  //             profile.handle = 'Guest1';
  //             profile.profileType = ProfileType.TEACHER;
  //             profile.source = UserSource.LOCAL;

  //             this.profileService.setCurrentProfile(true, profile).then(() => {
  //               this.navigateToAptPage();
  //               this.events.publish(AppGlobalService.USER_INFO_UPDATED);
  //             }).catch(() => {
  //               this.navigateToAptPage();
  //               this.events.publish(AppGlobalService.USER_INFO_UPDATED);
  //             });
  //           });
  //       }

  //       break;
  //   }
  // }

  // goToUserAndGroups() {
  //   this.navCtrl.push(UserAndGroupsPage, { profile: this.profile });
  // }
  // goToReports() {
  //   this.navCtrl.push(ReportsPage, { profile: this.profile });
  // }
  // goToLanguageSettings() {
  //   this.navCtrl.push(LanguageSettingsPage, {
  //     mainPage: true
  //   });
  // }
  // goToSettings() {
  //   this.navCtrl.push(SettingsPage);
  // }

  // generateLogoutInteractTelemetry(interactType, interactSubtype, uid) {
  //   const valuesMap = new Map();
  //   valuesMap['UID'] = uid;
  //   this.telemetryService.interact(
  //     generateInteractTelemetry(interactType,
  //       interactSubtype,
  //       Environment.HOME,
  //       PageId.LOGOUT,
  //       valuesMap,
  //       undefined,
  //       undefined
  //     )
  //   );
  // }

  // navigateToAptPage() {
  //   // if (this.appGlobalService.DISPLAY_ONBOARDING_PAGE) {
  //   //   this.app.getRootNav().setRoot(OnboardingPage);
  //   // } else {
  //   //   this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE)
  //   //     .then(val => {
  //   //       this.appGlobalService.getGuestUserInfo();
  //   //       if (val === ProfileType.STUDENT) {
  //   //         initTabs(this.container, GUEST_STUDENT_TABS);
  //   //       } else if (val === ProfileType.TEACHER) {
  //   //         initTabs(this.container, GUEST_TEACHER_TABS);
  //   //       }
  //   //     });
  //   //   this.app.getRootNav().setRoot(TabsPage, {
  //   //     loginMode: 'guest'
  //   //   });
  //   // }
  //   // this.generateLogoutInteractTelemetry(InteractType.OTHER, InteractSubtype.LOGOUT_SUCCESS, '');
  // }


}
