import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, ModalController, AlertController, Nav, App, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import {
  TabsPage, AuthService, ContainerService, PermissionService,
  Interact, InteractType, InteractSubtype, Environment, TelemetryService,
  SharedPreferences, ProfileType, UserProfileService, MigrationService, GroupService
} from "sunbird";
import { initTabs, GUEST_TEACHER_TABS, GUEST_STUDENT_TABS, LOGIN_TEACHER_TABS } from './module.service';
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { TranslateService } from '@ngx-translate/core';
import { SearchPage } from '../pages/search/search';
// import { CourseDetailPage } from '../pages/course-detail/course-detail';

import { CollectionDetailsPage } from '../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../pages/content-details/content-details';
import { generateEndTelemetry, generateInteractTelemetry } from './telemetryutil';
import { MimeType, ContentType } from './app.constant';
import { EnrolledCourseDetailsPage } from '../pages/enrolled-course-details/enrolled-course-details';
import { AppGlobalService } from '../service/app-global.service';
import { ProfileConstants } from './app.constant';
import { AppVersion } from '@ionic-native/app-version';

declare var chcp: any;

const KEY_SUNBIRD_SUPPORT_FILE_PATH = "sunbird_support_file_path";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  rootPage: any;
  public counter = 0;

  readonly permissionList = ["android.permission.CAMERA",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.RECORD_AUDIO"];

  options = {
    message: '',
    duration: 3000,
    position: 'bottom'
  };

  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
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
    private appGlobal: AppGlobalService,
    private userProfileService: UserProfileService,
    private migrationService: MigrationService,
    private appVersion: AppVersion,
  ) {

    let that = this;


    platform.ready().then(() => {
      this.registerDeeplinks();

      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setMaximumCacheSize(100 * 1024 * 1024);
      this.subscribeEvents();
      this.checkForMigration();
      this.saveDefaultSyncSetting();
      this.showAppWalkThroughScreen();

      permission.requestPermission(this.permissionList, (response) => {
        this.makeEntryInSupportFolder();
      }, (error) => {

      })

      this.preference.getString('selected_language_code', (val: string) => {
        if (val && val.length) {
          this.translate.use(val);
        }
      });

      that.authService.getSessionData((session) => {
        if (session === null || session === "null") {
          this.preference.getString('selected_user_type', (val) => {
            if (val !== undefined && val !== "") {
              if (val === ProfileType.TEACHER) {
                initTabs(this.containerService, GUEST_TEACHER_TABS);
              } else if (val === ProfileType.STUDENT) {
                initTabs(this.containerService, GUEST_STUDENT_TABS);
              } else if (val === "student") {   // This additional checks are added because previous users had user type stored lower case and app would show blank screen due to mismatch in types
                this.preference.putString('selected_user_type', ProfileType.STUDENT)
                initTabs(this.containerService, GUEST_STUDENT_TABS);
              } else if (val === "teacher") {
                this.preference.putString('selected_user_type', ProfileType.TEACHER)
                initTabs(this.containerService, GUEST_TEACHER_TABS);
              }

              that.rootPage = TabsPage;
            } else {
              that.rootPage = LanguageSettingsPage;
            }
          });
        } else {
          initTabs(that.containerService, LOGIN_TEACHER_TABS);
          let sessionObj = JSON.parse(session);
          this.preference.getString('SHOW_WELCOME_TOAST', (success) => {

            if (success === "true") {
              that.preference.putString('SHOW_WELCOME_TOAST', "false");
              let req = {
                userId: sessionObj[ProfileConstants.USER_TOKEN],
                requiredFields: ProfileConstants.REQUIRED_FIELDS,
                refreshUserProfileDetails: true
              };

              that.userProfileService.getUserProfileDetails(req, res => {

                setTimeout(() => {
                  that.getToast(this.translateMessage('WELCOME_BACK', JSON.parse(res).firstName)).present();
                }, 2500);
              }, (err: any) => {
              });
            }
          });

          that.rootPage = TabsPage;
        }

        (<any>window).splashscreen.hide();
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      window["thisRef"] = this;
      try {
        this.fetchUpdate();
      } catch (error) {
        console.log(error);
      }

      this.handleBackButton();
    });
  }

  makeEntryInSupportFolder() {
    (<any>window).supportfile.makeEntryInSunbirdSupportFile((result) => {
      console.log("Result - " + JSON.parse(result));
      this.preference.putString(KEY_SUNBIRD_SUPPORT_FILE_PATH, JSON.parse(result));
    }, (error) => {
      console.log("Error - " + error);
    });
  }

  saveDefaultSyncSetting() {
    this.preference.getString("sync_config", val => {
      if (val === undefined || val === "" || val === null) {
        this.preference.putString("sync_config", "ALWAYS_ON");
      }
    });
  }

  checkForMigration() {
    this.appVersion.getVersionCode()
      .then((versionCode) => {
        console.log("Current Version Code - " + versionCode);
        this.migrationService.migrateFromSQLToNoSQL();
      },
        (error) => {

        });
  }

  handleBackButton() {
    let self = this;
    this.platform.registerBackButtonAction(() => {

      let navObj = self.app.getActiveNavs()[0];
      if (navObj.canGoBack()) {
        navObj.pop();
      } else {
        if (self.counter == 0) {
          self.counter++;
          self.presentToast();
          setTimeout(() => { self.counter = 0 }, 1500)
        } else {
          this.telemetryService.end(generateEndTelemetry("app", "", "", "", "", "", undefined, undefined));
          self.platform.exitApp();
        }
      }
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.translateMessage("BACK_TO_EXIT"),
      duration: 3000
    });
    toast.present();
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst: string, field?: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst, { '%s': field }).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  fetchUpdate() {
    const options = {
      'config-file': 'http://172.16.0.23:3000/updates/chcp.json'
    };
    chcp.fetchUpdate(this.updateCallback, options);
  }
  updateCallback(error, data) {
    if (error) {
      console.error(error);
    } else {
      console.log('Update is loaded...');
      let confirm = window["thisRef"].alertCtrl.create({
        title: 'Application Update',
        message: 'Update available, do you want to apply it?',
        buttons: [
          { text: 'No' },
          {
            text: 'Yes',
            handler: () => {
              chcp.installUpdate(error => {
                if (error) {
                  console.error(error);
                  window["thisRef"].alertCtrl.create({
                    title: 'Update Download',
                    subTitle: `Error ${error.code}`,
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

      setTimeout(() => {
        let response = deepLinkResponse;

        if (response.type === "dialcode") {
          let results = response.code.split("/");
          let dialCode = results[results.length - 1];
          this.nav.push(SearchPage, { dialCode: dialCode });
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
      })
    } else if (content.mimeType === MimeType.COLLECTION) {
      console.log('Calling collection details page');
      this.nav.push(CollectionDetailsPage, {
        content: content
      })
    } else {
      console.log('Calling content details page');
      this.nav.push(ContentDetailsPage, {
        content: content
      })
    }
  }

  showAppWalkThroughScreen() {
    this.preference.getString('show_app_walkthrough_screen', (value) => {
      let val = (value === '') ? 'true' : 'false';
      this.preference.putString('show_app_walkthrough_screen', val);
    });
  }

  /**
   * It will returns Toast Object
   * @param {message} string - Message for the Toast to show
   * @returns {object} - toast Object
   */
  getToast(message: string = ''): any {
    this.options.message = message;
    if (message.length) return this.toastCtrl.create(this.options);
  }
}
