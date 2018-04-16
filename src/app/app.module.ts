import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Events, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { HTTP } from "@ionic-native/http";
import { File } from "@ionic-native/file";

import { PluginModules } from './module.service';
import { TelemetryService, EventService, FrameworkModule, ContainerService, TabsPage } from 'sunbird';
import { Globalization } from '@ionic-native/globalization';
import { RolePage } from '../pages/userrole/role';
import { OnboardingPage } from '../pages/onboarding/onboarding';
import { LanguageSettingsPage } from '../pages/language-settings/language-settings';
import { GuestEditProfilePage } from '../pages/guest-edit.profile/guest-edit.profile';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicImageLoader, ImageLoader, ImageLoaderConfig } from "ionic-image-loader";
import { FilePath } from '@ionic-native/file-path';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
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
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicImageLoader.forRoot(),
    ...PluginModules
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    HTTP,
    File,
    Globalization,
    UniqueDeviceID,
    AppVersion,
    SocialSharing,
    ImageLoader,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

  constructor(translate: TranslateService, private eventService: EventService, private events: Events, private imageConfig: ImageLoaderConfig) {
    translate.setDefaultLang('en');

    this.registerForEvent();
    this.imageConfig.enableDebugMode();
    this.imageConfig.maxCacheSize = 2 * 1024 * 1024;
  }


  registerForEvent() {
    this.eventService.register((response) => {
      // console.log("Event : " + response);
      this.events.publish('genie.event', response);
    }, (error) => {
      // console.log("Event : " + error);
    });
  }
}


export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
