 import { PersonalDetailsEditPage } from './personal-details-edit.profile';
 import { mockProfileRes } from './personal-details-edit-profile-spec-data';
 import {FormGroup, FormControl} from '@angular/forms';
// import { Profile } from 'sunbird';

import {
    navCtrlMock, loadingControllerMock, navParamsMock, commonUtilServiceMock,
    formAndFrameworkUtilServiceMock, formBuilderMock, translateServiceMock,
     appGlobalServiceMock, userProfileServiceMock, eventsMock, containerServiceMock,
     frameworkServiceMock } from '../../../__tests__/mocks';

describe('PersonalDetailsEditPage', () => {
    let personalDetailsEditPage: PersonalDetailsEditPage;
    beforeEach(() => {
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'profile') {
                return mockProfileRes.profile;
            }
        });
        commonUtilServiceMock.translateMessage.mockReturnValue('STATE');
        commonUtilServiceMock.translateMessage.mockReturnValue('DISTRICT');
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'name': new FormControl('', [])
        }));
        // personalDetailsEditPage.profile = mockProfileRes.profile;
            personalDetailsEditPage = new PersonalDetailsEditPage(
            navCtrlMock as any,
            loadingControllerMock as any,
            navParamsMock as any,
            commonUtilServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            formBuilderMock as any,
            translateServiceMock as any,
            appGlobalServiceMock as any,
            userProfileServiceMock as any,
            eventsMock as any,
            containerServiceMock as any,
            frameworkServiceMock as any
        );
        personalDetailsEditPage.profile = mockProfileRes.profile;
         jest.resetAllMocks();
        //  personalDetailsEditPage.profile.name = mockProfileRes.profile;
    });

    it('can load instance', () => {
        expect(personalDetailsEditPage).toBeTruthy();
    });
    // it('it should call onload() when ever opens page', () => {
    //     // arrange
    //     spyOn(profilePage, 'doRefresh').and.stub();
    //     spyOn(eventsMock, 'subscribe').and.stub();
    //     spyOn(telemetryServiceMock, 'impression').and.stub();
    //     // act
    //     profilePage.ionViewDidLoad();
    //     // assert
    //     expect(profilePage.ionViewDidLoad).toBeTruthy();
    // });
    // it('it should call dofresher() to publish events', (done) => {
    //     // arrange
    //     const loader = {
    //         present: jest.fn(),
    //         dismiss: jest.fn()
    //     };
    //     commonUtilServiceMock.getLoader.mockReturnValue(loader);
    //     spyOn(profilePage, 'refreshProfileData').and.returnValue(Promise.resolve(['hfhgf']));
    //     // act
    //     profilePage.doRefresh();
    //     // assert
    //     setTimeout(() => {
    //         expect(eventsMock.publish).toHaveBeenCalledWith('refresh:profile');
    //         expect(loader.dismiss).toHaveBeenCalled();
    //         done();
    //     }, 1000);
    // });
    // it('it should call dofresher() to refresh profile ', (done) => {
    //     // arrange
    //     const loader = {
    //         present: jest.fn(),
    //         dismiss: jest.fn()
    //     };
    //     const refresher = {
    //         complete: jest.fn()
    //     };
    //     commonUtilServiceMock.getLoader.mockReturnValue(loader);
    //     refresher.complete();
    //     // act
    //     profilePage.doRefresh('profile');
    //     // assert
    //     setTimeout(() => {
    //         expect(refresher.complete).toHaveBeenCalled();
    //         done();
    //     }, 1000);
    // });
    // it('it should call dofresher() to error scenario ', () => {
    //     // arrange
    //     const loader = {
    //         present: jest.fn(),
    //         dismiss: jest.fn()
    //     };
    //     const refresher = {
    //         complete: jest.fn()
    //     };
    //     commonUtilServiceMock.getLoader.mockReturnValue(loader);
    //     spyOn(profilePage, 'refreshProfileData').and.returnValue(Promise.reject('error'));
    //     refresher.complete();
    //     // act
    //     profilePage.doRefresh();
    //     // assert
    //     expect(profilePage.refreshProfileData).toHaveBeenCalled();
    // });
    // it('it should call resetprofile() to reset profile info', () => {
    //     // arrange
    //     spyOn(profilePage, 'profile').and.callThrough();
    //     // act
    //     profilePage.resetProfile();
    //     // assert
    //     expect(profilePage.profile).toEqual({});
    // });

    // it('it should call refreshProfileData() to refresh profile data', (done) => {
    //     // arrang

    //     spyOn(authServiceMock, 'getSessionData').and.returnValue(Promise.resolve(mockProfileRes.sessionMock));
    //     profileServiceMock.setCurrentProfile.mockResolvedValue(mockProfileRes.profileDetailsMock);
    //     profileServiceMock.getCurrentUser.mockResolvedValue(mockProfileRes.profileDetailsMock);
    //     appGlobalServiceMock.getCurrentUser.mockReturnValue({ syllabus: 'sample' });
    //     formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
    //         status: 'SOME_STATUS',
    //         profile: 'SOME_PROFILE'
    //     });
    //     // profilePage.formatRoles.;
    //     // profilePage.formatOrgDetails();
    //     // act

    //     profilePage.refreshProfileData();
    //     // assert
    //     setTimeout(() => {
    //         expect(authServiceMock.getSessionData).toHaveBeenCalled();
    //         // expect(contentServiceMock.getContentDetail).toBeCalledWith(expect.objectContaining({
    //         //     status: 'SOME_STATUS',
    //         //     profile: 'SOME_PROFILE'
    //         // }));
    //         done();
    //     }, 10);
    // });



});
