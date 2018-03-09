import { Component, ViewChild } from '@angular/core';
import { Platform, ModalController, AlertController, NavController, ViewController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage, AuthService } from "sunbird";
import { PluginService } from './plugins.service';
import { Storage } from "@ionic/storage";
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';

declare var chcp: any;

const KEY_USER_ONBOARDED = "user_onboarded";
const KEY_USER_LOGIN_MODE = "user_login_mode";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;
  // rootPage:any = OnboardingPage;
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen,
    private pluginLoader: PluginService, private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private storage: Storage) {

    let that = this;

    platform.ready().then(() => {

      // that.authService.isLoggedIn(() => {
      //   that.pluginLoader.initUserTabs();
      //   that.rootPage = TabsPage;
      // }, m => {
      //   //check if the user has already onboarded, then take him to the home screen
      //   that.storage.get(KEY_USER_ONBOARDED)
      //     .then(val => {
      //       if (val) {
      //         that.checkLoginType()
      //       }else {
      //         that.rootPage = LanguageSettingsPage;
      //       }
      //     });
      // });

      that.pluginLoader.initUserTabs();
      that.rootPage = TabsPage;

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      window["thisRef"] = this;
      try {
        this.fetchUpdate();
      } catch (error) {
        console.log(error);

      }
    });
  }

  private checkLoginType() {
    this.storage.get(KEY_USER_LOGIN_MODE)
      .then(val => {
        if (val === "signin") {
          //take user to home page
          this.takeToHomeAsIdentifiedUser()
        } else if (val === "guest") {
          //take user to home page
          this.takeToHomeAsGuest()
        }
      })
  }

  takeToHomeAsIdentifiedUser() {
    this.nav.push(TabsPage, { loginMode: 'signin' });
  }

  takeToHomeAsGuest() {
    this.pluginLoader.initGuestTabs();
    this.nav.push(TabsPage, { loginMode: 'guest' });
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
}
