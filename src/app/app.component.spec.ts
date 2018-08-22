
import { NavController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { eventsMock, appMock, NavControllerMock } from './../../test-config/mocks-ionic';
import { fakeAsync, ComponentFixture } from '@angular/core/testing';
import { ToastControllerMock } from '../../test-config/mocks-ionic';
import { PluginModules } from './module.service';
import { AppGlobalService } from '../service/app-global.service';
import { async, TestBed, inject } from '@angular/core/testing';
import { IonicModule, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {
  AuthService,
  ContainerService,
  PermissionService,
  TelemetryService,
  SharedPreferences,
} from "sunbird";
import { ImageLoaderConfig } from "ionic-image-loader";
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
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
  AppGlobalServiceMock,
  AppVersionMock,
  FormAndFrameworkUtilServiceMock,
  SharedPreferencesMock

} from '../../test-config/mocks-ionic';
import { CourseUtilService } from '../service/course-util.service';
import { AppVersion } from '@ionic-native/app-version';
import { FormAndFrameworkUtilService } from '../pages/profile/formandframeworkutil.service';
import { } from 'jasmine';
import { Observable } from 'rxjs';
import { Events } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '../pages/enrolled-course-details/enrolled-course-details';


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
        PermissionService,
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: ContainerService, useClass: ContainerServiceMock },
        //{ provide: PermissionService, useClass: PermissionServiceMock },
        { provide: ImageLoaderConfig, useClass: ImageLoaderConfigMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: TelemetryService, useClass: TelemetryServiceMock },
        { provide: AppGlobalService, useClass: AppGlobalServiceMock },
        { provide: CourseUtilService, useClass: CourseUtilServiceMock },
        { provide: AppVersion, useClass: AppVersionMock },
        { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
        { provide: SharedPreferences, useClass: SharedPreferencesMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: App, useClass: appMock },
//        { provide: NavController, useClass: NavControllerMock }
      ],
    })
  }));

  beforeEach(() => {
    spyOn(MyApp.prototype, 'registerDeeplinks');
    spyOn(MyApp.prototype, 'subscribeEvents');
    spyOn(MyApp.prototype, 'saveDefaultSyncSetting');
    spyOn(MyApp.prototype, 'showAppWalkThroughScreen');

    fixture = TestBed.createComponent(MyApp);
    comp = fixture.componentInstance;
  });

  beforeEach(() => {
    inject([TranslateService], (service) => {
      translateService = service;
      translateService.use('en');
    })
  });

  it('should create a valid instance of MyApp', () => {
    expect(comp instanceof MyApp).toBe(true);
  });
  it("counter defaults to: 0", () => {
    expect(comp.counter).toEqual(0);
  });

  it("permissionList defaults to: ['android.permission.CAMERA', 'android.permission.WRITE_EXTERNAL_STORAGE', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.RECORD_AUDIO']", () => {
    expect(comp.permissionList).toEqual(['android.permission.CAMERA', 'android.permission.WRITE_EXTERNAL_STORAGE', 'android.permission.ACCESS_FINE_LOCATION', 'android.permission.RECORD_AUDIO']);
  });

  describe("constructor", () => {
    it("makes expected calls", (done) => {
      const platform: Platform = TestBed.get(Platform);
      const permisssion: PermissionService = TestBed.get(PermissionService);
      const formAndFrameworkUtilService: FormAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
      let permissionList = [
        "android.permission.CAMERA",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO"
      ];
      spyOn(platform, 'ready').and.returnValue(Promise.resolve({}));
      // spyOn(permisssion, 'requestPermission').and.callFake((permissionList, response, error) => {
      //   return response({});
      // });
      spyOn(formAndFrameworkUtilService, 'checkNewAppVersion').and.returnValue(Promise.resolve({}));

      platform.ready().
        then((result) => {
          expect(comp.registerDeeplinks).toHaveBeenCalled();
          expect(MyApp.prototype.subscribeEvents).toHaveBeenCalled();
          expect(MyApp.prototype.saveDefaultSyncSetting).toHaveBeenCalled();
          expect(MyApp.prototype.showAppWalkThroughScreen).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('presentToast', () => {
    it('should create toast', () => {
      let toastCtrl: ToastController = TestBed.get(ToastController);
      expect(comp.presentToast).toBeDefined();
      spyOn(comp, 'presentToast').and.callThrough();
      spyOn(toastCtrl, 'create').and.callThrough();
      comp.presentToast();
      expect(comp.presentToast).toHaveBeenCalled();
      expect(toastCtrl.create).toHaveBeenCalled();
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
      expect(comp.handleBackButton).toBeDefined();
      spyOn(comp, 'handleBackButton').and.callThrough();
      spyOn(platformStub, 'registerBackButtonAction').and.callThrough();

      spyOn(app, 'getActiveNavs').and.returnValue([{
        canGoBack: () => { return true },
        pop: () => ({})
      }]);

      comp.handleBackButton();
      expect(comp.handleBackButton).toHaveBeenCalled();
      expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
    });
    it('should call handleBackButton, when user is on home page and cannot go back', () => {
      const platformStub = TestBed.get(Platform);
      const app = TestBed.get(App);
      expect(comp.handleBackButton).toBeDefined();
      spyOn(comp, 'handleBackButton').and.callThrough();
      spyOn(platformStub, 'registerBackButtonAction').and.callThrough();

      spyOn(app, 'getActiveNavs').and.returnValue([{
        canGoBack: () => { return false },
        pop: () => ({})
      }]);

      spyOn(comp, 'presentToast');
      comp.counter = 0;
      comp.handleBackButton();
      expect(comp.counter).toEqual(1);
      expect(comp.handleBackButton).toHaveBeenCalled();
      expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
      expect(comp.presentToast).toHaveBeenCalled();
      setTimeout(() => {
        //expect(comp.counter).toEqual(0);
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
        canGoBack: () => { return false },
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
        //expect(comp.generateInteractEvent).toHaveBeenCalled();
      }, 0);
    })
  });

  describe("translateMessage", () => {
    it('should call translateMessage', fakeAsync(() => {
      let translate = TestBed.get(TranslateService);
      const spy = spyOn(translate, 'get').and.callFake((arg) => {
        return Observable.of('Cancel');
      });
      console.log("SPY", spy);
      expect(comp.translateMessage('CANCEL')).toEqual('Cancel');
      expect(spy.calls.any()).toEqual(true);
    }));
  });

  describe("ionViewWillLeave", () => {
    it('should call ionViewWillLeave', () => {
      const eventsStub = TestBed.get(Events);
      expect(comp.ionViewWillLeave).toBeDefined();
      spyOn(comp, 'ionViewWillLeave').and.callThrough();
      spyOn(eventsStub, 'unsubscribe').and.callFake(() => { })
      comp.ionViewWillLeave();
      expect(comp.ionViewWillLeave).toHaveBeenCalled();
      expect(eventsStub.unsubscribe).toHaveBeenCalledWith('tab.change');
    });
  });

  xdescribe('showContentDetails', () => {
    it('should navigate to EnrolledCourseDetailsPage if content type is course', () => {
      const navControllerStub = TestBed.get(NavController);
      expect(comp.showContentDetails).toBeDefined();
      spyOn(comp, 'showContentDetails').and.callThrough();
      let content = {
        contentData: {
          contentType: 'Course'
        }
      }
      comp.showContentDetails(content);

      expect(comp.showContentDetails).toHaveBeenCalled();
      expect(navControllerStub.push).toHaveBeenCalled();
      expect(navControllerStub.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, { content: content });
    });
    it('should navigate to CollectionDetailsPage if content type is Collection', () => {

    });
    it('should navigate to ContentDetailsPage if content type is not specified', () => {

    });
  });

  describe('saveDefaultSyncSetting', () => {
    it('should call saveDefaultSyncSetting', (done) => {
      const preferenceStub = TestBed.get(SharedPreferences);
      expect(comp.saveDefaultSyncSetting).toBeDefined();
      let title = 'sync_config';
      // spyOn(preferenceStub, 'getString').and.callFake((title, callback) => {
      //   return callback(undefined);
      // });
      // spyOn(preferenceStub, 'putString');
      comp.saveDefaultSyncSetting();

      setTimeout(() => {
        expect(comp.saveDefaultSyncSetting).toHaveBeenCalled();
        // expect(preferenceStub.getString).toHaveBeenCalled();
        // expect(preferenceStub.putString).toHaveBeenCalledWith('sync_config', 'ALWAYS_ON');
        done();
      }, 100);

    });
  });

});