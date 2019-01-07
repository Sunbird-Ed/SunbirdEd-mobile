// import { } from 'jasmine';
// import {
//   ComponentFixture,
//   TestBed
// } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//   NavParams, Events,
//   PopoverController,
//   Platform
// } from 'ionic-angular';
// import { ViewController } from 'ionic-angular';
// import { App } from 'ionic-angular';
// import { ToastController } from 'ionic-angular';
// import {
//   OAuthService,
//   ServiceProvider,
//   AuthService,
//   BuildParamService,
//   FrameworkService
// } from 'sunbird';
// import { SharedPreferences } from 'sunbird';
// import { ContainerService } from 'sunbird';
// import { TelemetryService } from 'sunbird';
// import { ProfileService } from 'sunbird';
// import { Network } from '@ionic-native/network';
// import {
//   TranslateService,
//   TranslateModule
// } from '@ngx-translate/core';
// import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
// import { AppGlobalService } from '../../../service/app-global.service';
// import { OverflowMenuComponent } from './menu.overflow.component';
// import {
//   NavParamsMock,
//   PopoverControllerMock,
//   ViewControllerMock,
//   ToastControllerMockNew,
//   SharedPreferencesMock,
//   ContainerServiceMock,
//   TelemetryServiceMock,
//   ProfileServiceMock,
//   TranslateServiceStub,
//   AppGlobalServiceMock,
//   AuthServiceMock,
//   BuildParamaServiceMock,
//   AppMock
// } from '../../../../test-config/mocks-ionic';
// import { Observable } from 'rxjs';
// import { Config } from 'ionic-angular';
// import { CommonUtilService } from '../../../service/common-util.service';
// import { LoadingController } from 'ionic-angular';

// describe('OverflowMenuComponent', () => {
//   let comp: OverflowMenuComponent;
//   let fixture: ComponentFixture<OverflowMenuComponent>;

//   beforeEach(() => {
//     const TelemetryGeneratorServiceStub = {
//       generateInteractTelemetry: () => ({})
//     };
//     const OAuthServiceStub = {
//       doLogOut(): Promise<any> {
//         return new Promise(resolve => {
//           resolve('value');
//         });
//       }
//     };
//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot()],
//       declarations: [OverflowMenuComponent],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         ServiceProvider,
//         LoadingController,
//         CommonUtilService,
//         Events,
//         FrameworkService,
//         Config,
//         Platform,
//         Network,
//         { provide: BuildParamService, useClass: BuildParamaServiceMock },
//         { provide: AuthService, useClass: AuthServiceMock },
//         {
//           provide: PopoverController,
//           useFactory: () => PopoverControllerMock.instance()
//         },
//         { provide: NavParams, useClass: NavParamsMock },
//         { provide: ViewController, useClass: ViewControllerMock },
//         { provide: App, useClass: AppMock },
//         {
//           provide: ToastController,
//           useFactory: () => ToastControllerMockNew.instance()
//         },
//         { provide: SharedPreferences, useClass: SharedPreferencesMock },
//         { provide: ContainerService, useClass: ContainerServiceMock },
//         { provide: TelemetryService, useClass: TelemetryServiceMock },
//         { provide: ProfileService, useClass: ProfileServiceMock },
//         { provide: TranslateService, useClass: TranslateServiceStub },
//         { provide: AppGlobalService, useClass: AppGlobalServiceMock },
//         {
//           provide: TelemetryGeneratorService,
//           useValue: TelemetryGeneratorServiceStub
//         },
//         { provide: OAuthService, useValue: OAuthServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(OverflowMenuComponent);
//     comp = fixture.componentInstance;
//   });
//   it('can load instance', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('show toast method makes expected calls', () => {
//     const navStub = TestBed.get(NavParams);
//     comp.items = ['list'];
//     spyOn(navStub, 'get');
//     comp.showToast();
//     expect(navStub.get).toHaveBeenCalled();
//   });
//   describe('close function makes expected calls', () => {
//     it('makes expected calls ', () => {
//       const viewStub = TestBed.get(ViewController);
//       const telemeGenStub = TestBed.get(TelemetryGeneratorService);
//       const appStub = TestBed.get(App);
//       spyOn(viewStub, 'dismiss').and.returnValue(
//         Promise.resolve(JSON.stringify({}))
//       );
//       spyOn(telemeGenStub, 'generateInteractTelemetry');
//       spyOn(appStub, 'getActiveNav').and.callThrough();
//       comp.close({ target: { innerText: '' } }, 'USERS_AND_GROUPS');
//       expect(viewStub.dismiss).toHaveBeenCalled();
//       expect(telemeGenStub.generateInteractTelemetry).toHaveBeenCalled();
//       expect(appStub.getActiveNav).toHaveBeenCalled();
//     });
//     it('makes expected calls on case REPORTS', () => {
//       const telemeGenStub = TestBed.get(TelemetryGeneratorService);
//       const appStub = TestBed.get(App);
//       spyOn(telemeGenStub, 'generateInteractTelemetry');
//       spyOn(appStub, 'getActiveNav').and.callThrough();
//       comp.close({ target: { innerText: '' } }, 'REPORTS');
//       expect(telemeGenStub.generateInteractTelemetry).toHaveBeenCalled();
//       expect(appStub.getActiveNav).toHaveBeenCalled();
//     });
//     it('makes expected calls on case SETTINGS', () => {
//       const telemeGenStub = TestBed.get(TelemetryService);
//       const appStub = TestBed.get(App);
//       spyOn(telemeGenStub, 'interact');
//       spyOn(appStub, 'getActiveNav').and.callThrough();
//       comp.close({ target: { innerText: '' } }, 'SETTINGS');
//       expect(telemeGenStub.interact).toHaveBeenCalled();
//       expect(appStub.getActiveNav).toHaveBeenCalled();
//     });
//     it('should makes expected calls when case LOGOUT', () => {
//       const commonUtilServiceStub = TestBed.get(CommonUtilService);
//       const networkStub = TestBed.get(Network);
//       const toastStub = TestBed.get(ToastController);
//       spyOnProperty(networkStub, 'type').and.returnValue('none');
//       const translate = TestBed.get(TranslateService);
//       const translationId = 'CANCEL';
//       spyOn(translate, 'get').and.callFake(arg => {
//         return Observable.of('Cancel');
//       });
//       comp.close({ target: { innerText: '' } }, 'LOGOUT');
//       commonUtilServiceStub.translateMessage(translationId);
//       expect(toastStub.create).toHaveBeenCalled();
//       expect(networkStub.type).toBe('none');
//     });
//     it('should makes expected calls in else part if network is there', () => {
//       const networkStub = TestBed.get(Network);
//       const sharePreferStub = TestBed.get(SharedPreferences);
//       spyOnProperty(networkStub, 'type').and.returnValue('network');
//       window['splashscreen'] = {
//         clearPrefs: () => ({})
//       };
//       spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve(' '));
//       comp.close({ target: { innerText: '' } }, 'LOGOUT');
//       expect(sharePreferStub.getString).toHaveBeenCalled();
//       expect(networkStub.type).toBe('network');
//     });
//   });
//   describe('navigate page', () => {
//     it('should makes expected calls', () => {
//       const appGlobalStub = TestBed.get(AppGlobalService);
//       appGlobalStub.DISPLAY_ONBOARDING_PAGE = true;
//       const appStub = TestBed.get(App);
//       spyOn(appStub, 'getRootNav').and.callThrough();

//       comp.navigateToAptPage();
//       expect(appStub.getRootNav).toHaveBeenCalled();
//     });
//     it('should make expected calls when displayOnBoarding page is false and profile type is STUDENT', () => {
//       const appGlobalStub = TestBed.get(AppGlobalService);
//       const sharePreferStub = TestBed.get(SharedPreferences);
//       appGlobalStub.DISPLAY_ONBOARDING_PAGE = false;
//       spyOn(sharePreferStub, 'getString').and.returnValue(
//         Promise.resolve('STUDENT')
//       );
//       comp.navigateToAptPage();
//       expect(sharePreferStub.getString).toHaveBeenCalled();
//     });
//     it('should make expected calls when displayOnBoarding page is false and profile type is TEACHER', () => {
//       const appGlobalStub = TestBed.get(AppGlobalService);
//       const sharePreferStub = TestBed.get(SharedPreferences);
//       appGlobalStub.DISPLAY_ONBOARDING_PAGE = false;
//       spyOn(sharePreferStub, 'getString').and.returnValue(
//         Promise.resolve('TEACHER')
//       );
//       comp.navigateToAptPage();
//       expect(sharePreferStub.getString).toHaveBeenCalled();
//     });
//   });
//   it('translate Message to have been called', () => {
//     const commonUtilServiceStub = TestBed.get(CommonUtilService);
//     const translate = TestBed.get(TranslateService);
//     spyOn(translate, 'get').and.callFake(arg => {
//       return Observable.of('Cancel');
//     });
//     commonUtilServiceStub.translateMessage('any');
//     expect(translate.get).toHaveBeenCalled();
//   });

//   it('generateLogoutInteractTelemetry', () => {
//     const telemetrySub = TestBed.get(TelemetryService);
//     spyOn(telemetrySub, 'interact');
//     comp.generateLogoutInteractTelemetry('type', 'subType', 'uid');

//     expect(telemetrySub.interact).toHaveBeenCalled();
//   });
// });
