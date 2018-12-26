// import {
//     ProfileService, SharedPreferences, TelemetryService, ServiceProvider,
//     AuthService, BuildParamService, FrameworkService
// } from 'sunbird';
// import 'rxjs/add/observable/of';
// import { Observable } from 'rxjs';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//     async, ComponentFixture,
//     fakeAsync, TestBed
// } from '@angular/core/testing';
// import { Network } from '@ionic-native/network';

// import {
//     TranslateModule,
//     TranslateService
// } from '../../../../node_modules/@ngx-translate/core';
// import {
//     Events, LoadingController, NavController,
//     PopoverController, ToastController
// } from '../../../../node_modules/ionic-angular';
// import { AppGlobalService } from '../../../service/app-global.service';
// import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';
// import { GuestProfilePage } from './guest-profile';
// import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
// import {
//     LoadingControllerMock, TranslateServiceStub,
//     ToastControllerMockNew, PopoverControllerMock, AuthServiceMock,
//     AppGlobalServiceMock, NavMock, ProfileServiceMock,
//     FormAndFrameworkUtilServiceMock, EventsMock
// } from '../../../../test-config/mocks-ionic';
// import { CommonUtilService } from '../../../service/common-util.service';

// describe('GuestProfilePage', () => {
//     let comp: GuestProfilePage;
//     let fixture: ComponentFixture<GuestProfilePage>;
//     let spyObj;
//     beforeEach(async(() => {
//         const NetworkStub = {
//             type: '',
//             onConnect: () => ({
//                 subscribe: () => { }
//             }),
//             onDisconnect: () => ({
//                 subscribe: () => { }
//             })
//         };

//         const telemetryGeneratorServiceStub = {
//             generateImpressionTelemetry: () => ({}),
//             generateInteractTelemetry: () => ({})
//         };

//         TestBed.configureTestingModule({
//             imports: [TranslateModule.forRoot()],
//             declarations: [GuestProfilePage],
//             schemas: [NO_ERRORS_SCHEMA],
//             providers: [TelemetryGeneratorService, TelemetryService, ServiceProvider, SharedPreferences, BuildParamService,
//                 FrameworkService, CommonUtilService,
//                 { provide: NavController, useClass: NavMock },
//                 { provide: AuthService, useClass: AuthServiceMock },
//                 { provide: Network, useValue: NetworkStub },
//                 { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
//                 { provide: ProfileService, useClass: ProfileServiceMock },
//                 { provide: Events, useClass: EventsMock },
//                 // { provide: SharedPreferences, useValue: SharedPreferencesMock },
//                 { provide: TranslateService, useClass: TranslateServiceStub },
//                 { provide: AppGlobalService, useClass: AppGlobalServiceMock },
//                 { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
//                 { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
//                 { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
//                 { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }
//             ]
//         });
//     }));

//     it('should set showSignInCard to \'true\'', () => {
//         const appGlobal = TestBed.get(AppGlobalService);
//         spyOn(appGlobal, 'getGuestUserType').and.returnValue('TEACHER');
//         spyOn(appGlobal, 'DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER').and.returnValue(true);
//         fixture = TestBed.createComponent(GuestProfilePage);
//         comp = fixture.componentInstance;
//         expect(comp.showSignInCard).toBe(true);
//     });

//     it('should set showSignInCard to \'true\'', () => {
//         const appGlobal = TestBed.get(AppGlobalService);
//         spyOn(appGlobal, 'getGuestUserType').and.returnValue('STUDENT');
//         spyOn(appGlobal, 'DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT').and.returnValue(true);
//         fixture = TestBed.createComponent(GuestProfilePage);
//         comp = fixture.componentInstance;
//         expect(comp.showSignInCard).toBe(true);
//     });

//     beforeEach(async () => {
//         const code = 'selected_language_code';
//         const SharedPreferenceStub = TestBed.get(SharedPreferences);
//         spyOn(SharedPreferenceStub, 'getString').and.returnValue(Promise.resolve('en'));

//         const profileServiceStub = TestBed.get(ProfileService);
//         spyObj = spyOn(profileServiceStub, 'getCurrentUser');
//         spyObj.and.callFake((success, error) => {
//             error('error');
//         });
//         fixture = TestBed.createComponent(GuestProfilePage);
//         comp = fixture.componentInstance;
//     });

//     const getLoader = () => {
//         const loadingController = TestBed.get(LoadingController);
//         comp.getLoader();
//     };

//     it('should load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('ionViewDidLoad makes expected calls', () => {
//         const telemetryGeneratorServiceStub = TestBed.get(TelemetryGeneratorService);
//         const appGloabal = TestBed.get(AppGlobalService);
//         spyOn(telemetryGeneratorServiceStub, 'generateImpressionTelemetry');
//         spyOn(appGloabal, 'generateConfigInteractEvent');
//         comp.ionViewDidLoad();
//         expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
//         expect(appGloabal.generateConfigInteractEvent).toHaveBeenCalled();
//     });

//     it('imageUri defaults to: assets/imgs/ic_profile_default.png', () => {
//         expect(comp.imageUri).toBe('assets/imgs/ic_profile_default.png');
//         expect(comp.imageUri).not.toBe('');
//         expect(typeof comp.imageUri).toBe('string');
//         expect(typeof comp.imageUri).not.toBe('object');
//     });

//     it('showSignInCard defaults to: false and type should be boolean', () => {
//         expect(comp.showSignInCard).toBe(false);
//         expect(comp.showSignInCard).not.toBe(true);
//         expect(typeof comp.showSignInCard).toBe('boolean');
//         expect(typeof comp.showSignInCard).not.toBe('object');
//     });

//     it('showWarning defaults to: false and type should be boolean', () => {
//         expect(comp.showWarning).toBe(false);
//         expect(comp.showWarning).not.toBe(true);
//         expect(typeof comp.showWarning).toBe('boolean');
//         expect(typeof comp.showWarning).not.toBe('object');
//     });

//     it('boards defaults to: ""', () => {
//         expect(comp.boards).toBe('');
//         expect(comp.boards.length).toBe(0);
//         expect(typeof comp.boards).toBe('string');
//         expect(typeof comp.boards).not.toBe('object');
//     });

//     it('grade defaults to: ""', () => {
//         expect(comp.grade).toBe('');
//         expect(comp.grade.length).toBe(0);
//         expect(typeof comp.grade).toBe('string');
//         expect(typeof comp.grade).not.toBe('object');
//     });

//     it('medium defaults to: ""', () => {
//         expect(comp.medium).toBe('');
//         expect(comp.medium.length).toBe(0);
//         expect(typeof comp.medium).toBe('string');
//         expect(typeof comp.medium).not.toBe('object');
//     });

//     it('subjects defaults to: ""', () => {
//         expect(comp.subjects).toBe('');
//         expect(comp.subjects.length).toBe(0);
//         expect(typeof comp.subjects).toBe('string');
//         expect(typeof comp.subjects).not.toBe('object');
//     });

//     it('syllabus defaults to: ""', () => {
//         expect(comp.syllabus).toBe('');
//         expect(comp.syllabus.length).toBe(0);
//         expect(typeof comp.syllabus).toBe('string');
//         expect(typeof comp.syllabus).not.toBe('object');
//     });

//     it('categories defaults should be: empty array', () => {
//         expect(comp.categories).toEqual([]);
//         expect(typeof comp.categories).toEqual('object');
//     });

//     it('profile defaults should be: empty Object', () => {
//         expect(comp.profile).toEqual({});
//         expect(typeof comp.profile).toEqual('object');
//     });

//     describe('Constructor', () => { // Need to improve
//         it('should call getString to fetch selected_language_code', (done) => {
//             const SharedPreferencesStub = TestBed.get(SharedPreferences);

//             SharedPreferencesStub.getString().then(() => {
//                 expect(SharedPreferencesStub.getString).toHaveBeenCalled();
//                 expect(comp.selectedLanguage).toEqual('en');
//                 done();
//             });
//         });
//     });

//     it('refreshProfileData should make expected calls', () => {
//         getLoader();
//         const ProfileServiceStub = TestBed.get(ProfileService);
//         const response = {
//             id: 'abcd'
//         };
//         spyObj.and.callFake((res, err) => {
//             res(JSON.stringify(response));
//         });
//         spyOn(comp, 'getSyllabusDetails');
//         comp.refreshProfileData(false, true);
//         expect(comp.profile).toEqual(response);
//         expect(comp.getSyllabusDetails).toHaveBeenCalled();
//         // setTimeout(() => {
//         //     let refresher = jasmine.createSpyObj('refresher', ['complete']);
//         //     expect(refresher.complete).toHaveBeenCalled();
//         // },500)
//     });

//     it('editGuestProfile should call GuestEditProfile page', () => {
//         const navControllerStub = TestBed.get(NavController);
//         spyOn(navControllerStub, 'push');
//         comp.editGuestProfile();
//         expect(comp.editGuestProfile).toBeDefined();
//         expect(navControllerStub.push).toHaveBeenCalled();
//     });

//     it('showNetworkWarning should set showWarning to true', (done) => {
//         comp.showNetworkWarning();
//         expect(comp.showWarning).toBe(true);
//         setTimeout(() => {
//             expect(comp.showWarning).toBe(false);
//             done();
//         }, 3500);
//     });

//     it('should handle success scenario for getSyllabusDetails', (done) => {
//         getLoader();
//         const data = [{ name: 'sampleName', frameworkId: 'sampleSyllabus' }];
//         comp.profile = {
//             syllabus: ['sampleSyllabus']
//         };
//         const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
//         spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(data));
//         spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails');
//         comp.getSyllabusDetails();
//         expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
//         setTimeout(() => {
//             expect(comp.syllabus).toEqual(data[0].name);
//             expect(formAndFrameworkUtilServiceStub.getFrameworkDetails).toHaveBeenCalledWith(data[0].frameworkId);
//             done();
//         }, 10);
//     });

//     it('should handle failure scenario for getSyllabusDetails', () => {
//         getLoader();
//         const data = [];
//         comp.profile = {
//             syllabus: ['sampleSyllabus']
//         };
//         const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
//         spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(data));
//         spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails');
//         comp.getSyllabusDetails();
//         expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
//         // expect(comp.syllabus).toEqual(data[0].name);
//     });

//     it('should handle success scenario for getFrameworkDetails', (done) => {
//         getLoader();
//         const data = ['sampleCategory'];
//         comp.profile = {
//             board: ['sampleBoard'],
//             medium: ['sampleMedium'],
//             grade: ['sampleGrade'],
//             subject: ['sampleSubject']
//         };
//         const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
//         spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(data));
//         spyOn(comp, 'getFieldDisplayValues');
//         comp.getFrameworkDetails('string');
//         setTimeout(() => {
//             expect(comp.categories).toEqual(data);
//             done();
//         }, 10);

//     });

//     it('getFieldDisplayValues should call arrayToString', () => {
//         const data = ['sampleTerms'];
//         comp.categories = [{ terms: ['sampleTerms'] }];
//         comp.getFieldDisplayValues(data, 0);
//         spyOn(comp, 'arrayToString');
//     });

//     // it("arrayToString", () =>)

//     it('goToRoles should make expected calls', () => {
//         const navCtrl = TestBed.get(NavController);
//         spyOn(navCtrl, 'push');
//         comp.goToRoles();
//         expect(navCtrl.push).toHaveBeenCalled();
//     });

//     // describe('goToRoles', () => {
//     //     it('should call goToRoles page', () => {
//     //         const navControllerStub: NavController = TestBed.get(NavController);
//     //         spyOn(comp, 'goToRoles');
//     //         spyOn(navControllerStub, "push");
//     //         comp.goToRoles();
//     //         expect(comp.goToRoles).toBeDefined();
//     //         expect(comp.goToRoles).toHaveBeenCalled();
//     //         //expect(navControllerStub.push).toHaveBeenCalled();
//     //     });
//     // });

//     it('should call showNetworkWarning method', () => {
//         spyOn(comp, 'showNetworkWarning');
//         comp.buttonClick();
//         expect(comp.buttonClick).toBeDefined();
//         expect(comp.showNetworkWarning).toHaveBeenCalled();
//     });

//     describe('arrayToString', () => {
//         it('should convert String Array to single string', () => {
//             spyOn(comp, 'arrayToString');
//             expect(comp.arrayToString).toBeDefined();
//             const arg: Array<string> = ['abcd', 'xyz'];
//             comp.arrayToString(arg);
//             expect(comp.arrayToString).toHaveBeenCalled();
//             expect(typeof arg).toBe('object');
//             expect(Array.isArray(arg)).toBe(true);
//             expect(comp.arrayToString).toHaveBeenCalledWith(arg);
//             // expect(comp.arrayToString(arg)).toEqual("abcd, xyz");
//         });
//     });

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
// });
