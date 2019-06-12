import { Observable } from 'rxjs';
import { AfterViewInit, Component, Inject, NgZone, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { App, Events, Nav, Platform, PopoverController, ToastController, ViewController, NavControllerBase } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs, LOGIN_TEACHER_TABS } from './module.service';
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { TranslateService } from '@ngx-translate/core';
import { SearchPage } from '@app/pages/search';
import { CollectionDetailsPage } from '../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../pages/content-details/content-details';
import { ContentType, EventTopics, GenericAppConfig, MimeType, PreferenceKey, ProfileConstants } from './app.constant';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { FormAndFrameworkUtilService, GuestProfilePage } from '@app/pages/profile';
import {
  AppGlobalService, CommonUtilService, TelemetryGeneratorService, UtilityService, AppHeaderService, AppRatingService
} from '@app/service';
import { UserTypeSelectionPage } from '@app/pages/user-type-selection';
import { CategoriesEditPage } from '@app/pages/categories-edit/categories-edit';
import { TncUpdateHandlerService } from '@app/service/handlers/tnc-update-handler.service';
import {
  AuthService, ErrorEventType, EventNamespace, EventsBusService, OAuthSession, ProfileService, ProfileType,
  SharedPreferences, SunbirdSdk, TelemetryAutoSyncUtil, TelemetryService
} from 'sunbird-sdk';
import { tap } from 'rxjs/operators';
import { Environment, InteractSubtype, InteractType, PageId, ImpressionType } from '../service/telemetry-constants';
import { TabsPage } from '@app/pages/tabs/tabs';
import { ContainerService } from '@app/service/container.services';
import { SplashcreenTelemetryActionHandlerDelegate } from '@app/service/sunbird-splashscreen/splashcreen-telemetry-action-handler-delegate';
import { SplashscreenImportActionHandlerDelegate } from '@app/service/sunbird-splashscreen/splashscreen-import-action-handler-delegate';
import { OnboardingPage } from '@app/pages/onboarding/onboarding';
import { SettingsPage } from '@app/pages/settings';
import { ReportsPage } from '@app/pages/reports';
import { UserAndGroupsPage } from '@app/pages/user-and-groups';
import { LogoutHandlerService } from '@app/service/handlers/logout-handler.service';
import { Network } from '@ionic-native/network';
import { ResourcesPage } from '@app/pages/resources/resources';
import { CoursesPage } from '@app/pages/courses/courses';
import { ProfilePage } from '@app/pages/profile/profile';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { QrCodeResultPage } from '@app/pages/qr-code-result';
import { FaqPage } from '@app/pages/help/faq';
import { NotificationService } from '@app/service/notification.service';
import { SplaschreenDeeplinkActionHandlerDelegate } from '@app/service/sunbird-splashscreen/splaschreen-deeplink-action-handler-delegate';
import { ActivePageService } from '@app/service/active-page/active-page-service';

@Component({
  templateUrl: 'app.html',
  providers: [
    SplashcreenTelemetryActionHandlerDelegate,
    SplashscreenImportActionHandlerDelegate,
    SplaschreenDeeplinkActionHandlerDelegate
  ]
})
export class MyApp implements OnInit, AfterViewInit {
  @ViewChild(Nav) nav;
  rootPage: any;
  public counter = 0;
  headerConfig = {
    showHeader: true,
    showBurgerMenu: true,
    actionButtons: ['search'],
  };
  public sideMenuEvent = new EventEmitter;
  private telemetryAutoSyncUtil: TelemetryAutoSyncUtil;

  profile: any = {};
  selectedLanguage: string;


  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    private platform: Platform,
    private statusBar: StatusBar,
    private toastCtrl: ToastController,
    private containerService: ContainerService,
    private imageLoaderConfig: ImageLoaderConfig,
    private app: App,
    private translate: TranslateService,
    private events: Events,
    private zone: NgZone,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private event: Events,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private popoverCtrl: PopoverController,
    private tncUpdateHandlerService: TncUpdateHandlerService,
    private utilityService: UtilityService,
    private splashcreenTelemetryActionHandlerDelegate: SplashcreenTelemetryActionHandlerDelegate,
    private splashscreenImportActionHandlerDelegate: SplashscreenImportActionHandlerDelegate,
    private splaschreenDeeplinkActionHandlerDelegate: SplaschreenDeeplinkActionHandlerDelegate,
    private headerServie: AppHeaderService,
    private logoutHandlerService: LogoutHandlerService,
    private network: Network,
    private appRatingService: AppRatingService,
    private notificationSrc: NotificationService,
    private activePageService: ActivePageService,
  ) {
    this.telemetryAutoSyncUtil = new TelemetryAutoSyncUtil(this.telemetryService);
    platform.ready().then(async () => {
      // this.fcmTokenWatcher(); // Notification related
      // this.receiveNotification();
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setMaximumCacheSize(100 * 1024 * 1024);
      this.telemetryGeneratorService.genererateAppStartTelemetry(await utilityService.getDeviceSpec());
      this.generateNetworkTelemetry();
      this.autoSyncTelemetry();
      this.subscribeEvents();

      this.registerDeeplinks();
      this.startOpenrapDiscovery();
      this.saveDefaultSyncSetting();
      this.checkAppUpdateAvailable();
      this.makeEntryInSupportFolder();
      this.checkForTncUpdate();
      this.handleAuthErrors();
      await this.getSelectedLanguage();
      await this.navigateToAppropriatePage();
      this.handleSunbirdSplashScreenActions();
      this.preferences.putString(PreferenceKey.CONTENT_CONTEXT, '').subscribe();
      window['thisRef'] = this;
      this.statusBar.styleBlackTranslucent();
      this.handleBackButton();
      this.appRatingService.checkInitialDate();
      this.getUtmParameter();
    });
  }

  /* Generates new FCM Token if not available
   * if available then on token refresh updates FCM token
   */
//   fcmTokenWatcher() {
//     if (!this.preferences.getString('fcm_token')) {
//       FCMPlugin.getToken((token) => {
//         this.preferences.putString('fcm_token', token);
//       });
//     } else {
//       FCMPlugin.onTokenRefresh((token) => {
//         this.preferences.putString('fcm_token', token);
//       });
//     }

//   }



  /* Notification data will be received in data variable
   * can take action on data variable
   */
//   receiveNotification () {
//     FCMPlugin.onNotification((data) => {
//       console.log('Notificationdata');
//       console.log(data);
//       alert(data);

//         if (data.wasTapped) {
//           // Notification was received on device tray and tapped by the user.
//           alert( JSON.stringify(data) );
//         } else {
//           // Notification was received in foreground. Maybe the user needs to be notified.
//           alert( JSON.stringify(data) );
//         }
//     },
//     (sucess) => {
//       console.log('Notification Sucess Callback');
//       console.log(sucess);
//     },
//     (err) => {
//       console.log('Notification Error Callback');
//       console.log(err);
//     });
//   }

  /**
	 * Angular life cycle hooks
	 */
  ngOnInit() {
    this.headerServie.headerConfigEmitted$.subscribe(config => {
      this.headerConfig = config;
    });

    this.commonUtilService.networkAvailability$.subscribe((available: boolean) => {
      const navObj: NavControllerBase = this.app.getActiveNavs()[0];
      const activeView: ViewController = navObj.getActive();
      const pageId: string = this.activePageService.computePageId((<any>activeView).instance);
      if (available) {
        this.addNetworkTelemetry(InteractSubtype.INTERNET_CONNECTED, pageId);
      } else {
        this.addNetworkTelemetry(InteractSubtype.INTERNET_DISCONNECTED, pageId);
      }
    });
    this.notificationSrc.setupLocalNotification();
  }

  addNetworkTelemetry(subtype: string, pageId: string) {
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
      subtype,
      Environment.HOME,
      pageId, undefined
    );
  }
  ngAfterViewInit(): void {
    this.platform.resume.subscribe(() => {
      this.telemetryGeneratorService.generateInterruptTelemetry('resume', '');
      this.handleSunbirdSplashScreenActions();
    });

    this.platform.pause.subscribe(() => {
      this.telemetryGeneratorService.generateInterruptTelemetry('background', '');
    });
  }

  handleBackButton() {
    this.platform.registerBackButtonAction(() => {

      let navObj = this.app.getRootNavs()[0];
      let currentPage = navObj.getActive().name;
      const activeView: ViewController = this.nav.getActive();
      if (activeView != null && ((<any>activeView).instance instanceof TabsPage)) {
        navObj = this.app.getActiveNavs()[0];
        currentPage = navObj.getActive().name;
      }

      if (navObj.canGoBack()) {
        return navObj.pop();
      } else {
        this.commonUtilService.showExitPopUp(this.activePageService.computePageId((<any>activeView).instance), Environment.HOME, false);
      }
    });
  }

  generateNetworkTelemetry() {
    const value = new Map();
    value['network-type'] = this.network.type;
    this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
      InteractSubtype.NETWORK_STATUS, Environment.HOME, PageId.SPLASH_SCREEN, undefined, value);
  }

  subscribeEvents() {
    this.events.subscribe('tab.change', (data) => {
      this.zone.run(() => {
        this.generateInteractEvent(data);
        // Added below code to generate Impression Before Interact for Library,Courses,Profile
        this.generateImpressionEvent(data);
      });
    });

    this.events.subscribe('generic.event', (data) => {
      this.zone.run(() => {
        const response = JSON.parse(data);
        let action;
        try {
          action = JSON.parse(response.data.action);
        } catch (Error) {
        }
        const values = new Map();
        values['openrapInfo'] = action;
        if (response && response.data.action && response.data.action === 'logout') {
          this.authService.getSession().toPromise().then((session: OAuthSession) => {
            if (session) {
              this.authService.resignSession().subscribe();
              (<any>window).splashscreen.clearPrefs();
            }
            this.profileService.getActiveSessionProfile({
              requiredFields: ProfileConstants.REQUIRED_FIELDS
            }).toPromise()
              .then((currentUser: any) => {

                if (currentUser.profileType === ProfileType.STUDENT) {
                  initTabs(this.containerService, GUEST_STUDENT_TABS);
                  this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise().then();
                } else {
                  initTabs(this.containerService, GUEST_TEACHER_TABS);
                  this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise().then();
                }

                this.event.publish('refresh:profile');
                this.event.publish(AppGlobalService.USER_INFO_UPDATED);

                this.app.getRootNav().setRoot(TabsPage);

              }).catch(() => {
              });

          });
        } else if (response && action && action.actionType === 'connected') {
          console.log('connected to openrap device with the IP ' + action.ip);
          this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
            'openrap-device-connected',
            Environment.HOME,
            Environment.HOME, undefined,
            values);
        } else if (response && action && action.actionType === 'disconnected') {
          console.log('disconnected from openrap device with the IP ' + action.ip);
          this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
            'openrap-device-disconnected',
            Environment.HOME,
            Environment.HOME, undefined,
            values);
        } else if (response && response.data.action && response.data.action === EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY) {
          this.events.publish(EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY, {
            update: true
          });
        }
      });
    });

    this.translate.onLangChange.subscribe((params) => {
      if (params.lang === 'ur' && !this.platform.isRTL) {
        this.platform.setDir('rtl', true);
      } else if (this.platform.isRTL) {
        this.platform.setDir('ltr', true);
      }
    });
  }

  getProfileSettingConfig(hideBackButton = false) {
    this.utilityService.getBuildConfigValue(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE)
      .then(response => {
        if (response === 'true') {
          this.nav.setRoot('ProfileSettingsPage', { hideBackButton: hideBackButton });
        } else {
          this.nav.setRoot(TabsPage);
        }
      })
      .catch(error => {
        this.nav.setRoot(TabsPage);
      });
  }

  private async checkForTncUpdate() {
    await this.tncUpdateHandlerService.checkForTncUpdate();
  }

  private async navigateToAppropriatePage() {
    const session = await this.authService.getSession().toPromise();
    console.log(`Platform Session`, session);
    if (!session) {
      console.log(`Success Platform Session`, session);
      this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE).toPromise()
        .then(async (profileType: ProfileType | undefined) => {
          if (!profileType) {
            this.appGlobalService.isProfileSettingsCompleted = false;
            this.rootPage = LanguageSettingsPage;
            return;
          }

          switch (profileType.toLocaleLowerCase()) {
            case ProfileType.TEACHER: {
              await this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise();
              initTabs(this.containerService, GUEST_TEACHER_TABS);
              break;
            }
            case ProfileType.STUDENT: {
              await this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise();
              initTabs(this.containerService, GUEST_STUDENT_TABS);
              break;
            }
          }

          const display_cat_page: string = await this.utilityService
            .getBuildConfigValue(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE);

          if (display_cat_page === 'false') {
            await this.nav.setRoot(TabsPage);
          } else {
            const profile = await this.profileService.getActiveSessionProfile({ requiredFields: ProfileConstants.REQUIRED_FIELDS })
              .toPromise();
            if (
              profile
              && profile.syllabus && profile.syllabus[0]
              && profile.board && profile.board.length
              && profile.grade && profile.grade.length
              && profile.medium && profile.medium.length
            ) {
              this.appGlobalService.isProfileSettingsCompleted = true;
              await this.nav.setRoot(TabsPage);
            } else {
              this.appGlobalService.isProfileSettingsCompleted = false;
              try {
                if ((await this.preferences.getString(PreferenceKey.IS_ONBOARDING_COMPLETED).toPromise()) === 'true') {
                  this.getProfileSettingConfig(true);
                } else {
                  await this.nav.insertPages(0, [{ page: LanguageSettingsPage }, { page: UserTypeSelectionPage }]);
                }
              } catch (e) {
                this.getProfileSettingConfig();
              }
            }
          }
        });
    } else {
      console.log(`Failure Session`, session);
      this.profileService.getActiveSessionProfile({
        requiredFields: ProfileConstants.REQUIRED_FIELDS
      }).toPromise()
        .then(async (profile: any) => {
          if (profile
            && profile.syllabus && profile.syllabus[0]
            && profile.board && profile.board.length
            && profile.grade && profile.grade.length
            && profile.medium && profile.medium.length) {

            initTabs(this.containerService, LOGIN_TEACHER_TABS);

            if ((await this.preferences.getString('SHOW_WELCOME_TOAST').toPromise()) === 'true') {
              this.preferences.putString('SHOW_WELCOME_TOAST', 'false').toPromise().then();

              const serverProfile = await this.profileService.getServerProfilesDetails({
                userId: session.userToken,
                requiredFields: ProfileConstants.REQUIRED_FIELDS,
              }).toPromise();

              this.commonUtilService
                .showToast(this.commonUtilService.translateMessage('WELCOME_BACK', serverProfile.firstName));
            }

            this.rootPage = TabsPage;
          } else {
            const serverProfile = await this.profileService.getServerProfilesDetails({
              userId: session.userToken,
              requiredFields: ProfileConstants.REQUIRED_FIELDS,
            }).toPromise();

            this.formAndFrameworkUtilService.updateLoggedInUser(serverProfile, profile)
              .then((value) => {
                if (value['status']) {
                  this.nav.setRoot(TabsPage);
                  initTabs(this.containerService, LOGIN_TEACHER_TABS);
                } else {
                  this.nav.setRoot(CategoriesEditPage, {
                    showOnlyMandatoryFields: true,
                    profile: value['profile']
                  });
                }
              });
          }
        });
    }
  }

  private async getSelectedLanguage() {
    const selectedLanguage = await this.preferences.getString(PreferenceKey.SELECTED_LANGUAGE_CODE).toPromise();
    if (selectedLanguage) {
      await this.translate.use(selectedLanguage).toPromise();
    }
  }

  private async makeEntryInSupportFolder() {
    return new Promise((resolve => {
      (<any>window).supportfile.makeEntryInSunbirdSupportFile((result) => {
        this.preferences.putString(PreferenceKey.KEY_SUNBIRD_SUPPORT_FILE_PATH, result).toPromise().then();
        resolve();
      }, () => {
      });
    }));
  }

  private async saveDefaultSyncSetting() {
    return this.preferences.getString('sync_config').toPromise()
      .then(val => {
        if (val === undefined || val === '' || val === null) {
          this.preferences.putString('sync_config', 'ALWAYS_ON').toPromise().then();
        }
      });
  }

  private async registerDeeplinks() {
    (<any>window).splashscreen.onDeepLink(deepLinkResponse => {
      setTimeout(() => {
        const response = deepLinkResponse;

        if (response.type === 'dialcode') {
          const results = response.code.split('/');
          const dialCode = results[results.length - 1];
          this.nav.push(SearchPage, { dialCode: dialCode });
        } else if (response.type === 'contentDetails') {
          const hierarchyInfo = JSON.parse(response.hierarchyInfo);

          const content = {
            identifier: response.id,
            hierarchyInfo: hierarchyInfo
          };

          const navObj = this.app.getActiveNavs()[0];

          navObj.push(ContentDetailsPage, {
            content: content
          });
        } else if (response.result) {
          this.navigateToContentDetails(response.result);
        }
      }, 300);
    });
  }

  private generateInteractEvent(pageid: string) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.TAB_CLICKED,
      Environment.HOME,
      pageid.toLowerCase(),
      null,
      undefined,
      undefined
    );
  }

  private generateImpressionEvent(pageid: string) {
    pageid = pageid.toLowerCase();
    const env = pageid.localeCompare(PageId.PROFILE) ? Environment.HOME : Environment.USER;
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      pageid,
      env);
  }

  private navigateToContentDetails(content) {
    if (content.contentData.contentType === ContentType.COURSE) {
      this.nav.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      this.nav.push(CollectionDetailsPage, {
        content: content
      });
    } else {
      this.nav.push(ContentDetailsPage, {
        content: content
      });
    }
  }

  private async startOpenrapDiscovery(): Promise<undefined> {
    if (this.appGlobalService.OPEN_RAPDISCOVERY_ENABLED) {
      return Observable.create((observer) => {
        (<any>window).openrap.startDiscovery(
          (response: { ip: string, actionType: 'connected' | 'disconnected' }) => {
            observer.next(response);
          }, (e) => {
            observer.error(e);
          }
        );
      }).do((response: { ip?: string, actionType: 'connected' | 'disconnected' }) => {
        const values = new Map();
        values['openrapInfo'] = response;
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.OTHER,
          response.actionType === 'connected' ? 'openrap-device-connected' : 'openrap-device-disconnected',
          Environment.HOME,
          Environment.HOME, undefined,
          values);
        SunbirdSdk.instance.updateContentServiceConfig({
          host: response.actionType === 'connected' ? response.ip : undefined
        });

        SunbirdSdk.instance.updatePageServiceConfig({
          host: response.actionType === 'connected' ? response.ip : undefined
        });

        SunbirdSdk.instance.updateTelemetryConfig({
          host: response.actionType === 'connected' ? response.ip : undefined
        });
      }).toPromise();
    }
  }

  private async checkAppUpdateAvailable() {
    return this.formAndFrameworkUtilService.checkNewAppVersion()
      .then(result => {
        if (result !== undefined) {
          setTimeout(() => {
            this.events.publish('force_optional_upgrade', { upgrade: result });
          }, 5000);
        }
      }).catch(err => {
        // console.log('checkNewAppVersion err', err, err instanceof NetworkError);
      });
  }

  private async handleSunbirdSplashScreenActions(): Promise<undefined> {
    const stringifiedActions = await new Promise<string>((resolve) => {
      splashscreen.getActions((actionsTobeDone) => {
        resolve(actionsTobeDone);
      });
    });

    const actions: { type: string, payload: any }[] = JSON.parse(stringifiedActions);

    for (const action of actions) {
      switch (action.type) {
        case 'TELEMETRY': {
          await this.splashcreenTelemetryActionHandlerDelegate.onAction(action.type, action.payload).toPromise();
          break;
        }
        case 'IMPORT': {
          await this.splashscreenImportActionHandlerDelegate.onAction(action.type, action.payload).toPromise();
          break;
        }
        case 'DEEPLINK': {
          await this.splaschreenDeeplinkActionHandlerDelegate.onAction(action.type, action.payload).toPromise();
          break;
        }
        default:
          return;
      }
    }

    splashscreen.markImportDone();
    splashscreen.hide();
  }

  private autoSyncTelemetry() {
    this.telemetryAutoSyncUtil.start(30 * 1000)
      .mergeMap(() => {
        return Observable.combineLatest(
          this.platform.pause.pipe(tap(() => this.telemetryAutoSyncUtil.pause())),
          this.platform.resume.pipe(tap(() => this.telemetryAutoSyncUtil.continue()))
        );
      })
      .subscribe();
  }

  handleHeaderEvents($event) {
    if ($event.name === 'back') {
      // this.handleBackButton();
      let navObj = this.app.getRootNavs()[0];
      let activeView: ViewController = this.nav.getActive();
      if (activeView != null && ((<any>activeView).instance instanceof TabsPage)) {
        navObj = this.app.getActiveNavs()[0];
        activeView = navObj.getActive();
        // currentPage = navObj.getActive().name;
      }
      // if (currentPage === 'TabsPage') {
      //   navObj = this.app.getActiveNavs()[0];
      //   currentPage = navObj.getActive().name;
      // }
      if (((<any>activeView).instance instanceof UserTypeSelectionPage)
        || ((<any>activeView).instance instanceof EnrolledCourseDetailsPage)
        || ((<any>activeView).instance instanceof CollectionDetailsPage)
        || ((<any>activeView).instance instanceof CollectionDetailsEtbPage)
        || ((<any>activeView).instance instanceof ContentDetailsPage)
        || ((<any>activeView).instance instanceof OnboardingPage)
        || ((<any>activeView).instance instanceof QrCodeResultPage)
        || ((<any>activeView).instance instanceof FaqPage)
      ) {
        this.headerServie.sidebarEvent($event);
        return;
      }
      if (navObj.canGoBack()) {
        return navObj.pop();
      } else {
        this.commonUtilService.showExitPopUp(this.activePageService.computePageId((<any>activeView).instance), Environment.HOME, false);
      }
    } else {
      this.headerServie.sidebarEvent($event);
    }
  }

  menuItemAction(menuName) {
    switch (menuName.menuItem) {
      case 'USERS_AND_GROUPS':
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.USER_GROUP_CLICKED,
          Environment.USER,
          PageId.PROFILE
        );
        if (this.app.getRootNavs().length > 0) {
          this.app.getRootNavs()[0].push(UserAndGroupsPage, { profile: this.profile });
        }
        break;

      case 'REPORTS':
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.REPORTS_CLICKED,
          Environment.USER,
          PageId.PROFILE
        );
        if (this.app.getRootNavs().length > 0) {
          this.app.getRootNavs()[0].push(ReportsPage, { profile: this.profile });
        }
        break;

      case 'SETTINGS': {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.SETTINGS_CLICKED,
          Environment.USER,
          PageId.PROFILE,
          null,
          undefined,
          undefined
        );
        if (this.app.getRootNavs().length > 0) {
          this.app.getRootNavs()[0].push(SettingsPage);
        }
        break;
      }
      case 'LANGUAGE': {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.LANGUAGE_CLICKED,
          Environment.USER,
          PageId.PROFILE,
          null,
          undefined,
          undefined
        );
        if (this.app.getRootNavs().length > 0) {
          this.app.getRootNavs()[0].push(LanguageSettingsPage, {
            isFromSettings: true
          });
        }
        break;
      }
      case 'HELP': {
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.HELP_CLICKED,
          Environment.USER,
          PageId.PROFILE,
          null,
          undefined,
          undefined
        );
        if (this.app.getRootNavs().length > 0) {
          this.app.getRootNavs()[0].push(FaqPage, {
            isFromSettings: true
          });
        }
        break;
      }
      case 'LOGOUT':
        if (!this.commonUtilService.networkInfo.isNetworkAvailable) {
          this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
        } else {
          this.logoutHandlerService.onLogout();
        }
        break;

    }
  }

  private handleAuthErrors() {
    this.eventsBusService.events(EventNamespace.ERROR)
      .filter((e) => e.type === ErrorEventType.AUTH_TOKEN_REFRESH_ERROR)
      .take(1).subscribe(() => {
        this.logoutHandlerService.onLogout();
      });
  }
  getUtmParameter() {
    this.utilityService.getUtmInfo().then(response => {
      if (response) {
        const utmTelemetry = new Map();
        utmTelemetry['utm_data'] = response;
        this.telemetryGeneratorService.generateInteractTelemetry(
          InteractType.OTHER,
          InteractSubtype.UTM_INFO,
          Environment.HOME,
          PageId.HOME,
          undefined,
          utmTelemetry,
          undefined,
          undefined
        );
        this.utilityService.clearUtmInfo();
      }
    })
      .catch(error => {
        console.log('Error is', error);
      });
  }
}
