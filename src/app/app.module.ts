import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Events, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { HTTP } from "@ionic-native/http";

import { PluginService } from './plugins.service';
import { TelemetryService, EventService, FrameworkModule, ContainerService, TabsPage } from '../framework';
import { OnboardingPage } from '../plugins/core/onboarding/onboarding';
import { LanguageSettingsPage } from '../plugins/core/language-settings/language-settings';
import { Globalization } from '@ionic-native/globalization';
<<<<<<< HEAD
import {GuestEditProfilePage} from '../plugins/core/guest-edit.profile/guest-edit.profile'
=======
import { RolePage } from '../plugins/core/userrole/role';
>>>>>>> 92140282edc223bf5e51290ff7c4e8dc7009c1fb

const pluginModules = PluginService.getAllPluginModules();

@NgModule({
  declarations: [
    MyApp,
    RolePage,
    TabsPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FrameworkModule,
    IonicStorageModule.forRoot({
      name: "org.sunbird.framework.storage"
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    ...pluginModules
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OnboardingPage,
    TabsPage,
<<<<<<< HEAD
    LanguageSettingsPage,
    GuestEditProfilePage
=======
    RolePage,
    LanguageSettingsPage
>>>>>>> 92140282edc223bf5e51290ff7c4e8dc7009c1fb
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PluginService,
    HTTP,
    Globalization,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

  constructor(translate: TranslateService, private eventService: EventService, private events: Events) {
    translate.setDefaultLang('en');

    this.registerForEvent();
  }


  registerForEvent() {
    this.eventService.register((response) => {
      console.log("Event : " + response);
      this.events.publish('genie.event', response);
    }, (error) => {
      console.log("Event : " + error);
    });
  }
}


export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
