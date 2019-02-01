
import { GroupMembersPage } from './group-members';
import { mockRes } from './group-members.spec.data';
import {
    navCtrlMock,
    navParamsMock,
    groupServiceMock,
    profileServiceMock,
    zoneMock,
    loadingControllerMock,
    commonUtilServiceMock,
    telemetryGeneratorServiceMock
} from '../../../__tests__/mocks';

describe.only('GroupMembersPage Component', () => {
    let groupMembersPage: GroupMembersPage;

    beforeEach(() => {
        // deviceInfoServiceMock.getDownloadDirectoryPath.mockResolvedValue( 'SOME_PATH' );
        // fileMock.dataDirectory.mockReturnValue('SOME_DIR');
        // translateServiceMock.get.mockReturnValue( { subscribe: jest.fn() } );
        groupMembersPage = new GroupMembersPage(navCtrlMock as any, navParamsMock as any,
            groupServiceMock as any, profileServiceMock as any, zoneMock as any, loadingControllerMock as any,
            commonUtilServiceMock as any, telemetryGeneratorServiceMock as any);
        jest.resetAllMocks();
    });

    it('can load instance the instance of userReportPage', () => {
        expect(groupMembersPage).toBeTruthy();
    });

    it('userList defaults to: []', () => {
        expect(groupMembersPage.userList).toEqual([]);
    });
    it('#ionViewDidLoad should be makes expected calls', () => {
        groupMembersPage.group = { gid: 'test', name: 'board' };
        spyOn(telemetryGeneratorServiceMock, 'generateImpressionTelemetry');
        groupMembersPage.ionViewDidLoad();
        expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalled();
    });
    it('#ionViewWillEnter should be makes expected calls', () => {
        spyOn(groupMembersPage, 'getAllProfile');
        groupMembersPage.ionViewWillEnter();
        expect(groupMembersPage.getAllProfile).toHaveBeenCalled();
    });
    it('#getLastCreatedProfile should be create profile data', () => {

        profileServiceMock.getProfile.mockResolvedValue(mockRes.profile);
        groupMembersPage.getLastCreatedProfile();
        expect(profileServiceMock.getProfile).toHaveBeenCalled();
    });
    it('#getLastCreatedProfile should not create profile data', () => {

        profileServiceMock.getProfile.mockRejectedValue({ error: 'testing error' });
        groupMembersPage.getLastCreatedProfile();
        expect(profileServiceMock.getProfile).toHaveBeenCalled();
    });
    // it('#getAllProfile should be makes expected calls', (done) => {
    //     spyOn(profileServiceMock, 'getAllUserProfile').and.returnValue(Promise.resolve([mockRes.userData]));
    //     groupMembersPage.getAllProfile();
    //     zoneMock.run.mock.calls[0][0].call(groupMembersPage);
    //     expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
    //         });

    it('#toggleSelect should read toggleSelect param', () => {
        spyOn(groupMembersPage, 'toggleSelect').and.callThrough();
        groupMembersPage.userList = [mockRes.userData];
        groupMembersPage.toggleSelect(0);
        expect(groupMembersPage.toggleSelect).toHaveBeenCalled();
    });
    it('#toggleSelect should read toggleSelect param', () => {
        spyOn(groupMembersPage, 'toggleSelect').and.callThrough();
        groupMembersPage.userList = [mockRes.userData];
        groupMembersPage.userSelectionMap.set('', true);
        groupMembersPage.toggleSelect(0);
        expect(groupMembersPage.toggleSelect).toHaveBeenCalled();
    });
    it('#isUserSelected should read toggleSelect param', () => {
        spyOn(groupMembersPage, 'isUserSelected').and.callThrough();
        groupMembersPage.userList = [mockRes.userData];
        groupMembersPage.userSelectionMap.set('userId', true);
        groupMembersPage.isUserSelected(0);
        expect(groupMembersPage.isUserSelected).toHaveBeenCalled();
    });
    it('#getGradeNameFromCode should read toggleSelect param', () => {
        spyOn(groupMembersPage, 'getGradeNameFromCode').and.callThrough();
        const userListData = mockRes.userData;
        userListData['grade'] = ['grade1'];
        userListData['gradeValueMap'] = { 'grade1': 'class1' };
        userListData['gradeName'] = [];
        userListData['name'] = 'Name';
        groupMembersPage.userSelectionMap.set('userId', true);
        groupMembersPage.getGradeNameFromCode(userListData);
        expect(groupMembersPage.getGradeNameFromCode).toHaveBeenCalled();
    });
    it('#getGradeNameFromCode It should read toggleSelect param', () => {
        spyOn(groupMembersPage, 'getGradeNameFromCode').and.callThrough();
        const userListData = mockRes.userData;
        userListData['grade'] = ['grade1'];
        delete userListData['gradeValueMap'];
        userListData['gradeName'] = [];
        userListData['name'] = 'Name';
        groupMembersPage.userSelectionMap.set('userId', true);
        groupMembersPage.getGradeNameFromCode(userListData);
        expect(groupMembersPage.getGradeNameFromCode).toHaveBeenCalled();
    });
    // it('#selectAll should be makes expected calls', () => {
    //     groupMembersPage.userList =
    //                 [mockRes.userData];
    //             // const ngZoneStub: NgZone = fixture.debugElement.injector.get(NgZone);
    //             // spyOn(ngZoneStub, 'run');
    //             groupMembersPage.selectAll();
    //             // expect(ngZoneStub.run).toHaveBeenCalled();
    //         });

    it('#getLoader should return Loading object', () => {
        expect(groupMembersPage.getLoader).toBeDefined();
        spyOn(groupMembersPage, 'getLoader').and.callThrough();
        spyOn(loadingControllerMock, 'create');
        groupMembersPage.getLoader();
        expect(groupMembersPage.getLoader).toHaveBeenCalled();
        expect(loadingControllerMock.create).toHaveBeenCalled();
    });
    // it('#goTOGuestEdit should be makes expected calls', (done) => {
    //             spyOn(groupMembersPage, 'getLastCreatedProfile').and.returnValue(Promise.resolve('data'));
    //             spyOn(navCtrlMock, 'push');
    //             groupMembersPage.goTOGuestEdit();
    //             setTimeout(() => {
    //                 expect(navCtrlMock.push).toHaveBeenCalled();
    //                 done();
    //             }, 100);
    //         });
    // it('#goTOGuestEdit should be makes expected calls', (done) => {
    //             spyOn(groupMembersPage, 'getLastCreatedProfile').and.returnValue(Promise.reject('error'));
    //             spyOn(navCtrlMock, 'push');
    //             groupMembersPage.goTOGuestEdit();
    //             setTimeout(() => {
    //                 expect(navCtrlMock.push).toHaveBeenCalled();
    //                 done();
    //             }, 100);
    //         });
    // it('#createGroup should be makes expected calls', () => {
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
});
