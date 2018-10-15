import { userList } from './../group-details/group-detail.data.spec';
import { CommonUtilService } from './../../../service/common-util.service';
import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController, NavOptions } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GroupService, ProfileType, UserSource } from 'sunbird';
import { ProfileService } from 'sunbird';
import { LoadingController } from 'ionic-angular';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { AddOrRemoveGroupUserPage } from './add-or-remove-group-user';
import { mockCreateorremoveGroupRes } from './add-remove-group-user.spec.data';

import {
    LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, AuthServiceMock, NavParamsMock, ProfileServiceMock,
    FormAndFrameworkUtilServiceMock, ContainerServiceMock, AppGlobalServiceMock, NavMock, TranslateLoaderMock,
    NavParamsMockNew, SharedPreferencesMock, CommonUtilServiceMock
} from '../../../../test-config/mocks-ionic';
import 'rxjs/add/observable/of';
import { } from 'jasmine';

export class MockToastCtrl {
    public instance: MockToast = new MockToast();
    public create(options: any = {}): MockToast {
        return this.instance;
    }
}
export class MockToast {
    public present(navOptions: any = {}): Promise<any> {
        return Promise.resolve({});
    }
    public dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any> {
        return Promise.resolve({});
    }

    public onDidDismiss(callback: () => void): void {
        callback();
        return;
    }
}

describe('AddOrRemoveGroupUserPage', () => {
    describe('AddOrRemoveGroupUserPage', () => {
        let comp: AddOrRemoveGroupUserPage;
        let fixture: ComponentFixture<AddOrRemoveGroupUserPage>;

        beforeEach(() => {

            const navControllerStub = {
                push: () => ({}),
                popTo: () => ({}),
                getByIndex: () => ({}),
                length: () => ({})
            };
            const navParamsStub = {
                get: () => ({})
            };
            const toastControllerStub = {
                create: () => ({})
            };
            const alertControllerStub = {
                create: () => ({
                    present: () => ({})
                })
            };
            const translateServiceStub = {
                get: () => ({
                    subscribe: () => ({})
                })
            };
            const groupServiceStub = {
                addUpdateProfilesToGroup: () => ({
                    then: () => ({
                        catch: () => ({})
                    })
                })
            };
            const profileServiceStub = {
                getAllUserProfile: () => ({
                    then: () => ({
                        catch: () => ({})
                    })
                })
            };
            const loadingControllerStub = {
                create: () => ({})
            };
            const getLoader = () => {
                const loadingController = TestBed.get(LoadingController);
                comp.getLoader();
            };
            const telemetryGeneratorServiceStub = {
                generateInteractTelemetry: () => ({})
            };
            TestBed.configureTestingModule({
                declarations: [AddOrRemoveGroupUserPage],
                schemas: [NO_ERRORS_SCHEMA],
                imports: [TranslateModule.forRoot()],
                providers: [
                    CommonUtilService,
                    //     { provide: NgZone, useValue: ngZoneStub },
                    { provide: NavController, useValue: navControllerStub },
                    { provide: NavParams, useValue: navParamsStub },
                    { provide: ToastController, useClass: MockToastCtrl },
                    { provide: AlertController, useValue: alertControllerStub },
                    { provide: TranslateService, useValue: translateServiceStub },
                    { provide: GroupService, useValue: groupServiceStub },
                    { provide: ProfileService, useValue: profileServiceStub },
                    { provide: LoadingController, useValue: loadingControllerStub },
                    { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub }
                ]
            });
            fixture = TestBed.createComponent(AddOrRemoveGroupUserPage);
            comp = fixture.componentInstance;
        });

        it('#should load instance', () => {
            expect(comp).toBeTruthy();
        });

        it('#addUsers should defaults to: true', () => {
            console.log('addUsers', comp.addUsers);
            expect(comp.addUsers).toEqual(true);
        });

        it('#allUsers should defaults to: []', () => {
            expect(comp.allUsers).toEqual([]);
        });

        it('#selectedUids should defaults to: []', () => {
            expect(comp.selectedUids).toEqual([]);
        });

        describe('ionViewWillEnter', () => {
            it('#ionViewWill ahould and Enter to makes expected calls', () => {
                spyOn(comp, 'getAllProfile');
                comp.ionViewWillEnter();
                expect(comp.getAllProfile).toHaveBeenCalled();
            });
        });

        describe('getAllProfile', () => {
            it('#makes expected calls', () => {
                const profileServiceStub: ProfileService = TestBed.get(ProfileService);

                spyOn(profileServiceStub, 'getAllUserProfile').and.returnValue(Promise.resolve(JSON.stringify
                    (mockCreateorremoveGroupRes.UserList)));
                comp.groupMembers = [];
                comp.addUsers = false;
                comp.getAllProfile();
                expect(profileServiceStub.getAllUserProfile).toHaveBeenCalled();
            });
        });

        describe('selectAll', () => {
            it('#selectAll should makes expected calls', () => {
                comp.uniqueUserList = mockCreateorremoveGroupRes.UserList;
                comp.userSelectionMap.set(mockCreateorremoveGroupRes.UserList[0].uid, true);
                comp.selectAll();
                expect(comp.uniqueUserList).toBeDefined();
            });
        });

        describe('getSelectedGroupMemberUids', () => {
            it('getSelectedGroupMemberUids makes expected calls', () => {

                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                comp.getSelectedGroupMemberUids();
                expect(comp.getSelectedGroupMemberUids).toBeDefined();
            });
        });

        describe('add users to group', () => {
            it('#add should makes expected calls to add users to group', fakeAsync(() => {
                const navControllerStub = TestBed.get(NavController);
                spyOn(navControllerStub, 'popTo');
                spyOn(navControllerStub, 'getByIndex');
                spyOn(navControllerStub, 'length');
                comp.getLoader = jasmine.createSpy().and.callFake(() => {
                    return { present: () => { }, dismiss: () => { } };
                });
                const groupServiceStub: GroupService = TestBed.get(GroupService);
                const commonUtilService = TestBed.get(CommonUtilService);
                const translate = TestBed.get(TranslateService);
                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                spyOn(comp, 'getSelectedUids');
                spyOn(groupServiceStub, 'addUpdateProfilesToGroup').and.returnValue(Promise.resolve('resp'));
                spyOn(commonUtilService, 'showToast').and.returnValue(Promise.resolve('GROUP_MEMBER_ADD_SUCCESS'));
                comp.add();
                expect(comp.getLoader).toHaveBeenCalled();
                expect(comp.getSelectedUids).toHaveBeenCalled();
            }));

            it('#add makes expected calls when error', fakeAsync(() => {
                comp.getLoader = jasmine.createSpy().and.callFake(() => {
                    return { present: () => { }, dismiss: () => { } };
                });
                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                const groupServiceStub: GroupService = TestBed.get(GroupService);
                const commonUtilService = TestBed.get(CommonUtilService);
                spyOn(comp, 'getSelectedUids');
                spyOn(groupServiceStub, 'addUpdateProfilesToGroup').and.returnValue(Promise.reject('error'));
                spyOn(commonUtilService, 'showToast').and.returnValue(Promise.resolve('SOMETHING_WENT_WRONG'));
                comp.add();
                expect(comp.getSelectedUids).toHaveBeenCalled();
            }));
        });
        describe('deleteUsersFromGroup', () => {
            it('#deleteUsersFromGroup should makes expected calls', () => {
                const navControllerStub: NavController = TestBed.get(NavController);
                const groupServiceStub: GroupService = TestBed.get(GroupService);
                const telemetryGeneratorServiceStub: TelemetryGeneratorService =
                    TestBed.get(TelemetryGeneratorService);
                spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.returnValue(Promise.resolve({}));
                comp.getLoader = jasmine.createSpy().and.callFake(() => {
                    return { present: () => { }, dismiss: () => { } };
                });
                spyOn(console, 'log').and.callThrough();
                spyOn(groupServiceStub, 'addUpdateProfilesToGroup').and.returnValue(Promise.resolve([]));
                comp.deleteUsersFromGroup();
                expect(comp.getLoader).toHaveBeenCalled();
                expect(groupServiceStub.addUpdateProfilesToGroup).toHaveBeenCalled();
                expect(telemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
            });

            it('#deleteUsersFromGroup should makes expected calls for error', () => {
                const navControllerStub: NavController = TestBed.get(NavController);
                const groupServiceStub: GroupService = TestBed.get(GroupService);
                const telemetryGeneratorServiceStub: TelemetryGeneratorService =
                    TestBed.get(TelemetryGeneratorService);
                spyOn(telemetryGeneratorServiceStub, 'generateInteractTelemetry').and.returnValue(Promise.reject({}));
                comp.getLoader = jasmine.createSpy().and.callFake(() => {
                    return { present: () => { }, dismiss: () => { } };
                });
                spyOn(console, 'log').and.callThrough();
                spyOn(groupServiceStub, 'addUpdateProfilesToGroup').and.returnValue(Promise.reject([]));

                comp.deleteUsersFromGroup();
                expect(comp.getLoader).toHaveBeenCalled();
            });

        });
        describe('getLoader', () => {
            it('#getLoader should make  expected calls', () => {
                const loadingControllerStub: LoadingController = TestBed.get(LoadingController);
                spyOn(loadingControllerStub, 'create');
                comp.getLoader();
                expect(loadingControllerStub.create).toHaveBeenCalled();
            });
        });

        describe('toggleSelect', () => {
            it('#toggleSelect should read toggleSelect param', () => {
                spyOn(comp, 'toggleSelect').and.callThrough();
                comp.uniqueUserList = mockCreateorremoveGroupRes.UserList;
                comp.toggleSelect(0);
                expect(comp.toggleSelect).toHaveBeenCalled();
            });
            it('#toggleSelect should read toggleSelect param', () => {
                spyOn(comp, 'toggleSelect').and.callThrough();
                comp.uniqueUserList = mockCreateorremoveGroupRes.UserList;
                comp.userSelectionMap.set(mockCreateorremoveGroupRes.UserList[0].uid, true);
                comp.toggleSelect(0);
                expect(comp.toggleSelect).toHaveBeenCalled();
            });
        });

        describe('togglememberSelect', () => {
            it('#togglememberSelect should read togglememberSelect param', () => {
                spyOn(comp, 'toggleMemberSelect').and.callThrough();
                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                comp.memberSelectionMap.set(mockCreateorremoveGroupRes.UserList[0].uid, true);
                comp.toggleMemberSelect(0);
                expect(comp.toggleMemberSelect).toBeTruthy();
            });
        });

        describe('goToEditGroup', () => {
            it('#goToEditGroup should be navigated', () => {
                const navControllerStub: NavController = TestBed.get(NavController);
                spyOn(navControllerStub, 'push').and.callThrough();
                comp.goToEditGroup(0);
                expect(navControllerStub.push).toHaveBeenCalled();
            });
        });
        describe('isUserSelected', () => {
            it('#isUserSelected should be selected', () => {
                spyOn(comp, 'isUserSelected').and.callThrough();
                comp.uniqueUserList = mockCreateorremoveGroupRes.UserList;
                comp.userSelectionMap.set(mockCreateorremoveGroupRes.UserList[0].uid, true);
                comp.isUserSelected(0);
                expect(comp.isUserSelected).toHaveBeenCalled();
            });
        });
        describe('isGroupMemberSelected', () => {
            it('#isGroupMemberSelected should be selected', () => {
                spyOn(comp, 'isGroupMemberSelected').and.callThrough();
                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                comp.memberSelectionMap.set(mockCreateorremoveGroupRes.UserList[0].uid, true);
                comp.isGroupMemberSelected(0);
                expect(comp.isGroupMemberSelected).toHaveBeenCalled();
            });
        });
        describe('remove', () => {
            it('#remove should be unselected uid from group', () => {
                spyOn(comp, 'remove').and.callThrough();
                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                comp.memberSelectionMap.get(mockCreateorremoveGroupRes.UserList[0].uid);
                comp.selectedUids.push(mockCreateorremoveGroupRes.UserList[0].uid);
                comp.remove();
                expect(comp.isGroupMemberSelected).toBeTruthy();
            });
        });
        describe('unselectAll', () => {
            it('#unselectAll should be Unselected when all groupmembers removed', () => {
                comp.groupMembers = mockCreateorremoveGroupRes.UserList;
                comp.memberSelectionMap.get(mockCreateorremoveGroupRes.UserList[0].uid);
                comp.unselectAll();
                expect(comp.unselectAll).toBeTruthy();
            });
        });
    });
});
