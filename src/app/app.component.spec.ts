import { PluginModules } from './module.service';
import { AppGlobalService } from './../service/app-global.service';
import { async, TestBed, inject } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {
  AuthService,
  ContainerService,
  PermissionService,
  TelemetryService,
} from "sunbird";
import { ImageLoaderConfig } from "ionic-image-loader";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from "@angular/common/http";

import { MyApp } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock,
  AuthServiceMock,
  ContainerServiceMock,
  PermissionServiceMock,
  ImageLoaderConfigMock,
  TranslateLoaderMock,
  TelemetryServiceMock,
  CourseUtilServiceMock,
  AppGlobalServiceMock

} from '../../test-config/mocks-ionic';
import { CourseUtilService } from '../service/course-util.service';


describe('MyApp Component', () => {
  let fixture;
  let component;
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        IonicModule.forRoot(MyApp),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        ...PluginModules
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: ContainerService, useClass: ContainerServiceMock },
        { provide: PermissionService, useClass: PermissionServiceMock },
        { provide: ImageLoaderConfig, useClass: ImageLoaderConfigMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: TelemetryService, useClass: TelemetryServiceMock },
        { provide: AppGlobalService, useClass: AppGlobalServiceMock },
        { provide: CourseUtilService, useClass: CourseUtilServiceMock }
      ],
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    inject([TranslateService], (service) => {
      translateService = service;
      translateService.use('en');
    })
  });

  it('should create a valid instance of MyApp', () => {
    expect(component instanceof MyApp).toBe(true);
  });
});