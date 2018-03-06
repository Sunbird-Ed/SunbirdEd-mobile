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
import { TelemetryService, EventService, FrameworkModule, ContainerService, TabsPage } from 'sunbird';
import { Globalization } from '@ionic-native/globalization';
import { RolePage } from '../pages/userrole/role';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';
import { GuestEditProfilePage } from '../pages/guest-edit.profile/guest-edit.profile';

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
    LanguageSettingsPage,
    GuestEditProfilePage,
    RolePage,
    LanguageSettingsPage
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
