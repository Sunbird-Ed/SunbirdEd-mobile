import { EditContactDetailsPopupComponent } from './edit-contact-details-popup';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Profile, GenerateOTPRequest } from 'sunbird';

import {
    navParamsMock, viewControllerMock, platformMock,
    userProfileServiceMock, loadingControllerMock, commonUtilServiceMock,
    formBuilderMock
} from '../../__tests__/mocks';
import { ProfileConstants } from '../../app/app.constant';

describe('EditContactDetailsPopupComponent', () => {
    let editContactDetailsPopupComponent: EditContactDetailsPopupComponent;
    beforeEach(() => {
        navParamsMock.get.mockImplementation((arg: string) => {
            if (arg === 'userId') {
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
        editContactDetailsPopupComponent = new EditContactDetailsPopupComponent(
            navParamsMock as any,
            viewControllerMock as any,
            platformMock as any,
            userProfileServiceMock as any,
            loadingControllerMock as any,
            commonUtilServiceMock as any,
            formBuilderMock as any
        );
        jest.resetAllMocks();
    });

    it('can load instance', () => {
        expect(editContactDetailsPopupComponent).toBeTruthy();
    });
    it('to check init EditForm for email()', () => {
        // arrange
        const profileConstants = {
            'CONTACT_TYPE_EMAIL': 'somegmail@gmail.com'
        };
        editContactDetailsPopupComponent.type = profileConstants.CONTACT_TYPE_EMAIL;
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'email': new FormControl('', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
        }));
        editContactDetailsPopupComponent.personEditForm.controls['email'].setValue(profileConstants.CONTACT_TYPE_EMAIL);
        // spyOn(Validators, 'pattern');
        // act
        editContactDetailsPopupComponent.initEditForm();

        // assert
        expect(editContactDetailsPopupComponent.personEditForm).toBeTruthy();

    });
    it('to check init EditForm for phone()', () => {
        // arrange
        const profileConstants = {
            'CONTACT_TYPE_phone': '90*******9'
        };
        spyOn(Validators, 'pattern');
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'phone': new FormControl('', [])
        }));
        editContactDetailsPopupComponent.personEditForm.controls['phone'].setValue('90*******9');
        // act
        editContactDetailsPopupComponent.initEditForm();
        // assert
        expect(Validators.pattern).toHaveBeenNthCalledWith(1, '^[0-9]+$');
        expect(editContactDetailsPopupComponent.personEditForm).toBeTruthy();
    });

    it('to check the validation the profile edit field email  validate()', (done) => {
        // arrange
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        const profileConstants = {
            CONTACT_TYPE_phone: '9880822029',
            CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
        };
        editContactDetailsPopupComponent.type = profileConstants.CONTACT_TYPE_EMAIL;
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        loadingControllerMock.create.mockReturnValue(loader);
        formBuilderMock.group.mockReturnValue(new FormGroup({
            'phone':  new FormControl('', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
        }));
        spyOn(Validators, 'pattern');
        userProfileServiceMock.isAlreadyInUse.mockResolvedValue(JSON.stringify(profileConstants));
        editContactDetailsPopupComponent.personEditForm.controls['phone'].setValue('90*******9');
        // act
        editContactDetailsPopupComponent.validate();

        // assert
         setTimeout(() => {
        expect(userProfileServiceMock.isAlreadyInUse).toHaveBeenCalled();
        expect(loadingControllerMock.create).toBeCalled();
        done();
    });
});
it('to check the validation the profile edit fields for phone number validate()', (done) => {
    // arrange
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
    const profileConstants = {
        CONTACT_TYPE_phone: '9880822029'
    };
    editContactDetailsPopupComponent.type = profileConstants.CONTACT_TYPE_phone;
    const loader = {
        present: jest.fn(),
        dismiss: jest.fn()
    };
    loadingControllerMock.create.mockReturnValue(loader);
    formBuilderMock.group.mockReturnValue(new FormGroup({
        'phone': new FormControl('', [Validators.pattern('^[0-9]+$')])
    }));
    spyOn(Validators, 'pattern');
    userProfileServiceMock.isAlreadyInUse.mockResolvedValue(JSON.stringify(profileConstants));
    editContactDetailsPopupComponent.personEditForm.controls['phone'].setValue('98808220299');
    // act
    editContactDetailsPopupComponent.validate();

    // assert
    setTimeout(() => {
        expect(userProfileServiceMock.isAlreadyInUse).toHaveBeenCalled();
        expect(loadingControllerMock.create).toBeCalled();
        done();
    });
});

it('to check the validation the profile edit fields if pass empty arrays()', () => {
    // arrange
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
    spyOn(editContactDetailsPopupComponent, 'generateOTP').and.stub();
    const loader = {
        present: jest.fn(),
        dismiss: jest.fn()
    };
    loadingControllerMock.create.mockReturnValue(loader);
    formBuilderMock.group.mockReturnValue(new FormGroup({
        'phone': new FormControl('', []),
        'email': new FormControl('', [])
    }));
    userProfileServiceMock.isAlreadyInUse.mockRejectedValue(JSON.stringify({ error: 'USER_NOT_FOUND' }));
    spyOn(userProfileServiceMock, 'generateOTP').and.stub();
    // act
    editContactDetailsPopupComponent.validate();

    // assert
    expect(userProfileServiceMock.isAlreadyInUse).toHaveBeenCalled();
});

it('to check the Error scenario for validation the profile edit fields if pass empty arrays()', () => {
    // arrange
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;

    // act
    editContactDetailsPopupComponent.validate();

    // assert
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('INTERNET_CONNECTIVITY_NEEDED');
});

it('it should generate the otp to the register Email-id or a Phone number', (done) => {
    // arrange
    const loader = {
        present: jest.fn(),
        dismiss: jest.fn()
    };
    const profileConstants = {
        CONTACT_TYPE_phone: '90*******9',
        CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
    };
    editContactDetailsPopupComponent.type = profileConstants.CONTACT_TYPE_phone;
    const viewCtrl = {
        present: jest.fn(),
        dismiss: jest.fn()
    };
    viewControllerMock.dismiss.mockReturnValue(viewCtrl);
    loadingControllerMock.create.mockReturnValue(loader);
    formBuilderMock.group.mockReturnValue(new FormGroup({
        'phone': new FormControl('', []),
        'email': new FormControl('', [])
    }));
    userProfileServiceMock.generateOTP.mockResolvedValue(JSON.stringify(profileConstants));
    editContactDetailsPopupComponent.personEditForm.controls['phone'].setValue('90*******9');
    // act
    editContactDetailsPopupComponent.generateOTP();

    // assert
    setTimeout(() => {
        expect(loadingControllerMock.create).toHaveBeenCalled();
        done();
    }, 1000);
});
it('it should  check the generate the otp when user enters invalid Email-id or a Phone number', (done) => {
    // arrange
    const loader = {
        present: jest.fn(),
        dismiss: jest.fn()
    };
    const profileConstants = {
        CONTACT_TYPE_phone: '90*******9',
        CONTACT_TYPE_EMAIL: 'somegmail@gmail.com'
    };
    const viewCtrl = {
        present: jest.fn(),
        dismiss: jest.fn()
    };
    viewControllerMock.dismiss.mockReturnValue(viewCtrl);
    loadingControllerMock.create.mockReturnValue(loader);
    formBuilderMock.group.mockReturnValue(new FormGroup({
        'phone': new FormControl('', []),
        'email': new FormControl('', [])
    }));
    userProfileServiceMock.generateOTP.mockRejectedValue(JSON.stringify({ error: 'ERROR_RATE_LIMIT_EXCEEDED' }));
    editContactDetailsPopupComponent.personEditForm.controls['phone'].setValue('90*******9');
    // act
    editContactDetailsPopupComponent.generateOTP();

    // assert
    setTimeout(() => {
        expect(loadingControllerMock.create).toHaveBeenCalled();
        expect(commonUtilServiceMock.showToast).toBeCalledWith('You have exceeded the maximum limit for OTP, Please try after some time');
        done();
    });
});


it('#getLoader should return Loading object', () => {
    expect(editContactDetailsPopupComponent.getLoader).toBeDefined();
    spyOn(editContactDetailsPopupComponent, 'getLoader').and.callThrough();
    spyOn(loadingControllerMock, 'create');
    editContactDetailsPopupComponent.getLoader();
    expect(editContactDetailsPopupComponent.getLoader).toHaveBeenCalled();
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
    editContactDetailsPopupComponent.cancel();

    // assert
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
});

});
