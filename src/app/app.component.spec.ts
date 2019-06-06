import { ContentType, MimeType } from './app.constant';

import { App } from 'ionic-angular';
import { AppMock, ToastControllerMock, NavControllerBaseMock } from './../../test-config/mocks-ionic';
import { ComponentFixture } from '@angular/core/testing';
import { PluginModules } from './module.service';
import { AppGlobalService } from '../service/app-global.service';
import { async, TestBed, inject } from '@angular/core/testing';
import { IonicModule, Platform, ToastController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {
  AuthService, ContainerService, PermissionService, TelemetryService, SharedPreferences,
} from 'sunbird';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MyApp } from './app.component';
import {
  PlatformMock, StatusBarMock, SplashScreenMock, AuthServiceMock,
  ContainerServiceMock, PermissionServiceMock, ImageLoaderConfigMock, TranslateLoaderMock,
  TelemetryServiceMock, CourseUtilServiceMock, AppGlobalServiceMock, AppVersionMock,
  FormAndFrameworkUtilServiceMock
} from '../../test-config/mocks-ionic';
import { CourseUtilService } from '../service/course-util.service';
import { AppVersion } from '@ionic-native/app-version';
import { FormAndFrameworkUtilService } from '../pages/profile/formandframeworkutil.service';
import { } from 'jasmine';
import { Events } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '../pages/enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '../pages/collection-details/collection-details';
import { ContentDetailsPage } from '../pages/content-details/content-details';
import { TelemetryGeneratorService } from '../service/telemetry-generator.service';
import { CommonUtilService } from '../service/common-util.service';
import { NavControllerBase } from 'ionic-angular';

describe('MyApp Component', () => {
  let fixture: ComponentFixture<MyApp>;

  let comp: MyApp;
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
        CommonUtilService,
        TelemetryGeneratorService,
        // PermissionService,
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: ContainerService, useClass: ContainerServiceMock },
        { provide: PermissionService, useClass: PermissionServiceMock },
        { provide: ImageLoaderConfig, useClass: ImageLoaderConfigMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: TelemetryService, useClass: TelemetryServiceMock },
        { provide: AppGlobalService, useClass: AppGlobalServiceMock },
        { provide: CourseUtilService, useClass: CourseUtilServiceMock },
        { provide: AppVersion, useClass: AppVersionMock },
        { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
        // { provide: SharedPreferences, useClass: SharedPreferencesMock },
        SharedPreferences,
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: App, useClass: AppMock },
        { provide: NavControllerBase, useClass: NavControllerBaseMock }
      ],
    });
  }));

  beforeEach(() => {
    const permisssion: PermissionService = TestBed.get(PermissionService);
    spyOn(permisssion, 'requestPermission').and.callFake((permissionList, response, error) => {
      return response({});
    });
    spyOn(MyApp.prototype, 'registerDeeplinks');
    spyOn(MyApp.prototype, 'subscribeEvents');
    spyOn(MyApp.prototype, 'saveDefaultSyncSetting').and.callThrough();

    spyOn(MyApp.prototype, 'makeEntryInSupportFolder').and.callThrough();
    fixture = TestBed.createComponent(MyApp);
    comp = fixture.componentInstance;
  });

  beforeEach(() => {
    inject([TranslateService], (service) => {
      translateService = service;
      translateService.use('en');
    });
  });

  it('should create a valid instance of MyApp', () => {
    expect(comp instanceof MyApp).toBe(true);
  });
  it('counter defaults to: 0', () => {
    expect(comp.counter).toEqual(0);
  });

  it('permissionList defaults to: [\'android.permission.CAMERA\', \'android.permission.WRITE_EXTERNAL_STORAGE\','
    + ' \'android.permission.ACCESS_FINE_LOCATION\', \'android.permission.RECORD_AUDIO\']', () => {
      expect(comp.permissionList).toEqual(['android.permission.CAMERA', 'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.ACCESS_FINE_LOCATION', 'android.permission.RECORD_AUDIO']);
    });

  describe('constructor', () => {
    it('makes expected calls', (done) => {
      const platform: Platform = TestBed.get(Platform);
      const permisssion: PermissionService = TestBed.get(PermissionService);
      const permissionList = [
        'android.permission.CAMERA',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.RECORD_AUDIO'
      ];
      spyOn(platform, 'ready').and.returnValue(Promise.resolve({}));

      platform.ready().
        then((res) => {
          expect(comp.registerDeeplinks).toHaveBeenCalled();
          expect(MyApp.prototype.subscribeEvents).toHaveBeenCalled();
          expect(MyApp.prototype.saveDefaultSyncSetting).toHaveBeenCalled();

          expect(permisssion.requestPermission).toHaveBeenCalled();
          expect(comp.makeEntryInSupportFolder).toHaveBeenCalled();

          /* For makeEntryInSupportFolder */
          const preferenceStub = TestBed.get(SharedPreferences);
          expect(comp.saveDefaultSyncSetting).toBeDefined();


          comp.saveDefaultSyncSetting();

          preferenceStub.getString().then((val) => {
            const title = 'sync_config';
            spyOn(preferenceStub, 'getString').and.returnValue(Promise.resolve(undefined));
            spyOn(preferenceStub, 'putString');
            expect(comp.saveDefaultSyncSetting).toHaveBeenCalled();
            expect(preferenceStub.getString).toHaveBeenCalled();
            expect(val).toEqual(undefined);
            expect(preferenceStub.putString).toHaveBeenCalledWith('sync_config', 'ALWAYS_ON');
          });

          /* For  makeEntryInSupportFolder*/
          window['supportfile'] = {
            makeEntryInSunbirdSupportFile: () => ({})
          };
          spyOn(window['supportfile'], 'makeEntryInSunbirdSupportFile').and.callFake((result, error) => {
            return result(JSON.stringify({}));
          });
          // comp.makeEntryInSupportFolder();
          // expect(preferenceStub.putString).toHaveBeenCalledWith('sunbird_support_file_path', {});

          done();
        });
    });
    it('constructor with error callbacks', () => {
      const platform: Platform = TestBed.get(Platform);
      platform.ready().then((res) => {
        spyOn(window['supportfile'], 'makeEntryInSunbirdSupportFile').and.callFake((result, error) => {
          return error({});
        });
        comp.makeEntryInSupportFolder();
      });
    });
  });

  describe('generateInteractEvent', () => {
    it('should call interact event', () => {
      const telemetryServiceStub = TestBed.get(TelemetryService);
      expect(comp.generateInteractEvent).toBeDefined();
      spyOn(comp, 'generateInteractEvent').and.callThrough();
      spyOn(telemetryServiceStub, 'interact').and.callThrough();
      comp.generateInteractEvent('sample_page_id');
      expect(comp.generateInteractEvent).toHaveBeenCalled();
      expect(telemetryServiceStub.interact).toHaveBeenCalled();
    });
  });

  describe('handleBackButton', () => {
    it('should call handleBackButton, when user is on one of the child page and can go back to home page', () => {
      const platformStub = TestBed.get(Platform);
      const app = TestBed.get(App);
      const navControllerStub = TestBed.get(NavControllerBase);
      expect(comp.handleBackButton).toBeDefined();
      spyOn(comp, 'handleBackButton').and.callThrough();
      spyOn(platformStub, 'registerBackButtonAction').and.callThrough();
      spyOn(navControllerStub.getActive, 'name').and.returnValue('CHILD_PAGE_TO_HOME_PAGE');
      spyOn(app, 'getActiveNavs').and.returnValue([{
        canGoBack: () => true,
        pop: () => ({})
      }]);

      comp.handleBackButton();
      expect(comp.handleBackButton).toHaveBeenCalled();
      expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
      expect(navControllerStub.getActive.name).toEqual('CHILD_PAGE_TO_HOME_PAGE');
    });

    it('should call handleBackButton, when user is on home page and cannot go back', () => {
      const platformStub = TestBed.get(Platform);
      const app = TestBed.get(App);
      expect(comp.handleBackButton).toBeDefined();
      spyOn(comp, 'handleBackButton').and.callThrough();
      spyOn(platformStub, 'registerBackButtonAction').and.callThrough();

      spyOn(app, 'getActiveNavs').and.returnValue([{
        canGoBack: () => false,
        pop: () => ({})
      }]);
      comp.counter = 0;
      comp.handleBackButton();
      expect(comp.counter).toEqual(1);
      expect(comp.handleBackButton).toHaveBeenCalled();
      expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
      setTimeout(() => {
        // expect(comp.counter).toEqual(0);
      }, 1500);
    });

    it('should call handleBackButton, and should exit app if pressed back button twice', () => {
      const platformStub = TestBed.get(Platform);
      const app = TestBed.get(App);
      const telemetryServiceStub = TestBed.get(TelemetryService);
      expect(comp.handleBackButton).toBeDefined();
      spyOn(comp, 'handleBackButton').and.callThrough();
      spyOn(platformStub, 'registerBackButtonAction').and.callThrough();

      spyOn(app, 'getActiveNavs').and.returnValue([{
        canGoBack: () => false,
        pop: () => ({})
      }]);

      spyOn(telemetryServiceStub, 'end');
      spyOn(platformStub, 'exitApp');
      comp.counter = 1;
      comp.handleBackButton();
      expect(comp.counter).toEqual(1);
      expect(comp.handleBackButton).toHaveBeenCalled();
      expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
      expect(telemetryServiceStub.end).toHaveBeenCalled();
      expect(platformStub.exitApp).toHaveBeenCalled();
    });
  });

  describe('getToast', () => {
    it('should call getToast', () => {
      const toastCtrl = TestBed.get(ToastController);
      spyOn(toastCtrl, 'create').and.callThrough();
      expect(comp.getToast).toBeDefined();
      spyOn(comp, 'getToast').and.callThrough();
      comp.getToast('test message');
      expect(comp.getToast).toHaveBeenCalled();
      expect(comp.options.message).toEqual('test message');
      expect(toastCtrl.create).toHaveBeenCalled();
    });
  });

  describe('subscribeEvents', () => {
    it('should call subscribeEvents', () => {
      const events = TestBed.get(Events);
      spyOn(comp, 'generateInteractEvent').and.callThrough();
      spyOn(events, 'subscribe').and.callFake((eventname, callback) => {
        callback({});
      });
      comp.subscribeEvents();
      setTimeout(() => {
        // expect(comp.generateInteractEvent).toHaveBeenCalled();
      }, 0);
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call ionViewWillLeave', () => {
      const eventsStub = TestBed.get(Events);
      expect(comp.ionViewWillLeave).toBeDefined();
      spyOn(comp, 'ionViewWillLeave').and.callThrough();
      spyOn(eventsStub, 'unsubscribe').and.callFake(() => { });
      comp.ionViewWillLeave();
      expect(comp.ionViewWillLeave).toHaveBeenCalled();
      expect(eventsStub.unsubscribe).toHaveBeenCalledWith('tab.change');
    });
  });

  describe('showContentDetails', () => {
    it('should navigate to EnrolledCourseDetailsPage if content type is course', () => {
      fixture.detectChanges();
      const nav: Nav = fixture.componentInstance.nav;
      expect(comp.showContentDetails).toBeDefined();
      expect(nav).toBeDefined();

      spyOn(nav, 'push');
      spyOn(comp, 'showContentDetails').and.callThrough();
      const content = {
        contentData: {
          contentType: ContentType.COURSE
        }
      };
      comp.showContentDetails(content);

      expect(comp.showContentDetails).toHaveBeenCalled();
      expect(nav.push).toHaveBeenCalled();
      expect(nav.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, { content: content });
    });
    it('should navigate to CollectionDetailsPage if content type is course', () => {
      const nav: Nav = fixture.componentInstance.nav;
      expect(comp.showContentDetails).toBeDefined();
      expect(nav).toBeDefined();

      spyOn(nav, 'push');
      spyOn(comp, 'showContentDetails').and.callThrough();
      const content = {
        mimeType: MimeType.COLLECTION,
        contentData: {
          contentType: ContentType.COLLECTION
        }
      };
      comp.showContentDetails(content);

      expect(comp.showContentDetails).toHaveBeenCalled();
      expect(nav.push).toHaveBeenCalled();
      expect(nav.push).toHaveBeenCalledWith(CollectionDetailsPage, { content: content });
    });
    it('should navigate to ContentDetailsPage if content type is not specified', () => {
      const nav: Nav = fixture.componentInstance.nav;
      expect(comp.showContentDetails).toBeDefined();
      expect(nav).toBeDefined();

      spyOn(nav, 'push');
      spyOn(comp, 'showContentDetails').and.callThrough();
      const content = {
        contentData: {
          contentType: 'content'
        }
      };
      comp.showContentDetails(content);

      expect(comp.showContentDetails).toHaveBeenCalled();
      expect(nav.push).toHaveBeenCalled();
      expect(nav.push).toHaveBeenCalledWith(ContentDetailsPage, { content: content });
    });
  });
});
