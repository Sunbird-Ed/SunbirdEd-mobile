import {
  BuildParamService,
  ContainerService,
  PermissionService,
  SharedPreferences,
  TabsPage,
} from 'sunbird';
import {ProfileSettingsPage} from './../pages/profile-settings/profile-settings';
import {Component, Inject, NgZone, ViewChild} from '@angular/core';
import {App, Events, Nav, Platform, PopoverController, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs, LOGIN_TEACHER_TABS} from './module.service';
import {LanguageSettingsPage} from '../pages/language-settings/language-settings';
import {ImageLoaderConfig} from 'ionic-image-loader';
import {TranslateService} from '@ngx-translate/core';
import {SearchPage} from '@app/pages/search';
import {CollectionDetailsPage} from '../pages/collection-details/collection-details';
import {ContentDetailsPage} from '../pages/content-details/content-details';
import {generateInteractTelemetry} from './telemetryutil';
import {ContentType, EventTopics, GenericAppConfig, MimeType, PreferenceKey, ProfileConstants} from './app.constant';
import {EnrolledCourseDetailsPage} from '@app/pages/enrolled-course-details';
import {FormAndFrameworkUtilService} from '@app/pages/profile';
import {AppGlobalService, CommonUtilService, TelemetryGeneratorService} from '@app/service';
import {UserTypeSelectionPage} from '@app/pages/user-type-selection';
import {CategoriesEditPage} from '@app/pages/categories-edit/categories-edit';
import {TncUpdateHandlerService} from '@app/service/handlers/tnc-update-handler.service';
import {AuthService,
        OauthSession,
        ProfileService,
        ProfileType,
        Environment,
        InteractSubtype,
        InteractType,
        PageId,
      } from "sunbird-sdk";

const KEY_SUNBIRD_SUPPORT_FILE_PATH = 'sunbird_support_file_path';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav;
  rootPage: any;
  public counter = 0;

  readonly permissionList = [
    'android.permission.CAMERA',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.RECORD_AUDIO'
  ];

  constructor(
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('AUTH_SERVICE') private authService: AuthService,
    private preferences: SharedPreferences,
    private platform: Platform,
    private statusBar: StatusBar,
    private toastCtrl: ToastController,
    private containerService: ContainerService,
    private permission: PermissionService,
    private imageLoaderConfig: ImageLoaderConfig,
    private app: App,
    private translate: TranslateService,
    private events: Events,
    private zone: NgZone,
    private preference: SharedPreferences,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private event: Events,
    private container: ContainerService,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private buildParamService: BuildParamService,
    private popoverCtrl: PopoverController,
    private tncUpdateHandlerService: TncUpdateHandlerService
  ) {
    platform.ready().then(async () => {
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setMaximumCacheSize(100 * 1024 * 1024);

      this.subscribeEvents();

      await this.registerDeeplinks();
      await this.openrapDiscovery();
      await this.saveDefaultSyncSetting();
      await this.showAppWalkThroughScreen();
      await this.checkAppUpdateAvailable();
      await this.makeEntriesInSupportFolder();
      await this.getSelectedLanguage();
      await this.checkForTncUpdate();
      await this.navigateToAppropriatePage();

      (<any>window).splashscreen.hide();
      window['thisRef'] = this;
      statusBar.styleDefault();
      this.handleBackButton();
    });
  }

  private static getPageIdForPageName(pageName: string): string {
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

  handleBackButton() {
    const self = this;
    this.platform.registerBackButtonAction(() => {

      const navObj = self.app.getActiveNavs()[0];
      const currentPage = navObj.getActive().name;

      if (navObj.canGoBack()) {
        navObj.pop();
      } else {
        if (self.counter === 0) {
          self.counter++;
          this.commonUtilService.showToast('BACK_TO_EXIT');
          this.telemetryGeneratorService.generateBackClickedTelemetry(MyApp.getPageIdForPageName(currentPage), Environment.HOME, false);
          setTimeout(() => {
            self.counter = 0;
          }, 1500);
        } else {
          this.telemetryGeneratorService.generateBackClickedTelemetry(MyApp.getPageIdForPageName(currentPage), Environment.HOME, false);
          self.platform.exitApp();
          this.telemetryGeneratorService.generateEndTelemetry('app', '', '', Environment.HOME);

        }
      }
    });
  }

  subscribeEvents() {
    this.events.subscribe('tab.change', (data) => {
      this.zone.run(() => {
        this.generateInteractEvent(data);
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
        if (response && response.data.action && response.data.action === 'logout') {
          this.authService.getSession().toPromise().then((session: OauthSession) => {
            if (session) {
              this.authService.resignSession().subscribe();
              (<any>window).splashscreen.clearPrefs();
            }
            this.profileService.getActiveSessionProfile().toPromise()
              .then((currentUser: any) => {

                if (currentUser.profileType === ProfileType.STUDENT) {
                  initTabs(this.container, GUEST_STUDENT_TABS);
                  this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT);
                } else {
                  initTabs(this.container, GUEST_TEACHER_TABS);
                  this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
                }

                this.event.publish('refresh:profile');
                this.event.publish(AppGlobalService.USER_INFO_UPDATED);

                this.app.getRootNav().setRoot(TabsPage);

              }).catch(() => {
            });

          });
        } else if (response && action && action.actionType === 'connected') {
        } else if (response && action && action.actionType === 'disconnected') {
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

  private async checkForTncUpdate() {
    await this.tncUpdateHandlerService.checkForTncUpdate();
  }

  getProfileSettingConfig(hideBackButton = false) {
    this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE)
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

  private async navigateToAppropriatePage() {
    const session = await this.authService.getSession().toPromise();

    if (!session) {
      this.preference.getString(PreferenceKey.SELECTED_USER_TYPE)
        .then(async (profileType: ProfileType | undefined) => {
          if (!profileType) {
            this.appGlobalService.isProfileSettingsCompleted = false;
            this.rootPage = LanguageSettingsPage;
            return;
          }

          switch (profileType.toUpperCase()) {
            case ProfileType.TEACHER: {
              await this.preference.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
              initTabs(this.containerService, GUEST_TEACHER_TABS);
              break;
            }
            case ProfileType.STUDENT: {
              await this.preference.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT);
              initTabs(this.containerService, GUEST_STUDENT_TABS);
              break;
            }
          }

          const display_cat_page: string = await this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE);

          if (display_cat_page === 'false') {
            await this.nav.setRoot(TabsPage);
          } else {
            const profile = await this.profileService.getActiveSessionProfile().toPromise();
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
                if (await this.preference.getString(PreferenceKey.IS_ONBOARDING_COMPLETED) === 'true') {
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
      this.profileService.getActiveSessionProfile().toPromise()
        .then(async (profile: any) => {
          if (profile
            && profile.syllabus && profile.syllabus[0]
            && profile.board && profile.board.length
            && profile.grade && profile.grade.length
            && profile.medium && profile.medium.length) {

            initTabs(this.containerService, LOGIN_TEACHER_TABS);

            if (await this.preference.getString('SHOW_WELCOME_TOAST') === 'true') {
              this.preference.putString('SHOW_WELCOME_TOAST', 'false');

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
    const selectedLanguage = await this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE);
    if (selectedLanguage) {
      await this.translate.use(selectedLanguage).toPromise();
    }
  }

  private async makeEntriesInSupportFolder() {
    await this.permission.requestPermission(this.permissionList);
    await this.permission.hasPermission(this.permissionList);
    await this.makeEntryInSupportFolder();
  }

  private async makeEntryInSupportFolder() {
    return new Promise((resolve => {
      (<any>window).supportfile.makeEntryInSunbirdSupportFile((result) => {
        this.preference.putString(KEY_SUNBIRD_SUPPORT_FILE_PATH, JSON.parse(result));
        resolve();
      }, () => {
      });
    }));
  }

  private async saveDefaultSyncSetting() {
    return this.preference.getString('sync_config')
      .then(val => {
        if (val === undefined || val === '' || val === null) {
          this.preference.putString('sync_config', 'ALWAYS_ON');
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
    return this.preference.getString('show_app_walkthrough_screen')
      .then(value => {
        const val = (value === '') ? 'true' : 'false';
        this.preference.putString('show_app_walkthrough_screen', val);
      });
  }

  // TODO: this method will be used to communicate with the openrap device
  private async openrapDiscovery() {
    if (this.appGlobalService.OPEN_RAPDISCOVERY_ENABLED) {
      (<any>window).openrap.startDiscovery(
        () => {
        }, () => {
        }
      );
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
      });
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
