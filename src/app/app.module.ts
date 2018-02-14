import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContainerService } from '../core/container/container.services';
import { PluginService } from './plugins.service';
import { TelemetryService } from '../core/services/telemetry/telemetry.service';
import { CoreModule, TabsPage } from "../core";
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { OnboardingPage } from '../plugins/onboarding/onboarding';

const pluginModules = PluginService.getAllPluginModules();

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
    IonicModule.forRoot(MyApp),
    ...pluginModules
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
    PluginService,
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
