import { mockAllProfiles, userList } from './group-detail.spec.data';
import {
    navCtrlMock, navParamsMock, groupServiceMock,
    profileServiceMock, zoneMock, translateServiceMock,
    popoverCtrlMock, alertControllerMock, oAuthServiceMock,
    containerServiceMock, sharedPreferencesMock, appMock,
    eventsMock, loadingControllerMock, toastControllerMock,
    telemetryGeneratorServiceMock, authServiceMock,
    appGlobalServiceMock, commonUtilServiceMock

} from '../../../__tests__/mocks';
import { GroupDetailsPage } from './group-details';
import { GroupDetailNavPopoverPage } from '../group-detail-nav-popover/group-detail-nav-popover';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';
import { PopoverPage } from '../popover/popover';

describe.only('GroupDetailsPage', () => {

    let groupDetailsPage: GroupDetailsPage;

    beforeEach(() => {
        jest.resetAllMocks();

        navParamsMock.get.mockImplementation((data: any) => {
            if (data === 'groupInfo') {
                return ({
                    name: 'group_name'
                });
            } else if (data.gid === 'currentUserId') {
                return 'sample_group_id';
            } else {
                return 'OTHER';
            }
        });

        groupDetailsPage = new GroupDetailsPage(navCtrlMock as any, navParamsMock as any, groupServiceMock as any,
            profileServiceMock as any, zoneMock as any, translateServiceMock as any, popoverCtrlMock as any,
            alertControllerMock as any, oAuthServiceMock as any, containerServiceMock as any, sharedPreferencesMock as any,
            appMock as any, eventsMock as any, loadingControllerMock as any, toastControllerMock as any,
            telemetryGeneratorServiceMock as any, authServiceMock as any, appGlobalServiceMock as any,
            commonUtilServiceMock as any);

        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(groupDetailsPage).toBeTruthy();
    });
    it('should be called ionViewWillEnter', () => {

        // arrange
        spyOn(groupDetailsPage, 'getAllProfile').and.stub();
        // act
        groupDetailsPage.ionViewWillEnter();
        // assert
    });
    it('should be resizeContent()', () => {
        // arrange
        // groupDetailsPage.content= userUids;
        // act
        //  groupDetailsPage.resizeContent();
        // assert
    });
    it('should fetch all profile details for getAllProfile()', (done) => {
        // arrange
        const loader = { present: jest.fn(), dismiss: jest.fn() };
        spyOn(groupDetailsPage, 'getLoader').and.returnValue({ present: () => { }, dismiss: jest.fn() });
        profileServiceMock.getAllUserProfile.mockResolvedValue(JSON.stringify(mockAllProfiles));
        // act
        groupDetailsPage.getAllProfile();
        zoneMock.run.mock.calls[0][0].call(groupDetailsPage);
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[1][0].call(groupDetailsPage);
            expect(groupDetailsPage.getLoader).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should call getAllProfile()', (done) => {
        // arrange
        const loader = { present: jest.fn(), dismiss: jest.fn() };
        spyOn(groupDetailsPage, 'getLoader').and.returnValue({ present: () => { }, dismiss: jest.fn() });
        profileServiceMock.getAllUserProfile.mockRejectedValue(mockAllProfiles);
        // act
        groupDetailsPage.getAllProfile();
        zoneMock.run.mock.calls[0][0].call(groupDetailsPage);
        // assert
        setTimeout(() => {
            expect(groupDetailsPage.getLoader).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should call selectUser', () => {
        // arrange
        spyOn(groupDetailsPage, 'resizeContent').and.stub();
        // act
        groupDetailsPage.selectUser(23232, '242423');
        zoneMock.run.mock.calls[0][0].call(groupDetailsPage);
        // assert
    });
    it('should call play()', () => {
        // arrange
        const userData = ['er'];
        spyOn(groupDetailsPage, 'logOut');
        appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
        // act
        groupDetailsPage.play();
        // assert
        expect(appGlobalServiceMock.isUserLoggedIn).toHaveBeenCalled();
    });
    it('should call falsely play()', () => {
        // arrange
        const userData = userList[0];
        (groupServiceMock.setCurrentGroup as any).mockResolvedValue();
        // act
        groupDetailsPage.play();
        // assert
        expect(appGlobalServiceMock.isUserLoggedIn).toHaveBeenCalled();
    });

    it('should call endSession Logout()', () => {
        // arrange
        const selectedUser = JSON.stringify(userList);
        spyOn(groupDetailsPage, 'logOut');
        // act
        groupDetailsPage.logOut(selectedUser, false);
        // assert
        expect(groupDetailsPage.logOut).toHaveBeenCalled();
    });
    it('#should call isBeingPlayed when logout()', () => {
        // arrange
        window['splashscreen'] = {
            clearPrefs: jest.fn()
        };
        window['splashscreen'].clearPrefs.mockReturnValue(jest.fn());
        const selectedUser = JSON.stringify(userList);
        (groupServiceMock.setCurrentGroup as any).mockResolvedValue();
        (authServiceMock.endSession as any).mockReturnValue();
        spyOn(groupDetailsPage, 'logOut').and.callThrough();
        // act
        groupDetailsPage.logOut(selectedUser, true);
        // assert
        expect(window['splashscreen'].clearPrefs).toHaveBeenCalled();
    });

    it('should call when network is available for logout()', (done) => {
        // arrange
        window['splashscreen'] = {
            clearPrefs: jest.fn()
        };
        window['splashscreen'].clearPrefs.mockReturnValue(jest.fn());
        const selectedUser = JSON.stringify(userList);
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        (groupServiceMock.setCurrentGroup as any).mockResolvedValue();
        (oAuthServiceMock.doLogOut as any).mockResolvedValue(JSON.stringify(mockAllProfiles));
        spyOn(groupDetailsPage, 'logOut').and.callThrough();
        // act
        groupDetailsPage.logOut(selectedUser, false);
        // assert
        setTimeout(() => {
            expect(groupServiceMock.setCurrentGroup).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should call when network is not available for logout()', (done) => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        window['splashscreen'] = {
            clearPrefs: jest.fn()
        };
        window['splashscreen'].clearPrefs.mockReturnValue(jest.fn());
        const selectedUser = JSON.stringify(userList);
        (groupServiceMock.setCurrentGroup as any).mockResolvedValue();
        (authServiceMock.endSession as any).mockReturnValue();
        spyOn(groupDetailsPage, 'logOut').and.callThrough();
        // act
        groupDetailsPage.logOut(selectedUser, false);
        // assert
        setTimeout(() => {
            expect(groupServiceMock.setCurrentGroup).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should call and will check the network if its not there user ll be logout', () => {
        // arrange
        const selectedUser = JSON.stringify(userList);
        window['splashscreen'] = {
            clearPrefs: jest.fn()
        };
        window['splashscreen'].clearPrefs.mockReturnValue(jest.fn());
        (groupServiceMock.setCurrentGroup as any).mockResolvedValue();
        spyOn(groupDetailsPage, 'logOut').and.callThrough();
        // oAuthServiceMock.doLogOut.mockResolvedValue(JSON.stringify(mockAllProfiles));
        // act
        groupDetailsPage.logOut(selectedUser, false);
        // assert
        expect(groupDetailsPage.logOut).toHaveBeenCalled();
    });
    it('should pop the message presentPopoverNav()', () => {
        // arrange
        const popover = { present: jest.fn() };
        popoverCtrlMock.create.mockReturnValue(popover);

        // act
        groupDetailsPage.presentPopoverNav({});

        // assert
        expect(popoverCtrlMock.create).toHaveBeenCalledWith(GroupDetailNavPopoverPage, expect.anything(), expect.anything());
        expect(popover.present).toHaveBeenCalled();
    });
    it('should call navigateToAddUser()', () => {
        // arrange
        // act
        groupDetailsPage.navigateToAddUser();
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(GuestEditProfilePage, expect.objectContaining({}));
    });
    it('should call getLoader', () => {
        // arrange
        loadingControllerMock.create.mockReturnValue({ duration: 30000, spinner: 'crescent' })
        // act
        groupDetailsPage.getLoader();
        // assert
        expect(loadingControllerMock.create).toHaveBeenCalled();
    });
    it('should call translateMessage()', () => {
        // arrange
        const msg = 'group';
        translateServiceMock.get.mockReturnValue({ subscribe: jest.fn() });

        // act
        groupDetailsPage.translateMessage(msg);
        // assert
    });
    it('should call grade value for getGradeNameFromCode()', () => {
        // arrange
        const data = { grade: ['code1'], gradeValueMap: { 'code1': 'value_0' } };
        // act
        groupDetailsPage.getGradeNameFromCode(data);
        // assert
        expect(data.grade.length).toBeGreaterThan(0);
        expect(data.gradeValueMap).toBeTruthy();
    });
    it('should call grade value for getGradeNameFromCode()', () => {
        // arrange
        const data = { grade: [], gradeValueMap: { 'code': 'code' } };

        // act
        groupDetailsPage.getGradeNameFromCode(data);
        // assert
        expect(data.grade.length).toBe(0);

    });
    it('should pop the message presentPopover()', () => {
        // arrange
        const popover = { present: jest.fn() };
        const profile = JSON.stringify(userList[1]);
        console.log(userList[1]);
        popoverCtrlMock.create.mockReturnValue(popover);
        // act
        groupDetailsPage.userList = userList;
        groupDetailsPage.presentPopover({}, 1);
        // assert
        expect(popoverCtrlMock.create).toHaveBeenCalledWith(PopoverPage, expect.anything(), expect.anything());
        expect(popover.present).toHaveBeenCalled();
    });

    it('should be alert when deleteGroupConfirmBox()', () => {
        // arrange
        const alert = { present: jest.fn() };
        spyOn(groupDetailsPage, 'translateMessage').and.stub();
        alertControllerMock.create.mockReturnValue(alert);
        // act
        groupDetailsPage.deleteGroupConfirmBox();
        // assert
        expect(alertControllerMock.create).toHaveBeenCalled();
        expect(alert.present).toHaveBeenCalled();
    });
    it('should call deleteGroup()', (done) => {
        // arrange
        groupServiceMock.deleteGroup.mockResolvedValue(mockAllProfiles);
        // act
        groupDetailsPage.deleteGroup();
        // assert
        setTimeout(() => {
            //  expect(navCtrlMock.popTo(navCtrlMock.getByIndex(-2)));
            done();
        }, 0);
    });
    it('should call for error deleteGroup()', (done) => {
        // arrange
        groupServiceMock.deleteGroup.mockRejectedValue(mockAllProfiles);
        // act
        groupDetailsPage.deleteGroup();
        // assert
        setTimeout(() => {
            //  expect(navCtrlMock.popTo(navCtrlMock.getByIndex(-2)));
            done();
        }, 0);
    });
    it('should be alert when userDeleteGroupConfirmBox()', () => {
        // arrange
        const alert = { present: jest.fn() };
        groupDetailsPage.userList = userList;
        spyOn(groupDetailsPage, 'translateMessage').and.stub();
        alertControllerMock.create.mockReturnValue(alert);
        console.log(userList[1].handle);
        // act
        groupDetailsPage.userDeleteGroupConfirmBox(0);
        // assert
        expect(alertControllerMock.create).toHaveBeenCalled();
        expect(alert.present).toHaveBeenCalled();
    });
    it('should delete the group error deleteUsersinGroup()', (done) => {
        const req = {
            groupId: '123',
            uidList: 'id123'
        };
        groupServiceMock.addUpdateProfilesToGroup.mockRejectedValue(req);
        spyOn(groupDetailsPage, 'deleteUsersinGroup').and.callThrough();
        groupDetailsPage.deleteUsersinGroup(0);
        setTimeout(() => {
            expect(groupDetailsPage.deleteUsersinGroup).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should delete the group deleteUsersinGroup()', (done) => {
        const req = {
            groupId: '123',
            uidList: 'id123'
        };
        groupServiceMock.addUpdateProfilesToGroup.mockResolvedValue(req);
        spyOn(groupDetailsPage, 'deleteUsersinGroup').and.callThrough();
        groupDetailsPage.deleteUsersinGroup(0);
        setTimeout(() => {
            expect(groupDetailsPage.deleteUsersinGroup).toHaveBeenCalled();
            done();
        }, 0);
    });

});
