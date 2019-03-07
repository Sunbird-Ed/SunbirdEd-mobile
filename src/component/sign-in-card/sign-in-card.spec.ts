import { SignInCardComponent } from './sign-in-card';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Profile, GenerateOTPRequest, Interact } from 'sunbird';
import {
    Component,
    NgZone,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {
    oAuthServiceMock,
    translateServiceMock,
    containerServiceMock,
    profileServiceMock,
    authServiceMock,
    telemetryGeneratorServiceMock,
    navCtrlMock,
    userProfileServiceMock,
    zoneMock,
    telemetryServiceMock,
    appVersionMock,
    sharedPreferencesMock,
    commonUtilServiceMock,
    formAndFrameworkUtilServiceMock,
    loadingControllerMock,
    viewControllerMock
} from '../../__tests__/mocks';
import { ProfileConstants } from '../../app/app.constant';

describe('SignInCardComponent', () => {
    let signInCardComponent: SignInCardComponent;
    beforeEach((done) => {
        appVersionMock.getAppName.mockResolvedValue('SAMPLE_APP_NAME');
        translateServiceMock.get.mockReturnValue({ subscribe: jest.fn() });
        signInCardComponent = new SignInCardComponent(
            translateServiceMock as any,
            navCtrlMock as any,
            oAuthServiceMock as any,
            containerServiceMock as any,
            userProfileServiceMock as any,
            profileServiceMock as any,
            authServiceMock as any,
            zoneMock as any,
            telemetryServiceMock as any,
            appVersionMock as any,
            sharedPreferencesMock as any,
            commonUtilServiceMock as any,
            formAndFrameworkUtilServiceMock as any
        );

        setTimeout(() => {
            jest.resetAllMocks();
            done();
        }, 0);
    });
    it('can load instance', () => {
        expect(signInCardComponent).toBeTruthy();
    });
    it('it should call the initText', () => {
        expect(signInCardComponent.initText).toBeDefined();
        translateServiceMock.get.mockReturnValue({ subscribe: jest.fn() });

        spyOn(signInCardComponent, 'initText').and.callThrough();
        signInCardComponent.initText();
        expect(translateServiceMock.get).toHaveBeenCalled();
        expect(signInCardComponent.initText).toHaveBeenCalled();
    });

    it('it should call the signIn and should call the valueChange method with boolean', () => {
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        spyOn(signInCardComponent.valueChange, 'emit');
        signInCardComponent.singIn();
        // expect(commonUtilServiceMock.networkInfo).toHaveBeenCalled();
    });
    it('should show loader and generateLoginInteractTelemetry', (done) => {
        spyOn(signInCardComponent, 'refreshProfileData').and.returnValue(Promise.resolve('true'));
        spyOn(signInCardComponent, 'refreshTenantData').and.returnValue(Promise.resolve('true'));
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        translateServiceMock.get.mockReturnValue({ subscribe: jest.fn() });
        const loader = { present: jest.fn() };
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {
            },
            dismiss: () => Promise.resolve()
        });
        oAuthServiceMock.doOAuthStepOne.mockResolvedValue('SOME_TOKEN');
        oAuthServiceMock.doOAuthStepTwo.mockResolvedValue('SOME_TOKEN');
        commonUtilServiceMock.isRTL.mockReturnValue(true);
        signInCardComponent.singIn();

        setTimeout(() => {
            expect(oAuthServiceMock.doOAuthStepOne).toHaveBeenCalled();
            expect(oAuthServiceMock.doOAuthStepTwo).toHaveBeenCalled();
            done();
        }, 1000);
    });

    it('should call the sign in method and check doauth', (done) => {
        commonUtilServiceMock.translateMessage.mockReturnValue('SAMPLE_WELCOME_BACK');
        spyOn(signInCardComponent, 'refreshProfileData').and.returnValue(Promise.resolve('true'));
        spyOn(signInCardComponent, 'refreshTenantData').and.returnValue(Promise.resolve('true'));
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        translateServiceMock.get.mockReturnValue({ subscribe: jest.fn() });
        const loader = { present: jest.fn() };
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {
            },
            dismiss: () => Promise.resolve()
        });
        oAuthServiceMock.doOAuthStepOne.mockResolvedValue('SOME_TOKEN');
        oAuthServiceMock.doOAuthStepTwo.mockResolvedValue('SOME_TOKEN');
        commonUtilServiceMock.isRTL.mockReturnValue(true);
        signInCardComponent.singIn();
        setTimeout(() => {
            expect(oAuthServiceMock.doOAuthStepTwo).toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('should call the sign and check error scenerio', (done) => {
        commonUtilServiceMock.getLoader.mockReturnValue({
            present: () => {
            },
            dismiss: () => Promise.resolve()
        });
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        translateServiceMock.get.mockReturnValue({ subscribe: jest.fn() });
        oAuthServiceMock.doOAuthStepOne.mockRejectedValue('error');
        signInCardComponent.singIn();
        setTimeout(() => {
            // expect(commonUtilServiceMock.getLoader).toHaveBeenCalled();
            expect(oAuthServiceMock.doOAuthStepOne).toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('should reject if getUserProfileDetails fails', (done) => {
        // arrange
        authServiceMock.getSessionData.mockImplementation((cb: Function) => {
            cb(`{ "userToken": "SOME_SESSION" }`);
        });
        userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb, errCb) => {
            errCb('SAMPLE_ERROR_MESSAGE');
        });
        profileServiceMock.setCurrentProfile.mockResolvedValue('SOME_PROFILE');
        formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
            status: 'SOME_STATUS',
            profile: 'SOME_PROFILE'
        });
        // act
        signInCardComponent.refreshProfileData().catch((err) => {
            expect(authServiceMock.getSessionData).toHaveBeenCalled();
            done();
        });
    });

    it('should reject if setCurrentProfile fails', (done) => {
        // arrange
        authServiceMock.getSessionData.mockImplementation((cb: Function) => {
            cb(`{ "userToken": "SOME_SESSION" }`);
        });
        userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb) => {
            resCb(`{ "id": "SAMPLE_ID", "userId": "SAMPLE_USER_ID", "rootOrg": { "orgName": "SAMPLE_ORG_NAME",
             "slug": "SAMPLE_ORG_SLUG" } }`);
        });
        profileServiceMock.setCurrentProfile.mockRejectedValue('SAMPLE_ERROR_MESSAGE');
        formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
            status: 'SOME_STATUS',
            profile: 'SOME_PROFILE'
        });

        // act
        signInCardComponent.refreshProfileData().catch((err) => {
            expect(authServiceMock.getSessionData).toHaveBeenCalled();
            expect(err).toBe('SAMPLE_ERROR_MESSAGE');
            done();
        });
    });
    it('should resolve with rootOrg.slug and set orgName when unable to updateLoggedInUser', (done) => {
        // arrange
        authServiceMock.getSessionData.mockImplementation((cb: Function) => {
            cb(`{ "userToken": "SOME_SESSION" }`);
        });
        userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb) => {
            resCb(`{ "id": "SAMPLE_ID", "userId": "SAMPLE_USER_ID",
          "rootOrg": { "orgName": "SAMPLE_ORG_NAME", "slug": "SAMPLE_ORG_SLUG" } }`);
        });
        profileServiceMock.setCurrentProfile.mockResolvedValue('SOME_PROFILE');
        formAndFrameworkUtilServiceMock.updateLoggedInUser.mockRejectedValue('');

        // act
        signInCardComponent.refreshProfileData().then((r) => {
            // assert
            expect(userProfileServiceMock.getUserProfileDetails).toHaveBeenCalled();
            // expect(r).toBe({'slug': 'SAMPLE_ORG_SLUG', 'title': 'SAMPLE_ORG_NAME'});
            done();
        });
    });

    it('should setContent on splashcreen on success', (done) => {
        // arrange
        (<any>window).splashscreen = { setContent: jest.fn() };
        userProfileServiceMock.getTenantInfo.mockImplementation((req, successCB) => {
            successCB('{ "logo": "SAMPLE_LOGOG" }');
        });
        // act
        signInCardComponent.refreshTenantData('SAMPLE_SLUG', 'title');
        // assert
        setTimeout(() => {
            expect(userProfileServiceMock.getTenantInfo).toHaveBeenCalled();
            done();
        });
    });
});




