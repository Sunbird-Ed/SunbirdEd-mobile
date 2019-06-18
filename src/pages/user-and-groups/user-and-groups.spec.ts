// import {
//      navCtrlMock,

// } from '../../__tests__/mocks';
// import { mockResponseUserAndGroups } from './user-and-groups-data.spec';
// import { CommonUtilService } from './../../service/common-util.service';
// import {
//     AlertController, App, Events, IonicApp, NavController, NavParams, Platform, PopoverController,
//     ToastController, LoadingController
// } from 'ionic-angular';
// import { promise } from 'selenium-webdriver';
// import {
//     AuthService, ContainerService, GroupService, OAuthService, ProfileService, ProfileType,
//     SharedPreferences, UserSource
// } from 'sunbird';
// import { SocialSharing } from '@ionic-native/social-sharing';
// import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Network } from '@ionic-native/network';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';

// import { AppGlobalService } from '../../service/app-global.service';
// import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
// import { UserAndGroupsPage } from './user-and-groups';
// import { LoadingControllerMock } from '../../../test-config/mocks-ionic';
// import { platform } from 'os';
// import { currentId } from 'async_hooks';

// describe('UserAndGroupsPage', () => {
//     let comp: UserAndGroupsPage;
//     let fixture: ComponentFixture<UserAndGroupsPage>;

//     beforeEach(() => {
//         const translateServiceStub = {
//             get: () => ({
//                 subscribe: () => ({})
//             })
//         };
//         const ngZoneStub = {
//             run: () => ({})
//         };
//         const navControllerStub = {
//             pop: () => ({}),
//             push: () => ({})
//         };
//         const navParamsStub = {
//             get: () => ({})
//         };
//         const alertControllerStub = {
//             create: () => ({
//                 present: () => ({})
//             })
//         };
//         const platformStub = {
//             registerBackButtonAction: () => ({})
//         };
//         const popoverControllerStub = {
//             create: () => ({
//                 dismiss: () => ({}),
//                 present: () => ({})
//             })
//         };
//         const toastControllerStub = {
//             create: () => ({
//                 present: () => ({})
//             })
//         };
//         const profileServiceStub = {
//             getAllUserProfile: () => ({
//                 then: () => ({
//                     catch: () => ({})
//                 })
//             }),
//             deleteUser: () => ({}),
//             setCurrentUser: () => ({})
//         };
//         const groupServiceStub = {
//             getCurrentGroup: () => ({
//                 then: () => ({
//                     catch: () => ({})
//                 })
//             }),
//             getAllGroup: () => ({
//                 then: () => ({
//                     catch: () => ({})
//                 })
//             }),
//             deleteGroup: () => ({
//                 then: () => ({
//                     catch: () => ({})
//                 })
//             }),
//             setCurrentGroup: () => ({
//                 then: () => ({
//                     catch: () => ({})
//                 })
//             })
//         };
//         const containerServiceStub = {};
//         const sharedPreferencesStub = {
//             putString: () => ({})
//         };
//         const oAuthServiceStub = {
//             doLogOut: () => ({
//                 then: () => ({})
//             })
//         };
//         const loadingControllerStub = {
//             present: () => ({}),
//             dismiss: () => ({})
//         };
//         const authServiceStub = {
//             endSession: () => ({})
//         };
//         const ionicAppStub = {
//             _modalPortal: {
//                 getActive: () => ({
//                     dismiss: () => { }
//                 })
//             },
//             _overlayPortal: {
//                 getActive: () => ({
//                     dismiss: () => { }
//                 })
//             }
//         };
//         const appGlobalServiceStub = {
//             getCurrentUser: () => ({
//                 uid: {}
//             }),
//             isUserLoggedIn: () => ({})
//         };
//         const appStub = {
//             getRootNav: () => ({
//                 setRoot: () => ({})
//             })
//         };
//         const eventsStub = {
//             publish: () => ({})
//         };
//         const networkStub = {
//             type: {}
//         };
//         const socialSharingStub = {
//             share: () => ({})
//         };
//         const telemetryGeneratorServiceStub = {
//             generateImpressionTelemetry: () => ({}),
//             generateInteractTelemetry: () => ({})
//         };
//         TestBed.configureTestingModule({
//             declarations: [UserAndGroupsPage],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [TranslateModule.forRoot()],
//             providers: [
//                 { provide: TranslateService, useValue: translateServiceStub },
//                 { provide: NavController, useValue: navControllerStub },
//                 { provide: NavParams, useValue: navParamsStub },
//                 { provide: AlertController, useValue: alertControllerStub },
//                 { provide: Platform, useValue: platformStub },
//                 { provide: PopoverController, useValue: popoverControllerStub },
//                 { provide: ToastController, useValue: toastControllerStub },
//                 { provide: ProfileService, useValue: profileServiceStub },
//                 { provide: GroupService, useValue: groupServiceStub },
//                 { provide: SocialSharing, useValue: socialSharingStub },
//                 { provide: ContainerService, useValue: containerServiceStub },
//                 { provide: SharedPreferences, useValue: sharedPreferencesStub },
//                 { provide: OAuthService, useValue: oAuthServiceStub },
//                 { provide: AuthService, useValue: authServiceStub },
//                 { provide: IonicApp, useValue: ionicAppStub },
//                 { provide: AppGlobalService, useValue: appGlobalServiceStub },
//                 { provide: App, useValue: appStub },
//                 { provide: Events, useValue: eventsStub },
//                 { provide: Network, useValue: networkStub },
//                 { provide: CommonUtilService, useValue: CommonUtilService },
//                 // { provide: Zone, useValue: ngZoneStub},
//                 { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
//                 { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
//             ]
//         });
//         fixture = TestBed.createComponent(UserAndGroupsPage);
//         comp = fixture.componentInstance;
//     });

//     it('can load instance', () => {
//         expect(comp).toBeTruthy();
//     });

//     it('segmentType defaults to: users', () => {
//         expect(comp.segmentType).toEqual('users');
//     });

//     it('showEmptyGroupsMessage defaults to: true', () => {
//         expect(comp.showEmptyGroupsMessage).toEqual(true);
//     });

//     // it('isLoggedInUser defaults to: false', () => {
//     //     expect(comp.isLoggedInUser).toEqual(false);
//     // });

//     it('userList defaults to: []', () => {
//         expect(comp.userList).toEqual([]);
//     });

//     it('groupList defaults to: []', () => {
//         expect(comp.groupList).toEqual([]);
//     });

//     describe('ionViewDidLoad', () => {
//         it('makes expected calls', () => {
//             const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
//             spyOn(telemetryGeneratorServiceStub, 'generateImpressionTelemetry');
//             comp.ionViewDidLoad();
//             expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
//         });
//     });

//     describe('ionViewWillEnter', () => {
//         it('#ionViewWillEnter should makes expected calls', () => {
//             const navControllerStub: NavController = TestBed.get(NavController);
//             const platformStub = TestBed.get(Platform);
//             spyOn(comp, 'getAllProfile');
//             spyOn(comp, 'getAllGroup');
//             spyOn(comp, 'getCurrentGroup');
//             comp.getLoader();
//             spyOn(platformStub, 'registerBackButtonAction');
//             comp.ionViewWillEnter();
//             expect(comp.getAllProfile).toHaveBeenCalled();
//             expect(comp.getAllGroup).toHaveBeenCalled();
//             expect(comp.getCurrentGroup).toHaveBeenCalled();
//             expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
//             // expect(navControllerStub.pop).toHaveBeenCalled();
//         });
//     });
//     describe('getCurrentGroup', () => {
//         it('#getCurrentGroup should makes expected calls', () => {
//             const groupService: GroupService = TestBed.get(GroupService);
//             // const ngZoneStub = fixture.debugElement.injector.get(Zone);
//             //  spyOn(ngZoneStub, 'run');
//             spyOn(groupService, 'getCurrentGroup').and.returnValue(Promise.resolve({}));
//             comp.getCurrentGroup();
//             //  expect(ngZoneStub.run).toHaveBeenCalled();
//             expect(groupService.getCurrentGroup).toHaveBeenCalled();
//         });
//     });

//     describe('dismissPopup', () => {
//         it('#dismissPopup should makes expected calls', () => {
//             const navControllerStub = TestBed.get(NavController);
//             // const platformStub = TestBed.get(platform);
//             const ionicApp = TestBed.get(IonicApp);
//             // spyOn(ionicApp, 'getActive');
//             spyOn(navControllerStub, 'pop');
//             spyOn(comp, 'dismissPopup').and.callThrough();
//             comp.dismissPopup();
//             //  expect(ionicApp.getActive).toHaveBeenCalled();
//             expect(comp.dismissPopup).toBeDefined();
//             expect(navControllerStub.pop).toBeDefined();
//         });
//     });

//     describe('getAllProfile', () => {
//         it('#getAllProfile should call all profile users when success', (done) => {
//             const profileServiceStub = TestBed.get(ProfileService);
//             const loadingCtrlStub = TestBed.get(LoadingController);
//             spyOn(profileServiceStub, 'getAllUserProfile').and
//                 .returnValue(Promise.resolve(JSON.stringify(mockResponseUserAndGroups.UserList)));
//             comp.currentUserId = '3af2e8a4-003e-438d-b360-2ae922696913';
//             comp.showEmptyGroupsMessage = true;
//             comp.getAllProfile();
//             comp.getLoader();
//             expect(loadingCtrlStub.create).toHaveBeenCalled();
//             setTimeout(() => {
//                 expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
//                 done();
//             }, 3000);
//         });

//         it('#getAllProfile should call when all  profile users when error or empty', (done) => {
//             const profileServiceStub = TestBed.get(ProfileService);
//             const loadingCtrlStub = TestBed.get(LoadingController);
//             spyOn(profileServiceStub, 'getAllUserProfile').and
//                 .returnValue(Promise.reject('error'));
//             comp.currentUserId = '3af2e8a4-003e-438d-b360-2ae922696913';
//             comp.profileDetails = mockResponseUserAndGroups.UserList;
//             comp.getAllProfile();
//             setTimeout(() => {
//                 expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
//                 done();
//             }, 3000);
//         });

//     });
//     describe('getAllGroup', () => {
//         it('#getAllGroup should  makes a expected calls anf get all group information', () => {
//             const groupServiceStub = TestBed.get(GroupService);
//             comp.showEmptyGroupsMessage = false;
//             spyOn(groupServiceStub, 'getAllGroup').and
//                 .returnValue(Promise.resolve(mockResponseUserAndGroups.groupdetails));
//             comp.groupList = mockResponseUserAndGroups.groupList;
//             comp.currentUserId = '3af2e8a4-003e-438d-b360-2ae922696913';
//             comp.getAllGroup();
//             expect(groupServiceStub.getAllGroup).toHaveBeenCalled();
//         });


//         it('#getAllGroup should  makes a expected calls and  when error or empty', () => {
//             const groupServiceStub = TestBed.get(GroupService);
//             comp.showEmptyGroupsMessage = false;
//             spyOn(groupServiceStub, 'getAllGroup').and
//                 .returnValue(Promise.reject('error'));
//             comp.groupList = mockResponseUserAndGroups.UserList;
//             comp.getAllGroup();
//             expect(groupServiceStub.getAllGroup).toHaveBeenCalled();
//         });

//     });
//     describe('goToGroupDetail', () => {
//         it('#goToGroupDetail should makes expected calls', () => {
//             const navControllerStub = TestBed.get(NavController);

//             spyOn(navControllerStub, 'push').and.callThrough();
//             comp.goToGroupDetail(0);
//             expect(navControllerStub.push).toHaveBeenCalled();
//         });
//     });

//     describe('createGroup', () => {
//         it('#createGroup should makes expected calls ', () => {
//             const telemetryGeneratorServiceStub: TelemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
//             spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.returnValue(Promise.resolve({}));
//             const navControllerStub = TestBed.get(NavController);
//             spyOn(navControllerStub, 'push').and.callThrough();
//             comp.createGroup();
//             expect(navControllerStub.push).toHaveBeenCalled();
//         });
//     });
//     describe('goToSharePage', () => {
//         it('#goToSharePage should makes expected calls ', () => {
//             const navControllerStub = TestBed.get(NavController);
//             spyOn(navControllerStub, 'push').and.callThrough();
//             comp.goToSharePage();
//             expect(navControllerStub.push).toHaveBeenCalled();
//         });
//     });
//     describe('presentPopover', () => {
//         it('#presentPopover should makes expected calls', () => {
//             const navControllerStub = TestBed.get(NavController);
//             const popoverControllerStub = TestBed.get(PopoverController);
//             comp.currentUserId = '3af2e8a4-003e-438d-b360-2ae922696913';
//             spyOn(popoverControllerStub, 'create').and.callThrough();
//             spyOn(navControllerStub, 'push').and.callThrough();
//             comp.userList = mockResponseUserAndGroups.UserList;
//             comp.presentPopover(0, 0, true);
//             expect(popoverControllerStub.create).toHaveBeenCalled();
//             expect(navControllerStub.push);
//         });
//     });
//     describe('createGroup', () => {
//         it('makes expected calls', () => {
//             const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
//             const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);

//             spyOn(navControllerStub, 'push');
//             spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
//             comp.createGroup();
//             expect(navControllerStub.push).toHaveBeenCalled();
//             expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
//         });
//     });

//     describe('goToSharePage', () => {
//         it('makes expected calls', () => {
//             const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
//             spyOn(navControllerStub, 'push');
//             comp.goToSharePage();
//             expect(navControllerStub.push).toHaveBeenCalled();
//         });
//     });

//     describe('gotToGroupDetailsPage', () => {
//         it('makes expected calls', () => {
//             const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
//             spyOn(navControllerStub, 'push');
//             comp.gotToGroupDetailsPage();
//             expect(navControllerStub.push).toHaveBeenCalled();
//         });
//     });

//     // describe('createUser', () => {
//     //     it('makes expected calls', () => {
//     //         const navController: NavController = TestBed.get(NavController);
//     //         const telemetryGeneratorServiceStub: TelemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
//     //         spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
//     //         spyOn(comp, 'getLastCreatedProfile').and.returnValue(Promise.resolve([]));
//     //          spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.callThrough();
//     //         spyOn(navController, 'push').and.callThrough();
//     //         comp.createUser();
//     //          expect(navController.push).toHaveBeenCalled();
//     //          expect(comp.createUser).toHaveBeenCalled();
//     //         //   expect(telemetryGeneratorServiceStub.getLastCreatedProfile).toHaveBeenCalled();
//     //              });
//     // });



//     //     it('#getSyllabusDetails makes expected calls', () => {
//     // 		const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
//     // 		getLoader();
//     // 		spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve([]));
//     //     component.getLoader = jasmine.createSpy().and.callFake(function () {
//     //       return { present: function () { }, dismiss: function () { } }
//     //     });
//     //     (<jasmine.Spy>component.getSyllabusDetails).and.callThrough();
//     //     component.getSyllabusDetails();
//     //     expect(formAndFrameworkUtilServiceStub.getSyllabusList).toHaveBeenCalled();
//     //   });

//     describe('switchAccountConfirmBox', () => {
//         it('makes expected calls', () => {
//             const alertControllerStub: AlertController = TestBed.get(AlertController);
//             const appGlobalServiceStub: AppGlobalService = fixture.debugElement.injector.get(AppGlobalService);
//             const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
//             comp.selectedUserIndex = 0;
//             comp.userList = [{
//                 uid: 'user-id-1',
//                 handle: 'test',
//                 profileType: ProfileType.STUDENT,
//                 source: UserSource.LOCAL
//             }];
//             spyOn(comp, 'translateMessage');
//             spyOn(comp, 'logOut');
//             spyOn(alertControllerStub, 'create');
//             spyOn(appGlobalServiceStub, 'isUserLoggedIn');
//             spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
//             comp.switchAccountConfirmBox();
//             expect(comp.translateMessage).toHaveBeenCalled();
//             // expect(comp.logOut).toHaveBeenCalled();
//             expect(alertControllerStub.create).toHaveBeenCalled();
//             expect(appGlobalServiceStub.isUserLoggedIn).toHaveBeenCalled();
//             expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
//         });
//     });

//     describe('play', () => {
//         it('makes expected calls', () => {
//             const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
//             const appGlobalServiceStub: AppGlobalService = fixture.debugElement.injector.get(AppGlobalService);
//             const eventsStub: Events = fixture.debugElement.injector.get(Events);
//             comp.selectedUserIndex = 0;
//             comp.userList = [{
//                 uid: 'user-id-1',
//                 handle: 'test',
//                 profileType: ProfileType.STUDENT,
//                 source: UserSource.LOCAL
//             }];
//             spyOn(comp, 'logOut');
//             spyOn(navControllerStub, 'pop');
//             spyOn(appGlobalServiceStub, 'isUserLoggedIn');
//             spyOn(eventsStub, 'publish');
//             comp.play();
//             expect(appGlobalServiceStub.isUserLoggedIn).toHaveBeenCalled();
//         });
//     });

// });
import {
    navCtrlMock,
    navParamsMock,
    translateServiceMock,
    alertCtrlMock,
    popoverCtrlMock,
    zoneMock,
    profileServiceMock,
    groupServiceMock,
    authServiceMock,
    platformMock,
    ionicAppMock,
    eventsMock,
    appGlobalServiceMock,
    containerServiceMock,
    appMock,
    telemetryGeneratorServiceMock,
    loadingControllerMock,
    commonUtilServiceMock,
    sharedPreferencesMock,
    appHeaderServiceMock
} from '../../__tests__/mocks';
import { UserAndGroupsPage } from './user-and-groups';
import { mockResponseUserAndGroups } from './user-and-groups.spec.data';
import { Observable } from 'rxjs';
import 'jest';
import { Popover } from 'ionic-angular';
import { doesNotThrow } from 'assert';

describe('CollectionDetailsPage Component', () => {
    let userAndGroupsPage: UserAndGroupsPage;

    beforeEach(() => {
        userAndGroupsPage = new UserAndGroupsPage(
            navCtrlMock as any,
            navParamsMock as any,
            translateServiceMock as any,
            alertCtrlMock as any,
            popoverCtrlMock as any,
            zoneMock as any,
            profileServiceMock as any,
            groupServiceMock as any,
            authServiceMock as any,
            platformMock as any,
            ionicAppMock as any,
            eventsMock as any,
            appGlobalServiceMock as any,
            containerServiceMock as any,
            appMock as any,
            telemetryGeneratorServiceMock as any,
            loadingControllerMock as any,
            commonUtilServiceMock as any,
            sharedPreferencesMock as any,
            appHeaderServiceMock as any
        );
        jest.resetAllMocks();
    });

    it('test instance initiation', () => {
        expect(userAndGroupsPage).toBeTruthy();
    });

    it('should be call ionViewWillEnter()', (done) => {
        // arrange
        spyOn(userAndGroupsPage, 'getAllProfile').and.stub();
        spyOn(userAndGroupsPage, 'getAllGroup').and.stub();
        spyOn(userAndGroupsPage, 'getCurrentGroup').and.stub();
        appHeaderServiceMock.hideHeader.mockReturnValue(jest.fn());
        platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
        spyOn(userAndGroupsPage, 'dismissPopup').and.stub();
        userAndGroupsPage.userList = mockResponseUserAndGroups.UserList;
        // act
        userAndGroupsPage.ionViewWillEnter();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(userAndGroupsPage);
            platformMock.registerBackButtonAction.mock.calls[0][0].call(userAndGroupsPage);
            expect(userAndGroupsPage.noUsersPresent).toBeFalsy();
            expect(userAndGroupsPage.loadingUserList).toBeTruthy();
            done();
        }, 0);
    });

    it('should be call getCurrentGroup()', (done) => {
        // arrange
        groupServiceMock.getActiveSessionGroup.mockReturnValue(Observable.from([{
            gid: 'group_id',
            name: 'group',
            syllabus: ['math', 'phy', 'ch'],
            createdAt: 2,
            grade: ['A', 'B'],
            gradeValue: {
                ['key']: 'key',
            },
            updatedAt: 2
        }]));

        // act
        userAndGroupsPage.getCurrentGroup();

        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(userAndGroupsPage);
            expect(userAndGroupsPage.currentGroupId).toBe('group_id');
            done();
        }, 0);
    });

    it('should call dismissPopup() for registerBackButton action', () => {
        // arrange
        ionicAppMock._modalPortal = { getActive: jest.fn(() => ({ dismiss: jest.fn() })) };

        // act
        userAndGroupsPage.dismissPopup();
        // assert
    });

    it('should call presentPopover()', () => {
        // arrange
        userAndGroupsPage.isCurrentUser = false;
        userAndGroupsPage.userList[1] = [{ uid: 'uid' }];
        const popUp = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        popoverCtrlMock.create.mockReturnValue(popUp);
        // act
        userAndGroupsPage.presentPopover({}, 1, true);
        // assert
        //  expect(userAndGroupsPage.isCurrentUser).toBeTruthy();
        expect(popUp.present).toHaveBeenCalled();
    });

    fit('get all profiles', (done) => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        const profileRequest = {
            local: true
        };
        userAndGroupsPage.loadingUserList = true;
        // assert
        userAndGroupsPage.getAllProfile();
        // act
        expect(loader.present).toHaveBeenCalled();
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(userAndGroupsPage);
            expect((profileServiceMock.getAllProfiles as any).map).toHaveBeenCalledWith(profileRequest);
            done();
        }, 0);
    });

    it('get all group', (done) => {
        // arrange
        groupServiceMock.getAllGroups.mockReturnValue(Observable.from([[{
            gid: 'group_id',
            name: 'group',
            syllabus: ['math', 'phy', 'ch'],
            createdAt: 2,
            grade: ['A', 'B'],
            gradeValue: {
                ['key']: 'key',
            },
            updatedAt: 2
        }]]));
        userAndGroupsPage.showEmptyGroupsMessage = false;
        userAndGroupsPage.userList = mockResponseUserAndGroups.UserList;
        // act
        userAndGroupsPage.getAllGroup();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(userAndGroupsPage);
          //  expect(groupServiceMock.)
            done();
        }, 0);
    });

    it('get all group', (done) => {
        // arrange
        groupServiceMock.getAllGroups.mockReturnValue(Observable.from([{}]));
        // act
        userAndGroupsPage.getAllGroup();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(userAndGroupsPage);
            expect(userAndGroupsPage.showEmptyGroupsMessage).toBeTruthy();
            done();
        }, 0);
    });

});

