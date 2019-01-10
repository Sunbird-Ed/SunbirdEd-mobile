import { AddOrRemoveGroupUserPage } from './add-or-remove-group-user';
import { mockCreateorremoveGroupRes } from './add-remove-group-user.spec.data';
import {
    navCtrlMock, navParamsMock, groupServiceMock, profileServiceMock, zoneMock, loadingControllerMock,
    commonUtilServiceMock, alertCtrlMock, telemetryGeneratorServiceMock
} from '../../../__tests__/mocks';
import { GuestEditProfilePage } from '../../profile/guest-edit.profile/guest-edit.profile';
// const GuestEditProfilePage = {} as any;
describe('AddOrRemoveGroupUserPage', () => {
    let addOrRemoveUserGroup: AddOrRemoveGroupUserPage;

    beforeEach(() => {
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'isAddUsers') {
                return true;
            } else if (arg === 'groupMembers') {
                return [];
            }
        });
        addOrRemoveUserGroup = new AddOrRemoveGroupUserPage(
            navCtrlMock as any,
            navParamsMock as any,
            groupServiceMock as any,
            profileServiceMock as any,
            zoneMock as any,
            loadingControllerMock as any,
            commonUtilServiceMock as any,
            alertCtrlMock as any,
            telemetryGeneratorServiceMock as any
        );
        // addOrRemoveUserGroup.uniqueUserList = [];
        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(addOrRemoveUserGroup).toBeTruthy();
    });
    it('to get the profile info', () => {
        // arrange
        profileServiceMock.getAllUserProfile.mockResolvedValue((JSON.stringify(mockCreateorremoveGroupRes.UserList)));
        // act
        addOrRemoveUserGroup.getAllProfile();
        // assert
        expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
    });


    it('to test error scenerio of the profile', () => {
        // arrange
        profileServiceMock.getAllUserProfile.mockRejectedValue('error');
        // act
        addOrRemoveUserGroup.getAllProfile();
        // assert
        expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
    });

    it('to call the  toggle method for user selection map', () => {
        // arrange
        addOrRemoveUserGroup.uniqueUserList = [{ uid: 'SAMPLE_UID' } as any];
        addOrRemoveUserGroup.userSelectionMap = new Map();
        addOrRemoveUserGroup.userSelectionMap.set('SAMPLE_UID', true);
        spyOn(addOrRemoveUserGroup.userSelectionMap, 'set').and.callThrough();

        // act
        addOrRemoveUserGroup.toggleSelect(0);

        // assert
        expect(addOrRemoveUserGroup.userSelectionMap).toBeTruthy();
    });
    it('to call the  toggle method for MemberSelection map', () => {
        // arrange
        addOrRemoveUserGroup.groupMembers = [{ uid: 'SAMPLE_UID' } as any];
        addOrRemoveUserGroup.memberSelectionMap = new Map();
        addOrRemoveUserGroup.memberSelectionMap.set('SAMPLE_UID', true);
        spyOn(addOrRemoveUserGroup.memberSelectionMap, 'set').and.callThrough();

        // act
        addOrRemoveUserGroup.toggleMemberSelect(0);

        // assert
        expect(addOrRemoveUserGroup.memberSelectionMap).toBeTruthy();
    });

    it('to naviagte to the guesteditprofile page ', () => {
        // arrange

        // act
        addOrRemoveUserGroup.goToEditGroup(0);

        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(GuestEditProfilePage, {});
    });

    it('to check the isuser selected ', () => {
        // arrange
        spyOn(addOrRemoveUserGroup, 'getSelectedUids').and.stub();
        addOrRemoveUserGroup.uniqueUserList = [{ uid: 'SAMPLE_UID' } as any];
        addOrRemoveUserGroup.userSelectionMap = new Map();
        addOrRemoveUserGroup.userSelectionMap.get('SAMPLE_UID');
        // act
        addOrRemoveUserGroup.isUserSelected(0);
        expect(addOrRemoveUserGroup.userSelectionMap.get).toBeTruthy();
    });
    it('to check the isGroupMember selected ', () => {
        // arrange
        spyOn(addOrRemoveUserGroup, 'getSelectedGroupMemberUids').and.stub();
        addOrRemoveUserGroup.groupMembers = [{ uid: 'SAMPLE_GID' } as any];
        addOrRemoveUserGroup.memberSelectionMap = new Map();
        addOrRemoveUserGroup.memberSelectionMap.get('SAMPLE_GID');
        // act
        addOrRemoveUserGroup.isGroupMemberSelected(0);
        // assert
        expect(addOrRemoveUserGroup.memberSelectionMap.get).toBeTruthy();
    });

    it('to Select all users to group', () => {
        // arrange
        addOrRemoveUserGroup.userSelectionMap = new Map();
        addOrRemoveUserGroup.uniqueUserList = [{ uid: 'SAMPLE_UID' } as any];
        addOrRemoveUserGroup.userSelectionMap.set('SAMPLE_UID', true);
        // act
        addOrRemoveUserGroup.selectAll();
        zoneMock.run.mock.calls[0][0].call(addOrRemoveUserGroup);
        // addOrRemoveUserGroup.uniqueUserList.mock.calls[0][0].call();
        // assert
        expect(addOrRemoveUserGroup.userSelectionMap.set).toBeTruthy();
    });

    it('to UnSelect all users from group', () => {
        // arrange
        addOrRemoveUserGroup.memberSelectionMap = new Map();
        addOrRemoveUserGroup.groupMembers = [{ uid: 'SAMPLE_UID' } as any];
        addOrRemoveUserGroup.memberSelectionMap.set('SAMPLE_UID', true);
        // act
        addOrRemoveUserGroup.unselectAll();
        zoneMock.run.mock.calls[0][0].call(addOrRemoveUserGroup);
        // assert
        expect(addOrRemoveUserGroup.memberSelectionMap.set).toBeTruthy();
    });

    it('to remove user from group', () => {
        // arrange
        spyOn(addOrRemoveUserGroup, 'deleteUsersFromGroupConfirmBox').and.stub();
        spyOn(addOrRemoveUserGroup, 'remove').and.callThrough();
        addOrRemoveUserGroup.memberSelectionMap = new Map();
        addOrRemoveUserGroup.groupMembers = [{ uid: 'SAMPLE_UID' } as any];
        addOrRemoveUserGroup.memberSelectionMap.get('SAMPLE_UID');
        addOrRemoveUserGroup.selectedUids.push('SAMPLE_UID');
        // act
        addOrRemoveUserGroup.remove();
        // assert
        expect(addOrRemoveUserGroup.memberSelectionMap).toBeTruthy();
    });
    it('to add user to group', (done) => {
        // arrange
        addOrRemoveUserGroup.groupInfo = { gid: 'SAMPLE_GID' } as any;
        spyOn(addOrRemoveUserGroup, 'getSelectedUids').and.returnValue([]);
        commonUtilServiceMock.translateMessage.mockReturnValue('GROUP_MEMBER_ADD_SUCCESS');
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        (groupServiceMock.addUpdateProfilesToGroup as any).mockReturnValue
            (Promise.resolve(JSON.stringify(mockCreateorremoveGroupRes.UserList)));
        // act
        addOrRemoveUserGroup.add();
        // assert
        setTimeout(() => {
            expect(commonUtilServiceMock.showToast).toBeCalledWith('GROUP_MEMBER_ADD_SUCCESS');
            expect(navCtrlMock.popTo((-2)));
            done();
        }, 0);
    });

    it('to add() user to group should show error when something went wrong error cause', (done) => {
        // arrange
        addOrRemoveUserGroup.groupInfo = { gid: 'SAMPLE_GID' } as any;
        spyOn(addOrRemoveUserGroup, 'getSelectedUids').and.returnValue([]);
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        (groupServiceMock.addUpdateProfilesToGroup as any).mockRejectedValue
            (Promise.resolve(JSON.stringify(mockCreateorremoveGroupRes.UserList)));
        commonUtilServiceMock.translateMessage.mockReturnValue('SOMETHING_WENT_WRONG');
        // act
        addOrRemoveUserGroup.add();
        // assert
        setTimeout(() => {
            expect(commonUtilServiceMock.showToast).toBeCalledWith('SOMETHING_WENT_WRONG');
            expect(navCtrlMock.popTo((-2)));
            done();
        }, 0);
    });
    it('to add user to group when error cause', (done) => {
        // arrange
        addOrRemoveUserGroup.groupInfo = { gid: 'SAMPLE_GID' } as any;
        spyOn(addOrRemoveUserGroup, 'getSelectedUids').and.returnValue([]);
        commonUtilServiceMock.translateMessage.mockReturnValue('GROUP_MEMBER_DELETE_SUCCESS');
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        (groupServiceMock.addUpdateProfilesToGroup as any).mockReturnValue
            (Promise.resolve(JSON.stringify(mockCreateorremoveGroupRes.UserList)));
        // act
        addOrRemoveUserGroup.deleteUsersFromGroup();
        // assert
        setTimeout(() => {
            expect(commonUtilServiceMock.showToast).toBeCalledWith('GROUP_MEMBER_DELETE_SUCCESS');
            expect(navCtrlMock.popTo((-2)));
            done();
        }, 0);
    });
    it('to deleteUsersFromGroup() delete user to group when error cause', (done) => {
        // arrange
        addOrRemoveUserGroup.groupInfo = { gid: 'SOME_ERROR' } as any;
        spyOn(addOrRemoveUserGroup, 'getSelectedUids').and.returnValue([]);

        (groupServiceMock.addUpdateProfilesToGroup as any).mockRejectedValue
            (JSON.stringify(mockCreateorremoveGroupRes.UserList));
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        commonUtilServiceMock.translateMessage.mockReturnValue('SOMETHING_WENT_WRONG');
        // act
        addOrRemoveUserGroup.deleteUsersFromGroup();
        // assert
        setTimeout(() => {

            expect(commonUtilServiceMock.showToast).toBeCalledWith('SOMETHING_WENT_WRONG');
            done();
        }, 0);
    });

    it('should be alert when userDeleteGroupConfirmBox()', () => {
        // arrange
        const alert = { present: jest.fn() };
        spyOn(commonUtilServiceMock, 'translateMessage').and.stub();
        alertCtrlMock.create.mockReturnValue(alert);
        // act
        addOrRemoveUserGroup.deleteUsersFromGroupConfirmBox(0);
        // assert
        expect(alertCtrlMock.create).toHaveBeenCalled();
        expect(alert.present).toHaveBeenCalled();
    });

    it('toget GradeName from profile| group', () => {
        // arrange
        profileServiceMock.getAllUserProfile.mockResolvedValue(JSON.parse(mockCreateorremoveGroupRes.profileDetailsMock));
        const alert = { present: jest.fn() };
        alertCtrlMock.create.mockReturnValue(alert);
        // act
        addOrRemoveUserGroup.getGradeNameFromCode(JSON.parse(mockCreateorremoveGroupRes.profileDetailsMock));
        // assert
        expect(addOrRemoveUserGroup.getGradeNameFromCode).toBeTruthy();
    });
});
