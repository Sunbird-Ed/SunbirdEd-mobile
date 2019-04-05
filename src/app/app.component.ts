import {Observable} from 'rxjs';
import {ProfileSettingsPage} from './../pages/profile-settings/profile-settings';
import {AfterViewInit, Component, Inject, NgZone, ViewChild} from '@angular/core';
import {App, Events, Nav, Platform, PopoverController, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs, LOGIN_TEACHER_TABS} from './module.service';
import {LanguageSettingsPage} from '../pages/language-settings/language-settings';
import {ImageLoaderConfig} from 'ionic-image-loader';
import {TranslateService} from '@ngx-translate/core';
import {SearchPage} from '@app/pages/search';
import {CollectionDetailsPage} from '../pages/collection-details/collection-details';
import {ContentDetailsPage} from '../pages/content-details/content-details';
import {ContentType, EventTopics, GenericAppConfig, MimeType, PreferenceKey, ProfileConstants} from './app.constant';
import {EnrolledCourseDetailsPage} from '@app/pages/enrolled-course-details';
import {FormAndFrameworkUtilService} from '@app/pages/profile';
import {AppGlobalService, CommonUtilService, TelemetryGeneratorService, UtilityService} from '@app/service';
import {UserTypeSelectionPage} from '@app/pages/user-type-selection';
import {CategoriesEditPage} from '@app/pages/categories-edit/categories-edit';
import {TncUpdateHandlerService} from '@app/service/handlers/tnc-update-handler.service';
import {
  AuthService,
  OAuthSession,
  ProfileService,
  ProfileType,
  SharedPreferences,
  SunbirdSdk,
  TelemetryAutoSyncUtil,
  TelemetryService,
} from 'sunbird-sdk';
import {tap} from 'rxjs/operators';
import {Environment, ImpressionType, InteractSubtype, InteractType, PageId} from '../service/telemetry-constants';
import {TabsPage} from '@app/pages/tabs/tabs';
import {ContainerService} from '@app/service/container.services';
import {AndroidPermissionsService} from '../service/android-permissions/android-permissions.service';
import {AndroidPermission, AndroidPermissionsStatus} from '@app/service/android-permissions/android-permission';
import {SplashcreenTelemetryActionHandlerDelegate} from '@app/service/sunbird-splashscreen/splashcreen-telemetry-action-handler-delegate';
import {SplashscreenImportActionHandlerDelegate} from '@app/service/sunbird-splashscreen/splashscreen-import-action-handler-delegate';

@Component({
  templateUrl: 'app.html',
  providers: [
    SplashcreenTelemetryActionHandlerDelegate,
    SplashscreenImportActionHandlerDelegate
  ]
})
export class MyApp implements AfterViewInit {

  @ViewChild(Nav) nav;
  rootPage: any;
  public counter = 0;
  readonly permissionList = [
    AndroidPermission.WRITE_EXTERNAL_STORAGE,
    AndroidPermission.RECORD_AUDIO,
    AndroidPermission.CAMERA];
  private telemetryAutoSyncUtil: TelemetryAutoSyncUtil;

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    private platform: Platform,
    private statusBar: StatusBar,
    private toastCtrl: ToastController,
    private containerService: ContainerService,
    private permission: AndroidPermissionsService,
    private imageLoaderConfig: ImageLoaderConfig,
    private app: App,
    private translate: TranslateService,
    private events: Events,
    private zone: NgZone,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private event: Events,
    private container: ContainerService,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private popoverCtrl: PopoverController,
    private tncUpdateHandlerService: TncUpdateHandlerService,
    private utilityService: UtilityService,
    private splashcreenTelemetryActionHandlerDelegate: SplashcreenTelemetryActionHandlerDelegate,
    private splashscreenImportActionHandlerDelegate: SplashscreenImportActionHandlerDelegate,
  ) {
    this.telemetryAutoSyncUtil = new TelemetryAutoSyncUtil(this.telemetryService);
    platform.ready().then(async () => {
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setMaximumCacheSize(100 * 1024 * 1024);
      this.telemetryGeneratorService.genererateAppStartTelemetry(await utilityService.getDeviceSpec());
      this.autoSyncTelemetry();
      this.subscribeEvents();


      this.registerDeeplinks();
      // this.startOpenrapDiscovery();
      this.saveDefaultSyncSetting();
      this.showAppWalkThroughScreen();
      this.checkAppUpdateAvailable();
      this.requestAppPermissions();
      this.makeEntryInSupportFolder();
      this.checkForTncUpdate();
      await this.getSelectedLanguage();
      await this.navigateToAppropriatePage();
      this.preferences.putString(PreferenceKey.CONTENT_CONTEXT, '').subscribe();
      window['thisRef'] = this;
      this.statusBar.styleBlackTranslucent();
      this.handleBackButton();
    });

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

      const navObj = this.app.getActiveNavs()[0];
      const currentPage = navObj.getActive().name;

      if (navObj.canGoBack()) {
        return navObj.pop();
      } else {
        this.commonUtilService.showExitPopUp(this.computePageId(currentPage), Environment.HOME, false);
      }
    });
  }

  computePageId(pageName: string): string {
    let pageId = '';
    switch (pageName) {
      case 'ResourcesPage': {
        pageId = PageId.LIBRARY;
        break;
      }
      case 'CoursesPage': {
        pageId = PageId.COURSES;
        break;
      }
      case 'ProfilePage': {
        pageId = PageId.PROFILE;
        break;
      }
      case 'GuestProfilePage': {
        pageId = PageId.GUEST_PROFILE;
        break;
      }
    }
    return pageId;
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
                  initTabs(this.container, GUEST_STUDENT_TABS);
                  this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise().then();
                } else {
                  initTabs(this.container, GUEST_TEACHER_TABS);
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
          this.nav.setRoot('ProfileSettingsPage', {hideBackButton: hideBackButton});
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

    if (!session) {
      this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE).toPromise()
        .then(async (profileType: ProfileType | undefined) => {
          if (!profileType) {
            this.appGlobalService.isProfileSettingsCompleted = false;
            this.rootPage = LanguageSettingsPage;
            return;
          }

          switch (profileType) {
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
            const profile = await this.profileService.getActiveSessionProfile({requiredFields: ProfileConstants.REQUIRED_FIELDS}).toPromise();
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
                  await this.nav.insertPages(0, [{page: LanguageSettingsPage}, {page: UserTypeSelectionPage}]);
                }
              } catch (e) {
                this.getProfileSettingConfig();
              }
            }
          }
        });
    } else {
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

  private async requestAppPermissions() {
    return this.permission.checkPermissions(this.permissionList)
      .mergeMap((statusMap: { [key: string]: AndroidPermissionsStatus }) => {
        const toRequest: AndroidPermission[] = [];

        for (const permission in statusMap) {
          if (!statusMap[permission].hasPermission) {
            toRequest.push(permission as AndroidPermission);
          }
        }

        if (!toRequest.length) {
          return Observable.of(undefined);
        }

        return this.permission.requestPermissions(toRequest);
      }).toPromise();
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
          this.nav.push(SearchPage, {dialCode: dialCode});
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

  private async showAppWalkThroughScreen() {
    const showAppWalkthrough = (await this.preferences.getString('show_app_walkthrough_screen').toPromise()) === '' ? 'true' : 'false';
    await this.preferences.putString('show_app_walkthrough_screen', showAppWalkthrough).toPromise();
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
            this.events.publish('force_optional_upgrade', {upgrade: result});
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

  // updateCallback(error) {
  //   if (error) {
  //   } else {
  //     const confirm = window['thisRef'].alertCtrl.create({
  //       title: 'Application Update',
  //       message: 'Update available, do you want to apply it?',
  //       buttons: [
  //         {text: 'No'},
  //         {
  //           text: 'Yes',
  //           handler: () => {
  //             chcp.installUpdate(errorResponse => {
  //               if (errorResponse) {
  //                 window['thisRef'].alertCtrl.create({
  //                   title: 'Update Download',
  //                   subTitle: `Error ${errorResponse.code}`,
  //                   buttons: ['OK']
  //                 }).present();
  //               } else {
  //               }
  //             });
  //           }
  //         }
  //       ]
  //     });
  //     confirm.present();
  //   }
  // }

  // private async showGreetingPopup() {
  //   const popover = this.popoverCtrl.create(BroadcastComponent,
  //     {
  //       'greetings': 'Diwali Greetings',
  //       'imageurl': 'https://t3.ftcdn.net/jpg/01/71/29/20/240_F_171292090_liVMi9liOzZaW0gjsmCIZzwVr2Qw7g4i.jpg',
  //       'customButton': 'custom button',
  //       'greetingText': 'this diwali may enlighten your dreams'
  //     },
  //     {cssClass: 'broadcast-popover'}
  //   );
  //
  //   return popover.present();
  // }

  // fetchUpdate() {
  //   const options = {
  //     'config-file': 'http://172.16.0.23:3000/updates/chcp.json'
  //   };
  //   chcp.fetchUpdate(this.updateCallback, options);
  // }
}
