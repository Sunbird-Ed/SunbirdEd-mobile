import { ProfileService, SharedPreferences, TelemetryService, ServiceProvider } from 'sunbird';
import 'rxjs/add/observable/of';

import { Observable } from 'rxjs';

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Network } from '@ionic-native/network';

import { TranslateModule, TranslateService } from '../../../../node_modules/@ngx-translate/core';
import {
    Events, LoadingController, NavController, PopoverController, ToastController
} from '../../../../node_modules/ionic-angular';
import { AppGlobalService } from '../../../service/app-global.service';
import { FormAndFrameworkUtilService } from '../formandframeworkutil.service';
import { GuestProfilePage } from './guest-profile';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { SharedPreferencesMock } from '../../../../test-config/mocks-ionic';

export class LoadingControllerMock {
    _getPortal(): any { return {} };
    create(options?: any) {
        return new LoadingMock();
    };
}

class LoadingMock {
    present() { };
    dismiss() { };
    dismissAll() { };
}

export class ToastControllerMock {
    create(options?: any) {
        return new ToastMock();
    }
}

class ToastMock {
    present() { }
}

describe('GuestProfilePage', () => {
    let comp: GuestProfilePage;
    let fixture: ComponentFixture<GuestProfilePage>;

    beforeEach(async(() => {
        const NavControllerStub = {
            push: () => ({})
        }

        const NetworkStub = {
            type: '',
            onConnect: () => ({
                subscribe: () => { }
            }),
            onDisconnect: () => ({
                subscribe: () => { }
            })
        }

        const PopoverControllerStub = {
            create: () => {
                return {
                    data: '',
                    opts: '',
                    isOverlay: false,
                    present: () => { },
                    dismiss: () => { },
                    onDidDismiss: () => { },
                    onWillDismiss: () => { },
                }
            }
        }

        const ProfileServiceStub = {
            getCurrentUser: () => { },

        }

        const LoadingControllerStub = {
            create: () => { }
        }

        const EventsStub = {
            subscribe: () => { }
        }

        const ToastControllerStub = {
            create: () => {
                subscribe: () => { }
            }
        }

        const TranslateServiceStub = {
            get: () => {
                subscribe: () => { }
            }
        }

        const AppGlobalServiceStub = {
            openPopover: () => { },
            getGuestUserType: () => ({})
        }

        const FormAndFrameworkUtilServiceStub = {
            getSyllabusList: () => {
                then: () => { }
            },
            getFrameworkDetails: () => {
                then: () => { }
            }
        }

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [GuestProfilePage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [TelemetryGeneratorService, TelemetryService, ServiceProvider,SharedPreferences,
                { provide: NavController, useValue: NavControllerStub },
                { provide: Network, useValue: NetworkStub },
                { provide: PopoverController, useValue: PopoverControllerStub },
                { provide: ProfileService, useValue: ProfileServiceStub },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: Events, useValue: EventsStub },
                //{ provide: SharedPreferences, useValue: SharedPreferencesMock },
                { provide: ToastController, useClass: ToastControllerMock },
                { provide: TranslateService, useValue: TranslateServiceStub },
                { provide: AppGlobalService, useValue: AppGlobalServiceStub },
                { provide: FormAndFrameworkUtilService, useValue: FormAndFrameworkUtilServiceStub }
            ]
        });

        let code = 'selected_language_code';
        // spyOn(SharedPreferencesStub, 'getString').and.callFake((code, success) => {
        //     return success('en');
        // });
        const SharedPreferenceStub = TestBed.get(SharedPreferences);
        spyOn(SharedPreferenceStub, 'getString').and.returnValue(Promise.resolve('en'));
        // SharedPreferenceStub.getString().then(() => {

        // });

        fixture = TestBed.createComponent(GuestProfilePage);
        comp = fixture.componentInstance;
    }));

    it('should load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('imageUri defaults to: assets/imgs/ic_profile_default.png', () => {
        expect(comp.imageUri).toBe('assets/imgs/ic_profile_default.png');
        expect(comp.imageUri).not.toBe('');
        expect(typeof comp.imageUri).toBe('string');
        expect(typeof comp.imageUri).not.toBe('object');
    });

    it('showSignInCard defaults to: false and type should be boolean', () => {
        expect(comp.showSignInCard).toBe(false);
        expect(comp.showSignInCard).not.toBe(true);
        expect(typeof comp.showSignInCard).toBe('boolean');
        expect(typeof comp.showSignInCard).not.toBe('object');
    });

    it('showWarning defaults to: false and type should be boolean', () => {
        expect(comp.showWarning).toBe(false);
        expect(comp.showWarning).not.toBe(true);
        expect(typeof comp.showWarning).toBe('boolean');
        expect(typeof comp.showWarning).not.toBe('object');
    });

    it('boards defaults to: ""', () => {
        expect(comp.boards).toBe('');
        expect(comp.boards.length).toBe(0);
        expect(typeof comp.boards).toBe('string');
        expect(typeof comp.boards).not.toBe('object');
    });

    it('grade defaults to: ""', () => {
        expect(comp.grade).toBe('');
        expect(comp.grade.length).toBe(0);
        expect(typeof comp.grade).toBe('string');
        expect(typeof comp.grade).not.toBe('object');
    });

    it('medium defaults to: ""', () => {
        expect(comp.medium).toBe('');
        expect(comp.medium.length).toBe(0);
        expect(typeof comp.medium).toBe('string');
        expect(typeof comp.medium).not.toBe('object');
    });

    it('subjects defaults to: ""', () => {
        expect(comp.subjects).toBe('');
        expect(comp.subjects.length).toBe(0);
        expect(typeof comp.subjects).toBe('string');
        expect(typeof comp.subjects).not.toBe('object');
    });

    it('syllabus defaults to: ""', () => {
        expect(comp.syllabus).toBe('');
        expect(comp.syllabus.length).toBe(0);
        expect(typeof comp.syllabus).toBe('string');
        expect(typeof comp.syllabus).not.toBe('object');
    });

    it('categories defaults should be: empty array', () => {
        expect(comp.categories).toEqual([]);
        expect(typeof comp.categories).toEqual('object');
    });

    it('profile defaults should be: empty Object', () => {
        expect(comp.profile).toEqual({});
        expect(typeof comp.profile).toEqual('object');
    });

    describe('Constructor', () => { //Need to improve
        it('should call getString to fetch selected_language_code', (done) => {
            const SharedPreferencesStub = TestBed.get(SharedPreferences);

            SharedPreferencesStub.getString().then(() => {
                expect(SharedPreferencesStub.getString).toHaveBeenCalled();
                expect(comp.selectedLanguage).toEqual('en');
                done();
            });
        });
    });

    describe('goToRoles', () => {
        it('should call goToRoles page', () => {
            const navControllerStub: NavController = TestBed.get(NavController);
            spyOn(comp, 'goToRoles');
            spyOn(navControllerStub, "push");
            comp.goToRoles();
            expect(comp.goToRoles).toBeDefined();
            expect(comp.goToRoles).toHaveBeenCalled();
            //expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe('editGuestProfile', () => {
        it('should call GuestEditProfile page', () => {
            const navControllerStub: NavController = TestBed.get(NavController);
            spyOn(comp, 'editGuestProfile');
            spyOn(navControllerStub, "push");
            comp.editGuestProfile();
            expect(comp.editGuestProfile).toBeDefined();
            expect(comp.editGuestProfile).toHaveBeenCalled();
            //expect(navControllerStub.push).toHaveBeenCalled();
            // expect(navControllerStub.push).toHaveBeenCalledWith(GuestEditProfilePage, {
            //     profile: comp.profile,
            //     isCurrentUser: true
            // });
        });
    });


    describe('goToRoles', () => {
        it('should call goToRoles page', () => {
            const navControllerStub: NavController = TestBed.get(NavController);
            spyOn(comp, 'goToRoles');
            spyOn(navControllerStub, "push");
            comp.goToRoles();
            expect(comp.goToRoles).toBeDefined();
            expect(comp.goToRoles).toHaveBeenCalled();
            //expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe('buttonClick', () => {
        it('should call showNetworkWarning method', () => {
            spyOn(comp, 'buttonClick');
            spyOn(comp, 'showNetworkWarning');
            comp.buttonClick();
            expect(comp.buttonClick).toBeDefined();
            expect(comp.buttonClick).toHaveBeenCalled();
            //expect(comp.showNetworkWarning).toHaveBeenCalled();
        });
    })

    describe('arrayToString', () => {
        it('should convert String Array to single string', () => {
            spyOn(comp, 'arrayToString');
            expect(comp.arrayToString).toBeDefined();
            let arg: Array<string> = ["abcd", "xyz"];
            comp.arrayToString(arg);
            expect(comp.arrayToString).toHaveBeenCalled();
            expect(typeof arg).toBe('object');
            expect(Array.isArray(arg)).toBe(true);
            expect(comp.arrayToString).toHaveBeenCalledWith(arg);
            //expect(comp.arrayToString(arg)).toEqual("abcd, xyz");
        });
    });

    describe('getToast', () => {
        it('should convert String Array to single string', () => {
            spyOn(comp, 'arrayToString');
            expect(comp.arrayToString).toBeDefined();
            let arg: Array<string> = ["abcd", "xyz"];
            comp.arrayToString(arg);
            expect(comp.arrayToString).toHaveBeenCalled();
            expect(typeof arg).toBe('object');
            expect(Array.isArray(arg)).toBe(true);
            expect(comp.arrayToString).toHaveBeenCalledWith(arg);
            //expect(comp.arrayToString(arg)).toEqual("abcd, xyz");
        });
    });

    describe("translateMessage", () => {
        it('should resolve test data', fakeAsync(() => {
            let translate = TestBed.get(TranslateService);
            const translateStub = TestBed.get(TranslateService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            let translatedMessage = comp.translateMessage('CANCEL');
            //fixture.detectChanges();
            expect(translatedMessage).toEqual('Cancel');
            expect(spy.calls.any()).toEqual(true);
        }));
    });

    xdescribe('refreshProfileData', () => { //Need to improve
        it('should male expected calls', () => {
            spyOn(comp, 'refreshProfileData').and.callThrough();
            spyOn(comp.loader, 'present').and.callThrough();
            comp.refreshProfileData(true, true);
            comp.loader = jasmine.createSpyObj('comp.loader', ['present']);
            expect(comp.refreshProfileData).toBeDefined();
            expect(comp.refreshProfileData).toHaveBeenCalled();
            //expect(comp.loader.present).toHaveBeenCalled();
        });
        it('should make service call to fetch CurrentUser', (done) => {
            const ProfileServiceStub: ProfileService = TestBed.get(ProfileService);
            const FormAndFrameworkUtilServiceStub: FormAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
            let response = {
                id: 'abcd'
            };
            spyOn(ProfileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
                return res(JSON.stringify(response));
            });
            spyOn(FormAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve({}))
            comp.refreshProfileData(true, true);
            setTimeout(() => {
                expect(ProfileServiceStub.getCurrentUser).toHaveBeenCalled();
                expect(comp.profile).toEqual(response);
                expect(comp.getSyllabusDetails).toHaveBeenCalled();

                let refresher = jasmine.createSpyObj('refresher', ['complete']);
                tick(501);
                expect(refresher.complete).toHaveBeenCalled();
                done();
            }, 100);

        });
    });
});