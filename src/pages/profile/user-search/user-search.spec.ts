// import { ProfilePage } from './../profile';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { AuthService, SharedPreferences, ServiceProvider } from 'sunbird';
// import { UserProfileService } from 'sunbird';
// import { TelemetryService } from 'sunbird';
// import { NavController, Events, PopoverController, App, Config, Platform } from 'ionic-angular';
// import { NavParams } from 'ionic-angular';
// import { LoadingController } from 'ionic-angular';
// import { ToastController } from 'ionic-angular';
// import { Renderer } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { UserSearchComponent } from './user-search';
// import { TranslateModule } from '@ngx-translate/core';
// import { } from 'jasmine';
// import { CommonUtilService } from '../../../service/common-util.service';
// import { DeepLinker } from 'ionic-angular';
// import { DeepLinkerMock } from '../../../../test-config/mocks-ionic';

// describe('UserSearchComponent', () => {
//     let comp: UserSearchComponent;
//     let fixture: ComponentFixture<UserSearchComponent>;

//     beforeEach(() => {
//         const authServiceStub = {
//             getSessionData: () => ({})
//         };
//         const userProfileServiceStub = {
//             searchUser: () => ({})
//         };
//         const telemetryServiceStub = {
//             impression: () => ({})
//         };
//         const navControllerStub = {
//             push: () => ({})
//         };
//         const navParamsStub = {};
//         const loadingControllerStub = {
//             create: () => ({
//                 present: () => ({}),
//                 dismiss: () => ({})
//             })
//         };
//         const toastControllerStub = {
//             create: () => ({})
//         };
//         const rendererStub = {
//             invokeElementMethod: () => ({})
//         };
//         const translateServiceStub = {

//             get: () => ({
//                 subscribe: () => ({})
//             })
//         };
//         TestBed.configureTestingModule({
//             imports: [TranslateModule.forRoot()],
//             declarations: [UserSearchComponent],
//             schemas: [NO_ERRORS_SCHEMA],
//             providers: [
//                 CommonUtilService, SharedPreferences, ServiceProvider,
//                 Events, PopoverController, App, Config, Platform,
//                 { provide: DeepLinker, useValue: DeepLinkerMock },
//                 { provide: AuthService, useValue: authServiceStub },
//                 { provide: UserProfileService, useValue: userProfileServiceStub },
//                 { provide: TelemetryService, useValue: telemetryServiceStub },
//                 { provide: NavController, useValue: navControllerStub },
//                 { provide: NavParams, useValue: navParamsStub },
//                 { provide: LoadingController, useValue: loadingControllerStub },
//                 { provide: ToastController, useValue: toastControllerStub },
//                 { provide: Renderer, useValue: rendererStub },
//                 { provide: TranslateService, useValue: translateServiceStub }
//             ]
//         });
//         fixture = TestBed.createComponent(UserSearchComponent);
//         comp = fixture.componentInstance;
//     });

//     it('can load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('userList defaults to: []', () => {
//         expect(comp.userList).toEqual([]);
//     });

//     it('fallBackImage defaults to: ./assets/imgs/ic_profile_default.png', () => {
//         expect(comp.fallBackImage).toEqual('./assets/imgs/ic_profile_default.png');
//     });

//     it('enableInfiniteScroll defaults to: false', () => {
//         expect(comp.enableInfiniteScroll).toEqual(false);
//     });

//     it('showEmptyMessage defaults to: false', () => {
//         expect(comp.showEmptyMessage).toEqual(false);
//     });

//     it('apiOffset defaults to: 0', () => {
//         expect(comp.apiOffset).toEqual(0);
//     });

//     it('apiLimit defaults to: 10', () => {
//         expect(comp.apiLimit).toEqual(10);
//     });

//     it('visibleItems defaults to: []', () => {
//         expect(comp.visibleItems).toEqual([]);
//     });

//     it('visits defaults to: []', () => {
//         expect(comp.visits).toEqual([]);
//     });

//     it('isContentLoaded defaults to: false', () => {
//         expect(comp.isContentLoaded).toEqual(false);
//     });

//     describe('ionViewDidLoad', () => {
//         it('makes expected calls', () => {
//             const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(TelemetryService);
//             spyOn(telemetryServiceStub, 'impression');
//             comp.ionViewDidLoad();
//             expect(telemetryServiceStub.impression).toHaveBeenCalled();
//         });
//     });

//     describe('checkClear', () => {
//         it('makes expected calls', () => {
//             spyOn(comp, 'onInput');
//             comp.checkClear();
//             expect(comp.onInput).toHaveBeenCalled();
//         });
//     });

//     describe('ionViewDidEnter', () => {
//         xit('should make expected call after 100ms', (done) => {
//             expect(comp.input).toBeDefined();
//             comp.input = jasmine.createSpy().and.returnValue(() => {
//                 return { setFocus: () => ({}) };
//             });
//             spyOn(comp.input, 'setFocus');
//             console.log('comp.input', comp.input);
//             comp.ionViewDidEnter();
//             fixture.detectChanges();
//             // tick(100);
//             setTimeout(() => {
//                 expect(comp.input.setFocus).toHaveBeenCalled();
//                 done();
//             }, 101);
//         });
//     });

//     /*describe('getToast', () => {
//        it('Should not create ToastController if not passed any message for toast', () => {
//            const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
//            spyOn(toastCtrlStub, 'create');
//            comp.getToast();
//            expect(toastCtrlStub.create).not.toHaveBeenCalled();
//        });
//        it('Should create ToastController', () => {
//            const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
//            spyOn(toastCtrlStub, 'create');
//            comp.getToast('Some Message');
//            expect(toastCtrlStub.create).toHaveBeenCalled();
//            expect(toastCtrlStub.create).toBeTruthy();
//        });
//    }); */

//     describe('translateMessage', () => {
//         it('should resolve test data', fakeAsync(() => {
//             const translate = TestBed.get(TranslateService);
//             const translateStub = TestBed.get(TranslateService);
//             const commonUtilServiceStub = TestBed.get(CommonUtilService);
//             const spy = spyOn(translate, 'get').and.callFake((arg) => {
//                 return Observable.of('Cancel');
//             });
//             const translatedMessage = commonUtilServiceStub.translateMessage('CANCEL');
//             // fixture.detectChanges();
//             expect(translatedMessage).toEqual('Cancel');
//             expect(spy.calls.any()).toEqual(true);
//         }));
//     });

//     describe('openUserProfile', () => {
//         it('should navigate to profile page', () => {
//             const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
//             spyOn(navControllerStub, 'push');
//             comp.openUserProfile('userId');
//             expect(navControllerStub.push).toHaveBeenCalledWith(ProfilePage, {
//                 userId: 'userId'
//             });
//         });
//     });

//     describe('doInfiniteScroll', () => {
//         it('should call onInput method', () => {
//             comp.enableInfiniteScroll = true;
//             spyOn(comp, 'onInput');
//             comp.doInfiniteScroll({});
//             expect(comp.onInput).toHaveBeenCalledWith(undefined, {});
//         });
//         it('should complete the scroll event by calling complete method, if infiniteScroll is off', () => {
//             comp.enableInfiniteScroll = false;
//             const scrollEvent = {
//                 complete: () => { { } }
//             };
//             spyOn(scrollEvent, 'complete');
//             comp.doInfiniteScroll(scrollEvent);
//             expect(scrollEvent.complete).toHaveBeenCalled();
//         });
//     });

//     describe('onInput', () => {
//         xit('Should present loader', () => {
//             const commonUtilServiceStub = TestBed.get(CommonUtilService);
//             comp.onInput(undefined, {});
//             fixture.detectChanges();
//             const loader = commonUtilServiceStub.getLoader();
//             expect(typeof loader.present).toBe('function');
//             spyOn(loader, 'present').and.callThrough();

//         });
//         it('Should call getLoader', () => {
//             const commonUtilServiceStub = TestBed.get(CommonUtilService);
//             commonUtilServiceStub.getLoader = jasmine.createSpy().and.callFake(() => {
//                 return { present: () => { }, dismiss: () => { } };
//             });
//             comp.onInput(undefined, {});
//             fixture.detectChanges();
//             const loader = commonUtilServiceStub.getLoader();
//             expect(commonUtilServiceStub.getLoader).toHaveBeenCalled();
//         });
//         it('Should call invokeElementMethod', () => {
//             spyOn(comp['renderer'], 'invokeElementMethod').and.callThrough();
//             const event = {
//                 target: {
//                     blur: () => ({})
//                 }
//             };
//             comp.onInput(event);
//             expect(comp['renderer'].invokeElementMethod).toHaveBeenCalledWith(event.target, 'blur');
//         });
//         xit('Should call getSessionData which should return null', (callback) => {
//             const authServiceStub: AuthService = fixture.debugElement.injector.get(AuthService);
//             spyOn(comp['renderer'], 'invokeElementMethod').and.callThrough();
//             const event = {
//                 target: {
//                     blur: () => ({})
//                 }
//             };
//             spyOn(authServiceStub, 'getSessionData').and.callFake((success) => {
//                 return success(null);
//             });
//             comp.onInput(event);
//             authServiceStub.getSessionData(success => {
//                 expect(success).toBe(null);
//                 console.log('AuthRes1', success);
//                 callback();
//             });
//             setTimeout(() => {
//                 expect(comp['renderer'].invokeElementMethod).toHaveBeenCalledWith(event.target, 'blur');
//                 // expect(authServiceStub.getSessionData).toHaveBeenCalledTimes(2);
//                 callback();
//             }, 0);
//         });
//         describe('OnInput with success callback', () => {
//             xit('should return object for getSessionData', (callback) => {
//                 const authServiceStub: AuthService = fixture.debugElement.injector.get(AuthService);
//                 const userServiceStub: UserProfileService = fixture.debugElement.injector.get(UserProfileService);
//                 spyOn(comp['renderer'], 'invokeElementMethod').and.callThrough();
//                 const event = {
//                     target: {
//                         blur: () => ({})
//                     }
//                 };
//                 spyOn(authServiceStub, 'getSessionData').and.callFake((success) => {
//                     return success({});
//                 });

//                 const responseObj = JSON.stringify({
//                     searchUser: JSON.stringify({
//                         count: 0,
//                         content: []
//                     })
//                 });
//                 const scrollEvent = {
//                     complete: () => ({})
//                 };
//                 spyOn(userServiceStub, 'searchUser').and.callFake(({ }, response, error) => {
//                     return response(responseObj);
//                 });
//                 spyOn(scrollEvent, 'complete');
//                 scrollEvent.complete = jasmine.createSpy().and.callFake(() => {
//                     return true;
//                 });
//                 comp.searchInput = 'abc';
//                 comp.apiOffset = 0;
//                 comp.apiLimit = 10;
//                 comp.onInput(event, scrollEvent);
//                 authServiceStub.getSessionData(success => {

//                     expect(success).toBeTruthy();
//                     expect(scrollEvent.complete).toHaveBeenCalled();
//                     expect(userServiceStub.searchUser).toHaveBeenCalled();
//                     expect(userServiceStub.searchUser).toBeTruthy();
//                     callback();
//                 });
//                 setTimeout(() => {
//                     expect(comp['renderer'].invokeElementMethod).toHaveBeenCalledWith(event.target, 'blur');
//                     expect(authServiceStub.getSessionData).toHaveBeenCalled();
//                     callback();
//                 }, 100);
//             });

//             it('should return session object for sessionData', (callback) => {
//                 const authServiceStub: AuthService = fixture.debugElement.injector.get(AuthService);
//                 spyOn(comp['renderer'], 'invokeElementMethod').and.callThrough();
//                 const event = {
//                     target: {
//                         blur: () => ({})
//                     }
//                 };
//                 spyOn(authServiceStub, 'getSessionData').and.callFake((success) => {
//                     return success({});
//                 });
//                 comp.searchInput = '';
//                 comp.apiOffset = 0;
//                 comp.apiLimit = 10;
//                 comp.onInput(event);
//                 authServiceStub.getSessionData(success => {
//                     expect(success).toBeTruthy();
//                     expect(comp.userList).toEqual([]);
//                     expect(comp.showEmptyMessage).toBeFalsy();
//                     expect(comp['renderer'].invokeElementMethod).toHaveBeenCalledWith(event.target, 'blur');
//                     callback();
//                 });
//             });
//             it('should show toast Message', (callback) => {
//                 const authServiceStub: AuthService = fixture.debugElement.injector.get(AuthService);
//                 const userServiceStub: UserProfileService = fixture.debugElement.injector.get(UserProfileService);
//                 const loadingControllerStub: LoadingController = fixture.debugElement.injector.get(LoadingController);
//                 const commonUtilServiceStub = TestBed.get(CommonUtilService);
//                 // spyOn(comp["renderer"], 'invokeElementMethod').and.callThrough();
//                 const event = {
//                     target: {
//                         blur: () => ({})
//                     }
//                 };
//                 spyOn(authServiceStub, 'getSessionData').and.callFake((success) => {
//                     return success({});
//                 });
//                 spyOn(userServiceStub, 'searchUser').and.callFake(({ }, response, error) => {
//                     return error({});
//                 });
//                 comp.searchInput = 'abc';
//                 comp.apiOffset = 0;
//                 comp.apiLimit = 10;
//                 const scrollEvent = {
//                     complete: () => { { } }
//                 };
//                 scrollEvent.complete = jasmine.createSpy().and.callFake(() => {
//                     return true;
//                 });

//                 commonUtilServiceStub.showToast = jasmine.createSpy().and.callFake(() => {
//                     return {
//                         present: () => ({})
//                     };
//                 });
//                 comp.onInput(undefined, scrollEvent);
//                 authServiceStub.getSessionData(error => {
//                     expect(error).toBeTruthy();
//                     expect(scrollEvent.complete).toHaveBeenCalled();
//                     /// expect(comp["renderer"].invokeElementMethod).toHaveBeenCalledWith(event.target, 'blur');
//                     // expect(comp.getToast).toHaveBeenCalledWith('Due to a technical problem, we are unable to process the request');
//                     callback();
//                 });
//             });
//         });
//     });
// });
