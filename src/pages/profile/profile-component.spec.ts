import { ProfilePage } from './profile';
import { mockProfileRes } from './profile.spec.data';
import {
    navCtrlMock,
    popoverCtrlMock,
    userProfileServiceMock,
    zoneMock,
    authServiceMock,
    telemetryServiceMock,
    loadingControllerMock,
    navParamsMock,
    eventsMock,
    appGlobalServiceMock,
    courseServiceMock,
    telemetryGeneratorServiceMock,
    profileServiceMock,
    formAndFrameworkUtilServiceMock,
    containerServiceMock,
    commonUtilServiceMock,
    appMock,
    contentServiceMock,
    viewControllerMock
} from '../../__tests__/mocks';
 import { PersonalDetailsEditPage } from '../profile/personal-details-edit.profile/personal-details-edit.profile';
 import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
 import { CollectionDetailsPage } from '../collection-details/collection-details';
 import { ContentDetailsPage } from '../content-details/content-details';
import { CategoriesEditPage } from '../categories-edit/categories-edit';


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
            // spyOn(profilePage, 'updateLocalProfile').and.stub();
        });
        formAndFrameworkUtilServiceMock.getCustodianOrgId.mockResolvedValue('0126632859575746566');
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };

        profilePage = new ProfilePage(
            navCtrlMock as any,          popoverCtrlMock as any,
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
            viewControllerMock as any
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
        loadingControllerMock.create.mockReturnValue(loader);
        spyOn(profilePage, 'refreshProfileData').and.returnValue(Promise.resolve(['hfhgf']));
        // act
        profilePage.doRefresh().then(() => {
            setTimeout(() => {
                expect(eventsMock.publish).toHaveBeenCalledWith('refresh:profile');
                expect(loader.dismiss).toHaveBeenCalled();
                done();
            }, 500);
        });
    });
    it('it should call dofresher() to refresh profile ', (done) => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        const refresher = {
            complete: jest.fn()
        };
        // act
        profilePage.doRefresh(refresher);
        // assert
        setTimeout(() => {
            expect(refresher.complete).toHaveBeenCalled();
            done();
        }, 0);
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
        loadingControllerMock.create.mockReturnValue(loader);
        spyOn(profilePage, 'refreshProfileData').and.returnValue(Promise.reject('error'));
        refresher.complete();
        // act
        profilePage.doRefresh();
        // assert
        expect(profilePage.refreshProfileData).toHaveBeenCalled();
        expect(profilePage.isRefreshProfile).toBe(true);
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
        // act

        profilePage.refreshProfileData();
        // assert
        setTimeout(() => {
            expect(authServiceMock.getSessionData).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should show check the formatRoles() method ', () => {
        // arrange
        profilePage.roles = [''];
        profilePage.profile = mockProfileRes.profileDetailsMock;
        // act
        profilePage.formatRoles();
        // assert
        expect(profilePage.profile).toBeTruthy();
    });

    it('should show check the format user locations() ', () => {
        // arrangw
        profilePage.profile = JSON.parse(mockProfileRes.profileDetailsMock);

        // act
        profilePage.formatUserLocation();
        // assert
        expect(profilePage.profile).toBeTruthy();
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

    it('should show more Items in skills list ', () => {
        profilePage.rolesLimit = 1;
        profilePage.showMoreItems();
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
        profilePage.trainingsCompleted = [''];
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

    it('it should call the isResource page', () => {
        // arrange
        // act
        profilePage.isResource('content');
        // assert
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
            expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, { content: 'content' });
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
        const content = {contentType: 'Course'};
        // act
        profilePage.navigateToDetailPage(content, 'Layout', 0);
        // assert
        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalled();
            expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, { content:  content});
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

        const content = {mimeType: 'application/vnd.ekstep.content-collection'};
        // act
        profilePage.navigateToDetailPage(content, 'Layout', 0);
        // assert
        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalled();
            expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsPage, { content: content });
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
    it('it should call navigateToEditPersonalDetails() for to navigate to Personals edit page ', () => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        // act
        profilePage.navigateToEditPersonalDetails();
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(PersonalDetailsEditPage, { 'profile': {} });
    });

    it('it should call navigateToEditPersonalDetails() show a toast msg if network not available', () => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        // act
        profilePage.navigateToEditPersonalDetails();
        // assert
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('NEED_INTERNET_TO_CHANGE');
    });

    it('it should call searchContent() to search the content  which is created by the user', (done) => {
        // arrange
        const contentSortCriteria = {
            sortAttribute: 'lastUpdatedOn',
            sortOrder: 'SortOrder.DESC'
        };
        const result = {
            result: {
                contentDataList: {
                    createdBy: ['this.userId' || 'this.loggedInUserId'],
                    limit: 100,
                    contentTypes: 'ContentType.FOR_DOWNLOADED_TAB',
                    sortCriteria: ['contentSortCriteria']
                }
            }
        };
    contentServiceMock.searchContent.mockResolvedValue(JSON.stringify(result));
        // act
        profilePage.searchContent();
        // assert
        setTimeout(() => {
            expect(contentServiceMock.searchContent).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('it should call searchContent() to search the content  which is for error scenario', () => {
        // arrange
        const contentSortCriteria = {
            sortAttribute: 'lastUpdatedOn',
            sortOrder: 'SortOrder.DESC'
        };
        const contentSearchCriteria = {
            createdBy: ['this.userId' || 'this.loggedInUserId'],
            limit: 100,
            contentTypes: 'ContentType.FOR_DOWNLOADED_TAB',
            sortCriteria: ['contentSortCriteria']
        };
        (contentServiceMock.searchContent as any).mockRejectedValue(Promise.resolve(JSON.stringify(mockProfileRes.searchResultResponse)));
        // act
        profilePage.searchContent();
        // assert
        expect(contentServiceMock.searchContent).toHaveBeenCalled();
    });
    it('it should call the popup for edit the mobile number', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        profilePage.profile = {
            phone: true
        };
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.editMobileNumber({});
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('EDIT_PHONE_POPUP_TITLE');
        expect(popoverCtrlMock.create).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });
    it('it should call the popup for edit the email', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        profilePage.profile = {
            email: true
        };
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.editEmail({});
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('EDIT_EMAIL_POPUP_TITLE');
        expect(popoverCtrlMock.create).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });
    it('it should call the popup for enter the email', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        profilePage.profile = {
            email: false
        };
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.editEmail({});
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('EMAIL_PLACEHOLDER');
        expect(popoverCtrlMock.create).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });
    it('it should call the popup onDidDismiss for editMobileNumber', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        profilePage.profile = {
            phone: false
        };
        popUpMock.onDidDismiss.mockImplementation((edited, key) => {
            edited(true);
            // spyOn(profilePage, 'callOTPPopover').and.stub();
        });
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.editMobileNumber({});
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('ENTER_PHONE_POPUP_TITLE');
        expect(popUpMock.onDidDismiss).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });
    it('it should call the popup create method ', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'email'
        };
        popUpMock.onDidDismiss.mockImplementation((edited, key) => {
            edited(true);
            // spyOn(profilePage, 'callOTPPopover').and.stub();
        });
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.editEmail({});
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('EMAIL_PLACEHOLDER');
        expect(popUpMock.onDidDismiss).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });

    it('it should call the callOTPPopover method to check for validation of phone number ', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'someemail.com',
            CONTACT_TYPE_PHONE: '9xxxxxxxx9',
        };
        commonUtilServiceMock.translateMessage('VERIFY_PHONE_OTP_TITLE');
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        popUpMock.onDidDismiss.mockImplementation((OTPSuccess, phone, errCb) => {
            OTPSuccess(true);
            spyOn(profilePage, 'updatePhoneInfo').and.stub();
        });        // act
        profilePage.callOTPPopover('9xxxxxxxx9', 'any');
        // assert
        expect(popoverCtrlMock.create).toHaveBeenCalled();
        expect(popUpMock.onDidDismiss).toHaveBeenCalled();
        expect(popUpMock.present).toHaveBeenCalled();
    });
    it('it should call the callOTPPopover method to check for validation for email ', () => {
        // arrange
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'someemail.com',
            CONTACT_TYPE_PHONE: '9xxxxxxxx9',
        };
        popUpMock.present.mockImplementation(() => { });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        popUpMock.onDidDismiss.mockImplementation((OTPSuccess, phone, errCb) => {
            OTPSuccess(true);
            spyOn(profilePage, 'updatePhoneInfo').and.stub();
        });
        // act
        profilePage.callOTPPopover('someemail.com', 'any');
        // assert
        expect(popoverCtrlMock.create).toHaveBeenCalled();
        expect(popUpMock.onDidDismiss).toHaveBeenCalled();
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('VERIFY_EMAIL_OTP_DESCRIPTION');
        expect(popUpMock.present).toHaveBeenCalled();
    });

    it('it should call the updatePhoneInfo for updation ', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'someemail.com',
            CONTACT_TYPE_PHONE: '9xxxxxxxx9',
            phoneVerified: true
        };
        spyOn(profilePage, 'doRefresh').and.stub();

        userProfileServiceMock.updateUserInfo.mockImplementation((req, resCb, errCb) => {
            resCb(JSON.stringify(ProfileConstants));
        });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.updatePhoneInfo('9xxxxxxxx9');
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('PHONE_EDIT_SUCCESS');
    });
    it('it should call the updatePhoneInfo for error scenario ', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'someemail.com',
            CONTACT_TYPE_PHONE: '9xxxxxxxx9',
            phoneVerified: true
        };
        spyOn(profilePage, 'doRefresh').and.stub();

        userProfileServiceMock.updateUserInfo.mockImplementation((req, resCb, errCb) => {
            errCb(JSON.stringify({ 'error': 'err' }));
        });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.updatePhoneInfo('9xxxxxxxx9');
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('SOMETHING_WENT_WRONG');
    });

    it('it should call the updateEmailInfo for updation ', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'someemail.com',
            CONTACT_TYPE_PHONE: '9xxxxxxxx9',
            phoneVerified: true
        };
        spyOn(profilePage, 'doRefresh').and.stub();

        userProfileServiceMock.updateUserInfo.mockImplementation((req, resCb, errCb) => {
            resCb(JSON.stringify(ProfileConstants));
        });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.updateEmailInfo('someemail');
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('EMAIL_EDIT_SUCCESS');
    });
    it('it should call the updateEmailInfo for error scenario ', () => {
        // arrange
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        const popUpMock = {
            present: jest.fn(),
            onDidDismiss: jest.fn()
        };
        const ProfileConstants = {
            CONTACT_TYPE_EMAIL: 'someemail.com',
            CONTACT_TYPE_PHONE: '9xxxxxxxx9',
            phoneVerified: true
        };
        spyOn(profilePage, 'doRefresh').and.stub();

        userProfileServiceMock.updateUserInfo.mockImplementation((req, resCb, errCb) => {
            errCb(JSON.stringify({ 'error': 'err' }));
        });
        popoverCtrlMock.create.mockReturnValue(popUpMock);
        // act
        profilePage.updateEmailInfo('someemail.com');
        // assert
        expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('SOMETHING_WENT_WRONG');
    });
});
