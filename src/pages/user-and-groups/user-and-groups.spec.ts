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
import { win32 } from 'path';

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

    it('get all profiles', (done) => {
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
        profileServiceMock.getAllProfiles.mockReturnValue(Observable.of('test'));
        // window.setTimeout = jest.fn();
        // assert
        userAndGroupsPage.getAllProfile();
        // act
        expect(loader.present).toHaveBeenCalled();
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(userAndGroupsPage);
            //   expect((profileServiceMock.getAllProfiles as any).map).toHaveBeenCalledWith(profileRequest);
            done();
        }, 1000);
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

    it('should be go to Group Details', () => {
        // arrange
        // act
        // assert
    });
});
