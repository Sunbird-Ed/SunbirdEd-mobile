// import {
//   ComponentFixture, TestBed,
//   fakeAsync
// } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ContentRatingAlertComponent } from './content-rating-alert';
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

// describe('ContentRatingAlertComponent', () => {
//   let comp: ContentRatingAlertComponent;
//   let fixture: ComponentFixture<ContentRatingAlertComponent>;

//   beforeEach(() => {
//     const viewControllerStub = {
//       dismiss: () => ({})
//     };
//     const FrameworkServiceStub = {};
//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot()],
//       declarations: [ContentRatingAlertComponent],
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
//     spyOn(ContentRatingAlertComponent.prototype, 'getUserId');
//     // spyOn(ViewControllerMock,'backButtonfunc');

//     fixture = TestBed.createComponent(ContentRatingAlertComponent);
//     comp = fixture.componentInstance;
//   });
//   it('can load instance', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('#ionViewDidLoad should be call', () => {
//     const navParamsStub: NavParams = fixture.debugElement.injector.get(
//       NavParams
//     );
//     spyOn(navParamsStub, 'get');
//     comp.ionViewDidLoad();
//     expect(navParamsStub.get).toHaveBeenCalled();
//   });

//   it('#ionViewWillEnter should be impression', () => {
//     const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(
//       TelemetryService
//     );
//     spyOn(telemetryServiceStub, 'impression');
//     spyOn(telemetryServiceStub, 'log');
//     comp.ionViewWillEnter();
//     expect(telemetryServiceStub.impression).toHaveBeenCalled();
//     expect(telemetryServiceStub.log).toHaveBeenCalled();
//   });

//   it('#getUserId should return empty string if  user is not logged in', () => {
//     const appGlobalServiceStub = TestBed.get(AppGlobalService);
//     spyOn(appGlobalServiceStub, 'getSessionData');
//     (<jasmine.Spy>comp.getUserId).and.callThrough();
//     comp.getUserId();
//     expect(appGlobalServiceStub.getSessionData).toHaveBeenCalled();
//   });

//   it('#submit makes expected calls', () => {
//     comp.content.identifier = 'sample_content_id';
//     comp.ratingCount = 121;
//     comp.comment = 'sample_comment';
//     comp.content.versionKey = 'sample_version_key';

//     const viewControllerStub = TestBed.get(ViewController);
//     const contentServiceStub = TestBed.get(ContentService);
//     const telemetryServiceStub = TestBed.get(TelemetryService);
//     spyOn(comp, 'showMessage');
//     spyOn(comp, 'translateLangConst');
//     spyOn(contentServiceStub, 'sendFeedback').and.callFake((option, success, error) => {
//       return success();
//     });
//     // spyOn(viewControllerStub, "dismiss").and.callFake(success => {
//     //   return success("sample");
//     // });
//     spyOn(telemetryServiceStub, 'interact');
//     comp.submit();

//     expect(comp.showMessage).toHaveBeenCalled();
//     expect(comp.translateLangConst).toHaveBeenCalled();
//     expect(viewControllerStub.dismiss).toHaveBeenCalled();
//     expect(contentServiceStub.sendFeedback).toHaveBeenCalled();
//     expect(telemetryServiceStub.interact).toHaveBeenCalled();
//   });

//   it('#submit makes expected calls', () => {
//     comp.content.identifier = 'sample_content_id';
//     comp.ratingCount = 121;
//     comp.comment = 'sample_comment';
//     comp.content.versionKey = 'sample_version_key';

//     const viewControllerStub = TestBed.get(ViewController);
//     const contentServiceStub = TestBed.get(ContentService);
//     const telemetryServiceStub = TestBed.get(TelemetryService);
//     spyOn(comp, 'showMessage');
//     spyOn(comp, 'translateLangConst');
//     spyOn(contentServiceStub, 'sendFeedback').and.callFake((option, success, error) => {
//       return error();
//     });
//     // spyOn(viewControllerStub, "dismiss").and.callFake(success => {
//     //   return success("sample");
//     // });
//     spyOn(telemetryServiceStub, 'interact');
//     comp.submit();

//     expect(viewControllerStub.dismiss).toHaveBeenCalled();
//   });

//   it('#cancel should hide commentbox', () => {
//     expect(comp.cancel).toBeDefined();
//     const viewControllerStub = TestBed.get(ViewController);
//     spyOn(comp, 'cancel').and.callThrough();
//     comp.cancel();
//     expect(comp.cancel).toHaveBeenCalled();
//     expect(comp.showCommentBox).toBe(false);
//     expect(viewControllerStub.dismiss).toHaveBeenCalled();
//   });
//   it('#rateContent should be rating', () => {
//     expect(comp.rateContent).toBeDefined();
//     spyOn(comp, 'rateContent').and.callThrough();
//     comp.rateContent('rateContent');
//     expect(comp.rateContent).toHaveBeenCalled();
//     expect(comp.showCommentBox).toBe(true);
//     // expect(comp.rateContent).toEqual(this.rateContent);
//   });

//   it('#showMessage should be text', () => {
//     expect(comp.showMessage).toBeDefined();
//     const Toast = TestBed.get(ToastController);

//     //   spyOn(Toast, 'getSessionData').and.callFake((arg) => {
//     //     return Observable.of(JSON.stringify('msg'));
//     // });
//     spyOn(comp, 'showMessage').and.callThrough();
//     // spyOn(ToastControllerStub, 'present').and.callThrough();
//     comp.showMessage('sample_msg');
//     expect(comp.showMessage).toHaveBeenCalled();
//   });

//   it('#translateLangConst should call translateMessage', fakeAsync(() => {
//     const msg = TestBed.get(TranslateService);

//     const spy = spyOn(msg, 'get').and.callFake(arg => {
//       return Observable.of('Cancel');
//     });

//     const translateLangConst = comp.translateLangConst('CANCEL');

//     expect(translateLangConst).toEqual('Cancel');
//     expect(spy.calls.any()).toEqual(true);
//   }));
// });
