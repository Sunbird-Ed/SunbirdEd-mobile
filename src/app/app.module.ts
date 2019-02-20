import {ErrorHandler, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Events, IonicApp, IonicErrorHandler, IonicModule, Platform} from 'ionic-angular';
import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PluginModules} from './module.service';
import {EventService, FrameworkModule, TabsPage} from 'sunbird';
import {AppVersion} from '@ionic-native/app-version';
import {SocialSharing} from '@ionic-native/social-sharing';
import {ImageLoader, ImageLoaderConfig, IonicImageLoader} from 'ionic-image-loader';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';
import {FileOpener} from '@ionic-native/file-opener';
import {AppGlobalService} from '../service/app-global.service';
import {CourseUtilService} from '../service/course-util.service';
import {UpgradePopover} from '../pages/upgrade/upgrade-popover';
import {TelemetryGeneratorService} from '../service/telemetry-generator.service';
import {QRScannerResultHandler} from '../pages/qrscanner/qrscanresulthandler.service';
import {CommonUtilService} from '../service/common-util.service';
import {BroadcastComponent} from '../component/broadcast/broadcast';
import {LogoutHandlerService} from '@app/service/handlers/logout-handler.service';
import {TncUpdateHandlerService} from '@app/service/handlers/tnc-update-handler.service';
import {SunbirdSdk} from 'sunbird-sdk';

export const createTranslateLoader = (httpClient: HttpClient) => {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
};

export const sunbirdSdkServicesProvidersFactory: () => Provider[] = () => {
  return [{
    provide: 'SDK_CONFIG',
    useFactory: () => SunbirdSdk.instance.authService
  }, {
    provide: 'AUTH_SERVICE',
    useFactory: () => SunbirdSdk.instance.authService
  }, {
    provide: 'DB_SERVICE',
    useFactory: () => SunbirdSdk.instance.dbService
  }, {
    provide: 'COURSE_SERVICE',
    useFactory: () => SunbirdSdk.instance.courseService
  }, {
    provide: 'SHARED_PREFERENCES',
    useFactory: () => SunbirdSdk.instance.sharedPreferences
  }, {
    provide: 'API_SERVICE',
    useFactory: () => SunbirdSdk.instance.apiService
  }, {
    provide: 'PAGE_ASSEMBLE_SERVICE',
    useFactory: () => SunbirdSdk.instance.pageAssembleService
  }, {
    provide: 'GROUP_SERVICE',
    useFactory: () => SunbirdSdk.instance.groupService
  }, {
    provide: 'PROFILE_SERVICE',
    useFactory: () => SunbirdSdk.instance.profileService
  }, {
    provide: 'DB_SERVICE',
    useFactory: () => SunbirdSdk.instance.dbService
  }, {
    provide: 'FRAMEWORK_SERVICE',
    useFactory: () => SunbirdSdk.instance.frameworkService
  }, {
    provide: 'FRAMEWORK_UTIL_SERVICE',
    useFactory: () => SunbirdSdk.instance.frameworkUtilService
  }, {
    provide: 'PAGE_ASSEMBLE_SERVICE',
    useFactory: () => SunbirdSdk.instance.pageAssembleService
  }, {
    provide: 'FORM_SERVICE',
    useFactory: () => SunbirdSdk.instance.formService
  }, {
    provide: 'SYSTEM_SETTINGS_SERVICE',
    useFactory: () => SunbirdSdk.instance.systemSettingsService
  }];
};

export const sunbirdSdkFactory: (uniqueDeviceID: UniqueDeviceID, platform: Platform) => () => Promise<void> =
  (uniqueDeviceID: UniqueDeviceID, platform: Platform) => {
    return async () => {
      let deviceId = '';

      if (platform.is('core') || platform.is('mobileweb')) {
        deviceId = '4adce7fad56e02b7';
      } else {
        deviceId = await uniqueDeviceID.get();
      }

      await SunbirdSdk.instance.init({
        fileConfig: {
          debugMode: false
        },
        apiConfig: {
          debugMode: false,
          host: 'https://staging.ntp.net.in',
          baseUrl: 'https://staging.ntp.net.in/api',
          user_authentication: {
            redirectUrl: 'staging.diksha.app://mobile',
            authUrl: '/auth/realms/sunbird/protocol/openid-connect',
          },
          api_authentication: {
            mobileAppKey: 'sunbird-0.1',
            mobileAppSecret: 'eab91d5404434800b81996c1cd699d19',
            mobileAppConsumer: 'mobile_device',
            channelId: '505c7c48ac6dc1edc9b08f21db5a571d',
            producerId: 'staging.diksha.app',
            deviceId: deviceId,
            producerUniqueId: 'sunbird.app'
          },
          cached_requests: {
            timeToLive: 2000
          }
        },
        dbConfig: {
          debugMode: false,
          dbName: 'GenieServices.db'
        },
        contentServiceConfig: {
          apiPath: ''
        },
        courseServiceConfig: {
          apiPath: '/api/course/v1'
        },
        formServiceConfig: {
          apiPath: '/api/data/v1/form',
          formConfigDirPath: '/data/form',
        },
        frameworkServiceConfig: {
          channelApiPath: '/api/channel/v1',
          frameworkApiPath: '/api/framework/v1',
          searchOrganizationApiPath: '/api/org/v1',
          frameworkConfigDirPath: '/data/framework',
          channelConfigDirPath: '/data/channel'
        },
        profileServiceConfig: {
          profileApiPath: '/api/user/v1',
          tenantApiPath: '/v1/tenant',
          otpApiPath: '/api/otp/v1',
          searchLocationApiPath: '/api/data/v1'
        },
        pageServiceConfig: {
          apiPath: '/api/data/v1',
        },
        appConfig: {
          maxCompatibilityLevel: 100,
          minCompatibilityLevel: 0
        },
        systemSettingsConfig: {
          systemSettingsApiPath: '/api/data/v1',
          systemSettingsDirPath: '/data/system',
        }
      });
    };
};

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    UpgradePopover,
    BroadcastComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FrameworkModule,
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
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    TabsPage,
    UpgradePopover,
    BroadcastComponent
  ],
  providers: [
    StatusBar,
    AppVersion,
    SocialSharing,
    ImageLoader,
    FileTransferObject,
    FileOpener,
    FileTransfer,
    AppGlobalService,
    CourseUtilService,
    TelemetryGeneratorService,
    QRScannerResultHandler,
    CommonUtilService,
    LogoutHandlerService,
    TncUpdateHandlerService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ],
  exports: [
    BroadcastComponent
  ]
})
export class AppModule {

  constructor(
    translate: TranslateService,
    private eventService: EventService,
    private events: Events,
    private imageConfig: ImageLoaderConfig) {

    translate.setDefaultLang('en');

    this.registerForEvent();
    this.imageConfig.enableDebugMode();
    this.imageConfig.maxCacheSize = 2 * 1024 * 1024;
  }

  registerForEvent() {
    this.eventService.register((response) => {
      const res = JSON.parse(response);
      if (res && res.type === 'genericEvent') {
        this.events.publish('generic.event', response);
      } else {
        this.events.publish('genie.event', response);
      }

    }, (error) => {
      // console.log("Event : " + error);
    });
  }
}
