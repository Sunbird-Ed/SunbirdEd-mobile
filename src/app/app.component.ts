import { Component } from '@angular/core';
import { Platform, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PluginService } from '../core';
import { OnboardingPage } from '../plugins/onboarding/onboarding';

declare var chcp: any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = OnboardingPage;

  constructor(platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen,
    private pluginLoader: PluginService,  private modalCtrl: ModalController,
    private alertCtrl: AlertController) {

    platform.ready().then(() => {
      this.pluginLoader.loadAllPlugins();
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
         {text: 'No'},
         {text: 'Yes',
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
