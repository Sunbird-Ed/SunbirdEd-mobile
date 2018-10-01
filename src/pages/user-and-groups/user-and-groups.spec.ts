import {
    AlertController, App, Events, IonicApp, NavController, NavParams, Platform, PopoverController,
    ToastController, LoadingController
} from 'ionic-angular';
import { promise } from 'selenium-webdriver';
import {
    AuthService, ContainerService, GroupService, OAuthService, ProfileService, ProfileType,
    SharedPreferences, UserSource
} from 'sunbird';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Network } from '@ionic-native/network';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { UserAndGroupsPage } from './user-and-groups';
import { LoadingControllerMock } from '../../../test-config/mocks-ionic';

describe('UserAndGroupsPage', () => {
    let comp: UserAndGroupsPage;
    let fixture: ComponentFixture<UserAndGroupsPage>;

    beforeEach(() => {
        const translateServiceStub = {
            get: () => ({
                subscribe: () => ({})
            })
        };
        const ngZoneStub = {
            run: () => ({})
        };
        const navControllerStub = {
            pop: () => ({}),
            push: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        const alertControllerStub = {
            create: () => ({
                present: () => ({})
            })
        };
        const platformStub = {
            registerBackButtonAction: () => ({})
        };
        const popoverControllerStub = {
            create: () => ({
                dismiss: () => ({}),
                present: () => ({})
            })
        };
        const toastControllerStub = {
            create: () => ({
                present: () => ({})
            })
        };
        const profileServiceStub = {
            getAllUserProfile: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            deleteUser: () => ({}),
            setCurrentUser: () => ({})
        };
        const groupServiceStub = {
            getCurrentGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            getAllGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            deleteGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            }),
            setCurrentGroup: () => ({
                then: () => ({
                    catch: () => ({})
                })
            })
        };
        const containerServiceStub = {};
        const sharedPreferencesStub = {
            putString: () => ({})
        };
        const oAuthServiceStub = {
            doLogOut: () => ({
                then: () => ({})
            })
        };
        const loadingControllerStub = {
            present: () => ({}),
            dismiss: () => ({})
        };
        const authServiceStub = {
            endSession: () => ({})
        };
        const ionicAppStub = {
            _modalPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            },
            _overlayPortal: {
                getActive: () => ({
                    dismiss: () => { }
                })
            }
        };
        const appGlobalServiceStub = {
            getCurrentUser: () => ({
                uid: {}
            }),
            isUserLoggedIn: () => ({})
        };
        const appStub = {
            getRootNav: () => ({
                setRoot: () => ({})
            })
        };
        const eventsStub = {
            publish: () => ({})
        };
        const networkStub = {
            type: {}
        };
        const telemetryGeneratorServiceStub = {
            generateImpressionTelemetry: () => ({}),
            generateInteractTelemetry: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [UserAndGroupsPage],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: AlertController, useValue: alertControllerStub },
                { provide: Platform, useValue: platformStub },
                { provide: PopoverController, useValue: popoverControllerStub },
                { provide: ToastController, useValue: toastControllerStub },
                { provide: ProfileService, useValue: profileServiceStub },
                { provide: GroupService, useValue: groupServiceStub },
                { provide: ContainerService, useValue: containerServiceStub },
                { provide: SharedPreferences, useValue: sharedPreferencesStub },
                { provide: OAuthService, useValue: oAuthServiceStub },
                { provide: AuthService, useValue: authServiceStub },
                { provide: IonicApp, useValue: ionicAppStub },
                { provide: AppGlobalService, useValue: appGlobalServiceStub },
                { provide: App, useValue: appStub },
                { provide: Events, useValue: eventsStub },
                { provide: Network, useValue: networkStub },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
            ]
        });
        fixture = TestBed.createComponent(UserAndGroupsPage);
        comp = fixture.componentInstance;
    });

    it ('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('segmentType defaults to: users', () => {
        expect(comp.segmentType).toEqual('users');
    });

    it('showEmptyGroupsMessage defaults to: true', () => {
        expect(comp.showEmptyGroupsMessage).toEqual(true);
    });

    // it('isLoggedInUser defaults to: false', () => {
    //     expect(comp.isLoggedInUser).toEqual(false);
    // });

    it('userList defaults to: []', () => {
        expect(comp.userList).toEqual([]);
    });

    it('groupList defaults to: []', () => {
        expect(comp.groupList).toEqual([]);
    });

    describe('ionViewDidLoad', () => {
        it('makes expected calls', () => {
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            spyOn(telemetryGeneratorServiceStub, 'generateImpressionTelemetry');
            comp.ionViewDidLoad();
            expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
        });
    });

    describe('ionViewWillEnter', () => {
        it('makes expected calls', () => {
            //   const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            const platformStub: Platform = fixture.debugElement.injector.get(Platform);
            spyOn(comp, 'getAllProfile');
            spyOn(comp, 'getAllGroup');
            spyOn(comp, 'getCurrentGroup');
            spyOn(comp, 'dismissPopup');
            // spyOn(ngZoneStub, 'run');
            spyOn(platformStub, 'registerBackButtonAction');
            comp.ionViewWillEnter();
            expect(comp.getAllProfile).toHaveBeenCalled();
            expect(comp.getAllGroup).toHaveBeenCalled();
            expect(comp.getCurrentGroup).toHaveBeenCalled();
            // expect(comp.dismissPopup).toHaveBeenCalled();
            // expect(ngZoneStub.run).toHaveBeenCalled();
            expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
        });
    });

    describe('getCurrentGroup', () => {
        it('makes expected calls', () => {
            // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            // spyOn(ngZoneStub, 'run');
            spyOn(groupServiceStub, 'getCurrentGroup').and.returnValue(Promise.resolve({}));
            comp.getCurrentGroup();
            // expect(ngZoneStub.run).toHaveBeenCalled();
            expect(groupServiceStub.getCurrentGroup).toHaveBeenCalled();
        });
    });

    describe('dismissPopup', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const ionicApp = TestBed.get(IonicApp);
            spyOn(navControllerStub, 'pop');
            comp.dismissPopup();
            // expect(navControllerStub.pop).toHaveBeenCalled();
        });
    });

    describe('getAllProfile', () => {
        xit('makes expected calls', () => {
            const profileServiceStub: ProfileService = fixture.debugElement.injector.get(ProfileService);
            const loadingCtrlStub = TestBed.get(LoadingController);
            spyOn(profileServiceStub, 'getAllUserProfile').and.returnValue(Promise.resolve({}));
            comp.getAllProfile();
            expect(loadingCtrlStub.create).toHaveBeenCalled();
            setTimeout(() => {
                expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
            }, 1000);
        });
    });

    describe('getAllGroup', () => {
        it('makes expected calls', () => {
            // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
            const groupServiceStub: GroupService = fixture.debugElement.injector.get(GroupService);
            //  spyOn(ngZoneStub, 'run');
            spyOn(groupServiceStub, 'getAllGroup').and.returnValue(Promise.resolve({}));
            comp.getAllGroup();
            // expect(ngZoneStub.run).toHaveBeenCalled();
            expect(groupServiceStub.getAllGroup).toHaveBeenCalled();
        });
    });

    describe('createGroup', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);

            spyOn(navControllerStub, 'push');
            spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
            comp.createGroup();
            expect(navControllerStub.push).toHaveBeenCalled();
            expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
        });
    });

    describe('goToSharePage', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, 'push');
            comp.goToSharePage();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe('gotToGroupDetailsPage', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, 'push');
            comp.gotToGroupDetailsPage();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            spyOn(navControllerStub, 'push');
            spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
            comp.createUser();
            expect(navControllerStub.push).toHaveBeenCalled();
            expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
        });
    });

    describe('switchAccountConfirmBox', () => {
        it('makes expected calls', () => {
            const alertControllerStub: AlertController = fixture.debugElement.injector.get(AlertController);
            const appGlobalServiceStub: AppGlobalService = fixture.debugElement.injector.get(AppGlobalService);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            comp.selectedUserIndex = 0;
            comp.userList = [{
                uid: 'user-id-1',
                handle: 'test',
                profileType: ProfileType.STUDENT,
                source: UserSource.LOCAL
            }];
            spyOn(comp, 'translateMessage');
            spyOn(comp, 'logOut');
            spyOn(alertControllerStub, 'create');
            spyOn(appGlobalServiceStub, 'isUserLoggedIn');
            spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry');
            comp.switchAccountConfirmBox();
            expect(comp.translateMessage).toHaveBeenCalled();
            // expect(comp.logOut).toHaveBeenCalled();
            expect(alertControllerStub.create).toHaveBeenCalled();
            expect(appGlobalServiceStub.isUserLoggedIn).toHaveBeenCalled();
            expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
        });
    });

    describe('play', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const appGlobalServiceStub: AppGlobalService = fixture.debugElement.injector.get(AppGlobalService);
            const eventsStub: Events = fixture.debugElement.injector.get(Events);
            comp.selectedUserIndex = 0;
            comp.userList = [{
                uid: 'user-id-1',
                handle: 'test',
                profileType: ProfileType.STUDENT,
                source: UserSource.LOCAL
            }];
            spyOn(comp, 'logOut');
            spyOn(navControllerStub, 'pop');
            spyOn(appGlobalServiceStub, 'isUserLoggedIn');
            spyOn(eventsStub, 'publish');
            comp.play();
            expect(appGlobalServiceStub.isUserLoggedIn).toHaveBeenCalled();
        });
    });

});
