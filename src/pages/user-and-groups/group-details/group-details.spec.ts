// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//     TranslateService, TranslateModule,
//     TranslateLoader
// } from '@ngx-translate/core';
// import { NavController } from 'ionic-angular';
// import { NavParams, IonicModule } from 'ionic-angular';
// import { LoadingController } from 'ionic-angular';
// import { PopoverController } from 'ionic-angular';
// import { AlertController } from 'ionic-angular';
// import {
//     GroupService, ProfileType, ServiceProvider,
//     BuildParamService, FrameworkService, TelemetryService
// } from 'sunbird';
// import { ProfileService } from 'sunbird';
// import { OAuthService, } from 'sunbird';
// import { ContainerService } from 'sunbird';
// import { SharedPreferences } from 'sunbird';
// import { AuthService } from 'sunbird';
// import { Events } from 'ionic-angular';
// import { AppGlobalService } from '../../../service/app-global.service';
// import { App } from 'ionic-angular';
// import { ToastController } from 'ionic-angular';
// import { Network } from '@ionic-native/network';
// import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
// import { GroupDetailsPage } from './group-details';
// import { } from 'jasmine';
// import {
//     mockAllProfiles,
//     selectedUser, userUids
// } from '../group-details/group-detail.data.spec';
// import {
//     NavParamsMock, ToastControllerMock,
//     TranslateLoaderMock, TranslateServiceStub, NavControllerMock, LoadingControllerMock,
//     PopoverControllerMock, AlertControllerMock,
//     ProfileServiceMock, ContainerServiceMock, AuthServiceMock, SharedPreferencesMock, EventsMock,
//     AppGlobalServiceMock, AppMock, GroupServiceMock, OAuthServiceMock
// } from '../../../../test-config/mocks-ionic';

// describe('GroupDetailsPage', () => {
//     let comp: GroupDetailsPage;
//     let fixture: ComponentFixture<GroupDetailsPage>;

//     beforeEach(() => {

//         TestBed.configureTestingModule({
//             declarations: [GroupDetailsPage],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [
//                 IonicModule.forRoot(GroupDetailsPage),
//                 TranslateModule.forRoot({
//                     loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
//                 }),
//             ],
//             providers: [
//                 ServiceProvider, BuildParamService, FrameworkService, ProfileService,
// TelemetryGeneratorService, TelemetryService, Network,
//                 { provide: TranslateService, useClass: TranslateServiceStub },
//                 { provide: NavController, useClass: NavControllerMock },
//                 { provide: NavParams, useClass: NavParamsMock },
//                 { provide: LoadingController, useClass: LoadingControllerMock },
//                 { provide: PopoverController, useClass: PopoverControllerMock },
//                 { provide: AlertController, useClass: AlertControllerMock },
//                 { provide: GroupService, useClass: GroupServiceMock },
//                 { provide: OAuthService, useClass: OAuthServiceMock },
//                 { provide: ContainerService, useClass: ContainerServiceMock },
//                 { provide: SharedPreferences, useClass: SharedPreferencesMock },
//                 { provide: AuthService, useClass: AuthServiceMock },
//                 { provide: Events, useClass: EventsMock },
//                 { provide: AppGlobalService, useClass: AppGlobalServiceMock },
//                 { provide: App, useClass: AppMock },
//                 { provide: ToastController, useClass: ToastControllerMock },
//                 { provide: ProfileService, useClass: ProfileServiceMock },
//                 { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
//                 // { provide: TelemetryGeneratorService, useClass: TelemetryServiceMock }
//             ]
//         });

//         // GroupDetailsPage.prototype.group = {
//         //     name: 'group_name'
//         // };
//         // GroupDetailsPage.prototype.group.gid = 'sample_group_id';
//         // GroupDetailsPage.prototype.currentGroupId = 'sample_group_id';

//         // const navParamsStub = TestBed.get(NavParams);
//         // navParamsStub.data = {
//         //     name: 'sample_group_name',
//         //     gid: 'sample_group_id'
//         // }

//         fixture = TestBed.createComponent(GroupDetailsPage);
//         comp = fixture.componentInstance;

//     });
//     const getLoader = () => {
//         const loadingController = TestBed.get(LoadingController);
//         comp.getLoader();
//     };


//     it('#constructor can load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('#constructor  userList defaults to: []', () => {
//         expect(comp.userList).toEqual([]);
//     });

//     it('#constructor  userUids defaults to: []', () => {
//         expect(comp.userUids).toEqual([]);
//     });

//     it('#constructor isNoUsers defaults to: false', () => {
//         expect(comp.isNoUsers).toEqual(false);
//     });

//     it('#constructor isCurrentGroupActive defaults to: true', () => {
//         expect(comp.isCurrentGroupActive).toEqual(false);
//     });

//     it('#ionViewWillEnter should call getAllProfile', () => {
//         expect(comp.ionViewWillEnter).toBeDefined();
//         spyOn(comp, 'ionViewWillEnter').and.callThrough();
//         spyOn(comp, 'getAllProfile');
//         comp.ionViewWillEnter();
//         expect(comp.ionViewWillEnter).toHaveBeenCalled();
//         expect(comp.getAllProfile).toHaveBeenCalled();
//     });

//     it('#resizeContent should call', () => {
//         expect(comp.resizeContent).toBeDefined();
//         spyOn(comp.content, 'resize');
//         spyOn(comp, 'resizeContent').and.callThrough();
//         comp.resizeContent();
//         expect(comp.resizeContent).toHaveBeenCalled();
//         expect(comp.content.resize).toHaveBeenCalled();
//     });
//     it('#getAllProfile should fetch all profile details', (done) => {
//         const profileServiceStub = TestBed.get(ProfileService);

//         expect(comp.getAllProfile).toBeDefined();
//         spyOn(comp, 'getAllProfile').and.callThrough();
//         spyOn(comp, 'getLoader').and.returnValue({ present: () => { } });
//         spyOn(profileServiceStub, 'getAllUserProfile').and.returnValue(Promise.resolve(JSON.stringify(mockAllProfiles)));
//         comp.getAllProfile();

//         setTimeout(() => {
//             expect(comp.getAllProfile).toHaveBeenCalled();
//             expect(comp.getLoader).toHaveBeenCalled();
//             done();
//         }, 10);
//     });

//     it('#selectUser should call', () => {
//         expect(comp.selectUser).toBeDefined();
//         spyOn(comp, 'selectUser').and.callThrough();
//         comp.selectUser(23232, '242423');
//         expect(comp.selectUser).toHaveBeenCalled();
//     });
//     it('#switchAccountConfirmBox should call', () => {
//         const uid = '1234';

//         const TelemetryGeneratorServiceStub = TestBed.get(TelemetryGeneratorService);
//         // const  telemetryObject = TestBed.get(TelemetryObject)
//         expect(comp.switchAccountConfirmBox).toBeDefined();
//         spyOn(TelemetryGeneratorServiceStub, 'generateInteractTelemetry').and.callFake(() => { });
//         // spyOn(comp, 'switchAccountConfirmBox');
//         spyOn(comp, 'switchAccountConfirmBox').and.callThrough();
//         comp.switchAccountConfirmBox();
//         expect(TelemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
//         expect(comp.switchAccountConfirmBox).toHaveBeenCalled();
//         expect(comp.switchAccountConfirmBox).toHaveBeenCalled();
//     });

//     it('#play should call', () => {
//         expect(comp.play).toBeDefined();
//         const groupServiceStub = TestBed.get(GroupService);
//         spyOn(groupServiceStub, 'setCurrentGroup').and.returnValue(Promise.resolve({}));
//         spyOn(comp, 'play').and.callThrough();
//         comp.play();

//         expect(comp.play).toHaveBeenCalled();
//     });

//     it('#play should call', () => {
//         expect(comp.play).toBeDefined();
//         const AppGlobalServiceStub = TestBed.get(AppGlobalService);
//         AppGlobalServiceMock.isGuestUser = true;
//         spyOn(comp, 'play').and.callThrough();
//         comp.play();
//         expect(comp.play).toHaveBeenCalled();
//     });
//     it('# Logout call', () => {
//         const authService = TestBed.get(AuthService);
//         expect(comp.play).toBeDefined();
//         // spyOn(authService,'endSession');
//         spyOn(comp, 'logOut');
//         comp.logOut(selectedUser, false);
//         expect(comp.logOut).toHaveBeenCalled();
//     });
//     it('# Logout call', () => {
//         const authService = TestBed.get(AuthService);
//         window['splashscreen'] = {
//             clearPrefs: () => ({})
//         };
//         spyOn(window['splashscreen'], 'clearPrefs').and.callFake(() => {
//         });

//         expect(comp.logOut).toBeDefined();
//         spyOn(authService, 'endSession');
//         spyOn(comp, 'logOut').and.callThrough();
//         comp.logOut(selectedUser, true);
//         expect(comp.logOut).toHaveBeenCalled();
//     });

//     it('# Logout call', () => {
//         const authService = TestBed.get(AuthService);
//         expect(comp.play).toBeDefined();
//         // spyOn(authService,'endSession');
//         spyOn(comp, 'logOut').and.callThrough();
//         comp.logOut(selectedUser, false);
//         expect(comp.logOut).toHaveBeenCalled();
//     });
//     it('# Logout call and will do session end', () => {
//         const authService = TestBed.get(AuthService);
//         spyOn(comp, 'logOut').and.callThrough();
//         comp.logOut(selectedUser, false);
//         expect(comp.logOut).toHaveBeenCalled();
//     });
//     it('# Logout call and will check the network', () => {
//         const authService = TestBed.get(AuthService);
//         const network = TestBed.get(Network);
//         spyOnProperty(network, 'type').and.returnValue('none');
//         spyOn(authService, 'endSession');
//         spyOn(comp, 'logOut').and.callThrough();
//         comp.logOut(selectedUser, false);
//         expect(comp.logOut).toHaveBeenCalled();
//     });
//     it('# Logout call and will check the network if its not there user ll be logout', () => {
//         const oauth = TestBed.get(OAuthService);
//         window['splashscreen'] = {
//             clearPrefs: () => ({})
//         };
//         spyOn(window['splashscreen'], 'clearPrefs').and.callFake(() => {
//         });
//         spyOn(comp, 'logOut').and.callThrough();
//         spyOn(oauth, 'doLogOut');
//         comp.logOut(selectedUser, false);
//         expect(comp.logOut).toHaveBeenCalled();
//     });

//     it('# setAsCurrentUser should call', () => {
//         const groupServiceStub = TestBed.get(GroupService);
//         const profileServiceStub = TestBed.get(ProfileService);

//         spyOn(comp, 'setAsCurrentUser').and.callThrough();
//         // spyOn(profileServiceStub, 'setAsCurrentUser').and.callThrough();
//         comp.setAsCurrentUser(selectedUser, true);
//         expect(comp.setAsCurrentUser).toHaveBeenCalled();
//     });
//     it('# setAsCurrentUser should check content is being played', () => {
//         const groupServiceStub = TestBed.get(GroupService);
//         const profileServiceStub = TestBed.get(ProfileService);
//         spyOn(comp, 'setAsCurrentUser').and.callThrough();

//         //   spyOn(comp, 'setCurrentUser').and.callThrough();
//         spyOn(profileServiceStub, 'setCurrentUser').and.callFake((arg, success, err) => {

//             return success();
//         });
//         comp.setAsCurrentUser(selectedUser, true);
//         expect(comp.setAsCurrentUser).toHaveBeenCalled();
//     });
//     it('# setAsCurrentUser if content is not played', () => {
//         const groupServiceStub = TestBed.get(GroupService);
//         const profileServiceStub = TestBed.get(ProfileService);
//         spyOn(comp, 'setAsCurrentUser').and.callThrough();

//         //   spyOn(comp, 'setCurrentUser').and.callThrough();
//         spyOn(profileServiceStub, 'setCurrentUser').and.callFake((arg, success, err) => {

//             return success();
//         });
//         comp.setAsCurrentUser(selectedUser[0], false);
//         expect(comp.setAsCurrentUser).toHaveBeenCalled();
//     });

//     it('# getAllProfile should call', () => {

//         spyOn(comp, 'getAllProfile').and.callThrough();
//         comp.getAllProfile();
//         expect(comp.getAllProfile).toHaveBeenCalled();

//     });
//     it('# getAllProfile should call', () => {
//         const profileRequest = {
//             local: true,
//             groupId: 'id123'
//         };
//         const profileServiceStub = TestBed.get(ProfileService);
//         spyOn(comp, 'getAllProfile').and.callThrough();
//         spyOn(profileServiceStub, 'getAllUserProfile').and.callThrough();
//         comp.getAllProfile();
//         expect(comp.getAllProfile).toHaveBeenCalled();

//     });

//     it('#deleteUsersinGroup should delete the group', () => {
//         const userList = {
//             'age': -1,
//             'avatar': 'avatar',
//             'createdAt': 'Aug 9, 2018 11:36:50 AM',
//             'day': -1,
//             'gender': '',
//             'handle': 'handle_testdata',
//             'isGroupUser': false,
//             'language': 'en',
//             'month': -1,
//             // 'profileType': 'STUDENT',
//             'source': 'LOCAL',
//             'standard': -1,
//             'uid': 'sample_id1',
//             'profileType': ProfileType.STUDENT,
//             'syllabus': []

//         };
//         comp.userUids = userUids;
//         const elementIndex = 0;

//         spyOn(comp, 'deleteUsersinGroup').and.callThrough();
//         comp.deleteUsersinGroup(0);
//         expect(comp.deleteUsersinGroup).toHaveBeenCalled();
//     });

//     it('#deleteUsersinGroup should delete the group', () => {
//         const groupServiceStub = TestBed.get(GroupService);
//         const req = {
//             groupId: '123',
//             uidList: 'id123'
//         };
//         spyOn(groupServiceStub, 'addUpdateProfilesToGroup').and.callThrough();
//         spyOn(comp, 'deleteUsersinGroup').and.callThrough();
//         comp.deleteUsersinGroup(0);
//         expect(comp.deleteUsersinGroup).toHaveBeenCalled();
//     });
//     it('#presentPopoverNav should pop the popover', () => {

//         spyOn(comp, 'presentPopoverNav').and.callThrough();
//         comp.presentPopoverNav({});
//         expect(comp.presentPopoverNav).toHaveBeenCalled();
//     });
//     it('# should display the edit group goToEditGroup content', () => {
//         const popOverCtrl = TestBed.get(PopoverController);
//         // spyOn(popOverCtrl, 'create').and.callThrough();
//         //  expect(comp.presentPopoverNav).toBeDefined();

//         spyOn(comp, 'presentPopoverNav').and.callThrough();
//         // spyOn(comp,'goToEditGroup').and.callThrough().callFake();
//         comp.presentPopoverNav({});
//         expect(comp.presentPopoverNav).toHaveBeenCalled();
//     });

//     it('#getGradeNameFromCode should get the grade name', () => {
//         // const popOverCtrl = TestBed.get(PopoverController)
//         // spyOn(popOverCtrl, 'create').and.callThrough();
//         //  expect(comp.presentPopoverNav).toBeDefined();


//         spyOn(comp, 'getGradeNameFromCode').and.callThrough();
//         // spyOn(comp,'goToEditGroup').and.callThrough().callFake();
//         const Profile = ProfileServiceMock[0];
//         comp.getGradeNameFromCode(Profile);
//         expect(comp.getGradeNameFromCode).toHaveBeenCalled();
//     });

//     it('#presentPopover should pop the message', () => {
//         // const popOverCtrl = TestBed.get(PopoverController)
//         // spyOn(popOverCtrl, 'create').and.callThrough();
//         //  expect(comp.presentPopoverNav).toBeDefined();


//         spyOn(comp, 'presentPopover').and.callThrough();
//         // spyOn(comp,'goToEditGroup').and.callThrough().callFake();

//         //  let Profile = ProfileServiceMock[0];
//         comp.presentPopover({}, 0);
//         const profile = this.userList[0];
//         this.isCurrentGroupActive = '123';
//         const isActiveUser = false;
//         expect(comp.presentPopover).toHaveBeenCalled();
//     });

// });
