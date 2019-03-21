import {APP_INITIALIZER, ErrorHandler, NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Events, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PluginModules} from './module.service';
import {AppVersion} from '@ionic-native/app-version';
import {SocialSharing} from '@ionic-native/social-sharing';
import {ImageLoader, ImageLoaderConfig, IonicImageLoader} from 'ionic-image-loader';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {FileOpener} from '@ionic-native/file-opener';
import {
  AppGlobalService,
  CommonUtilService,
  CourseUtilService,
  TelemetryGeneratorService,
  UtilityService
} from '@app/service';
import {UpgradePopover} from '@app/pages/upgrade';
import {QRScannerResultHandler} from '../../src/pages/qrscanner';
import {BroadcastComponent} from '@app/component/broadcast/broadcast';
import {LogoutHandlerService} from '@app/service/handlers/logout-handler.service';
import {TncUpdateHandlerService} from '@app/service/handlers/tnc-update-handler.service';
import {SunbirdSdk} from 'sunbird-sdk';
import {UniqueDeviceID} from '@ionic-native/unique-device-id';
import {Device} from '@ionic-native/device';
import {TabsPage} from '@app/pages/tabs/tabs';
import {AndroidPermissionsService} from "@app/service/android-permissions/android-permissions.service";

export const translateHttpLoaderFactory = (httpClient: HttpClient) => {
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
  }, {
    provide: 'TELEMETRY_SERVICE',
    useFactory: () => SunbirdSdk.instance.telemetryService
  }, {
    provide: 'CONTENT_SERVICE',
    useFactory: () => SunbirdSdk.instance.contentService
  }, {
    provide: 'CONTENT_FEEDBACK_SERVICE',
    useFactory: () => SunbirdSdk.instance.contentFeedbackService
  }, {
    provide: 'SUMMARIZER_SERVICE',
    useFactory: () => SunbirdSdk.instance.summarizerService
  }, {
    provide: 'EVENTS_BUS_SERVICE',
    useFactory: () => SunbirdSdk.instance.eventsBusService
  }, {
    provide: 'DEVICE_INFO',
    useFactory: () => SunbirdSdk.instance.deviceInfo
  }, {
    provide: 'PLAYER_SERVICE',
    useFactory: () => SunbirdSdk.instance.playerService
  }
];
};

export const sunbirdSdkFactory =
  () => {
    return async () => {
      const buildConfigValues = JSON.parse(await new Promise<string>((resolve, reject) => {
        buildconfigreader.getBuildConfigValues('org.sunbird.app', (v) => {
          resolve(v);
        }, (err) => {
          reject(err);
        });
      }));

      await SunbirdSdk.instance.init({
        fileConfig: {
          debugMode: false
        },
        apiConfig: {
          debugMode: false,
          host: buildConfigValues['BASE_URL'],
          baseUrl: buildConfigValues['BASE_URL'] + '/api',
          user_authentication: {
            redirectUrl: buildConfigValues['OAUTH_REDIRECT_URL'],
            authUrl: '/auth/realms/sunbird/protocol/openid-connect',
          },
          api_authentication: {
            mobileAppKey: buildConfigValues['MOBILE_APP_KEY'],
            mobileAppSecret: buildConfigValues['MOBILE_APP_SECRET'],
            mobileAppConsumer: buildConfigValues['MOBILE_APP_CONSUMER'],
            channelId: buildConfigValues['CHANNEL_ID'],
            producerId: buildConfigValues['PRODUCER_ID'],
            producerUniqueId: 'sunbird.app'
          },
          cached_requests: {
            timeToLive: 30 * 60 * 60 * 1000
          }
        },
         eventsBusConfig: {
          debugMode: true
        },
        dbConfig: {
          debugMode: false,
          dbName: 'GenieServices.db'
        },
        contentServiceConfig: {
          apiPath: '/api/content/v1',
          searchApiPath: '/api/composite/v1'
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
          frameworkConfigDirPath: '/data/framework',
          channelConfigDirPath: '/data/channel',
          searchOrganizationApiPath: '/api/org/v1',
          systemSettingsDefaultChannelIdKey: 'custodianOrgId'
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
          maxCompatibilityLevel: 4,
          minCompatibilityLevel: 1
        },
        systemSettingsConfig: {
          systemSettingsApiPath: '/api/data/v1',
          systemSettingsDirPath: '/data/system',
        },
        telemetryConfig: {
          deviceRegisterApiPath: '',
          telemetryApiPath: '/api/data/v1',
          deviceRegisterHost: 'https://api.diksha.gov.in/',
          telemetrySyncBandwidth: 200,
          telemetrySyncThreshold: 300
        },
        sharedPreferencesConfig: {
          debugMode: false
        },
        playerConfig: {
          showEndPage: false,
          splash: {
            webLink: '',
            text: '',
            icon: '',
            bgImage: ''
          },
          overlay: {
            enableUserSwitcher: false,
            showUser: false
          }
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (translateHttpLoaderFactory),
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
    UniqueDeviceID,
    UtilityService,
    Device,
    AndroidPermissionsService,
    ...sunbirdSdkServicesProvidersFactory(),
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: APP_INITIALIZER, useFactory: sunbirdSdkFactory, deps: [], multi: true}
  ],
  exports: [
    BroadcastComponent
  ]
})
export class AppModule {

  constructor(
    private translate: TranslateService,
    private events: Events,
    private imageConfig: ImageLoaderConfig) {

    this.setDefaultLanguage();

    this.registerForEvent();

    this.configureImageLoader();
  }

  private configureImageLoader() {
    this.imageConfig.enableDebugMode();
    this.imageConfig.maxCacheSize = 2 * 1024 * 1024;
  }

  private setDefaultLanguage() {
    this.translate.setDefaultLang('en');
  }

  // TODO
  private registerForEvent() {
    // this.eventService.register((response) => {
    //   const res = JSON.parse(response);
    //   if (res && res.type === 'genericEvent') {
    //     this.events.publish('generic.event', response);
    //   } else {
    //     this.events.publish('genie.event', response);
    //   }
    // }, () => {
    // });
  }
}
