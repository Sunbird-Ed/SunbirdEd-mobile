// import { PlatformMock } from './../../../../test-config/mocks-ionic';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { NavController } from 'ionic-angular';
// import { NavParams } from 'ionic-angular';
// import { LoadingController } from 'ionic-angular';
// import { GroupService, ProfileType, UserSource, SharedPreferences } from 'sunbird';
// import { ProfileService, ServiceProvider } from 'sunbird';
// import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
// import { CommonUtilService } from '../../../service/common-util.service';
// import { GroupMembersPage } from './group-members';
// import {
//     ToastController,
//     PopoverController
// } from 'ionic-angular';
// import {
//     NavMock, NavParamsMock, LoadingControllerMock, GroupServiceMock,
//     ProfileServiceMock, TranslateServiceStub, TelemetryServiceMock, ToastControllerMock
// } from '../../../../test-config/mocks-ionic';
// import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';
// import { mockRes } from './group-members.data.spec';

// import { } from 'jasmine';
// import { promise } from 'protractor';
// import { Events } from 'ionic-angular';
// import { PopoverControllerMock } from 'ionic-mocks';
// import { doesNotThrow } from 'assert';

// describe('GroupMembersPage', () => {


//     let comp: GroupMembersPage;
//     let fixture: ComponentFixture<GroupMembersPage>;

//     beforeEach(() => {
//         const telemetryGeneratorServiceStub = {
//             generateImpressionTelemetry: () => ({}),
//             generateInteractTelemetry: () => ({})
//         };
//         TestBed.configureTestingModule({
//             declarations: [GroupMembersPage],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [TranslateModule.forRoot()],


//             providers: [CommonUtilService, ProfileService, ServiceProvider, SharedPreferences, Events,
//                 { provide: NavController, useClass: NavMock },
//                 { provide: NavParams, useClass: NavParamsMock },
//                 { provide: LoadingController, useClass: LoadingControllerMock },
//                 { provide: GroupService, useClass: GroupServiceMock },
//                 // { provide: ProfileService, useClass: ProfileServiceMock },
//                 { provide: TranslateService, useClass: TranslateServiceStub },
//                 { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
//                 { provide: ToastController, useClass: ToastControllerMock },
//                 { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
//             ]
//         });
//         fixture = TestBed.createComponent(GroupMembersPage);
//         comp = fixture.componentInstance;
//     });

//     it('can load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('userList defaults to: []', () => {
//         expect(comp.userList).toEqual([]);
//     });

//     it('#ionViewDidLoad should be makes expected calls', () => {
//         const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
//         spyOn(telemetryGeneratorServiceStub, 'generateImpressionTelemetry');
//         comp.ionViewDidLoad();
//         expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
//     });
//     it('#ionViewWillEnter should be makes expected calls', () => {
//         spyOn(comp, 'getAllProfile');
//         comp.ionViewWillEnter();
//         expect(comp.getAllProfile).toHaveBeenCalled();
//     });
//     it('#getLastCreatedProfile should be create profile data', () => {
//         const profileServiceStub = TestBed.get(ProfileService);
//         expect(comp.getLastCreatedProfile).toBeDefined();
//         spyOn(profileServiceStub, 'getProfile').and.returnValue((req, res, err) => res(mockRes.profile));
//         comp.getLastCreatedProfile();
//         expect(profileServiceStub.getProfile).toHaveBeenCalled();
//     });
//     it('#getLastCreatedProfile should be create profile data', () => {
//         const profileServiceStub = TestBed.get(ProfileService);
//         expect(comp.getLastCreatedProfile).toBeDefined();
//         spyOn(profileServiceStub, 'getProfile').and.returnValue((req, res, err) => err('err'));
//         comp.getLastCreatedProfile();
//         expect(profileServiceStub.getProfile).toHaveBeenCalled();
//     });
//     it('#getAllProfile should be makes expected calls', () => {
//         // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
//         const profileServiceStub = TestBed.get(ProfileService);
//         spyOn(profileServiceStub, 'getAllUserProfile').and.returnValue(Promise.resolve([mockRes.userData]));

//         //  spyOn(ngZoneStub, 'run');
//         // spyOn(profileServiceStub, 'getAllUserProfile');
//         comp.getAllProfile();
//         //
//         //  expect(ngZoneStub.run).toHaveBeenCalled();
//         expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
//     });

//     it('#toggleSelect should read toggleSelect param', () => {
//         spyOn(comp, 'toggleSelect').and.callThrough();
//         comp.userList = [mockRes.userData];
//         comp.toggleSelect(0);
//         expect(comp.toggleSelect).toHaveBeenCalled();
//     });
//     it('#toggleSelect should read toggleSelect param', () => {
//         spyOn(comp, 'toggleSelect').and.callThrough();
//         comp.userList = [mockRes.userData];
//         comp.userSelectionMap.set('', true);
//         comp.toggleSelect(0);
//         expect(comp.toggleSelect).toHaveBeenCalled();
//     });
//     it('#isUserSelected should read toggleSelect param', () => {
//         spyOn(comp, 'isUserSelected').and.callThrough();
//         comp.userList = [mockRes.userData];
//         comp.userSelectionMap.set('userId', true);
//         comp.isUserSelected(0);
//         expect(comp.isUserSelected).toHaveBeenCalled();
//     });

//     it('#getGradeNameFromCode should read toggleSelect param', () => {
//         spyOn(comp, 'getGradeNameFromCode').and.callThrough();
//         const userListData = mockRes.userData;
//         userListData['grade'] = ['grade1'];
//         userListData['gradeValueMap'] = { 'grade1': 'class1' };
//         userListData['gradeName'] = [];
//         userListData['name'] = 'Name';

//         comp.userSelectionMap.set('userId', true);
//         comp.getGradeNameFromCode(userListData);
//         expect(comp.getGradeNameFromCode).toHaveBeenCalled();
//     });
//     it('#getGradeNameFromCode It should read toggleSelect param', () => {
//         spyOn(comp, 'getGradeNameFromCode').and.callThrough();
//         const userListData = mockRes.userData;
//         userListData['grade'] = ['grade1'];
//         delete userListData['gradeValueMap'];
//         userListData['gradeName'] = [];
//         userListData['name'] = 'Name';

//         comp.userSelectionMap.set('userId', true);
//         comp.getGradeNameFromCode(userListData);
//         expect(comp.getGradeNameFromCode).toHaveBeenCalled();
//     });
//     it('#getGradeNameFromCode should read toggleSelect param', () => {
//         spyOn(comp, 'getGradeNameFromCode').and.callThrough();
//         const userListData = mockRes.userData;
//         delete userListData['grade'];
//         delete userListData['gradeValueMap'];
//         userListData['gradeName'] = [];
//         userListData['name'] = 'Name';
//         comp.userSelectionMap.set('userId', true);
//         comp.getGradeNameFromCode(userListData);
//         expect(comp.getGradeNameFromCode).toHaveBeenCalled();
//     });

//     it('#selectAll should be makes expected calls', () => {
//         comp.userList =
//             [mockRes.userData];
//         // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
//         // spyOn(ngZoneStub, 'run');
//         comp.selectAll();
//         // expect(ngZoneStub.run).toHaveBeenCalled();
//     });
//     it('#getLoader should return Loading object', () => {
//         const loadingCtrlStub = TestBed.get(LoadingController);
//         expect(comp.getLoader).toBeDefined();
//         spyOn(comp, 'getLoader').and.callThrough();
//         spyOn(loadingCtrlStub, 'create');
//         comp.getLoader();
//         expect(comp.getLoader).toHaveBeenCalled();
//         expect(loadingCtrlStub.create).toHaveBeenCalled();
//     });
//     it('#goTOGuestEdit should be makes expected calls', (done) => {
//         const navControllerStub = TestBed.get(NavController);
//         expect(comp.goTOGuestEdit).toBeDefined();
//         spyOn(comp, 'getLastCreatedProfile').and.returnValue(Promise.resolve('data'));
//         spyOn(navControllerStub, 'push');
//         comp.goTOGuestEdit();
//         setTimeout(() => {
//             expect(navControllerStub.push).toHaveBeenCalled();
//             done();
//         }, 100);
//     });
//     it('#goTOGuestEdit should be makes expected calls', (done) => {
//         const navControllerStub = TestBed.get(NavController);
//         expect(comp.goTOGuestEdit).toBeDefined();
//         spyOn(comp, 'getLastCreatedProfile').and.returnValue(Promise.reject('error'));
//         spyOn(navControllerStub, 'push');
//         comp.goTOGuestEdit();
//         setTimeout(() => {
//             expect(navControllerStub.push).toHaveBeenCalled();
//             done();
//         }, 100);
//     });

//     it('#createGroup should be makes expected calls', () => {
//         const navControllerStub = TestBed.get(NavController);
//         const groupServiceStub = TestBed.get(GroupService);
//         const telemetryGeneratorServiceStub = TestBed.get(TelemetryGeneratorService);
//         const CommonUtilServiceStub = TestBed.get(CommonUtilService);
//         // comp.getLoader = jasmine.createSpy().and.callFake(() => {
//         //     return { present: () => { }, dismiss: () => { } };
//         // });
//         const response = {
//             result: {
//                 gid: 'test'
//             }
//         };
//         spyOn(groupServiceStub, 'createGroup').and.returnValue(Promise.resolve([response]));
//        // spyOn(comp, 'getLoader');
//        // spyOn(comp, 'getToast');
//         // spyOn(CommonUtilServiceStub, 'translateMessage');
//         // spyOn(navControllerStub, 'popTo');
//         // spyOn(navControllerStub, 'getByIndex');
//         // spyOn(navControllerStub, 'length');
//         // spyOn(comp, 'createGroup');
//         // spyOn(groupServiceStub, 'addUpdateProfilesToGroup');
//         // spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
//         comp.createGroup();
//         expect(comp.getLoader).toHaveBeenCalled();
//         // expect(comp.getToast).toHaveBeenCalled();
//         // expect(CommonUtilServiceStub.translateMessage).toHaveBeenCalled();
//         // expect(navControllerStub.popTo).toHaveBeenCalled();
//         // expect(navControllerStub.getByIndex).toHaveBeenCalled();
//         // expect(navControllerStub.length).toHaveBeenCalled();
//         expect(groupServiceStub.createGroup).toHaveBeenCalled();
//         // expect(groupServiceStub.addUpdateProfilesToGroup).toHaveBeenCalled();
//         // expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
//     });

// });
