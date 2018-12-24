// import { ComponentsModule } from './../components.module';
// import {
//   ComponentFixture,
//   TestBed
// } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//   LoadingController, ToastController,
//   NavController, NavParams,
//   Events, PopoverController
// } from 'ionic-angular';
// import {
//   AuthService,
//   TelemetryService,
//   ProfileService, ServiceProvider,
//   SharedPreferences,
//   BuildParamService, FrameworkService,
// } from 'sunbird';
// import { } from 'jasmine';
// import { ProfileAvatarComponent } from './profile-avatar';
// import { CommonUtilService } from '../../service/common-util.service';
// import {
//   TranslateModule,
//   TranslateService
// } from '../../../node_modules/@ngx-translate/core';
// import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
// import { DatePipe } from '../../../node_modules/@angular/common';
// import { AppGlobalService } from '../../service/app-global.service';
// import {
//   LoadingControllerMock, TranslateServiceStub,
//   ToastControllerMockNew, PopoverControllerMock,
//   AuthServiceMock, AppGlobalServiceMock, NavMock,
//   NavParamsMock,
//   EventsMock, TelemetryServiceMock
// } from '../../../test-config/mocks-ionic';

// describe('ProfileAvatarComponent', () => {
//   let comp: ProfileAvatarComponent;
//   let fixture: ComponentFixture<ProfileAvatarComponent>;

//   beforeEach(async () => {
//     const datePipeStub = {
//       transform: () => ({})
//     };

//     TestBed.configureTestingModule({
//       imports: [TranslateModule.forRoot(), ComponentsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       providers: [
//         ProfileService, ServiceProvider, SharedPreferences, BuildParamService, FrameworkService,
//         TelemetryGeneratorService, CommonUtilService,
//         { provide: NavController, useClass: NavMock },
//         { provide: NavParams, useClass: NavParamsMock },
//         { provide: Events, useClass: EventsMock },
//         { provide: AuthService, useClass: AuthServiceMock },
//         { provide: TelemetryService, useClass: TelemetryServiceMock },
//         { provide: DatePipe, useValue: datePipeStub },
//         { provide: TranslateService, useClass: TranslateServiceStub },
//         { provide: AppGlobalService, useClass: AppGlobalServiceMock },
//         { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
//         { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
//         { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }
//       ]
//     });

//     fixture = TestBed.createComponent(ProfileAvatarComponent);
//     comp = fixture.componentInstance;
//     comp.username = 'test username';

//   });

//   it('should create instance of the ProfileAvatarComponent', () => {
//     expect(comp).toBeTruthy();
//   });

//   it('ngOnInIt should make expected calls', () => {
//     comp.ngOnInit();
//     expect(comp.initial).toBeTruthy();
//   });

//   it('stringToColor should return expected value', () => {
//     expect(comp.stringToColor('test')).toEqual('#924436');
//   });

//   it('getContrast should return expected value', () => {
//     comp.ngOnInit();
//     expect(comp.getContrast('#924436')).toEqual('#ffffff');
//   });

// });
