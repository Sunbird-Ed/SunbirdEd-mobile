import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TelemetryService } from '../service/TelemetryService';
import { CoreModule, PluginService, ContainerService, TabsPage, CameraService } from "../core";
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { OnboardingPage } from '../plugins/onboarding/onboarding';



@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OnboardingPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TelemetryService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
  }
}


export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
