import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, ModalController, AlertController, NavController, ViewController, Nav, App, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { TabsPage, AuthService, ContainerService, PermissionService, Interact, InteractType, InteractSubtype, Environment, TelemetryService, SharedPreferences } from "sunbird";
import { initGuestTabs, initUserTabs } from './module.service';
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { platform } from 'os';
import { TranslateService } from '@ngx-translate/core';
import { SearchPage } from '../pages/search/search';
import { CourseDetailPage } from '../pages/course-detail/course-detail';
import { CollectionDetailsPage } from '../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../pages/content-details/content-details';
import { generateEndEvent } from './telemetryutil';

declare var chcp: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  // rootPage:any = OnboardingPage;
  rootPage: any;
  public counter = 0;

  readonly permissionList = ["android.permission.CAMERA",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.RECORD_AUDIO"];

  constructor(private platform: Platform, statusBar: StatusBar,
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
    private preference: SharedPreferences) {

    let that = this;


    platform.ready().then(() => {
      this.registerDeeplinks();

      permission.requestPermission(this.permissionList, (response) => {

      }, (error) => {

      })

      this.preference.getString('selected_language_code', (val: string) => {
        if (val && val.length) {
          this.translate.use(val);
        }
      });

      that.authService.getSessionData((session) => {
        if (session == "null") {
          this.preference.getString('selected_user_type', (val) => {

            initGuestTabs(this.containerService);

            that.rootPage = (val != "") ? this.nav.setRoot(TabsPage, { loginMode: 'guest' }) : this.nav.setRoot(LanguageSettingsPage);
          })
        } else {
          initUserTabs(that.containerService);
          that.rootPage = TabsPage;
        }
      });

      // initUserTabs(that.containerService);
      // that.rootPage = TabsPage;

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      (<any>window).splashscreen.hide();


      window["thisRef"] = this;
      try {
        this.fetchUpdate();
      } catch (error) {
        console.log(error);
      }

      this.handleBackButton();
    });

    this.imageLoaderConfig.enableDebugMode();
    this.imageLoaderConfig.setMaximumCacheSize(100 * 1024 * 1024);
    this.subscribeEvents();
    this.saveDefaultSyncSetting();
  }

  saveDefaultSyncSetting(){
    this.preference.getString("sync_config", val => {
      if (val === undefined || val === "" || val === null) {
        this.preference.putString("sync_config","ALWAYS_ON");
      } 
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
          this.telemetryService.end(generateEndEvent("app", "", "", "", "", ""));
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
  translateMessage(messageConst: string): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }

  // private checkLoginType() {
  //   this.storage.get(KEY_USER_LOGIN_MODE)
  //     .then(val => {
  //       if (val === "signin") {
  //         //take user to home page
  //         this.takeToHomeAsIdentifiedUser()
  //       } else if (val === "guest") {
  //         //take user to home page
  //         this.takeToHomeAsGuest()
  //       }
  //     })
  // }

  takeToHomeAsIdentifiedUser() {
    this.nav.setRoot(TabsPage, { loginMode: 'signin' });
  }

  takeToHomeAsGuest() {
    initGuestTabs(this.containerService);
    this.nav.setRoot(TabsPage, { loginMode: 'guest' });
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
    let interact = new Interact();
    interact.type = InteractType.TOUCH;
    interact.subType = InteractSubtype.TAB_CLICKED;
    interact.pageId = pageid.toLowerCase();
    interact.id = pageid.toLowerCase();
    interact.env = Environment.HOME;
    this.telemetryService.interact(interact);
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
    if (content.contentType === 'Course') {
      console.log('Calling course details page');
      this.nav.push(CourseDetailPage, {
        content: content
      })
    } else if (content.mimeType === 'application/vnd.ekstep.content-collection') {
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
}
