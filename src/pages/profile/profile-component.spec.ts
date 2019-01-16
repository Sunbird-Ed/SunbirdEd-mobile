import { ProfilePage } from './profile';
import { Profile } from 'sunbird';
import { mockProfileRes } from './profile.data.spec';
import {
    navCtrlMock, popoverCtrlMock, userProfileServiceMock, zoneMock, authServiceMock,
    telemetryServiceMock, loadingControllerMock, navParamsMock, eventsMock, appGlobalServiceMock,
    courseServiceMock, telemetryGeneratorServiceMock, profileServiceMock, formAndFrameworkUtilServiceMock,
    containerServiceMock, commonUtilServiceMock, appMock, contentServiceMock, imageLoaderMock
} from '../../__tests__/mocks';
const CategoriesEditPage = {} as any;
const CollectionDetailsPage = {} as any;
const EnrolledCourseDetailsPage = {} as any;
const ContentDetailsPage = {} as any;
const OverflowMenuComponent = {} as any;
describe('ProfilePage', () => {
    let profilePage: ProfilePage;
    beforeEach(() => {
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'userId') {
                return '';
            } else if (arg === 'returnRefreshedUserProfileDetails') {
                return true;
            }
            spyOn(appGlobalServiceMock, 'openPopover').and.stub();
            spyOn(profilePage, 'updateLocalProfile').and.stub();
        });
        profilePage = new ProfilePage(
            navCtrlMock as any,
            popoverCtrlMock as any,
            userProfileServiceMock as any,
            zoneMock as any,
            authServiceMock as any,
            telemetryServiceMock as any,
            loadingControllerMock as any,
            navParamsMock as any,
            eventsMock as any,
            appGlobalServiceMock as any,
            courseServiceMock as any,
            telemetryGeneratorServiceMock as any,
            profileServiceMock as any,
            formAndFrameworkUtilServiceMock as any,
            containerServiceMock as any,
            commonUtilServiceMock as any,
            appMock as any,
            contentServiceMock as any,
            imageLoaderMock as any
        );
        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(profilePage).toBeTruthy();
    });
    it('it should call onload() when ever opens page', () => {
        // arrange
        spyOn(profilePage, 'doRefresh').and.stub();
        spyOn(eventsMock, 'subscribe').and.stub();
        spyOn(telemetryServiceMock, 'impression').and.stub();
        // act
        profilePage.ionViewDidLoad();
        // assert
        expect(profilePage.ionViewDidLoad).toBeTruthy();
    });
    it('it should call dofresher() to publish events', (done) => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        commonUtilServiceMock.getLoader.mockReturnValue(loader);
        spyOn(profilePage, 'refreshProfileData').and.returnValue(Promise.resolve(['hfhgf']));
        // act
        profilePage.doRefresh();
        // assert
        setTimeout(() => {
            expect(eventsMock.publish).toHaveBeenCalledWith('refresh:profile');
            expect(loader.dismiss).toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('it should call dofresher() to refresh profile ', (done) => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        const refresher = {
            complete: jest.fn()
        };
        commonUtilServiceMock.getLoader.mockReturnValue(loader);
        refresher.complete();
        // act
        profilePage.doRefresh('profile');
        // assert
        setTimeout(() => {
            expect(refresher.complete).toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('it should call dofresher() to error scenario ', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        const refresher = {
            complete: jest.fn()
        };
        commonUtilServiceMock.getLoader.mockReturnValue(loader);
        spyOn(profilePage, 'refreshProfileData').and.returnValue(Promise.reject('error'));
        refresher.complete();
        // act
        profilePage.doRefresh();
        // assert
        expect(profilePage.refreshProfileData).toHaveBeenCalled();
    });
    it('it should call resetprofile() to reset profile info', () => {
        // arrange
        spyOn(profilePage, 'profile').and.callThrough();
        // act
        profilePage.resetProfile();
        // assert
        expect(profilePage.profile).toEqual({});
    });

    it('it should call refreshProfileData() to refresh profile data', (done) => {
        // arrang

        spyOn(authServiceMock, 'getSessionData').and.returnValue(Promise.resolve(mockProfileRes.sessionMock));
        profileServiceMock.setCurrentProfile.mockResolvedValue(mockProfileRes.profileDetailsMock);
        profileServiceMock.getCurrentUser.mockResolvedValue(mockProfileRes.profileDetailsMock);
        appGlobalServiceMock.getCurrentUser.mockReturnValue({ syllabus: 'sample' });
        formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
            status: 'SOME_STATUS',
            profile: 'SOME_PROFILE'
        });
        // profilePage.formatRoles.;
        // profilePage.formatOrgDetails();
        // act

        profilePage.refreshProfileData();
        // assert
        setTimeout(() => {
            expect(authServiceMock.getSessionData).toHaveBeenCalled();
            // expect(contentServiceMock.getContentDetail).toBeCalledWith(expect.objectContaining({
            //     status: 'SOME_STATUS',
            //     profile: 'SOME_PROFILE'
            // }));
            done();
        }, 10);
    });


    it('it should call formatOrgDetails()', () => {
        // arrange
        profilePage.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        navParamsMock.get.mockReturnValue((param: string) => {
            switch (param) {
                case 'state':
                    return {
                        'state': 'Some_state',
                    };
                case 'block':
                    return {
                        'block': 'Some_block',
                    };
                case 'district':
                    return {
                        'block': 'Some_District',
                    };
            }
        });
        // act
        profilePage.formatOrgDetails();
        // assert
    });
    it('should show Overflow menu when showOverflowMenu() ', () => {
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };

        popoverCtrlMock.create.mockReturnValue(popUpMock);
        popUpMock.present();
        profilePage.showOverflowMenu('event');
        expect(popoverCtrlMock.create).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });

    it('it should call showMoreBadges() to badge assertion', () => {
        // arrange
        profilePage.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        // act
        profilePage.showMoreBadges();
        // assert
        expect(profilePage.badgesLimit).toEqual(profilePage.profile.badgeAssertions.length);
    });
    it('it should call ShowlessBadges() to badge assertion', () => {
        // arrange
        // act
        profilePage.showLessBadges();
        // assert
        expect(profilePage.badgesLimit).toEqual(profilePage.DEFAULT_PAGINATION_LIMIT);
    });
    it('it should call showMoreTainings() to trianning assertion', () => {
        // arrange
        profilePage.trainingsLimit = JSON.parse(mockProfileRes.profileDetailsMock);
        // act
        profilePage.showMoreTainings();
        // assert
        expect(profilePage.trainingsLimit).toEqual(0);
    });
    it('it should call showMoreLessTriannings() to trianning assertion', () => {
        // arrange
        // act
        profilePage.showLessTrainings();
        // assert
        expect(profilePage.trainingsLimit).toEqual(profilePage.DEFAULT_PAGINATION_LIMIT);
    });
    it('it should call loader() for ', () => {
        // arrange
        const loader = { create: jest.fn(), dismiss: jest.fn() };
        spyOn(profilePage, 'getLoader').and.returnValue({ create: () => { }, dismiss: jest.fn() });
        // act
        profilePage.getLoader();
        // assert
        expect(profilePage.getLoader).toHaveBeenCalled();
    });

    it('it should call getEnrolledCourses() for logged in user ', (done) => {
        // arrange
        const option = {
            'userId': '659b011a-06ec-4107-84ad-955e16b0a48a',
            'refreshEnrolledCourses': true,
            'returnRefreshedEnrolledCourses': true
        };
        courseServiceMock.getEnrolledCourses.mockResolvedValue(JSON.stringify(mockProfileRes.getEnrolledCourses));

        // act
        profilePage.getEnrolledCourses();
        // assert

        setTimeout(() => {
            expect(profilePage.trainingsLimit).toEqual(mockProfileRes.trainingsCompleted.length);
            done();
        }, 0);
    });
    it('it should call getEnrolledCourses() for logged in user error scenerio ', (done) => {
        // arrange
        profilePage.trainingsCompleted = [];
        spyOn(profilePage, 'trainingsCompleted').and.stub();
        courseServiceMock.getEnrolledCourses.mockRejectedValue(JSON.stringify(mockProfileRes.getEnrolledCourses));

        // act
        profilePage.getEnrolledCourses();
        // assert

        setTimeout(() => {
            expect(courseServiceMock.getEnrolledCourses).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('it should call navigateToDetailPage() to course or content detail page', (done) => {
        // arrange
        const values = new Map();
        values['sectionName'] = 'Contributions';
        values['positionClicked'] = 0;
        spyOn(telemetryGeneratorServiceMock, 'generateInteractTelemetry').and.callThrough();
        spyOn(profilePage, 'trainingsCompleted').and.stub();
        courseServiceMock.getEnrolledCourses.mockRejectedValue(JSON.stringify(mockProfileRes.getEnrolledCourses));

        // act
        profilePage.navigateToDetailPage('content', 'Layout', 0);
        // assert

        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalled();
            expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, { content: 'content' });
            expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsPage, { content: 'content' });
            expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, { content: 'content' });
            done();
        }, 0);
    });

    it('it should call updateLocalProfile() for current user ', (done) => {
        // arrange
        profileServiceMock.getCurrentUser.mockResolvedValue(mockProfileRes.profileDetailsMock);
        profilePage.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        profilePage.profile.framework = 'framework';
        formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue(profilePage);
        // act
        profilePage.updateLocalProfile('framework');
        // assert
        setTimeout(() => {
            expect(formAndFrameworkUtilServiceMock.updateLoggedInUser).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('it should call navigateToCategoriesEditPage() for to navigate to categories edit page ', () => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        // act
        profilePage.navigateToCategoriesEditPage();
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(CategoriesEditPage);
    });

    it('it should call navigateToCategoriesEditPage() show a toast msg if network not avilable', () => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        // act
        profilePage.navigateToCategoriesEditPage();
        // assert
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('NEED_INTERNET_TO_CHANGE');
    });

    it('it should call searchContent() to search the content  which is created by the user', () => {
        // arrange
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.resolve(JSON.stringify(mockProfileRes.searchResultResponse)));
        // act
        profilePage.searchContent();
        // assert
        expect(contentServiceMock.searchContent).toHaveBeenCalled();
    });
    it('it should call searchContent() to search the content  which is for error scenario', () => {
        // arrange
        (contentServiceMock.searchContent as any).mockRejectedValue(Promise.resolve(JSON.stringify(mockProfileRes.searchResultResponse)));
        // act
        profilePage.searchContent();
        // assert
        expect(contentServiceMock.searchContent).toHaveBeenCalled();
    });
});
