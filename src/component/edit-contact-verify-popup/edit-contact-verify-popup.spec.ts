// import 'jest';
import { EditContactVerifyPopupComponent } from './edit-contact-verify-popup';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Profile, GenerateOTPRequest } from 'sunbird';

import {
    navParamsMock, viewControllerMock, platformMock,
    userProfileServiceMock, loadingControllerMock, commonUtilServiceMock,
    formBuilderMock
} from '../../__tests__/mocks';
import { ProfileConstants } from '../../app/app.constant';
describe('EditContactVerifyPopupComponent', () => {
    let editContactVerifyPopupComponent: EditContactVerifyPopupComponent;
    beforeEach(() => {
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'key') {
                return '';
            } else if (arg === 'title') {
                return '';
            } else if (arg === 'description') {
                return '';
            } else if (arg === 'type') {
                return '';
            }
        });
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'email': new FormControl('', []),
            'phone': new FormControl('', [])
        }));
           editContactVerifyPopupComponent = new EditContactVerifyPopupComponent(
            navParamsMock as any,
            viewControllerMock as any,
            platformMock as any,
            userProfileServiceMock as any,
            loadingControllerMock as any,
            commonUtilServiceMock as any
        );
        jest.resetAllMocks();
    });

    it('can load instance', () => {
        expect(editContactVerifyPopupComponent).toBeTruthy();
    });

    it('to check the verify the email or phone number for otp verification()', (done) => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        const profileConstants = {
            CONTACT_TYPE_phone: '90*******9',
            CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
        };
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'phone': new FormControl('', []),
            'email': new FormControl('', [])
        }));
        userProfileServiceMock.verifyOTP.mockResolvedValue(JSON.stringify(profileConstants));
        // act
        editContactVerifyPopupComponent.verify();

        // assert
        setTimeout(() => {
        expect(userProfileServiceMock.verifyOTP).toHaveBeenCalled();
        done();
    }, );
    });
    it('to check the verify the email or phone number if  otp is invalid()', (done) => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        const profileConstants = {
            CONTACT_TYPE_phone: '90*******9',
            CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
        };
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'phone': new FormControl('', []),
            'email': new FormControl('', [])
        }));
        userProfileServiceMock.verifyOTP.mockRejectedValue(JSON.stringify({error: 'ERROR_INVALID_OTP'}));
        // act
        editContactVerifyPopupComponent.verify();

        // assert
        setTimeout(() => {
        expect(userProfileServiceMock.verifyOTP).toHaveBeenCalled();
        expect(editContactVerifyPopupComponent.invalidOtp).toBeTruthy();
        done();
    }, );
    });
    it('to check the Error scenario for validation the verify otp()', () => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;

        // act
        editContactVerifyPopupComponent.verify();

        // assert
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('INTERNET_CONNECTIVITY_NEEDED');
    });

    it('to check the verify the email or phone number for resendOTP()', (done) => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        const profileConstants = {
            CONTACT_TYPE_phone: '90*******9',
            CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
        };
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
            loadingControllerMock.create.mockReturnValue(loader);
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'phone': new FormControl('', []),
            'email': new FormControl('', [])
        }));
        userProfileServiceMock.generateOTP.mockResolvedValue(JSON.stringify(profileConstants));
        // act
        editContactVerifyPopupComponent.resendOTP();

        // assert
        setTimeout(() => {
        expect(userProfileServiceMock.generateOTP).toHaveBeenCalled();
        done();
    }, );
    });
    it('to check the verify the email or phone number resendOTP fails()', (done) => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
             const loader = {
                    present: jest.fn(),
                    dismiss: jest.fn()
                };
        loadingControllerMock.create.mockReturnValue(loader);
        const profileConstants = {
            CONTACT_TYPE_phone: '90*******9',
            CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
        };
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'phone': new FormControl('', []),
            'email': new FormControl('', [])
        }));
        userProfileServiceMock.generateOTP.mockRejectedValue(JSON.stringify({error: 'ERROR_INVALID_OTP'}));
        // act
        editContactVerifyPopupComponent.resendOTP();

        // assert
        setTimeout(() => {
        expect(userProfileServiceMock.generateOTP).toHaveBeenCalled();
        done();
    }, );
    });
    it('to check the Error scenario for validation the resend otp()', () => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;

        // act
        editContactVerifyPopupComponent.verify();

        // assert
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('INTERNET_CONNECTIVITY_NEEDED');
    });
    it('#getLoader should return Loading object', () => {
        expect(editContactVerifyPopupComponent.getLoader).toBeDefined();
        spyOn(editContactVerifyPopupComponent, 'getLoader').and.callThrough();
        spyOn(loadingControllerMock, 'create');
        editContactVerifyPopupComponent.getLoader();
        expect(editContactVerifyPopupComponent.getLoader).toHaveBeenCalled();
        expect(loadingControllerMock.create).toHaveBeenCalled();
    });
    it('to should cal the cancel method to dismiss the view ctrl', () => {
        // arrange
        const viewCtrl = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        viewControllerMock.dismiss.mockReturnValue(false);
        // act
        editContactVerifyPopupComponent.cancel();

        // assert
        expect(viewControllerMock.dismiss).toHaveBeenCalled();
    });

});




