import {
  AuthService,
  BuildParamService,
  ContainerService,
  Environment,
  InteractSubtype,
  InteractType,
  PageId,
  PermissionService,
  ProfileService,
  ProfileType,
  SharedPreferences,
  TabsPage,
  TelemetryService,
  UserProfileService
} from 'sunbird';
import { ProfileSettingsPage } from './../pages/profile-settings/profile-settings';
import { Component, NgZone, ViewChild } from '@angular/core';
import { App, Events, Nav, Platform, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, initTabs, LOGIN_TEACHER_TABS } from './module.service';
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { TranslateService } from '@ngx-translate/core';
import { SearchPage } from '../pages/search/search';
import { CollectionDetailsPage } from '../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../pages/content-details/content-details';
import { generateInteractTelemetry } from './telemetryutil';
import { ContentType, EventTopics, GenericAppConfig, MimeType, PreferenceKey, ProfileConstants } from './app.constant';
import { EnrolledCourseDetailsPage } from '../pages/enrolled-course-details/enrolled-course-details';
import { FormAndFrameworkUtilService } from '../pages/profile/formandframeworkutil.service';
import { AppGlobalService } from '../service/app-global.service';
import { UserTypeSelectionPage } from '../pages/user-type-selection/user-type-selection';
import { CommonUtilService } from '../service/common-util.service';
import { TelemetryGeneratorService } from '../service/telemetry-generator.service';
import { BroadcastComponent } from '../component/broadcast/broadcast';
import { CategoriesEditPage } from '@app/pages/categories-edit/categories-edit';
import { TncUpdateHandlerService } from '@app/service/handlers/tnc-update-handler.service';

declare var chcp: any;

const KEY_SUNBIRD_SUPPORT_FILE_PATH = 'sunbird_support_file_path';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;
  public counter = 0;

  readonly permissionList = ['android.permission.CAMERA',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.RECORD_AUDIO'];

  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private containerService: ContainerService,
    private permission: PermissionService,
    private imageLoaderConfig: ImageLoaderConfig,
    public app: App,
    public translate: TranslateService,
    private events: Events,
    private zone: NgZone,
    private telemetryService: TelemetryService,
    private preference: SharedPreferences,
    private userProfileService: UserProfileService,
    private formAndFrameworkUtilService: FormAndFrameworkUtilService,
    private event: Events,
    private profileService: ProfileService,
    private preferences: SharedPreferences,
    private container: ContainerService,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private buildParamService: BuildParamService,
    public popoverCtrl: PopoverController,
    private tncUpdateHandlerService: TncUpdateHandlerService
  ) {

    const that = this;

    platform.ready().then(async () => {
      this.registerDeeplinks();
      this.openrapDiscovery();
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setMaximumCacheSize(100 * 1024 * 1024);
      this.subscribeEvents();
      this.saveDefaultSyncSetting();
      this.showAppWalkThroughScreen();

      // check if any new app version is available
      this.checkForUpgrade();

      this.permission.requestPermission(this.permissionList).then(() => {
        this.makeEntryInSupportFolder();
      }).catch(() => {
      });
      this.permission.hasPermission(this.permissionList).then(() => {
        this.makeEntryInSupportFolder();
      }).catch(() => {
      });

      this.preference.getString(PreferenceKey.SELECTED_LANGUAGE_CODE)
        .then(val => {
          if (val && val.length) {
            this.translate.use(val);
          }
        });

      await this.tncUpdateHandlerService.checkForTncUpdate();

      that.authService.getSessionData((session) => {
        if (session === null || session === 'null') {
          this.preference.getString(PreferenceKey.SELECTED_USER_TYPE)
            .then(val => {
              if (val) {
                if (val === ProfileType.TEACHER) {
                  initTabs(this.containerService, GUEST_TEACHER_TABS);
                } else if (val === ProfileType.STUDENT) {
                  initTabs(this.containerService, GUEST_STUDENT_TABS);
                } else if (val === 'student') {
                  // This additional checks are added because previous users had user type stored
                  // lower case and app would show blank screen due to mismatch in types
                  this.preference.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT);
                  initTabs(this.containerService, GUEST_STUDENT_TABS);
                } else if (val === 'teacher') {
                  this.preference.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER);
                  initTabs(this.containerService, GUEST_TEACHER_TABS);
                }
                this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE)
                  .then(response => {
                    const display_cat_page = response;
                    this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_SCAN_PAGE)
                      .then(scanResponse => {
                        const disp_profile_page = response;
                        if (display_cat_page === 'false' && disp_profile_page === 'false') {
                          this.nav.setRoot(TabsPage);
                        } else {
                          this.profileService.getCurrentUser().then((profile: any) => {
                            profile = JSON.parse(profile);
                            if (profile
                              && profile.syllabus && profile.syllabus[0]
                              && profile.board && profile.board.length
                              && profile.grade && profile.grade.length
                              && profile.medium && profile.medium.length) {
                              this.appGlobalService.isProfileSettingsCompleted = true;
                              this.nav.setRoot(TabsPage);
                            } else {
                              this.appGlobalService.isProfileSettingsCompleted = false;
                              this.preference.getString(PreferenceKey.IS_ONBOARDING_COMPLETED)
                                .then((result) => {
                                  if (result === 'true') {
                                    this.getProfileSettingConfig(true);
                                  } else {
                                    this.nav.insertPages(0, [{ page: LanguageSettingsPage }, { page: UserTypeSelectionPage }]);
                                  }
                                })
                                .catch(error => {
                                  this.getProfileSettingConfig();
                                });
                            }
                          }).catch(error => { });
                        }
                      });
                  });
                // Check if User has filled all the required information of the on boarding preferences
              } else {
                this.appGlobalService.isProfileSettingsCompleted = false;
                that.rootPage = LanguageSettingsPage;
              }
            });
        } else {
          this.profileService.getCurrentUser().then((profile: any) => {
            profile = JSON.parse(profile);
            if (profile
              && profile.syllabus && profile.syllabus[0]
              && profile.board && profile.board.length
              && profile.grade && profile.grade.length
              && profile.medium && profile.medium.length) {
              initTabs(that.containerService, LOGIN_TEACHER_TABS);
              const sessionObj = JSON.parse(session);
              this.preference.getString('SHOW_WELCOME_TOAST')
                .then(success => {
                  if (success === 'true') {
                    that.preference.putString('SHOW_WELCOME_TOAST', 'false');
                    const req = {
                      userId: sessionObj[ProfileConstants.USER_TOKEN],
                      requiredFields: ProfileConstants.REQUIRED_FIELDS,
                      refreshUserProfileDetails: true
                    };
                    that.userProfileService.getUserProfileDetails(req, res => {
                      setTimeout(() => {
                        this.commonUtilService
                          .showToast(this.commonUtilService.translateMessage('WELCOME_BACK', JSON.parse(res).firstName));
                      }, 2500);
                    }, () => {
                    });
                  }
                });

              that.rootPage = TabsPage;
            } else {
              const sessionObj = JSON.parse(session);
              const req = {
                userId: sessionObj[ProfileConstants.USER_TOKEN],
                requiredFields: ProfileConstants.REQUIRED_FIELDS,
                refreshUserProfileDetails: true
              };
              that.userProfileService.getUserProfileDetails(req, res => {
                const r = JSON.parse(res);
                that.formAndFrameworkUtilService.updateLoggedInUser(r, profile)
                  .then((value) => {
                    if (value['status']) {
                      this.nav.setRoot(TabsPage);
                      initTabs(that.containerService, LOGIN_TEACHER_TABS);
                      // that.rootPage = TabsPage;
                    } else {
                      that.nav.setRoot(CategoriesEditPage, { showOnlyMandatoryFields: true, profile: value['profile'] });
                    }
                  }).catch(() => {
                    that.nav.setRoot(CategoriesEditPage, { showOnlyMandatoryFields: true });
                  });
              }, err => {
                console.log('err', err);
                that.nav.setRoot(CategoriesEditPage, { showOnlyMandatoryFields: true });
              });
            }
          });

        }

        (<any>window).splashscreen.hide();
      });


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      window['thisRef'] = this;
      // try {
      //   this.fetchUpdate();
      // } catch (error) {
      //   console.log(error);
      // }

      this.handleBackButton();
    });
  }

  /**
   * It will read profile settings configuration and navigates to appropriate page
   * @param hideBackButton To hide the navigation back button in the profile settings page
   */
  getProfileSettingConfig(hideBackButton = false) {
    this.buildParamService.getBuildConfigParam(GenericAppConfig.DISPLAY_ONBOARDING_CATEGORY_PAGE)
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

  private checkForUpgrade() {
    this.formAndFrameworkUtilService.checkNewAppVersion()
      .then(result => {
        if (result !== undefined) {
          console.log('Force Optional Upgrade - ' + JSON.stringify(result));
          setTimeout(() => {
            this.events.publish('force_optional_upgrade', { upgrade: result });
          }, 5000);
        }
      })
      .catch(error => {
        console.log('Error - ' + error);
      });
  }

  makeEntryInSupportFolder() {
    (<any>window).supportfile.makeEntryInSunbirdSupportFile((result) => {
      console.log('Result - ' + JSON.parse(result));
      this.preference.putString(KEY_SUNBIRD_SUPPORT_FILE_PATH, JSON.parse(result));
    }, (error) => {
      console.log('Error - ' + error);
    });
  }

  saveDefaultSyncSetting() {
    this.preference.getString('sync_config')
      .then(val => {
        if (val === undefined || val === '' || val === null) {
          this.preference.putString('sync_config', 'ALWAYS_ON');
        }
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

  fetchUpdate() {
    const options = {
      'config-file': 'http://172.16.0.23:3000/updates/chcp.json'
    };
    chcp.fetchUpdate(this.updateCallback, options);
  }
  updateCallback(error) {
    if (error) {
      console.error(error);
    } else {
      console.log('Update is loaded...');
      const confirm = window['thisRef'].alertCtrl.create({
        title: 'Application Update',
        message: 'Update available, do you want to apply it?',
        buttons: [
          { text: 'No' },
          {
            text: 'Yes',
            handler: () => {
              chcp.installUpdate(errorResponse => {
                if (errorResponse) {
                  console.error(errorResponse);
                  window['thisRef'].alertCtrl.create({
                    title: 'Update Download',
                    subTitle: `Error ${errorResponse.code}`,
                    buttons: ['OK']
                  }).present();
                } else {
                  console.log('Update installed...');
                }
              });
            }
          }
        ]
      });
      confirm.present();
    }
  }

  /**
   * Ionic life cycle hook
   */
  ionViewWillLeave(): void {
    this.events.unsubscribe('tab.change');
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
        } catch (Error) { }
        const values = new Map();
        values['openrapInfo'] = action;
        if (response && response.data.action && response.data.action === 'logout') {
          this.authService.getSessionData((session) => {
            if (session) {
              this.authService.endSession();
              (<any>window).splashscreen.clearPrefs();
            }
            this.profileService.getCurrentUser().then((currentUser: any) => {
              const guestProfile = JSON.parse(currentUser);

              if (guestProfile.profileType === ProfileType.STUDENT) {
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

  generateInteractEvent(pageid: string) {
    this.telemetryService.interact(generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.TAB_CLICKED,
      Environment.HOME,
      pageid.toLowerCase(),
      null,
      undefined,
      undefined
    ));
  }

  registerDeeplinks() {
    (<any>window).splashscreen.onDeepLink(deepLinkResponse => {

      console.log('Deeplink : ' + deepLinkResponse);

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
          this.showContentDetails(response.result);
        }
      }, 300);
    });
  }

  showContentDetails(content) {
    if (content.contentData.contentType === ContentType.COURSE) {
      console.log('Calling course details page');
      this.nav.push(EnrolledCourseDetailsPage, {
        content: content
      });
    } else if (content.mimeType === MimeType.COLLECTION) {
      console.log('Calling collection details page');
       this.nav.push(CollectionDetailsPage, {
        content: content
      });
    } else {
      console.log('Calling content details page');
      this.nav.push(ContentDetailsPage, {
        content: content
      });
    }
  }

  showAppWalkThroughScreen() {
    this.preference.getString('show_app_walkthrough_screen')
      .then(value => {
        const val = (value === '') ? 'true' : 'false';
        this.preference.putString('show_app_walkthrough_screen', val);
      });
    console.log('open rap discovery enabled', this.appGlobalService.OPEN_RAPDISCOVERY_ENABLED);
  }

  showGreetingPopup() {
    const popover = this.popoverCtrl.create(BroadcastComponent,
      {
        'greetings': 'Diwali Greetings',
        'imageurl': 'https://t3.ftcdn.net/jpg/01/71/29/20/240_F_171292090_liVMi9liOzZaW0gjsmCIZzwVr2Qw7g4i.jpg',
        'customButton': 'custom button',
        'greetingText': 'this diwali may enlighten your dreams'
      },
      { cssClass: 'broadcast-popover' }
    );
    popover.present();
  }

  // TODO: this method will be used to communicate with the openrap device
  openrapDiscovery() {
    if (this.appGlobalService.OPEN_RAPDISCOVERY_ENABLED) {
      console.log('openrap called', this.appGlobalService.OPEN_RAPDISCOVERY_ENABLED);
      (<any>window).openrap.startDiscovery(
        (success) => {
          console.log(success);
        }, (error) => {
          console.log(error);
        }
      );
    }
  }
}
