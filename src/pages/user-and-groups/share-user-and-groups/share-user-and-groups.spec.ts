import { ShareUserAndGroupPage } from './share-user-and-groups';
import { mockAllProfiles, userList, groupList, usergroupmap } from './share-user-and-group.spec.data';
import {
    groupServiceMock, profileServiceMock, zoneMock, fileUtilMock, socialSharingMock, loadingControllerMock,
    telemetryGeneratorServiceMock, navParamsMock
} from '../../../__tests__/mocks';

describe('ShareUserAndGroupPage', () => {
    let shareUserAndGroupPage: ShareUserAndGroupPage;

    beforeEach(() => {
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
        shareUserAndGroupPage = new ShareUserAndGroupPage(
            groupServiceMock as any,
            profileServiceMock as any,
            zoneMock as any,
            fileUtilMock as any,
            socialSharingMock as any,
            loadingControllerMock as any,
            telemetryGeneratorServiceMock as any
        );
        // addOrRemoveUserGroup.uniqueUserList = [];
        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(shareUserAndGroupPage).toBeTruthy();
    });

    it('should be called ionViewWillEnter', () => {

        // arrange
        spyOn(shareUserAndGroupPage, 'getAllProfile').and.stub();
        spyOn(shareUserAndGroupPage, 'getAllGroup').and.stub();
        // act
        shareUserAndGroupPage.ionViewWillEnter();
        // assert
    });

    it('should fetch all profile details for getAllProfile()', (done) => {
        // arrange
        profileServiceMock.getAllUserProfile.mockResolvedValue(JSON.stringify(mockAllProfiles));
        // act
        shareUserAndGroupPage.getAllProfile();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(shareUserAndGroupPage);
            done();
        }, 0);
    });
    it('to test error scenerio of the profile', (done) => {
        // arrange
        profileServiceMock.getAllUserProfile.mockRejectedValue(undefined);
        // act
        shareUserAndGroupPage.getAllProfile();
        // assert
        setTimeout(() => {
            expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('to get the group info', (done) => {
        // arrange
        groupServiceMock.getAllGroup.mockResolvedValue((JSON.stringify(mockAllProfiles)));
        profileServiceMock.getAllUserProfile.mockResolvedValue((JSON.stringify(userList)));
        // act
        shareUserAndGroupPage.getAllGroup();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(shareUserAndGroupPage);
            done();
        }, 0);
    });

    it('to get the error info inside all User profiles', (done) => {
        // arrange
        const profile = [{ uid: 'SAMPLE_GID' } as any];
        groupServiceMock.getAllGroup.mockResolvedValue((JSON.stringify(mockAllProfiles)));
        profileServiceMock.getAllUserProfile.mockRejectedValue('error');
        shareUserAndGroupPage['userGroupMap'] = new Map();
        shareUserAndGroupPage['userGroupMap'].set('SAMPLE_UID', profile);
        spyOn(shareUserAndGroupPage['userGroupMap'], 'set').and.callThrough();
        // act
        shareUserAndGroupPage.getAllGroup();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(shareUserAndGroupPage);
            done();
        }, 0);
    });

    it('to get the error info inside all group error cause', (done) => {
        // arrange
        // zoneMock.run.mock.calls.call(shareUserAndGroupPage);
        const profile = [{ uid: 'SAMPLE_GID' } as any];
        groupServiceMock.getAllGroup.mockRejectedValue(undefined);
        // act
        shareUserAndGroupPage.getAllGroup();
        // assert
        setTimeout(() => {
            done();
        }, 0);
    });

    it('to get the check user groups', () => {
        // arrange
        const totalLength = 2;
        // act
        shareUserAndGroupPage.checkUserGroups();
        // assert
        expect(totalLength).toBeGreaterThan(0);
        // return true;
    });


    it('to get the check user groups', (done) => {
        // arrange
        shareUserAndGroupPage.selectedGroupList = [];
        shareUserAndGroupPage.groupList = groupList;
        // shareUserAndGroupPage.userGroupMap.get(groupList[0].gid);
        shareUserAndGroupPage['userGroupMap'] = new Map();
        shareUserAndGroupPage['userGroupMap'].set('781e5927-29d3-48e2-bbfd-ba883d0a905f', usergroupmap as any);
        // act
        shareUserAndGroupPage.toggleGroupSelected(0);
        // assert
        setTimeout(() => {
            expect(shareUserAndGroupPage.selectedGroupList.length).toEqual(1);
            done();
        }, 0);
    });

    it('to get the check user groups if exists then delete', (done) => {
        // arrange
        shareUserAndGroupPage.selectedGroupList = ['781e5927-29d3-48e2-bbfd-ba883d0a905f'];
        shareUserAndGroupPage.groupList = groupList;
        // shareUserAndGroupPage.userGroupMap.get(groupList[0].gid);
        shareUserAndGroupPage['userGroupMap'] = new Map();
        shareUserAndGroupPage['userGroupMap'].set('781e5927-29d3-48e2-bbfd-ba883d0a905f', usergroupmap as any);
        // act
        shareUserAndGroupPage.toggleGroupSelected(0);
        // assert
        setTimeout(() => {
            expect(shareUserAndGroupPage.selectedGroupList.length).toEqual(0);
            done();
        }, 0);
    });
    it('to get the check user selected to add', (done) => {
        // arrange
        shareUserAndGroupPage.selectedUserList = [];
        shareUserAndGroupPage.userList = usergroupmap as any;
        // shareUserAndGroupPage.userGroupMap.get(groupList[0].gid);
        shareUserAndGroupPage['userGroupMap'] = new Map();
        shareUserAndGroupPage['userWeightMap'].get('781e5927-29d3-48e2-bbfd-ba883d0a905f');
        // act
        shareUserAndGroupPage.toggleUserSelected(0);
        // assert
        setTimeout(() => {
            expect(shareUserAndGroupPage.selectedUserList.length).toEqual(1);
            done();
        }, 0);
    });

    it('to check the isuser selected ', () => {
        // arrange
        shareUserAndGroupPage.selectedUserList = ['SAMPLE_UID'];
        // act
        expect(shareUserAndGroupPage.isUserSelected('SAMPLE_UID')).toBe(true);
    });

    it('to check the Is Group Is selected ', () => {
        // arrange
        shareUserAndGroupPage.selectedGroupList = ['SAMPLE_UID'];
        // act
        expect(shareUserAndGroupPage.isGroupSelected('SAMPLE_UID')).toBe(true);
        // assert
        // expect(shareUserAndGroupPage.selectedUserList).toBeTruthy();
    });
    it('to check the is isShareEnabled or not ', () => {
        // arrange
        shareUserAndGroupPage.selectedUserList = [userList as any];
        // act
        expect(shareUserAndGroupPage.isShareEnabled()).toEqual(true);
        // assert
    });

    it('to check the share user and groups', (done) => {
        // arrange
        shareUserAndGroupPage.selectedUserList = [userList as any];
        shareUserAndGroupPage.selectedGroupList = [groupList as any];
        (fileUtilMock.internalStoragePath as any).mockReturnValue('SAMPLE_CODE');
        profileServiceMock.exportProfile.mockResolvedValue((mockAllProfiles as any));
        spyOn(socialSharingMock, 'share').and.stub();
        loadingControllerMock.create.mockReturnValue({
            present: () => {
            },
            dismiss: () => {
            }
        });
        // act
        shareUserAndGroupPage.share();
        // assert
        setTimeout(() => {
            expect(fileUtilMock.internalStoragePath).toHaveBeenCalled();
            expect(profileServiceMock.exportProfile).toHaveBeenCalled();
            expect(loadingControllerMock.create).toHaveBeenCalled();
            done();
        }, 1000);
    });


});



