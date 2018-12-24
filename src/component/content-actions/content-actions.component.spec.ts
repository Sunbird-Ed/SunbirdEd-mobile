// import {
//     ToastControllerMockNew, NavParamsMock,
//     PopoverControllerMock, TranslateServiceStub, PlatformMock,
//     BuildParamaServiceMock, AuthServiceMock, NavMock, AlertControllerMock
// } from './../../../test-config/mocks-ionic';
// import { ConfigMock } from 'ionic-mocks';
// import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
// import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { NavController, PopoverController, Events, NavParams } from 'ionic-angular/index';
// import { ViewController, ToastController, Platform, LoadingController } from 'ionic-angular';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//     ContentService, AuthService, ServiceProvider,
//     ProfileService, SharedPreferences, BuildParamService, FrameworkService, TelemetryService
// } from 'sunbird';
// import { Config } from 'ionic-angular';
// import { CommonUtilService } from '../../service/common-util.service';
// import { AlertController, Alert } from 'ionic-angular';
// import { AppGlobalService } from '../../service/app-global.service';
// import { ContentActionsComponent } from './content-actions';
// import { App } from 'ionic-angular/components/app/app';

// import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
// import { } from 'jasmine';
// import { Observable } from 'rxjs';

// describe('Content-actions', () => {
//     let comp: ContentActionsComponent;
//     let fixture: ComponentFixture<ContentActionsComponent>;

//     beforeEach(() => {
//         const viewControllerStub = {
//             dismiss: () => ({})
//         };
//         TestBed.configureTestingModule({
//             imports: [TranslateModule.forRoot()],
//             schemas: [NO_ERRORS_SCHEMA],
//             declarations: [ContentActionsComponent],
//             providers: [
//                 ContentService, Events, AppGlobalService, CommonUtilService, ServiceProvider, ProfileService, LoadingController,
//                 SharedPreferences, FrameworkService, App, Config,
//                 TelemetryGeneratorService, TelemetryService,
//                 { provide: NavController, useClass: NavMock },
//                 { provide: NavParams, useClass: NavParamsMock },
//                 { provide: ViewController, useValue: viewControllerStub },
//                 { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
//                 { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
//                 { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
//                 // { provide: DeepLinker, useFactory: () => ConfigMock.instance() },
//                 { provide: TranslateService, useClass: TranslateServiceStub },
//                 { provide: Platform, useClass: PlatformMock },
//                 { provide: BuildParamService, useClass: BuildParamaServiceMock },
//                 { provide: AuthService, useClass: AuthServiceMock }
//             ]
//         });

//         const viewControllerMock = TestBed.get(ViewController);
//         const platformStub = TestBed.get(Platform);
//         spyOn(viewControllerMock, 'dismiss');
//         spyOn(platformStub, 'registerBackButtonAction');

//         fixture = TestBed.createComponent(ContentActionsComponent);
//         comp = fixture.componentInstance;
//     });

//     it('#constructor should create instance',
//         () => {
//             expect(comp).toBeTruthy();
//         });

//     it('#getUserId should return empty string if  user is not logged in',
//         (done) => {
//             expect(comp.getUserId).toBeDefined();
//             spyOn(comp, 'getUserId').and.callThrough();
//             const authServiceStub = TestBed.get(AuthService);
//             spyOn(authServiceStub, 'getSessionData').and.callFake(success => {
//                 return success('null');
//             });
//             comp.getUserId();
//             setTimeout(() => {
//                 expect(comp.getUserId).toHaveBeenCalled();
//                 expect(comp.userId).toEqual('');
//                 done();
//             }, 0);
//         });
//     it('#getUserId should set userId to empty string',
//         (done) => {
//             expect(comp.getUserId).toBeDefined();
//             spyOn(comp, 'getUserId').and.callThrough();
//             const authServiceStub = TestBed.get(AuthService);
//             const res = {};
//             spyOn(authServiceStub, 'getSessionData').and.callFake(success => {
//                 return success(JSON.stringify(res));
//             });
//             comp.pageName = 'course';
//             comp.content = {};
//             comp.getUserId();
//             setTimeout(() => {
//                 expect(comp.getUserId).toHaveBeenCalled();
//                 expect(comp.userId).toEqual('');
//                 expect(comp.showFlagMenu).toBe(true);
//                 done();
//             }, 0);
//         });

//     it('#getUserId should set userId',
//         (done) => {

//             expect(comp.getUserId).toBeDefined();
//             spyOn(comp, 'getUserId').and.callThrough();
//             const authServiceStub = TestBed.get(AuthService);
//             const res = {
//                 userToken: 'sample_user_token'
//             };
//             spyOn(authServiceStub, 'getSessionData').and.callFake(success => {
//                 return success(JSON.stringify(res));
//             });
//             comp.pageName = 'course';
//             comp.content.batchId = 'sample_batch_id';
//             comp.getUserId();
//             setTimeout(() => {
//                 expect(comp.getUserId).toHaveBeenCalled();
//                 expect(comp.userId).toEqual('sample_user_token');
//                 expect(comp.showFlagMenu).toBe(true);
//                 done();
//             }, 10);
//         });
//     it('#getDeleteRequestBody should return apiParams object',
//         () => {
//             comp.contentId = 'sample_content_id';
//             comp.isChild = true;
//             const apiParams = {
//                 contentDeleteList: [{
//                     contentId: 'sample_content_id',
//                     isChildContent: true
//                 }]
//             };
//             expect(comp.getDeleteRequestBody).toBeDefined();
//             spyOn(comp, 'getDeleteRequestBody').and.callThrough();
//             const response = comp.getDeleteRequestBody();
//             expect(comp.getDeleteRequestBody).toHaveBeenCalled();
//             expect(response).toEqual(apiParams);
//         });
//     it('#close should return apiParams object',
//         () => {
//             expect(comp.close).toBeDefined();
//             spyOn(comp, 'close').and.callThrough();
//             spyOn(comp, 'deleteContent');
//            comp.close(0);
//             expect(comp.close).toHaveBeenCalled();
//             expect(comp.deleteContent).toHaveBeenCalled();
//         });
//     it('#close should return apiParams object', () => {
//         const viewCtrlStub = TestBed.get(ViewController);
//         expect(comp.close).toBeDefined();
//         spyOn(comp, 'close').and.callThrough();
//         spyOn(comp, 'reportIssue');
//         const response = comp.close(1);
//         expect(comp.close).toHaveBeenCalled();
//         expect(comp.reportIssue).toHaveBeenCalled();
//         expect(viewCtrlStub.dismiss).toHaveBeenCalled();
//     });
//     it('#deleteContent should show the proper message if fails to delete content delete the content with given'
//         + 'request body and should proper toast message, on success of API call',
//         (done) => {
//             //    const alertController = TestBed.get(AlertController);
//             const contentServiceStub = TestBed.get(ContentService);
//             const translateServiceStub = TestBed.get(TranslateService);
//             spyOn(comp, 'deleteContent').and.callThrough();
//             spyOn(comp, 'showToaster');
//             // spyOn(alertController, 'create');
//             spyOn(comp, 'getMessageByConstant');
//             spyOn(translateServiceStub, 'get').and.callFake((arg) => {
//                 return Observable.of('Cancel');
//                 expect(comp.deleteContent).toBeDefined();
//             });

//             const responseObj = {
//                 result: {
//                     status: 'NOT_FOUND'
//                 }
//             };
//             spyOn(contentServiceStub, 'deleteContent').and.callFake((req, response, error) => {
//                 response(JSON.stringify(responseObj));
//             });

//             comp.deleteContent();
//             setTimeout(() => {
//                 expect(comp.deleteContent).toHaveBeenCalled();
//                 expect(comp.showToaster).toHaveBeenCalled();
//                 expect(comp.getMessageByConstant).toHaveBeenCalled();
//                 expect(comp.getMessageByConstant).toHaveBeenCalledWith('CONTENT_DELETE_FAILED');
//                 // expect(alertController.create).toHaveBeenCalled();
//                 done();
//             }, 10);
//         });

//     it('#deleteContent should delete the content with given request body and should proper toast message,'
//         + ' on success of API call',
//         (done) => {
//             expect(comp.deleteContent).toBeDefined();
//             const contentServiceStub = TestBed.get(ContentService);
//             const translateServiceStub = TestBed.get(TranslateService);
//             const eventsStub = TestBed.get(Events);
//             const viewCtrlStub = TestBed.get(ViewController);

//             spyOn(comp, 'deleteContent').and.callThrough();
//             spyOn(comp, 'showToaster');
//             spyOn(comp, 'getMessageByConstant');
//             spyOn(eventsStub, 'publish');
//             spyOn(translateServiceStub, 'get').and.callFake((arg) => {
//                 return Observable.of('Cancel');
//             });

//             const responseObj = {
//                 result: {
//                     status: 'SUCCESS'
//                 }
//             };
//             spyOn(contentServiceStub, 'deleteContent').and.callFake((req, response, error) => {
//                 response(JSON.stringify(responseObj));
//             });
//             comp.deleteContent();
//             setTimeout(() => {
//                 expect(comp.deleteContent).toHaveBeenCalled();
//                 expect(comp.showToaster).toHaveBeenCalled();
//                 expect(comp.getMessageByConstant).toHaveBeenCalled();
//                 expect(comp.getMessageByConstant).toHaveBeenCalledWith('MSG_RESOURCE_DELETED');
//                 expect(eventsStub.publish).toHaveBeenCalled();
//                 expect(eventsStub.publish).toHaveBeenCalledWith('savedResources:update', { update: true });
//                 expect(viewCtrlStub.dismiss).toHaveBeenCalled();
//                 expect(viewCtrlStub.dismiss).toHaveBeenCalledWith('delete.success');
//                 done();
//             }, 10);
//         });



//     it('#deleteContent should show the proper message if fails to delete content delete the content with given request '
//         + 'body and should proper toast message, on success of API call',
//         (done) => {
//             expect(comp.deleteContent).toBeDefined();
//             const contentServiceStub = TestBed.get(ContentService);
//             const translateServiceStub = TestBed.get(TranslateService);
//             const viewCtrlStub = TestBed.get(ViewController);

//             spyOn(comp, 'deleteContent').and.callThrough();
//             spyOn(comp, 'showToaster');
//             spyOn(comp, 'getMessageByConstant');
//             spyOn(translateServiceStub, 'get').and.callFake((arg) => {
//                 return Observable.of('Cancel');
//             });
//             spyOn(contentServiceStub, 'deleteContent').and.callFake((req, response, error) => {
//                 error({});
//             });

//             comp.deleteContent();
//             setTimeout(() => {
//                 expect(comp.deleteContent).toHaveBeenCalled();
//                 expect(comp.showToaster).toHaveBeenCalled();
//                 expect(comp.getMessageByConstant).toHaveBeenCalled();
//                 expect(comp.getMessageByConstant).toHaveBeenCalledWith('CONTENT_DELETE_FAILED');
//                 expect(viewCtrlStub.dismiss).toHaveBeenCalled();
//                 done();
//             }, 10);
//         });
//     it('#reportIssue should show popover to report issue', () => {
//         expect(comp.reportIssue).toBeDefined();
//         const popOverCtrlStub = TestBed.get(PopoverController);
//         // /spyOn(popOverCtrlStub, 'create');
//         spyOn(comp, 'reportIssue').and.callThrough();
//         comp.reportIssue();
//         expect(comp.reportIssue).toHaveBeenCalled();
//         expect(popOverCtrlStub.create).toHaveBeenCalled();
//     });
//     it('#showToaster should return toast object', () => {
//         expect(comp.showToaster).toBeDefined();
//         const toastCtrlStub = TestBed.get(ToastController);
//         spyOn(comp, 'showToaster').and.callThrough();

//         comp.showToaster('SAMPLE_STRING');
//         expect(toastCtrlStub.create).toHaveBeenCalled();
//     });
//     it('#getMessageByConstant should return string', () => {
//         expect(comp.showToaster).toBeDefined();
//         spyOn(comp, 'showToaster').and.callThrough();
//         const translate = TestBed.get(TranslateService);
//         const spy = spyOn(translate, 'get').and.callFake((arg) => {
//             return Observable.of('Cancel');
//         });

//         comp.getMessageByConstant('SAMPLE_STRING');
//         expect(translate.get).toHaveBeenCalled();

//         expect(comp.getMessageByConstant('CANCEL')).toEqual('Cancel');
//         expect(spy.calls.any()).toEqual(true);
//     });

// });
