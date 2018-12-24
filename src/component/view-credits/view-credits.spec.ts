// import {
//   ComponentFixture, TestBed,
//   fakeAsync
// } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ViewCreditsComponent } from './view-credits';
// import {
//   ContentService,
//   TelemetryService,
//   AuthService,
//   ProfileService,
//   BuildParamService
// } from 'sunbird';
// import { ServiceProvider, SharedPreferences, FrameworkService } from 'sunbird';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { PopoverController } from 'ionic-angular';
// import {
//   NavParamsMock,
//   PlatformMock,
//   ToastControllerMockNew,
//   TelemetryServiceMock,
//   TranslateServiceStub,
//   AppGlobalServiceMock,
//   EventsMock,
//   AuthServiceMock,
//   ProfileServiceMock,
//   SharedPreferencesMock,
//   PopoverControllerMock,
//   BuildParamaServiceMock
// } from '../../../test-config/mocks-ionic';
// import { } from 'jasmine';
// import { ViewController } from 'ionic-angular/navigation/view-controller';
// import {
//   ToastController,
//   NavParams, Platform, Events
// } from 'ionic-angular';
// import { AppGlobalService } from '../../service/app-global.service';
// import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';

// describe('ViewCreditsComponent', () => {
//   let comp: ViewCreditsComponent;
//   let fixture: ComponentFixture<ViewCreditsComponent>;

//   beforeEach(() => {
//     const viewControllerStub = {
//       dismiss: () => ({})
//     };
//     const FrameworkServiceStub = {};
//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot()],
//       declarations: [ViewCreditsComponent],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         ServiceProvider,
//         TelemetryGeneratorService, ContentService,
//         { provide: NavParams, useClass: NavParamsMock },
//         { provide: ViewController, useValue: viewControllerStub },
//         { provide: Platform, useClass: PlatformMock },
//         {
//           provide: ToastController,
//           useFactory: () => ToastControllerMockNew.instance()
//         },
//         { provide: TelemetryService, useClass: TelemetryServiceMock },
//         { provide: TranslateService, useClass: TranslateServiceStub },
//         { provide: AppGlobalService, useClass: AppGlobalServiceMock },
//         { provide: Events, useClass: EventsMock },
//         { provide: AuthService, useClass: AuthServiceMock },
//         { provide: ProfileService, useClass: ProfileServiceMock },
//         { provide: SharedPreferences, useClass: SharedPreferencesMock },
//         {
//           provide: PopoverController,
//           useFactory: () => PopoverControllerMock.instance()
//         },
//         { provide: BuildParamService, useClass: BuildParamaServiceMock },
//         { provide: FrameworkService, useValue: FrameworkServiceStub }
//       ]
//     });
//     const ViewControllerMock = TestBed.get(ViewController);
//     const platformStub = TestBed.get(Platform);
//     spyOn(ViewControllerMock, 'dismiss');
//     spyOn(platformStub, 'registerBackButtonAction');
//     spyOn(ViewCreditsComponent.prototype, 'getUserId');
//     // spyOn(ViewControllerMock,'backButtonfunc');

//     fixture = TestBed.createComponent(ViewCreditsComponent);
//     comp = fixture.componentInstance;
//   });
//   it('can load instance', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('#ionViewDidLoad should be called', () => {
//     comp.ionViewDidLoad();
//   });


//   it('#getUserId should return empty string if  user is not logged in', () => {
//     const appGlobalServiceStub = TestBed.get(AppGlobalService);
//     spyOn(appGlobalServiceStub, 'getSessionData');
//     (<jasmine.Spy>comp.getUserId).and.callThrough();
//     comp.getUserId();
//     expect(appGlobalServiceStub.getSessionData).toHaveBeenCalled();
//   });

//   it('#cancel should hide popup', () => {
//     expect(comp.cancel).toBeDefined();
//     const viewControllerStub = TestBed.get(ViewController);
//     spyOn(comp, 'cancel').and.callThrough();
//     comp.cancel();
//     expect(comp.cancel).toHaveBeenCalled();
//     expect(viewControllerStub.dismiss).toHaveBeenCalled();
//   });
// });
